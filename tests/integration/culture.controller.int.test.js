const request = require("supertest");
const dayjs = require("dayjs");
const mongoose = require("../../database/test.mongodb.connect");
const app = require("../../app");
const CultureModel = require("../../models/culture.model");
// mock data
const newUser = require("../mock-data/user/new-user.json");
const newCulture = require("../mock-data/culture/new-culture.json");
const allCulture = require("../mock-data/culture/all-culture.json");
// testing detail
const endpointUrl = "/cultures/";
const nonExistingCultureId = "5fe313b9c8acc928ceaee2ba";
const testData = {
  name: "Never call them Deaf and Dumb",
  description: "asd",
  countrySource: "Hong Kong",
  reportDate: "2021-03-02T00:00:00.000Z",
};

dayjs.locale("zh-hk");
let firstCulture;
let newCultureId;
let config;
const group = "group";
describe(endpointUrl, () => {
  beforeAll(async () => {
    await CultureModel.deleteMany({});
    await CultureModel.create(allCulture);
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

  test(`GET ${endpointUrl}`, async () => {
    const response = await request(app).get(endpointUrl);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].name).toBeDefined();
    expect(response.body[0].description).toBeDefined();
    expect(response.body[0].countrySource).toBeDefined();
    expect(response.body[0].reportDate).toBeDefined();
    [firstCulture] = response.body;
  });

  test(`GET ${endpointUrl}group`, async () => {
    const response = await request(app).get(endpointUrl + group);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0]._id).toBeDefined();
    expect(response.body[0].data).toBeDefined();
  });

  test(`GET by Id ${endpointUrl} :cultureID`, async () => {
    const response = await request(app).get(endpointUrl + firstCulture._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstCulture.title);
    expect(response.body.done).toBe(firstCulture.done);
  });

  test(`GET case by id doesn't exist ${endpointUrl} ':cultureId'`, async () => {
    const response = await request(app).get(endpointUrl + nonExistingCultureId);
    expect(response.statusCode).toBe(404);
  });

  it(`POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .set(config)
      .send(newCulture);

    expect(response.statusCode).toBe(201);
    expect(response.body.caseNo).toBe(newCulture.caseNo);
    expect(dayjs(response.body.reportDate).format("YYYY-MM-DD")).toBe(
      dayjs(newCulture.reportDate).format("YYYY-MM-DD")
    );
    newCultureId = response.body._id;
  });

  it(`should return error 500 on malformed data with POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .set(config)
      .send({ ...newCulture, name: "" });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: "Culture validation failed: name: Path `name` is required.",
    });
  });

  it(`PUT ${endpointUrl}`, async () => {
    const res = await request(app)
      .put(endpointUrl + newCultureId)
      .set(config)
      .send(testData);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(testData.name);
    expect(res.body.description).toBe(testData.description);
    expect(res.body.countrySource).toBe(testData.countrySource);
    expect(res.body.reportDate).toBe(testData.reportDate);
  });

  test("HTTP DELETE", async () => {
    const res = await request(app)
      .delete(endpointUrl + newCultureId)
      .set(config)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(testData.name);
  });

  test("HTTP DELETE 404", async () => {
    const res = await request(app)
      .delete(endpointUrl + nonExistingCultureId)
      .set(config)
      .send();
    expect(res.statusCode).toBe(404);
  });
});
