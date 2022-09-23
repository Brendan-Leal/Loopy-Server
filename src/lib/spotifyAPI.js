import axios from "axios";
export const spotifyAPI = {
  applicationScopes: "streaming user-read-email user-read-private",
  
  async getTokens({ code, state }) {
    const queryParams = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "http://localhost:3000/auth/callback",
    });

    const auth = Buffer.from(
      process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
    ).toString("base64");

    try {
      const res = await axios({
        method: "post",
        url: "https://accounts.spotify.com/api/token",
        params: queryParams,
        headers: { Authorization: "Basic " + auth },
      });
    //   console.log("tokens: ", res.data);
      const tokens = res.data;
      return tokens;
    } catch (e) {
      console.log(e);
    }
  },
};
