import client from "../config/client.js";

// TODO: implement
export const getUserByID = async (userID) => {
  const sql = "SELECT * FROM users WHERE user_id = $1";

  try {
    const result = await client.query(sql, [userID]);

    if (result.rows.length === 1) {
      return result.rows[0];
    } else {
      throw new Error("Something went wrong getting user by ID");
    }
  } catch (error) {
    console.log(error);
  }
};

export const getUserByEmail = async (email) => {
  const sql = "SELECT * FROM users WHERE email=$1";

  try {
    const result = await client.query(sql, [email]);
    // console.log(result);
    if (result.rows.length === 1) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  }
};

export const createUser = async (profile) => {
  const sql =
    "INSERT INTO users (email, spotify_username, display_name, is_premium, profile_url) VALUES($1, $2, $3, $4, $5) RETURNING user_id";

  try {
    const userData = [
      profile.emails[0].value,
      profile.username,
      profile.displayName,
      profile.product === "premium",
      profile.profileUrl,
    ];

    const result = await client.query(sql, userData);
    return result.rows[0].user_id;
  } catch (err) {
    console.log(err);
  }
};
