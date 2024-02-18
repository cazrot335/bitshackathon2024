const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const axios = require('axios');
const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config();
const CORS = require('cors');

const app = express();
app.use(CORS());

// Define userToken at the top level of your script
let userToken;

// Use express-session middleware
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID, // Use environment variable for client ID
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://bitshackathon2024.vercel.app/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Set the value of userToken
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

// Define Mongoose schema and model
const userSchema = new Schema({
  githubUsername: String,
  githubProfileUrl: String,
  githubProfilePictureUrl: String,
  location: String,
  bio: String,
  starredRepos: [String]
});

const User = mongoose.model('User', userSchema);

app.get('/starred', async (req, res) => {
  const starredRepos = await axios.get('https://api.github.com/user/starred', {
    headers: {
      Authorization: `token ${userToken}`
    }
  });

  const userProfile = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `token ${userToken}`
    }
  });

  // Map over the response data and pick out the full_name property
  const repoNames = starredRepos.data.map(repo => repo.full_name);

  const result = {
    githubUsername: userProfile.data.login,
    githubProfileUrl: userProfile.data.html_url,
    githubProfilePictureUrl: userProfile.data.avatar_url,
    location: userProfile.data.location,
    bio: userProfile.data.bio,
    starredRepos: repoNames
  };

  // Save or update user data
  await User.findOneAndUpdate(
    { githubUsername: result.githubUsername }, // find a document with that filter
    result, // document to insert when nothing was found
    { upsert: true, new: true, runValidators: true }, // options
  );

  res.json(result);
});

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://nischal:lawdatelassan@cluster0.mkr1avg.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(3001);