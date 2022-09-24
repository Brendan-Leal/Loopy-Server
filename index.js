// Local imports
import "./src/config/loadEnv.js";
import authRouter from "./src/routes/auth.js";
import { ensureAuthenticated } from "./src/middleware/ensureAuthenticated.js";

// 3rd party imports
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "temp secret", // TODO: sign key correctly
    resave: true,
    saveUninitialized: true,
  })
);

// TODO: implement real logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRouter);

// TODO: this is a test route be sure to delete when done developing or when I decide to implement a real testing framework.
app.get("/", ensureAuthenticated, (req, res) => {
  console.log("Authenticated");
  res.json({ test: "Foo" });
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
