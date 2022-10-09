import client from "../../config/client.js";
import {
  getUserByEmail,
  createUser,
  getUserByID,
} from "../../services/users.js";

afterAll(async () => {
  const user = await getUserByEmail("baz.foo@example.com");
  const userID = user.user_id;
  client.query("DELETE FROM users WHERE user_id = $1", [userID]);

  setTimeout(() => {
    client.end();
  }, 500);
});

test("getUserByEmail returns the user object with correct properties", async () => {
  const data = await getUserByEmail("baz@foo.com");
  expect(data).toEqual({
    email: expect.any(String),
    user_id: expect.any(Number),
    spotify_username: expect.any(String),
    display_name: expect.any(String),
    is_premium: expect.any(Boolean),
    profile_url: expect.any(String),
  });
});

test("getUserByEmail and email does not exist", async () => {
  const data = await getUserByEmail("fizz@buzz.com");
  expect(data).toBeNull();
});

test("createUser in database and returns the user_id created", async () => {
  const fakeUser = {
    provider: "spotify",
    id: "foo",
    username: "bar",
    displayName: "fizz",
    profileUrl: "https://open.spotify.com/user/bar",
    photos: [],
    country: "US",
    followers: 1,
    product: "premium",
    emails: [{ value: "baz.foo@example.com", type: null }],
  };
  const data = await createUser(fakeUser);
  expect(typeof data).toBe("number");
});

test("Can get a user by id", async () => {
  const user = await getUserByID(1);
  console.log(user);
  expect(user).toEqual({
    user_id: 1,
    email: "baz@foo.com",
    spotify_username: "baz",
    display_name: "bazzy",
    is_premium: true,
    profile_url: "https://open.spotify/user/baz",
  });
});
