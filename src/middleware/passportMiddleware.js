import client from "../db/client.js";
import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
  console.log(user);
  done(null, {
    displayName: user.displayName,
    isAuthed: true,
    email: user.email,
    isPremium: user.product === "premium", // FIXME: Do i need this in the session or should I be checking elsewhere?
  });
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// FIXME: refactor
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:" + process.env.PORT + "/auth/callback",
    },
    async function (accessToken, refreshToken, expires_in, profile, done) {
      const email = profile.emails[0].value;

      const user = {
        email,
        userName: profile.username,
        displayName: profile.displayName,
        isPremium: profile.product === "premium",
        profileUrl: profile.profileUrl,
      };

      try {
        // Check if the user is already in the DB
        const getUser = await client.query(
          "SELECT email FROM users WHERE email=$1",
          [email]
        );
        const userExists = getUser.rowCount === 1;

        if (userExists) {
          // TODO: user exists is their token still valid? if not need to refresh it
          return done(null, user);
        } else {
          // add user to DB
          const createUserQuery =
            "INSERT INTO users (email, spotify_username, display_name, is_premium, profile_url) VALUES($1, $2, $3, $4, $5) RETURNING user_id";
          const userValues = [
            email,
            profile.username,
            profile.displayName,
            profile.product === "premium",
            profile.profileUrl,
          ];
          const createUser = await client.query(createUserQuery, userValues);
          const userId = createUser.rows[0].user_id;

          // Create timestamp of when access token was created.
          const currentTimeInMilliSec = new Date().getTime();
          const fiftyFiveMinutesInMilliSec = 60 * 60 * 1000 - 300000;
          const timeToExpireInMilliSec =
            currentTimeInMilliSec + fiftyFiveMinutesInMilliSec;

          const expireTime = new Date(timeToExpireInMilliSec)
            .toLocaleTimeString()
            .replace(/[APM]/g, "")
            .trim();
          console.log(expireTime);

          // save tokens in DB
          const saveTokenQuery =
            "INSERT INTO tokens (access_token, refresh_token, expire_time, user_id) VALUES($1, $2, $3, $4)";
          const saveTokenValues = [
            accessToken,
            refreshToken,
            expireTime,
            userId,
          ];
          const saveTokens = await client.query(
            saveTokenQuery,
            saveTokenValues
          );

          console.log(createUser, saveTokens);
          const createUserSuccess = createUser.rowCount === 1;
          const saveTokenSuccess = saveTokens.rowCount === 1;

          if (createUserSuccess && saveTokenSuccess) {
            done(null, user);
          } else {
            throw new Error("something went wrong creating user");
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);

export { passport };
