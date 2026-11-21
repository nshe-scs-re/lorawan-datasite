import { OnboardSensorRequest } from "../models/OnboardSensorRequest";

// Sends the request object through the GO API layer to the onboard request db
export function submitRequest(request: OnboardSensorRequest){
    // Convert to json
    const requestJson = request.convertToJson();

    // SQL to create the request row with a pending status (0).
    // The request_id is bound as :requestId in SUBMIT_REQUEST_DETAILS.
    const SUBMIT_REQUEST = `
        INSERT INTO onboard_requests (status_id)
        VALUES (0)
        RETURNING request_id;
    `;

    // SQL to store the rest of the request, run in one transaction.
    // Named params map to the convertToJson() fields.
    // device_comment insert runs once per comment (:postedDate, :comment).
    // device_image insert runs once per image (:imageType = 'close_up' | 'context').
    const SUBMIT_REQUEST_DETAILS = `
        BEGIN TRANSACTION;

        -- Sensor type is shared between requests, only add it if new
        INSERT OR IGNORE INTO sensor_type (make, model)
        VALUES (:devMake, :devModel);

        INSERT INTO device_metadata (
            request_id, 
            sensor_type_id, 
            name, 
            dev_eui, 
            dev_address,
            nws_key, 
            app_s_key, 
            otaa_app_key, 
            at_pin, 
            ota_pin, 
            serial_no
        )
        VALUES (
            :requestId,
            (SELECT sensor_type_id 
                FROM sensor_type 
                WHERE make = :devMake AND model = :devModel
            ),
            :devName, 
            :devEUI, 
            :devAddr,
            :devNwsKey, 
            :devAppsKey, 
            :appKey, 
            :atPin, 
            :otaPin, 
            :serialNo
        );

        -- Project is shared between requests, only add it if new
        INSERT OR IGNORE INTO project (name)
        VALUES (:projectAssociation);

        INSERT INTO project_history (
            request_id, 
            project_id, 
            deployment_datetime, 
            longitude, 
            latitude,
            contact_first_name, 
            contact_last_name, 
            contact_email
        )
        VALUES (
            :requestId,
            (SELECT project_id 
                FROM project 
                WHERE name = :projectAssociation
            ),
            :deploymentDate, 
            :longitude, 
            :latitude,
            :contactFName, 
            :contactLName, 
            :email
        );

        INSERT INTO device_comment (
            request_id, 
            datetime, 
            comment)
        VALUES (
            :requestId, 
            :postedDate, 
            :comment
        );

        INSERT INTO device_image (
            request_id, 
            image_type, 
            image_path)
        VALUES (
            :requestId, 
            :imageType, 
            :imagePath
        );

        COMMIT;
    `;

    // POST request via GO API

}

// Updates the onboard request db with the status number according to if it is approved (1) or denied (2)
export function updateRequestStatus(requestId: number, statusValue: number){
    // Validate the request ID

    // Validate the status value
    if(!Number.isInteger(statusValue) || statusValue < 0 || statusValue > 2){
        throw new Error(`Status value is not valid. Was ${statusValue}, Should be 0, 1, or 2`);
    }

    // SQL to update the status value
    const REQUEST_UPDATE =`
        UPDATE onboard_requests
        SET status_id = :statusValue
        WHERE request_id = :requestId;
    `;

    // POST request for updating value
}

// Called when sensor is approved. Sends the db entry associated with the request ID to the SCS-RE db
// The REGISTER_SENSOR SQL needs to be verified by SCS-RE before we ever use it
export function registerSensor(requestId:number){
    // SQL to read the approved request from the onboard request db.
    // Comments and images come back as JSON arrays to pass into REGISTER_SENSOR.
    const REGISTER_REQUEST_SELECT = `
        SELECT
            dm.name,
            dm.dev_eui,
            dm.dev_address,
            dm.nws_key,
            dm.app_s_key,
            dm.otaa_app_key,
            dm.at_pin,
            dm.ota_pin,
            dm.serial_no,
            st.make,
            st.model,
            p.name AS project_name,
            ph.contact_first_name,
            ph.contact_last_name,
            ph.contact_email,
            ph.deployment_datetime,
            ph.latitude,
            ph.longitude,
            (SELECT json_group_array(json_object(
                    'datetime', dc.datetime,
                    'comment', dc.comment
                ))
                FROM device_comment dc
                WHERE dc.request_id = r.request_id
            ) AS comments,
            (SELECT json_group_array(json_object(
                    'datetime', di.datetime,
                    'image_type', di.image_type,
                    'image_path', di.image_path
                ))
                FROM device_image di
                WHERE di.request_id = r.request_id
            ) AS images
        FROM onboard_requests r
        JOIN device_metadata dm ON dm.request_id = r.request_id
        JOIN sensor_type st ON st.sensor_type_id = dm.sensor_type_id
        JOIN project_history ph ON ph.request_id = r.request_id
        JOIN project p ON p.project_id = ph.project_id
        WHERE r.request_id = :requestId AND r.status_id = 1;
    `;

    // SQL to add to the SCS-RE database (PostgreSQL). One statement, so it all commits or fails together.
    // Params come from the REGISTER_REQUEST_SELECT row:
    //   $1 device_type          $2 make                    $3 model
    //   $4 name                 $5 dev_eui                 $6 dev_address
    //   $7 nws_key              $8 app_s_key               $9 otaa_app_key
    //   $10 at_pin              $11 ota_pin                $12 serial_no
    //   $13 project_name        $14 contact_first_name     $15 contact_last_name
    //   $16 contact_email       $17 deployment_datetime    $18 latitude
    //   $19 longitude           $20 comments (JSON)        $21 images (JSON)
    const REGISTER_SENSOR =`
        WITH new_device AS (
            -- New sensors start active but not public
            INSERT INTO device (
                device_type,
                is_active,
                is_public)
            VALUES (
                $1,
                TRUE,
                FALSE
            )
            RETURNING device_id
        ),

        -- Sensor type is shared between sensors, only add it if new
        new_sensor_type AS (
            INSERT INTO sensor_type (
                make,
                model)
            SELECT $2, $3
            WHERE NOT EXISTS (
                SELECT 1
                FROM sensor_type
                WHERE make = $2 AND model = $3
            )
            RETURNING sensor_type_id
        ),
        sensor_type_ref AS (
            SELECT sensor_type_id FROM new_sensor_type
            UNION ALL
            SELECT sensor_type_id FROM sensor_type WHERE make = $2 AND model = $3
            LIMIT 1
        ),

        -- Project is shared between sensors, only add it if new
        new_project AS (
            INSERT INTO project (project_name)
            SELECT $13
            WHERE NOT EXISTS (
                SELECT 1
                FROM project
                WHERE project_name = $13
            )
            RETURNING project_id
        ),
        project_ref AS (
            SELECT project_id FROM new_project
            UNION ALL
            SELECT project_id FROM project WHERE project_name = $13
            LIMIT 1
        ),

        new_metadata AS (
            INSERT INTO sensor_metadata (
                sensor_metadata_id,
                sensor_type_id,
                name,
                dev_eui,
                dev_address,
                nws_key,
                app_s_key,
                otaa_app_key,
                at_pin,
                ota_pin,
                serial_no
            )
            SELECT
                d.device_id,
                t.sensor_type_id,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9,
                $10,
                $11,
                $12
            FROM new_device d, sensor_type_ref t
        ),

        new_history AS (
            INSERT INTO project_history (
                device_id,
                project_id,
                contact_first_name,
                contact_last_name,
                email,
                deployment_datetime,
                latitude,
                longitude
            )
            SELECT
                d.device_id,
                p.project_id,
                $14,
                $15,
                $16,
                $17::TIMESTAMPTZ,
                $18,
                $19
            FROM new_device d, project_ref p
        ),

        -- One row per entry in the comments / images JSON arrays
        new_comments AS (
            INSERT INTO device_comment (
                device_id,
                datetime,
                comment)
            SELECT
                d.device_id,
                (c->>'datetime')::TIMESTAMPTZ,
                c->>'comment'
            FROM new_device d, json_array_elements($20::JSON) c
        ),
        new_images AS (
            INSERT INTO device_image (
                device_id,
                datetime,
                image_type,
                image_path)
            SELECT
                d.device_id,
                (i->>'datetime')::TIMESTAMPTZ,
                i->>'image_type',
                i->>'image_path'
            FROM new_device d, json_array_elements($21::JSON) i
        )

        SELECT device_id FROM new_device;
    `;

    // POST request for GO layer

}