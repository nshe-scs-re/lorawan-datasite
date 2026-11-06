// For ease of adding to the web_assets db
// Author: Jacob Campau

const Database = require("better-sqlite3");
const readline = require("node:readline/promises");
const fs = require("node:fs");
const path = require("node:path");

const dbPath = path.join(__dirname, "web_assets.db");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    let db;

    try {
        // Verify database exists
        if (!fs.existsSync(dbPath)) {
            throw new Error("web_assets.db does not exist.");
        }

        db = new Database(dbPath, { fileMustExist: true });
        db.pragma("foreign_keys = ON");

        let running = true;
        while (running) {
            console.log("\n=== LoRaWAN-TCC Asset Management ===");
            console.log("1. Add new asset");
            console.log("2. View all asset IDs");
            console.log("3. Edit asset by ID");
            console.log("4. View asset details by ID");
            console.log("5. Exit");
            const choice = (await rl.question("\nSelect an option: ")).trim();

            try {
                switch (choice) {
                    case "1":
                        await addNewAsset(db);
                        break;
                    case "2":
                        viewAllAssetIds(db);
                        break;
                    case "3":
                        const editAssetId = Number(await rl.question("Enter asset ID: "));
                        if (editAssetId <= 0) {
                            console.log("Please enter a valid asset ID.");
                            break;
                        }

                        await editAsset(db, editAssetId);
                        break;
                    case "4":
                        const viewAssetId = Number(await rl.question("Enter asset ID: "));
                        if (viewAssetId <= 0) {
                            console.log("Please enter a valid asset ID.");
                            break;
                        }
                        
                        viewAssetDetails(db, viewAssetId);
                        break;
                    case "5":
                        running = false;
                        break;
                    default:
                        console.log("Invalid option. Try again.");
                }
            } catch (error) {
                console.error("\nError:", error.message);
            }
        }
    } catch (error) {
        console.error("\nError:", error.message);
        process.exitCode = 1;
    } finally {
        if (db) {
            db.close();
        }
        rl.close();
    }
}

main();

// Adding a new asset to the db
async function addNewAsset(db){
    console.log("\n=== LoRaWAN-TCC Asset Entry ===\n");

    // Collect information from user
    const title = (await rl.question("Asset title: ")).trim();
    const description = (await rl.question("Description: ")).trim();
    const filePath = (await rl.question("File path: ")).trim();
    const fileType = (await rl.question("File type: ")).trim();

    const categoriesInput = await rl.question(
        "Categories (comma-separated): "
    );

    const tagsInput = await rl.question(
        "Tags (comma-separated): "
    );

    // Split categories and tags by commas
    const categories = categoriesInput.split(",").map(value => value.trim()).filter(Boolean);
    const tags = tagsInput.split(",").map(value => value.trim()).filter(Boolean);

    // Validate required fields
    if (!title || !filePath || !fileType) {
        throw new Error("Title, file path, and file type are required.");
    }

    // Prepare SQL statements
    const insertAsset = db.prepare(`
        INSERT INTO asset
        (title, description, file_path, file_type)
        VALUES (?, ?, ?, ?)
    `);

    const insertCategory = db.prepare(`
        INSERT OR IGNORE INTO category (name)
        VALUES (?)
    `);

    const findCategory = db.prepare(`
        SELECT category_id FROM category WHERE name = ?
    `);

    const linkCategory = db.prepare(`
        INSERT OR IGNORE INTO asset_category
        (asset_id, category_id)
        VALUES (?, ?)
    `);

    const insertTag = db.prepare(`
        INSERT OR IGNORE INTO tag (name)
        VALUES (?)
    `);

    const findTag = db.prepare(`
        SELECT tag_id FROM tag WHERE name = ?
    `);

    const linkTag = db.prepare(`
        INSERT OR IGNORE INTO asset_tag
        (asset_id, tag_id)
        VALUES (?, ?)
    `);

    // Insert asset and its relationships
    const addAsset = db.transaction(() => {
        const result = insertAsset.run(
            title,
            description || null,
            filePath,
            fileType
        );
        const assetId = result.lastInsertRowid;

        for (const category of categories) {
            insertCategory.run(category);
            const categoryId = findCategory.get(category).category_id;
            linkCategory.run(assetId, categoryId);
        }

        for (const tag of tags) {
            insertTag.run(tag);
            const tagId = findTag.get(tag).tag_id;
            linkTag.run(assetId, tagId);
        }

        return assetId;
    });

    const assetId = addAsset();

    console.log("\nAsset added successfully!");
    console.log(`Asset ID: ${assetId}`);
}

// View the current assets and their asset ID
function viewAllAssetIds(db){
    console.log("\n=== Existing Assets ===\n");

    const assets = db.prepare(`
        SELECT asset_id, title, file_path
        FROM asset
        ORDER BY asset_id
    `).all();

    if (assets.length === 0) {
        console.log("No assets found.");
        return;
    }

    console.table(assets);
}

// Edit a specific asset via the ID
async function editAsset(db, assetId){
    const asset = db.prepare(`
        SELECT asset_id, title, description, file_path, file_type
        FROM asset
        WHERE asset_id = ?
    `).get(assetId);

    if (!asset) {
        console.log("Asset not found.");
        return;
    }

    console.log(`\n=== Asset ${assetId} Current Values ===\n`);
    console.table([asset]);

    console.log("\n=== Change Information ===\n")
    console.log("(If staying the same, keep blank)")

    // Collect new information
    const title = (await rl.question("Asset title: ")).trim();
    const description = (await rl.question("Description: ")).trim();
    const filePath = (await rl.question("File path: ")).trim();
    const fileType = (await rl.question("File type: ")).trim();

    const newTitle = title || asset.title;
    const newDescription = description || asset.description;
    const newFilePath = filePath || asset.file_path;
    const newFileType = fileType || asset.file_type;

    const categoriesInput = await rl.question(
        "Categories (comma-separated): "
    );

    const tagsInput = await rl.question(
        "Tags (comma-separated): "
    );

    // Split new categories and tags by commas
    const newCategories = categoriesInput.split(",").map(value => value.trim()).filter(Boolean);
    const newTags = tagsInput.split(",").map(value => value.trim()).filter(Boolean);

    // Prepare SQL statements
    const editAsset = db.prepare(`
        UPDATE asset
        SET title = ?,
            description = ?,
            file_path = ?,
            file_type = ?
        Where asset_id = ?
    `);

    const insertCategory = db.prepare(`
        INSERT OR IGNORE INTO category (name)
        VALUES (?)
    `);

    const findCategory = db.prepare(`
        SELECT category_id FROM category WHERE name = ?
    `);

    const linkCategory = db.prepare(`
        INSERT OR IGNORE INTO asset_category
        (asset_id, category_id)
        VALUES (?, ?)
    `);

    const deleteCategories = db.prepare(`
        DELETE FROM asset_category
        WHERE asset_id = ?
    `);

    const insertTag = db.prepare(`
        INSERT OR IGNORE INTO tag (name)
        VALUES (?)
    `);

    const findTag = db.prepare(`
        SELECT tag_id FROM tag WHERE name = ?
    `);

    const deleteTags = db.prepare(`
        DELETE FROM asset_tag
        WHERE asset_id = ?
    `);

    const linkTag = db.prepare(`
        INSERT OR IGNORE INTO asset_tag
        (asset_id, tag_id)
        VALUES (?, ?)
    `);

    // Edit asset and its relationships
    const update = db.transaction(() => {
        editAsset.run(
            newTitle,
            newDescription,
            newFilePath,
            newFileType,
            assetId
        );

        if(newCategories.length > 0){
            deleteCategories.run(assetId);
            for (const category of newCategories) {
                insertCategory.run(category);
                const categoryId = findCategory.get(category).category_id;
                linkCategory.run(assetId, categoryId);
            }
        }

        if(newTags.length > 0){
            deleteTags.run(assetId);
            for (const tag of newTags) {
                insertTag.run(tag);
                const tagId = findTag.get(tag).tag_id;
                linkTag.run(assetId, tagId);
            }
        }
    });

    update();

    console.log("\nAsset edited successfully!");
    console.log(`Asset ID: ${assetId}`);
}

// View the whole asset information via the ID
function viewAssetDetails(db, assetId){
    const asset = db.prepare(`
        SELECT *
        FROM asset
        WHERE asset_id = ?
    `).get(assetId);

    if (!asset) {
        console.log("Asset not found.");
        return;
    }
    
    console.log(`\n=== Viewing Asset ${assetId} ===\n`);
    console.table([asset]);
}