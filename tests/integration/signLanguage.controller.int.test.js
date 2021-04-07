const request = require("supertest");
const dayjs = require("dayjs");
const mongoose = require("../../database/test.mongodb.connect");
const app = require("../../app");
const SignLanguageModel = require("../../models/signLanguage.model");
// mock data
const newUser = require("../mock-data/user/new-user.json");
const newSignLanguage = require("../mock-data/signLanguage/new-signLanguage.json");
const allSignLanguage = require("../mock-data/signLanguage/all-signLanguage.json");
// testing detail
const endpointUrl = "/signLanguages/";
const nonExistingSignLanguageId = "5fe313b9c8acc928ceaee2ba";
const testData = {
  name: "Hand",
  videoLink: "video/hand.mp3",
  description: "The sign language of hand",
  gesture: "to left",
  district: "Hong Kong",
};

dayjs.locale("zh-hk");
let firstSignLanguage;
let newSignLanguageId;
let config;
const group = "group";

describe(endpointUrl, () => {
  beforeAll(async () => {
    await SignLanguageModel.deleteMany({});
    await SignLanguageModel.create(allSignLanguage);
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
    expect(response.body[0].name).toBeDefined();
    expect(response.body[0].videoLink).toBeDefined();
    expect(response.body[0].description).toBeDefined();
    expect(response.body[0].gesture).toBeDefined();
    expect(response.body[0].district).toBeDefined();
    [firstSignLanguage] = response.body;
  });

  test(`GET by Id ${endpointUrl} :signLanguageId`, async () => {
    const response = await request(app).get(
      endpointUrl + firstSignLanguage._id
    );
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(firstSignLanguage._id);
    expect(response.body.name).toBe(firstSignLanguage.name);
    expect(response.body.videoLink).toBe(firstSignLanguage.videoLink);
    expect(response.body.description).toBe(firstSignLanguage.description);
    expect(response.body.gesture).toBe(firstSignLanguage.gesture);
    expect(response.body.district).toBe(firstSignLanguage.district);
  });

  test(`GET sign language by id doesn't exist ${endpointUrl} ':signLanguageId'`, async () => {
    const response = await request(app).get(
      endpointUrl + nonExistingSignLanguageId
    );
    expect(response.statusCode).toBe(404);
  });

  it(`POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .set(config)
      .send(newSignLanguage);
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(newSignLanguage.name);
    expect(response.body.videoLink).toBe(newSignLanguage.videoLink);
    expect(response.body.description).toBe(newSignLanguage.description);
    expect(response.body.gesture).toBe(newSignLanguage.gesture);
    expect(response.body.district).toBe(newSignLanguage.district);
    newSignLanguageId = response.body._id;
  });

  it(`should return error 500 on malformed data with POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .set(config)
      .send({ ...newSignLanguage, name: "" });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: "SignLanguage validation failed: name: Path `name` is required.",
    });
  });

  it(`PUT ${endpointUrl}`, async () => {
    const res = await request(app)
      .put(endpointUrl + newSignLanguageId)
      .set(config)
      .send(testData);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(testData.name);
    expect(res.body.videoLink).toBe(testData.videoLink);
    expect(res.body.description).toBe(testData.description);
    expect(res.body.gesture).toBe(testData.gesture);
    expect(res.body.district).toBe(testData.district);
  });

  test("HTTP DELETE", async () => {
    const res = await request(app)
      .delete(endpointUrl + newSignLanguageId)
      .set(config)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(testData.name);
    expect(res.body.videoLink).toBe(testData.videoLink);
    expect(res.body.description).toBe(testData.description);
    expect(res.body.gesture).toBe(testData.gesture);
    expect(res.body.district).toBe(testData.district);
  });

  test("HTTP DELETE 404", async () => {
    const res = await request(app)
      .delete(endpointUrl + nonExistingSignLanguageId)
      .set(config)
      .send();
    expect(res.statusCode).toBe(404);
  });
});
