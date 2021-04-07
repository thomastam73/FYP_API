const request = require("supertest");
const dayjs = require("dayjs");
const mongoose = require("../../database/test.mongodb.connect");
const app = require("../../app");
const LocationModel = require("../../models/location.model");
// mock data
const newUser = require("../mock-data/user/new-user.json");
const newLocation = require("../mock-data/location/new-location.json");
const allLocation = require("../mock-data/location/all-location.json");
// testing detail
const endpointUrl = "/locations/";
const nonExistingLocationId = "5fe313b9c8acc928ceaee2ba";
const testData = {
  buildingName: "Aim deaf and dumb people",
  district: "new",
  address: "tuem mun",
  phone: 99223344,
  description: "Aim of help deaf and dumb people",
};

dayjs.locale("zh-hk");
let firstLocation;
let newLocationId;
let config;
const group = "group";

describe(endpointUrl, () => {
  beforeAll(async () => {
    await LocationModel.deleteMany({});
    await LocationModel.create(allLocation);
    // Login
    const res = await request(app)
      .post("/login")
      .send({ email: newUser.email, password: newUser.password });
    config = {
      Authorization: `Bearer ${res.body.token}`,
    };
  });

  afterEach(async () => {});

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test(`GET ${endpointUrl}group`, async () => {
    const response = await request(app).get(endpointUrl + group);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0]._id).toBeDefined();
    expect(response.body[0].data).toBeDefined();
  });

  test(`GET ${endpointUrl}`, async () => {
    const response = await request(app).get(endpointUrl);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0]._id).toBeDefined();
    expect(response.body[0].buildingName).toBeDefined();
    expect(response.body[0].district).toBeDefined();
    expect(response.body[0].address).toBeDefined();
    expect(response.body[0].phone).toBeDefined();
    expect(response.body[0].description).toBeDefined();
    [firstLocation] = response.body;
  });

  test(`GET by Id ${endpointUrl} :signLanguageId`, async () => {
    const response = await request(app).get(endpointUrl + firstLocation._id);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(firstLocation._id);
    expect(response.body.buildingName).toBe(firstLocation.buildingName);
    expect(response.body.district).toBe(firstLocation.district);
    expect(response.body.address).toBe(firstLocation.address);
    expect(response.body.phone).toBe(firstLocation.phone);
    expect(response.body.description).toBe(firstLocation.description);
  });

  test(`GET sign language by id doesn't exist ${endpointUrl} ':signLanguageId'`, async () => {
    const response = await request(app).get(
      endpointUrl + nonExistingLocationId
    );
    expect(response.statusCode).toBe(404);
  });

  it(`POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .set(config)
      .send(newLocation);
    expect(response.statusCode).toBe(201);
    expect(response.body.buildingName).toBe(newLocation.buildingName);
    expect(response.body.district).toBe(newLocation.district);
    expect(response.body.address).toBe(newLocation.address);
    expect(response.body.phone).toBe(newLocation.phone);
    expect(response.body.description).toBe(newLocation.description);
    newLocationId = response.body._id;
  });

  it(`should return error 500 on malformed data with POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .set(config)
      .send({ ...newLocation, buildingName: "" });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message:
        "Location validation failed: buildingName: Path `buildingName` is required.",
    });
  });

  it(`PUT ${endpointUrl}`, async () => {
    const res = await request(app)
      .put(endpointUrl + newLocationId)
      .set(config)
      .send(testData);
    expect(res.statusCode).toBe(200);
    expect(res.body.buildingName).toBe(testData.buildingName);
    expect(res.body.district).toBe(testData.district);
    expect(res.body.address).toBe(testData.address);
    expect(res.body.phone).toBe(testData.phone);
    expect(res.body.description).toBe(testData.description);
  });

  test("HTTP DELETE", async () => {
    const res = await request(app)
      .delete(endpointUrl + newLocationId)
      .set(config)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.buildingName).toBe(testData.buildingName);
    expect(res.body.district).toBe(testData.district);
    expect(res.body.address).toBe(testData.address);
    expect(res.body.phone).toBe(testData.phone);
    expect(res.body.description).toBe(testData.description);
  });

  test("HTTP DELETE 404", async () => {
    const res = await request(app)
      .delete(endpointUrl + nonExistingLocationId)
      .set(config)
      .send();
    expect(res.statusCode).toBe(404);
  });
});
