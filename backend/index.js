const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const axios = require('axios');
require('dotenv').config();
const CORS = require('cors');

const app = express();
app.use(CORS());

// Use express-session middleware
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://bitshackathon2024.vercel.app/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Attach the accessToken to the user profile
    profile.accessToken = accessToken;
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
  if (!req.user || !req.user.accessToken) {
    return res.status(401).send('User not authenticated');
  }

  const starredRepos = await axios.get('https://api.github.com/user/starred', {
    headers: {
      Authorization: `token ${req.user.accessToken}`
    }
  });

  const userProfile = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `token ${req.user.accessToken}`
    }
  });

  const repoNames = starredRepos.data.map(repo => repo.full_name);

  const result = {
    githubUsername: userProfile.data.login,
    githubProfileUrl: userProfile.data.html_url,
    location: userProfile.data.location,
    bio: userProfile.data.bio,
    starredRepos: repoNames
  };

  res.json(result);
});

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(3001);