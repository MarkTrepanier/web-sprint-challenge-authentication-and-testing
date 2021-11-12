const server = require("./server");
const request = require("supertest");
const db = require("../data/dbConfig");

test("sanity", () => {
  expect(true).toBe(true);
});

test("is testing environment", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});

describe("[POST] to /api/auth/register", () => {
  test.todo("res.status, 201");
  test.todo("returns proper body");
  test.todo("fails if user already exists");
  test.todo("username and password required");
});

describe("[POST] to /api/auth/login", () => {
  test.todo("res.status, 200");
  test.todo("success, provides message and token");
  test.todo("fail message for user not existing");
  test.todo("username and password required");
});
