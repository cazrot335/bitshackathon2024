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

  res.json({ message: 'User data saved successfully', data: result });
});

app.get('/users', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

app.get('/connect', async (req, res) => {
  const { username } = req.query;

  // Fetch the starred repositories the given user
  const user = await User.findOne({ githubUsername: username });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Find other users that have at least 3 of the same starred repositories
  const users = await User.find({
    githubUsername: { $ne: username },
    starredRepos: { $in: user.starredRepos }
  });

  // Filter users that have at least 3 matching repositories
  const matchingUsers = users.filter(user => {
    const matchingRepos = user.starredRepos.filter(repo => user.starredRepos.includes(repo));
    return matchingRepos.length >= 3;
  });

  // If no matching users found, return a message
  if (matchingUsers.length === 0) {
    return res.json({ message: 'No users found' });
  }

  // Map the users to only include the necessary data
  const result = matchingUsers.map(user => ({
    githubUsername: user.githubUsername,
    githubProfileUrl: user.githubProfileUrl,
    githubProfilePictureUrl: user.githubProfilePictureUrl,
    location: user.location,
    bio: user.bio
  }));

  res.json(result);
});

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://nischal:lawdatelassan@cluster0.mkr1avg.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(3001);