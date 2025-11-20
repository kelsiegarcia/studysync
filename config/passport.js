const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongodb = require('../db/connect');
const { findOrCreateGoogleUser } = require('../controllers/user');

const initPassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id.toString());
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await mongodb.getDb().collection('users').findOne({ _id: new (require('mongodb').ObjectId)(id) });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await findOrCreateGoogleUser(profile);
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

module.exports = initPassport;
