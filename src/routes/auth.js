import express from "express";
import { spotifyAPI } from "../lib/spotifyAPI.js";

const authRouter = express.Router();
const client_id = process.env.CLIENT_ID; // Your client id

function generateRandomString(length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

authRouter.get("/login", (req, res) => {
  let state = generateRandomString(16);

  let auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: spotifyAPI.applicationScopes,
    redirect_uri: "http://localhost:3000/auth/callback",
    state: state,
  });

  res.redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString()
  );
});

authRouter.get("/callback", (req, res) => {
  const tokens = spotifyAPI.getTokens(req.query);
  res.json(tokens);
});

authRouter.get("/token", (req, res) => {
  res.json({
    access_token: access_token,
  });
});

export default authRouter;
