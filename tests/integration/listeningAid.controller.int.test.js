const request = require("supertest");
const dayjs = require("dayjs");
const mongoose = require("../../database/test.mongodb.connect");
const app = require("../../app");
const ListeningAidModel = require("../../models/listeningAid.model");
// mock data
const newUser = require("../mock-data/user/new-user.json");
const newListeningAid = require("../mock-data/listeningAid/new-listeningAid.json");
const allListeningAids = require("../mock-data/listeningAid/all-listeningAid.json");
// testing detail
const endpointUrl = "/listeningAids/";
const nonExistingListeningAidId = "5fe313b9c8acc928ceaee2ba";
const testData = {
  name: "Kwun Tong",
  brand: "Ping Tin Shopping Centre Man Wah Restaurant (non-residential)",
  price: 1234,
  mark: 7825,
  description: "asd",
  type: "BTC",
};

dayjs.locale("zh-hk");
let firstListeningAid;
let newListeningAidId;
let config;
const group = "group";

describe(endpointUrl, () => {
  beforeAll(async () => {
    await ListeningAidModel.deleteMany({});
    await ListeningAidModel.create(allListeningAids);
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
    expect(response.body[0].name).toBeDefined();
    expect(response.body[0].brand).toBeDefined();
    expect(response.body[0].price).toBeDefined();
    expect(response.body[0].mark).toBeDefined();
    expect(response.body[0].description).toBeDefined();
    expect(response.body[0].type).toBeDefined();
    [firstListeningAid] = response.body;
  });

  test(`GET by Id ${endpointUrl} :listeningAidId`, async () => {
    const response = await request(app).get(
      endpointUrl + firstListeningAid._id
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstListeningAid.title);
    expect(response.body.done).toBe(firstListeningAid.done);
  });

  test(`GET area by id doesn't exist ${endpointUrl} ':listeningAidId'`, async () => {
    const response = await request(app).get(
      endpointUrl + nonExistingListeningAidId
    );
    expect(response.statusCode).toBe(404);
  });

  it(`POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .set(config)
      .send(newListeningAid);
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(newListeningAid.name);
    expect(response.body.brand).toBe(newListeningAid.brand);
    expect(response.body.price).toBe(newListeningAid.price);
    expect(response.body.mark).toBe(newListeningAid.mark);
    expect(response.body.description).toBe(newListeningAid.description);
    expect(response.body.type).toBe(newListeningAid.type);

    newListeningAidId = response.body._id;
  });

  it(`should return error 500 on malformed data with POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .set(config)
      .send({ ...newListeningAid, name: "" });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: "ListeningAid validation failed: name: Path `name` is required.",
    });
  });

  it(`PUT ${endpointUrl}`, async () => {
    const res = await request(app)
      .put(endpointUrl + newListeningAidId)
      .set(config)
      .send(testData);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(testData.name);
    expect(res.body.brand).toBe(testData.brand);
    expect(res.body.price).toBe(testData.price);
    expect(res.body.mark).toBe(testData.mark);
    expect(res.body.description).toBe(testData.description);
    expect(res.body.type).toBe(testData.type);
  });

  test("HTTP DELETE", async () => {
    const res = await request(app)
      .delete(endpointUrl + newListeningAidId)
      .set(config)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(testData.name);
  });

  test("HTTP DELETE 404", async () => {
    const res = await request(app)
      .delete(endpointUrl + nonExistingListeningAidId)
      .set(config)
      .send();
    expect(res.statusCode).toBe(404);
  });
});
