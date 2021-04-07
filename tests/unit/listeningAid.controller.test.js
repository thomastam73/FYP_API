const httpMocks = require("node-mocks-http");
const ListeningAidModel = require("../../models/listeningAid.model");
const ListeningAidController = require("../../controllers/ListeningAidController");

const listeningAidController = new ListeningAidController(ListeningAidModel);

const newListeningAid = require("../mock-data/listeningAid/new-listeningAid.json");
const allListeningAid = require("../mock-data/listeningAid/all-listeningAid.json");
const groupListeningAid = require("../mock-data/listeningAid/group-listeningAid.json");

jest.mock("../../models/listeningAid.model");

let req;
let res;
let next;
const listeningAidId = "5d5ecb5a6e598605f06cb945";

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
    expect(typeof listeningAidController.getAllEntities).toBe("function");
  });
  it("should call ListeningAidModel.find({})", async () => {
    await listeningAidController.getAllEntities(req, res, next);
    expect(ListeningAidModel.find).toHaveBeenCalledWith({});
  });
  it("should return response with status 200 and all todos", async () => {
    ListeningAidModel.find.mockReturnValue(allListeningAid);
    await listeningAidController.getAllEntities(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allListeningAid);
  });
  it("should handle errors in getAllEntities", async () => {
    const errorMessage = { message: "Error finding" };
    const rejectedPromise = Promise.reject(errorMessage);
    ListeningAidModel.find.mockReturnValue(rejectedPromise);
    await listeningAidController.getAllEntities(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("listeningAidController.getEntityById", () => {
  it("should have a.getEntityById", () => {
    expect(typeof listeningAidController.getEntityById).toBe("function");
  });
  it("should call ListeningAidModel.findById with route parameters", async () => {
    req.params.id = listeningAidId;
    await listeningAidController.getEntityById(req, res, next);
    expect(ListeningAidModel.findById).toBeCalledWith(listeningAidId);
  });
  it("should return json body and response code 200", async () => {
    ListeningAidModel.findById.mockReturnValue(newListeningAid);
    await listeningAidController.getEntityById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newListeningAid);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should do error handling", async () => {
    const errorMessage = { message: "error finding ListeningAidModel" };
    const rejectedPromise = Promise.reject(errorMessage);
    ListeningAidModel.findById.mockReturnValue(rejectedPromise);
    await listeningAidController.getEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it("should return 404 when item doesnt exist", async () => {
    ListeningAidModel.findById.mockReturnValue(null);
    await listeningAidController.getEntityById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
/*
 * Get Listening Aid group
 */
describe("ListeningAidController.getListeningAidGroup", () => {
  it("should have a getTodos function", () => {
    expect(typeof listeningAidController.getListeningAidGroup).toBe("function");
  });

  it("should call CultureModel.aggregate([{...}])", async () => {
    await listeningAidController.getListeningAidGroup(req, res, next);
    expect(ListeningAidModel.aggregate).toHaveBeenCalledWith([
      {
        $group: {
          _id: "$type",
          data: {
            $push: {
              _id: "$_id",
              name: "$name",
              brand: "$brand",
              price: "$price",
              mark: "$mark",
              description: "$description",
            },
          },
        },
      },
    ]);
  });

  it("should return response with status 200 and group Culturea", async () => {
    ListeningAidModel.aggregate.mockReturnValue(groupListeningAid);
    await listeningAidController.getListeningAidGroup(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(groupListeningAid);
  });

  it("should handle errors in getCultureGroup", async () => {
    const errorMessage = { message: "Error finding" };
    const rejectedPromise = Promise.reject(errorMessage);
    ListeningAidModel.aggregate.mockReturnValue(rejectedPromise);
    await listeningAidController.getListeningAidGroup(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

/*
 * Create Listening Aid
 */
describe("listeningAidController.createEntity", () => {
  beforeEach(() => {
    req.body = newListeningAid;
  });

  it("should have a.createEntity function", () => {
    expect(typeof listeningAidController.createEntity).toBe("function");
  });
  it("should call ListeningAidModel.create", () => {
    listeningAidController.createEntity(req, res, next);
    expect(ListeningAidModel.create).toBeCalledWith(newListeningAid);
  });
  it("should return 201 response code", async () => {
    await listeningAidController.createEntity(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should return json body in response", async () => {
    ListeningAidModel.create.mockReturnValue(newListeningAid);
    await listeningAidController.createEntity(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newListeningAid);
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "Done property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    ListeningAidModel.create.mockReturnValue(rejectedPromise);
    await listeningAidController.createEntity(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
/*
 * Update Listening Aid
 */
describe("listeningAidController.updateEntityById", () => {
  it("should have a updateEntityById function", () => {
    expect(typeof listeningAidController.updateEntityById).toBe("function");
  });
  it("should update with ListeningAidModel.findByIdAndUpdate", async () => {
    req.params.id = listeningAidId;
    req.body = newListeningAid;
    await listeningAidController.updateEntityById(req, res, next);

    expect(ListeningAidModel.findByIdAndUpdate).toHaveBeenCalledWith(
      listeningAidId,
      newListeningAid,
      {
        new: true,
        useFindAndModify: false,
      }
    );
  });
  it("should return a response with json data and http code 200", async () => {
    req.params.id = listeningAidId;
    req.body = newListeningAid;
    ListeningAidModel.findByIdAndUpdate.mockReturnValue(newListeningAid);
    await listeningAidController.updateEntityById(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newListeningAid);
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "Error" };
    const rejectedPromise = Promise.reject(errorMessage);
    ListeningAidModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await listeningAidController.updateEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
/*
 * Delete Rule
 */
describe("listeningAidController.deleteEntityById", () => {
  it("should have a deleteEntityById function", () => {
    expect(typeof listeningAidController.deleteEntityById).toBe("function");
  });
  it("should call findByIdAndDelete", async () => {
    req.params.id = listeningAidId;
    await listeningAidController.deleteEntityById(req, res, next);
    expect(ListeningAidModel.findByIdAndDelete).toBeCalledWith(listeningAidId);
  });
  it("should return 200 OK and deleted ListeningAidModel", async () => {
    ListeningAidModel.findByIdAndDelete.mockReturnValue(newListeningAid);
    await listeningAidController.deleteEntityById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newListeningAid);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "Error deleting" };
    const rejectedPromise = Promise.reject(errorMessage);
    ListeningAidModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    await listeningAidController.deleteEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it("should handle 404", async () => {
    ListeningAidModel.findByIdAndDelete.mockReturnValue(null);
    await listeningAidController.deleteEntityById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
