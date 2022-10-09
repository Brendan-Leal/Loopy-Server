// Local imports
import "./src/config/loadEnv.js";
import authRouter from "./src/routes/auth.js";
import client from "./src/config/client.js";
import { ensureAuthenticated } from "./src/middleware/ensureAuthenticated.js";
import { isTokenValid } from "./src/middleware/isTokenValid.js";

// 3rd party imports
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// TODO: use prod ready session store
app.use(
  session({
    name: "session",
    secret: "temp secret", // TODO: sign key correctly
    resave: true,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRouter);

// TODO: this is a test route be sure to delete when done developing or when I decide to implement a real testing framework.
app.get("/", ensureAuthenticated, (req, res) => {
  console.log("Authenticated");
  res.json({ test: "Foo" });
});

app.get("/session-state", ensureAuthenticated, (req, res) => {
  res.json(req.session.passport.user);
});

app.get("/token", ensureAuthenticated, async (req, res) => {
  console.log(req.session.passport.user);
  try {
    const axRes = await client.query(
      "SELECT access_token FROM tokens INNER JOIN users ON tokens.user_id = users.user_id"
    );
    res.json(axRes.rows[0]);
  } catch (error) {
    console.log(error);
  }
});

app.get("/validate-token", ensureAuthenticated, isTokenValid, (req, res) => {});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
