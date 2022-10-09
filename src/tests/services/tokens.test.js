import client from "../../config/client.js";
import { generateTokenExpireDate, saveToken } from "../../services/tokens.js";

afterAll(async () => {
  client.query("DELETE FROM tokens");

  setTimeout(() => {
    client.end();
  }, 500);
});

describe("Tokens service Tests", () => {
  test("generateTokenExpireDate is a function", () => {
    expect(typeof generateTokenExpireDate).toBe("function");
  });

  test("A token's expire time is one hour ahead of the current time", () => {
    const expireDate = generateTokenExpireDate();
    const expireHour = expireDate.getHours();
    const currentHour = new Date().getHours();
    expect(currentHour + 1 === expireHour).toBeTruthy();
  });

  test("saveToken function saves token in postgres database", async () => {
    const result = await saveToken(
      "fake access token",
      "fake refresh token",
      1
    );
    expect(result).toBeTruthy();
  });
});
