const dotenv = require("dotenv").config();
const axios = require("axios");
const express = require("express");
// const querystring = require("query-string");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
// app.use(express.urlencoded());
app.use(express.json());

const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret

app.get("/", (req, res) => {
  res.send("home");
});
app.get("/test", (req, res) => {
  console.log("Test route");
  console.log(req.query.code);
  res.json({ test: "Foo" });
});

function generateRandomString(length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

app.get("/auth/login", (req, res) => {
  let scope = "streaming user-read-email user-read-private";

  let state = generateRandomString(16);

  let auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: "http://localhost:3000/auth/callback",
    state: state,
  });

  res.redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString()
  );
});

app.get("/auth/callback", async (req, res) => {
  console.log("In /auth/callback");
  // console.log(req.query);
  const queryParams = new URLSearchParams({
    grant_type: "authorization_code",
    code: req.query.code,
    redirect_uri: "http://localhost:3000/auth/callback",
  });
  const auth = Buffer.from(
    process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
  ).toString("base64");

  console.log("auth: ", auth);
  try {
    const axiosRes = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      params: queryParams,
      // auth: { auth },
      headers: { Authorization: "Basic " + auth },
    });
    // res.send(axiosRes);
    console.log(axiosRes.data);
    res.json(axiosRes.data);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
});

app.get("/auth/token", (req, res) => {
  res.json({
    access_token: access_token,
  });
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
