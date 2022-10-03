import client from "../services/client";
import TokenService from "../services/TokenService";

let tokenService = null;

beforeAll(() => {
  tokenService = new TokenService();
});

afterAll(() => {
  client.end();
});

describe("TokenService Tests", () => {
  test("_generateExpireTime is a function", () => {
    expect(typeof tokenService._generateExpireTime).toBe("function");
  });

  test("_generateExpireTime returns a string", () => {
    const expireTime = tokenService._generateExpireTime();
    expect(typeof expireTime).toBe("string");
  });

  test("_generateExpireTime returns string that matches correct format for postgres timestamp", () => {
    const expireTime = tokenService._generateExpireTime();
    console.log(expireTime);
    expect(expireTime).toMatch(/\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d.\d+/);
  });
});
