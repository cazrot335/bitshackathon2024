const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const axios = require('axios');

const app = express();

// Use express-session middleware
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
    clientID: "7ac9639d38c326ae11e6",
    clientSecret: "c5011ee675ff680b8613431a01dd4db31a187a5b",
    callbackURL: "http://localhost:3001/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // In a real application, you might store this accessToken in the user's session or a database
    userToken = accessToken;
    return cb(null, profile);
  }
));

// Required for managing session
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to the starred repos.
    res.redirect('/starred');
  });

app.get('/starred', async (req, res) => {
  const starredRepos = await axios.get('https://api.github.com/user/starred', {
    headers: {
      Authorization: `token ${userToken}`
    }
  });
  res.json(starredRepos.data);
});

app.listen(3001);