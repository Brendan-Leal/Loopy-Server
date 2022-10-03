import client from "./client";

class TokenService {
  constructor() {
    this.saveTokenQuery =
      "INSERT INTO tokens (access_token, refresh_token, expire_time, user_id) VALUES($1, $2, $3, to_timestamp($4))";
    this.millisecondsInHour = 60 * 60 * 1000;
  }

  getTokenByUserId() {}
  saveToken() {}
  refreshToken() {}
  getAccessToken() {}
  getRefreshToken() {}
  _generateExpireTime() {
    const currentTimeInMilliseconds = new Date().getTime();
    const expireDate = new Date(
      currentTimeInMilliseconds + this.millisecondsInHour
    );
    let expireTime = expireDate.toISOString();
    expireTime = expireTime.replace("T", " ");
    expireTime = expireTime.replace("Z", "");
    // console.log("generated time to expire", expireTime);
    return expireTime;
  }
}

export default TokenService;
