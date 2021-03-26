const httpMocks = require('node-mocks-http');
const UserModel = require('../../models/user.model');
const UserController = require('../../controllers/UserController');

const userController = new UserController(UserModel);

const newUser = require('../mock-data/user/new-user.json');
const allUser = require('../mock-data/user/all-users.json');

jest.mock('../../models/user.model');

let req;
let res;
let next;
const userId = '5d5ecb5a6e598605f06cb945';

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});
/*
 * Get Users
 */
describe('userController.getAllEntities', () => {
  it('should have a getTodos function', () => {
    expect(typeof userController.getAllEntities).toBe('function');
  });
  it('should call UserModel.find({})', async () => {
    await userController.getAllEntities(req, res, next);
    expect(UserModel.find).toHaveBeenCalledWith({});
  });
  it('should return response with status 200 and all todos', async () => {
    UserModel.find.mockReturnValue(allUser);
    await userController.getAllEntities(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allUser);
  });
  it('should handle errors in getAllEntities', async () => {
    const errorMessage = { message: 'Error finding' };
    const rejectedPromise = Promise.reject(errorMessage);
    UserModel.find.mockReturnValue(rejectedPromise);
    await userController.getAllEntities(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('userController.getEntityById', () => {
  it('should have a.getEntityById', () => {
    expect(typeof userController.getEntityById).toBe('function');
  });
  it('should call UserModel.findById with route parameters', async () => {
    req.params.id = userId;
    await userController.getEntityById(req, res, next);
    expect(UserModel.findById).toBeCalledWith(userId);
  });
  it('should return json body and response code 200', async () => {
    UserModel.findById.mockReturnValue(newUser);
    await userController.getEntityById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newUser);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should do error handling', async () => {
    const errorMessage = { message: 'error finding UserModel' };
    const rejectedPromise = Promise.reject(errorMessage);
    UserModel.findById.mockReturnValue(rejectedPromise);
    await userController.getEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it('should return 404 when item doesnt exist', async () => {
    UserModel.findById.mockReturnValue(null);
    await userController.getEntityById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
/*
 * Create User
 */
describe('userController.createEntity', () => {
  beforeEach(() => {
    req.body = newUser;
  });

  it('should have a.createEntity function', () => {
    expect(typeof userController.createEntity).toBe('function');
  });
  it('should call UserModel.create', () => {
    userController.createEntity(req, res, next);
    expect(UserModel.create).toBeCalledWith(newUser);
  });
  it('should return 201 response code', async () => {
    await userController.createEntity(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should return json body in response', async () => {
    UserModel.create.mockReturnValue(newUser);
    await userController.createEntity(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newUser);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Done property missing' };
    const rejectedPromise = Promise.reject(errorMessage);
    UserModel.create.mockReturnValue(rejectedPromise);
    await userController.createEntity(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
/*
 * Update User
 */
describe('userController.updateEntityById', () => {
  it('should have a updateEntityById function', () => {
    expect(typeof userController.updateEntityById).toBe('function');
  });
  it('should update with UserModel.findByIdAndUpdate', async () => {
    req.params.id = userId;
    req.body = newUser;
    await userController.updateEntityById(req, res, next);

    expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(userId, newUser, {
      new: true,
      useFindAndModify: false,
    });
  });
  it('should return a response with json data and http code 200', async () => {
    req.params.id = userId;
    req.body = newUser;
    UserModel.findByIdAndUpdate.mockReturnValue(newUser);
    await userController.updateEntityById(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newUser);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Error' };
    const rejectedPromise = Promise.reject(errorMessage);
    UserModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await userController.updateEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
/*
 * Delete User
 */
describe('userController.deleteEntityById', () => {
  it('should have a deleteEntityById function', () => {
    expect(typeof userController.deleteEntityById).toBe('function');
  });
  it('should call findByIdAndDelete', async () => {
    req.params.id = userId;
    await userController.deleteEntityById(req, res, next);
    expect(UserModel.findByIdAndDelete).toBeCalledWith(userId);
  });
  it('should return 200 OK and deleted UserModel', async () => {
    UserModel.findByIdAndDelete.mockReturnValue(newUser);
    await userController.deleteEntityById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newUser);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Error deleting' };
    const rejectedPromise = Promise.reject(errorMessage);
    UserModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    await userController.deleteEntityById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it('should handle 404', async () => {
    UserModel.findByIdAndDelete.mockReturnValue(null);
    await userController.deleteEntityById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
/*
 * Update Login
 */
describe('userController.authenticate', () => {
  it('should have an authenticate function', () => {
    expect(typeof userController.authenticate).toBe('function');
  });

  it('should return 403 OK and invalid email', async () => {
    UserModel.findOne.mockReturnValue(null);
    req.body = newUser;
    await userController.authenticate(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toStrictEqual({
      status: 'error',
      message: 'Invalid email/password!!!',
      token: null,
    });
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return 403 OK and invalid password', async () => {
    UserModel.findOne.mockReturnValue(newUser);
    req.body = {
      email: newUser.email,
      password: 123,
    };

    await userController.authenticate(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toStrictEqual({
      status: 'error',
      message: 'Invalid email/password!!!',
      token: null,
    });
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return 403 OK and invalid password', async () => {
    UserModel.findOne.mockReturnValue(newUser);
    req.body = newUser;

    await userController.authenticate(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().token).toBeTruthy();
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should handle errors', async () => {
    const errorMessage = { message: 'Error authing' };
    const rejectedPromise = Promise.reject(errorMessage);
    UserModel.findOne.mockReturnValue(rejectedPromise);
    await userController.authenticate(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
