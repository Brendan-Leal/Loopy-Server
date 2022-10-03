import client from "../services/client.js";
import axios from "axios";

export async function isTokenValid(req, res, next) {
  try {
    console.log("validating token");
    const userEmail = req.session.passport.user.email;
    console.log(userEmail);
    const expireQuery = await client.query(
      "SELECT expire_time, refresh_token, tokens.user_id FROM tokens INNER JOIN users ON tokens.user_id = users.user_id AND users.email = $1",
      [userEmail]
    );
    const expireTime = expireQuery.rows[0].expire_time;

    if (expireTime.getTime() < Date.now()) {
      console.log("expired need to refresh token");
      const refreshToken = expireQuery.rows[0].refresh_token;
      // refresh access token
      const queryParams = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      });

      const auth = Buffer.from(
        process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
      ).toString("base64");

      console.log("auth: ", auth);
      const refreshRes = await axios.post(
        "https://accounts.spotify.com/api/token",
        queryParams,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("res: ", refreshRes.data);

      // save to DB
      const currentTimeInMilliSec = new Date().getTime();
      const oneHourInMilliSec = 60 * 60 * 1000;

      let expireTime = new Date(currentTimeInMilliSec + oneHourInMilliSec).toISOString();
      expireTime.replace("T", " ")
      expireTime.replace("Z", "")




      console.log("expireTime: ", new Date(expireTime));

      const userId = expireQuery.rows[0].user_id;
      const updateTokenQ = await client.query(
        "UPDATE tokens SET access_token = $1, expire_time = to_timestamp($2, 'YYY MM DD HH24 MI SS') WHERE user_id = $3",
        [refreshRes.data.access_token, expireTime, userId]
      );
      console.log(updateTokenQ.rows);
    } else {
      console.log("still valid");
    }
    res.send("refresh").end();
  } catch (error) {
    console.log(error);
  }
}
