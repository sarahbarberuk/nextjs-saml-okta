const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const SamlStrategy = require("passport-saml").Strategy;
const session = require("express-session");
require("dotenv").config({ path: ".env.local" });

console.log("OKTA_CERT?", !!process.env.OKTA_CERT); // Should print true if it's loaded
console.log("Raw value:", process.env.OKTA_CERT?.slice(0, 50)); // Just the start of the cert

// Define the SAML strategy for Passport
passport.use(
  new SamlStrategy(
    {
      entryPoint: process.env.OKTA_ENTRY_POINT,
      issuer: process.env.OKTA_ISSUER,
      callbackUrl: process.env.SAML_CALLBACK_URL,
      cert: process.env.OKTA_CERT?.replace(/\\n/g, "\n"),
    },
    (profile, done) => {
      console.log("SAML login success:", profile);
      return done(null, profile);
    }
  )
);

// Passport uses serialization to persist the user across a session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Creates an express web server
const app = express();

// Parses URL-encoded data from POST requests (used for the SAML responses)
app.use(bodyParser.urlencoded({ extended: false }));

// This persist login state across requests
app.use(
  session({ secret: "supersecret", resave: false, saveUninitialized: true })
);

// Initializes Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Home page displays different information depending on whether user is authenticated
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`
      <h1> You are logged in as ${req.user.nameID}</h1>
      <p><a href="/profile">View Profile</a></p>
      <p><a href="/logout">Log out</a></p>
    `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <p><a href="/login">Login with SAML</a></p>
    `);
  }
});

// Start SAML login flow with IdP
app.get("/login", passport.authenticate("saml"));

// Callback URL (after successful SAML login)
app.post(
  "/login/callback",
  passport.authenticate("saml", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/"); // if successfully authenticated, redirect to home page
  }
);

app.get("/logout", (req, res) => {
  // logs out of session and redirects to home page
  req.logout(() => res.redirect("/"));
});

// Returns profile info about the user (only if authenticated)
app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.json(req.user);
});

app.listen(4000, () =>
  console.log("Auth server running on http://localhost:4000")
);
