// import client from "../config/client.js";
import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";

import { getUserByEmail, createUser, getUserByID } from "../services/users.js";
import { saveToken } from "../services/tokens.js";

const scope = [
  "streaming",
  "user-modify-playback-state",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
];

passport.serializeUser(function (user, done) {
  // console.log("serialize");
  done(null, {
    displayName: user.displayName,
    isAuthed: true,
    email: user.email,
    isPremium: user.product === "premium", // FIXME: Do i need this in the session or should I be checking elsewhere?
  });
});

passport.deserializeUser(function (obj, done) {
  // console.log("deserialize");
  done(null, obj);
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:" + process.env.PORT + "/auth/callback",
    },
    async function (accessToken, refreshToken, expires_in, profile, done) {
      try {
        const email = profile.emails[0].value;
        const user = await getUserByEmail(email);

        if (user) {
          // TODO: user exists is their token still valid? if not need to refresh it
          console.log("user Exists");
          return done(null, user);
        } else {
          console.log("user doesn't exist");
          const userID = await createUser(profile);
          await saveToken(accessToken, refreshToken, userID);
          const newUser = getUserByID(userID);
          return done(null, newUser);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

export { passport, scope };
