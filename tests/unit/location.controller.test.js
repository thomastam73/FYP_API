const httpMocks = require("node-mocks-http");
const LocationModel = require("../../models/location.model");
const LocationController = require("../../controllers/LocationController");

const locationController = new LocationController(LocationModel);

const newLocation = require("../mock-data/location/new-location.json");
const allLocation = require("../mock-data/location/all-location.json");
const groupLocation = require("../mock-data/location/group-location.json");

jest.mock("../../models/location.model");

let req;
let res;
let next;
const locationId = "5d5ecb5a6e598605f06cb945";

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});
/*
 * Get Listening Aid
 */
describe("listeningAidController.getAllEntities", () => {
  it("should have a getTodos function", () => {
    expect(typeof locationController.getAllEntities).toBe("function");
  });
  it("should call ListeningAidModel.find({})", async () => {
    await locationController.getAllEntities(req, res, next);
    expect(LocationModel.find).toHaveBeenCalledWith({});
  });
  it("should return response with status 200 and all todos", async () => {
    LocationModel.find.mockReturnValue(allLocation);
    await locationController.getAllEntities(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allLocation);
  });
  it("should handle errors in getAllEntities", async () => {
    const errorMessage = { message: "Error finding" };
    const rejectedPromise = Promise.reject(errorMessage);
    LocationModel.find.mockReturnValue(rejectedPromise);
    await locationController.getAllEntities(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("listeningAidController.getEntityById", () => {
  it("should have a.getEntityById", () => {
    expect(typeof locationController.getEntityById).toBe("function");
  });
  it("should call ListeningAidModel.findById with route parameters", async () => {
    req.params.id = locationId;
    await locationController.getEntityById(req, res, next);
    expect(LocationModel.findById).toBeCalledWith(locationId);
  });
  it("should return json body and response code 200", async () => {
    LocationModel.findById.mockReturnValue(newLocation);
    await locationController.getEntityById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newLocation);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should do error handling", async () => {
    const errorMessage = { message: "error finding ListeningAidModel" };
    const rejectedPromise = Promise.reject(errorMessage);
    LocationModel.findById.mockReturnValue(rejectedPromise);
    await locationController.getEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it("should return 404 when item doesnt exist", async () => {
    LocationModel.findById.mockReturnValue(null);
    await locationController.getEntityById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

/*
 * Get Listening Aid group
 */
describe("LocationController.getLocationGroup", () => {
  it("should have a getTodos function", () => {
    expect(typeof locationController.getLocationGroup).toBe("function");
  });

  it("should call Location.aggregate([{...}])", async () => {
    await locationController.getLocationGroup(req, res, next);
    expect(LocationModel.aggregate).toHaveBeenCalledWith([
      {
        $group: {
          _id: "$district",
          data: {
            $push: {
              _id: "$_id",
              buildingName: "$buildingName",
              address: "$address",
              phone: "$phone",
              description: "$description",
            },
          },
        },
      },
    ]);
  });

  it("should return response with status 200 and group Culturea", async () => {
    LocationModel.aggregate.mockReturnValue(groupLocation);
    await locationController.getLocationGroup(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(groupLocation);
  });

  it("should handle errors in getCultureGroup", async () => {
    const errorMessage = { message: "Error finding" };
    const rejectedPromise = Promise.reject(errorMessage);
    LocationModel.aggregate.mockReturnValue(rejectedPromise);
    await locationController.getLocationGroup(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

/*
 * Create Listening Aid
 */
describe("listeningAidController.createEntity", () => {
  beforeEach(() => {
    req.body = newLocation;
  });

  it("should have a.createEntity function", () => {
    expect(typeof locationController.createEntity).toBe("function");
  });
  it("should call ListeningAidModel.create", () => {
    locationController.createEntity(req, res, next);
    expect(LocationModel.create).toBeCalledWith(newLocation);
  });
  it("should return 201 response code", async () => {
    await locationController.createEntity(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should return json body in response", async () => {
    LocationModel.create.mockReturnValue(newLocation);
    await locationController.createEntity(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newLocation);
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "Done property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    LocationModel.create.mockReturnValue(rejectedPromise);
    await locationController.createEntity(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
/*
 * Update Listening Aid
 */
describe("listeningAidController.updateEntityById", () => {
  it("should have a updateEntityById function", () => {
    expect(typeof locationController.updateEntityById).toBe("function");
  });
  it("should update with ListeningAidModel.findByIdAndUpdate", async () => {
    req.params.id = locationId;
    req.body = newLocation;
    await locationController.updateEntityById(req, res, next);

    expect(LocationModel.findByIdAndUpdate).toHaveBeenCalledWith(
      locationId,
      newLocation,
      {
        new: true,
        useFindAndModify: false,
      }
    );
  });
  it("should return a response with json data and http code 200", async () => {
    req.params.id = locationId;
    req.body = newLocation;
    LocationModel.findByIdAndUpdate.mockReturnValue(newLocation);
    await locationController.updateEntityById(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newLocation);
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "Error" };
    const rejectedPromise = Promise.reject(errorMessage);
    LocationModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await locationController.updateEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
/*
 * Delete Rule
 */
describe("listeningAidController.deleteEntityById", () => {
  it("should have a deleteEntityById function", () => {
    expect(typeof locationController.deleteEntityById).toBe("function");
  });
  it("should call findByIdAndDelete", async () => {
    req.params.id = locationId;
    await locationController.deleteEntityById(req, res, next);
    expect(LocationModel.findByIdAndDelete).toBeCalledWith(locationId);
  });
  it("should return 200 OK and deleted ListeningAidModel", async () => {
    LocationModel.findByIdAndDelete.mockReturnValue(newLocation);
    await locationController.deleteEntityById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newLocation);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "Error deleting" };
    const rejectedPromise = Promise.reject(errorMessage);
    LocationModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    await locationController.deleteEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it("should handle 404", async () => {
    LocationModel.findByIdAndDelete.mockReturnValue(null);
    await locationController.deleteEntityById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
