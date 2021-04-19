const httpMocks = require("node-mocks-http");
const SignLanguageModel = require("../../models/signLanguage.model");
const SignLanguageController = require("../../controllers/SignLanguageController");

const signLanguageController = new SignLanguageController(SignLanguageModel);

const newSignLanguage = require("../mock-data/signLanguage/new-signLanguage.json");
const allSignLanguage = require("../mock-data/signLanguage/all-signLanguage.json");
const groupSignLanguage = require("../mock-data/signLanguage/group-signLanguage.json");

jest.mock("../../models/signLanguage.model");

let req;
let res;
let next;
const signLanguageId = "5d5ecb5a6e598605f06cb945";

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
    expect(typeof signLanguageController.getAllEntities).toBe("function");
  });
  it("should call ListeningAidModel.find({})", async () => {
    await signLanguageController.getAllEntities(req, res, next);
    expect(SignLanguageModel.find).toHaveBeenCalledWith({});
  });
  it("should return response with status 200 and all todos", async () => {
    SignLanguageModel.find.mockReturnValue(allSignLanguage);
    await signLanguageController.getAllEntities(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allSignLanguage);
  });
  it("should handle errors in getAllEntities", async () => {
    const errorMessage = { message: "Error finding" };
    const rejectedPromise = Promise.reject(errorMessage);
    SignLanguageModel.find.mockReturnValue(rejectedPromise);
    await signLanguageController.getAllEntities(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("listeningAidController.getEntityById", () => {
  it("should have a.getEntityById", () => {
    expect(typeof signLanguageController.getEntityById).toBe("function");
  });
  it("should call ListeningAidModel.findById with route parameters", async () => {
    req.params.id = signLanguageId;
    await signLanguageController.getEntityById(req, res, next);
    expect(SignLanguageModel.findById).toBeCalledWith(signLanguageId);
  });
  it("should return json body and response code 200", async () => {
    SignLanguageModel.findById.mockReturnValue(newSignLanguage);
    await signLanguageController.getEntityById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newSignLanguage);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should do error handling", async () => {
    const errorMessage = { message: "error finding ListeningAidModel" };
    const rejectedPromise = Promise.reject(errorMessage);
    SignLanguageModel.findById.mockReturnValue(rejectedPromise);
    await signLanguageController.getEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it("should return 404 when item doesnt exist", async () => {
    SignLanguageModel.findById.mockReturnValue(null);
    await signLanguageController.getEntityById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
/*
 * Get Listening Aid group
 */
describe("LocationController.getLocationGroup", () => {
  it("should have a getTodos function", () => {
    expect(typeof signLanguageController.getSignLanguageGroup).toBe("function");
  });

  it("should call Location.aggregate([{...}])", async () => {
    await signLanguageController.getSignLanguageGroup(req, res, next);
    expect(SignLanguageModel.aggregate).toHaveBeenCalledWith([
      {
        $group: {
          _id: "$district",
          data: {
            $push: {
              _id: "$_id",
              name: "$name",
              videoLink: "$videoLink",
              description: "$description",
              gesture: "$gesture",
              imgURL: "$imgURL",
            },
          },
        },
      },
    ]);
  });

  it("should return response with status 200 and group Culturea", async () => {
    SignLanguageModel.aggregate.mockReturnValue(groupSignLanguage);
    await signLanguageController.getSignLanguageGroup(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(groupSignLanguage);
  });

  it("should handle errors in getCultureGroup", async () => {
    const errorMessage = { message: "Error finding" };
    const rejectedPromise = Promise.reject(errorMessage);
    SignLanguageModel.aggregate.mockReturnValue(rejectedPromise);
    await signLanguageController.getSignLanguageGroup(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

/*
 * Create Listening Aid
 */
describe("listeningAidController.createEntity", () => {
  beforeEach(() => {
    req.body = newSignLanguage;
  });

  it("should have a.createEntity function", () => {
    expect(typeof signLanguageController.createEntity).toBe("function");
  });
  it("should call ListeningAidModel.create", () => {
    signLanguageController.createEntity(req, res, next);
    expect(SignLanguageModel.create).toBeCalledWith(newSignLanguage);
  });
  it("should return 201 response code", async () => {
    await signLanguageController.createEntity(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should return json body in response", async () => {
    SignLanguageModel.create.mockReturnValue(newSignLanguage);
    await signLanguageController.createEntity(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newSignLanguage);
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "Done property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    SignLanguageModel.create.mockReturnValue(rejectedPromise);
    await signLanguageController.createEntity(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
/*
 * Update Listening Aid
 */
describe("listeningAidController.updateEntityById", () => {
  it("should have a updateEntityById function", () => {
    expect(typeof signLanguageController.updateEntityById).toBe("function");
  });
  it("should update with ListeningAidModel.findByIdAndUpdate", async () => {
    req.params.id = signLanguageId;
    req.body = newSignLanguage;
    await signLanguageController.updateEntityById(req, res, next);

    expect(SignLanguageModel.findByIdAndUpdate).toHaveBeenCalledWith(
      signLanguageId,
      newSignLanguage,
      {
        new: true,
        useFindAndModify: false,
      }
    );
  });
  it("should return a response with json data and http code 200", async () => {
    req.params.id = signLanguageId;
    req.body = newSignLanguage;
    SignLanguageModel.findByIdAndUpdate.mockReturnValue(newSignLanguage);
    await signLanguageController.updateEntityById(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newSignLanguage);
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "Error" };
    const rejectedPromise = Promise.reject(errorMessage);
    SignLanguageModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await signLanguageController.updateEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
/*
 * Delete Rule
 */
describe("listeningAidController.deleteEntityById", () => {
  it("should have a deleteEntityById function", () => {
    expect(typeof signLanguageController.deleteEntityById).toBe("function");
  });
  it("should call findByIdAndDelete", async () => {
    req.params.id = signLanguageId;
    await signLanguageController.deleteEntityById(req, res, next);
    expect(SignLanguageModel.findByIdAndDelete).toBeCalledWith(signLanguageId);
  });
  it("should return 200 OK and deleted ListeningAidModel", async () => {
    SignLanguageModel.findByIdAndDelete.mockReturnValue(newSignLanguage);
    await signLanguageController.deleteEntityById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newSignLanguage);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "Error deleting" };
    const rejectedPromise = Promise.reject(errorMessage);
    SignLanguageModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    await signLanguageController.deleteEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it("should handle 404", async () => {
    SignLanguageModel.findByIdAndDelete.mockReturnValue(null);
    await signLanguageController.deleteEntityById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
