// mock repository to isolate controller
jest.mock("../src/repositories/assets.repository");

const assetRepository = require("../src/repositories/assets.repository");
const assetController = require("../src/controllers/assets.controller");

describe("Asset Controller Unit Tests", () => {

    let req;
    let res;

    beforeEach(() => {
        // mock request and response objects
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

    describe("getAssetByTitle()", () => {

        test("should retrieve a specific asset by title", () => {
            const mockAsset = {
                asset_id: 1,
                title: "Test Asset",
                description: "Test description",
                file_path: "/assets/test.png",
                file_type: "image/png"
            };

            req.params.title = "Test Asset";

            assetRepository.getAssetByTitle.mockReturnValue(mockAsset);

            assetController.getAssetByTitle(req, res);

            expect(assetRepository.getAssetByTitle).toHaveBeenCalledWith("Test Asset");
            expect(res.json).toHaveBeenCalledWith(mockAsset);
        });

        test("should return 404 if asset does not exist", () => {
            req.params.title = "Nonexistent Asset";

            assetRepository.getAssetByTitle.mockReturnValue(undefined);

            assetController.getAssetByTitle(req, res);

            expect(assetRepository.getAssetByTitle).toHaveBeenCalledWith("Nonexistent Asset");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Asset not found"
            });
        });

        test("should handle database errors", () => {
            const consoleError = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            req.params.title = "Test Asset";

            assetRepository.getAssetByTitle.mockImplementation(() => {
                throw new Error("Database error");
            });

            assetController.getAssetByTitle(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Failed to retrieve asset"
            });

            consoleError.mockRestore();
        });
    });
});