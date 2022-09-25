import express from "express";
import { passport as passportMiddleware } from "../middleware/passportMiddleware.js";

const authRouter = express.Router();
const scope = [
  "streaming",
  "user-modify-playback-state",
  "user-read-email",
  "user-read-private",
];

authRouter.get(
  "/spotify",
  passportMiddleware.authenticate("spotify", {
    scope,
  })
);

authRouter.get(
  "/callback",
  passportMiddleware.authenticate("spotify", {
    failureRedirect: "http://localhost:3000/",
  }),
  function (req, res) {
    res.redirect("http://localhost:3000/login-success");
  }
);

export default authRouter;
