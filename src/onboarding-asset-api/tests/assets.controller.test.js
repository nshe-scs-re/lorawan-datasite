
// mock repository to isolate controller
jest.mock("../src/repositories/assets.repository");

const assetRepository = require("../src/repositories/assets.repository");
const assetController = require("../src/controllers/assets.controller");

describe("Asset Controller Unit Tests", () => {

    let req;
    let res;

    beforeEach(() => {
        // mock objects
        req = {
            params: {}
        };

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllAssets()", () => {

        test("should retrieve all assets", () => {
            const mockAssets = [
                {
                    asset_id: 1,
                    title: "Test Asset",
                    description: "Test description",
                    file_path: "/assets/test.png",
                    file_type: "image/png"
                }
            ];

            assetRepository.getAllAssets.mockReturnValue(mockAssets);

            assetController.getAllAssets(req, res);

            expect(assetRepository.getAllAssets).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(mockAssets);
        });

        test("should handle database errors", () => {
            const consoleError = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            assetRepository.getAllAssets.mockImplementation(() => {
                throw new Error("Database error");
            });

            assetController.getAllAssets(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Failed to retrieve assets"
            });

            consoleError.mockRestore();
        });
    });

    describe("getAssetById()", () => {

        test("should retrieve a specific asset", () => {
            const mockAsset = {
                asset_id: 1,
                title: "Test Asset",
                description: "Test description",
                file_path: "/assets/test.png",
                file_type: "image/png"
            };

            req.params.id = "1";

            assetRepository.getAssetById.mockReturnValue(mockAsset);

            assetController.getAssetById(req, res);

            expect(assetRepository.getAssetById).toHaveBeenCalledWith("1");
            expect(res.json).toHaveBeenCalledWith(mockAsset);
        });

        test("should return 404 if asset does not exist", () => {
            req.params.id = "999";

            assetRepository.getAssetById.mockReturnValue(undefined);

            assetController.getAssetById(req, res);

            expect(assetRepository.getAssetById).toHaveBeenCalledWith("999");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Asset not found"
            });
        });

        test("should handle database errors", () => {
            const consoleError = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            req.params.id = "1";

            assetRepository.getAssetById.mockImplementation(() => {
                throw new Error("Database error");
            });

            assetController.getAssetById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Failed to retrieve asset"
            });

            consoleError.mockRestore();
        });
    });
});
