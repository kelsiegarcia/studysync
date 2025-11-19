const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongodb = require('../db/connect');

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
          const usersColl = mongodb.getDb().collection('users');
          const existing = await usersColl.findOne({ provider: 'google', providerId: profile.id });
          if (existing) return done(null, existing);

          const newUser = {
            provider: 'google',
            providerId: profile.id,
            authorID: '',
            name: profile.displayName,
            email: (profile.emails && profile.emails[0] && profile.emails[0].value) || '',
            subjects: []
          };

          const result = await usersColl.insertOne(newUser);
          // set authorID to insertedId string
          const authorId = result.insertedId.toString();
          await usersColl.updateOne({ _id: result.insertedId }, { $set: { authorID: authorId } });
          const created = await usersColl.findOne({ _id: result.insertedId });
          return done(null, created);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

module.exports = initPassport;
