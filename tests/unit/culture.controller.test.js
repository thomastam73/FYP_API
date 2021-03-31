const httpMocks = require("node-mocks-http");
const CultureModel = require("../../models/culture.model");
const CultureController = require("../../controllers/CultureController");

const cultureController = new CultureController(CultureModel);

const newCulture = require("../mock-data/culture/new-culture.json");
const allCulture = require("../mock-data/culture/all-culture.json");
const groupCulture = require("../mock-data/culture/group-culture.json");

jest.mock("../../models/culture.model");
let req;
let res;
let next;
const cultureId = "5d5ecb5a6e598605f06cb945";

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});
/*
 * Get Culture
 */
describe("CultureController.getAllEntities", () => {
  it("should have a getTodos function", () => {
    expect(typeof cultureController.getAllEntities).toBe("function");
  });
  it("should call CultureModel.find({})", async () => {
    await cultureController.getAllEntities(req, res, next);
    expect(CultureModel.find).toHaveBeenCalledWith({});
  });
  it("should return response with status 200 and all todos", async () => {
    CultureModel.find.mockReturnValue(allCulture);
    await cultureController.getAllEntities(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allCulture);
  });
  it("should handle errors in getAllEntities", async () => {
    const errorMessage = { message: "Error finding" };
    const rejectedPromise = Promise.reject(errorMessage);
    CultureModel.find.mockReturnValue(rejectedPromise);
    await cultureController.getAllEntities(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
/*
 * Get Culture group
 */
describe("InstitutionController.getCultureGroup", () => {
  it("should have a getTodos function", () => {
    expect(typeof cultureController.getCultureGroup).toBe("function");
  });

  it("should call CultureModel.aggregate([{...}])", async () => {
    await cultureController.getCultureGroup(req, res, next);
    expect(CultureModel.aggregate).toHaveBeenCalledWith([
      {
        $group: {
          _id: "$countrySource",
          data: {
            $push: {
              _id: "$_id",
              name: "$name",
              discription: "$discription",
              reportDate: "$reportDate",
            },
          },
        },
      },
    ]);
  });
  it("should return response with status 200 and group Culturea", async () => {
    CultureModel.aggregate.mockReturnValue(groupCulture);
    await cultureController.getCultureGroup(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(groupCulture);
  });

  it("should handle errors in getCultureGroup", async () => {
    const errorMessage = { message: "Error finding" };
    const rejectedPromise = Promise.reject(errorMessage);
    CultureModel.aggregate.mockReturnValue(rejectedPromise);
    await cultureController.getCultureGroup(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("CultureController.getEntityById", () => {
  it("should have a.getEntityById", () => {
    expect(typeof cultureController.getEntityById).toBe("function");
  });
  it("should call CultureModel.findById with route parameters", async () => {
    req.params.id = cultureId;
    await cultureController.getEntityById(req, res, next);
    expect(CultureModel.findById).toBeCalledWith(cultureId);
  });
  it("should return json body and response code 200", async () => {
    CultureModel.findById.mockReturnValue(newCulture);
    await cultureController.getEntityById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newCulture);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should do error handling", async () => {
    const errorMessage = { message: "error finding CultureModel" };
    const rejectedPromise = Promise.reject(errorMessage);
    CultureModel.findById.mockReturnValue(rejectedPromise);
    await cultureController.getEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it("should return 404 when item doesnt exist", async () => {
    CultureModel.findById.mockReturnValue(null);
    await cultureController.getEntityById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
/*
 * Create Culture
 */
describe("CultureController.createEntity", () => {
  beforeEach(() => {
    req.body = newCulture;
  });

  it("should have a.createEntity function", () => {
    expect(typeof cultureController.createEntity).toBe("function");
  });
  it("should call CultureModel.create", () => {
    cultureController.createEntity(req, res, next);
    expect(CultureModel.create).toBeCalledWith(newCulture);
  });
  it("should return 201 response code", async () => {
    await cultureController.createEntity(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should return json body in response", async () => {
    CultureModel.create.mockReturnValue(newCulture);
    await cultureController.createEntity(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newCulture);
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "Done property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    CultureModel.create.mockReturnValue(rejectedPromise);
    await cultureController.createEntity(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
/*
 * Update Case
 */
describe("CultureController.updateEntityById", () => {
  it("should have a updateEntityById function", () => {
    expect(typeof cultureController.updateEntityById).toBe("function");
  });
  it("should update with CultureModel.findByIdAndUpdate", async () => {
    req.params.id = cultureId;
    req.body = newCulture;
    await cultureController.updateEntityById(req, res, next);

    expect(CultureModel.findByIdAndUpdate).toHaveBeenCalledWith(
      cultureId,
      newCulture,
      {
        new: true,
        useFindAndModify: false,
      }
    );
  });
  it("should return a response with json data and http code 200", async () => {
    req.params.id = cultureId;
    req.body = newCulture;
    CultureModel.findByIdAndUpdate.mockReturnValue(newCulture);
    await cultureController.updateEntityById(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newCulture);
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "Error" };
    const rejectedPromise = Promise.reject(errorMessage);
    CultureModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await cultureController.updateEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
/*
 * Delete Case
 */
describe("CultureController.deleteEntityById", () => {
  it("should have a deleteEntityById function", () => {
    expect(typeof cultureController.deleteEntityById).toBe("function");
  });
  it("should call findByIdAndDelete", async () => {
    req.params.id = cultureId;
    await cultureController.deleteEntityById(req, res, next);
    expect(CultureModel.findByIdAndDelete).toBeCalledWith(cultureId);
  });
  it("should return 200 OK and deleted CaseModel", async () => {
    CultureModel.findByIdAndDelete.mockReturnValue(newCulture);
    await cultureController.deleteEntityById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newCulture);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "Error deleting" };
    const rejectedPromise = Promise.reject(errorMessage);
    CultureModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    await cultureController.deleteEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it("should handle 404", async () => {
    CultureModel.findByIdAndDelete.mockReturnValue(null);
    await cultureController.deleteEntityById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
