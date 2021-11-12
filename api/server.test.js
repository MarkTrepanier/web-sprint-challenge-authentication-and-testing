const server = require("./server");
const request = require("supertest");
const db = require("../data/dbConfig");

test("sanity", () => {
  expect(true).toBe(true);
});

test("is testing environment", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});

beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
afterAll(async () => {
  await db.destroy();
});

describe("[POST] to /api/auth/register", () => {
  const reqBody = { username: "phillip", password: "1234" };
  test("responds with status 201", async () => {
    const res = await request(server).post("/api/auth/register").send(reqBody);
    expect(res.status).toBe(201);
  });
  test("returns proper body", async () => {
    const res = await request(server).post("/api/auth/register").send(reqBody);
    expect(res.body).toMatchObject({ username: "phillip" });
  });
  test("fails if user already exists", async () => {
    await request(server).post("/api/auth/register").send(reqBody);
    const res = await request(server).post("/api/auth/register").send(reqBody);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("username taken");
  });
  test("username and password required", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "", password: "" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("username and password required");
  });
});

describe("[POST] to /api/auth/login", () => {
  const credentials = { username: "phillip", password: "1234" };
  beforeEach(async () => {
    await request(server).post("/api/auth/register").send(credentials);
  });

  test("res.status, 200", async () => {
    const res = await request(server).post("/api/auth/login").send(credentials);
    expect(res.status).toBe(200);
  });
  test("success, provides message and token", async () => {
    const res = await request(server).post("/api/auth/login").send(credentials);
    expect(res.body.message).toBe(`welcome ${credentials.username}`);
    expect(res.body).toHaveProperty("token");
  });
  test("fail message for user not existing", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "crag", password: "1234" });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("invalid credentials");
  });
  test("fail message for incorrect password", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "phillip", password: "1238" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("invalid credentials");
  });
  test("username and password required", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "", password: "" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("username and password required");
  });
});
