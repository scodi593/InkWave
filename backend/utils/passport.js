const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find or create user
    let user = await User.findOne({ googleId: profile.id });
    const isNewUser = !user;
    
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0].value,
        hasCompletedProfile: false
      });
    }
    
    return done(null, { user, isNewUser });
  } catch (err) {
    return done(err, null);
  }
}));

// No session serialization needed (JWT used) 