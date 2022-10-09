import client from "../config/client.js";
const millisecondsInHour = 60 * 60 * 1000;

export const getTokenByUserId = () => {};
export const refreshToken = () => {};
export const getAccessToken = () => {};
export const getRefreshToken = () => {};

export const generateTokenExpireDate = () => {
  const currentTimeInMilliseconds = new Date().getTime();
  const expireDate = new Date(currentTimeInMilliseconds + millisecondsInHour);

  return expireDate;
};

export const saveToken = async (accessToken, refreshToken, userID) => {
  const sql =
    "INSERT INTO tokens (access_token, refresh_token, expire_time, user_id) VALUES($1, $2, $3, $4)";

  try {
    const tokenExpireTime = generateTokenExpireDate();

    const result = await client.query(sql, [
      accessToken,
      refreshToken,
      tokenExpireTime,
      userID,
    ]);
    return result;
  } catch (error) {
    console.log("error saving token");
    console.log(error);
  }
};
