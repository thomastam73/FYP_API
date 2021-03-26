const request = require('supertest');
const mongoose = require('../../database/test.mongodb.connect');
const app = require('../../app');
const UserModel = require('../../models/user.model');
// mock data
const newUser = require('../mock-data/user/new-user.json');
const allUser = require('../mock-data/user/all-users.json');
// testing detail
const endpointUrl = '/users/';
const nonExistingCaseId = '5fe313b9c8acc928ceaee2ba';
const testData = {
  name: 'Make integration test for PUT',
  email: 'description integration test',
  password: '332532',
};

let firstUser;
let newUserId;
let config;

describe(endpointUrl, () => {
  beforeAll(async () => {
    await UserModel.deleteMany({});
    await UserModel.create(allUser);
    // Login
    const res = await request(app)
      .post('/login')
      .send({ email: newUser.email, password: newUser.password });
    config = {
      Authorization: `Bearer ${res.body.token}`,
    };
  });

  beforeEach(() => {});

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Login
  const loginUrl = '/login/';
  test('should return 200 and a token', async () => {
    const res = await request(app)
      .post(loginUrl)
      .send({ email: newUser.email, password: newUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  it('should return 403 and invalid email', async () => {
    const res = await request(app)
      .post(loginUrl)
      .send({ email: 'sdgkjk@gmail.com', password: newUser.password });
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toStrictEqual('Invalid email/password!!!');
  });

  it('should return 403 and invalid password', async () => {
    const res = await request(app)
      .post(loginUrl)
      .send({ email: newUser.email, password: 1234 });
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toStrictEqual('Invalid email/password!!!');
  });

  it('should return 422 and reqire to input email and password', async () => {
    const res = await request(app)
      .post(loginUrl)
      .send({ email: '', password: '' });
    expect(res.statusCode).toBe(422);
    expect(res.body.errors[0].email).toStrictEqual('Please input email');
    expect(res.body.errors[1].password).toStrictEqual('Please input password');
  });

  test(`GET ${endpointUrl}`, async () => {
    const response = await request(app).get(endpointUrl).set(config);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].name).toBeDefined();
    expect(response.body[0].email).toBeDefined();
    expect(response.body[0].password).toBeDefined();
    expect(response.body[0].status).toBeDefined();
    [firstUser] = response.body;
  });

  test(`GET by Id ${endpointUrl} :caseId`, async () => {
    const response = await request(app)
      .get(endpointUrl + firstUser._id)
      .set(config);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstUser.title);
    expect(response.body.done).toBe(firstUser.done);
  });

  test(`GET case by id doesn't exist ${endpointUrl} ':caseId'`, async () => {
    const response = await request(app)
      .get(endpointUrl + nonExistingCaseId)
      .set(config);
    expect(response.statusCode).toBe(404);
  });

  it(`POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .set(config)
      .send(newUser);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newUser.title);
    expect(response.body.description).toBe(newUser.description);
    newUserId = response.body._id;
  });

  it(`should return error 422 on missing data with POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .set(config)
      .send({ name: 'Missing pasword property', email: 'missing@gmail.com' });
    expect(response.statusCode).toBe(422);
    expect(response.body.errors[0]).toStrictEqual({
      password: 'Please input at least 5 digits',
    });
  });

  it(`PUT ${endpointUrl}`, async () => {
    const res = await request(app)
      .put(endpointUrl + newUserId)
      .set(config)
      .send(testData);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testData.title);
    expect(res.body.description).toBe(testData.description);
  });

  test('HTTP DELETE', async () => {
    const res = await request(app)
      .delete(endpointUrl + newUserId)
      .set(config)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testData.title);
    expect(res.body.description).toBe(testData.description);
  });

  test('HTTP DELETE 404', async () => {
    const res = await request(app)
      .delete(endpointUrl + nonExistingCaseId)
      .set(config)
      .send();
    expect(res.statusCode).toBe(404);
  });
});
