import express from "express";
import { redirectOnSuccess } from "../controllers/auth.js/index.js";
import { passport, scope } from "../middleware/passport.js";

const authRouter = express.Router();

authRouter.get(
  "/spotify",
  passport.authenticate("spotify", {
    scope,
  })
);

authRouter.get(
  "/callback",
  passport.authenticate("spotify", {
    failureRedirect: "http://localhost:3000/fail",
  }),
  redirectOnSuccess
);

export default authRouter;
