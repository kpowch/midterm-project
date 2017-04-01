"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const bcrypt      = require("bcrypt");

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'development']
}));

const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

const flash       = require("connect-flash");
app.use(flash());

// Middleware to check if logged in
// const ensureLoggedIn  = require('./routes/middleware').ensureLoggedIn;
// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const resourceRoutes = require("./routes/resources");
const apiRoutes = require("./routes/api");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("../public/styles/", sass({
  src: __dirname + "../public/styles",
  dest: __dirname + "../public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/users", ensureLoggedIn, usersRoutes(knex));
//TODO if we want to forbid certain routes for resoruces (not all) , then put only on the forbidden ones
app.use("/resources", resourceRoutes(knex));
app.use('/api', apiRoutes(knex));


function ensureLoggedIn(req, res, next) {
    // TODO: implement me
    // eg: req.userId = 1;
    knex('users').select('username').where('users.id', req.session.user_id)
    .then((results) => {
      return username;
    })
    console.log('Im here, ', req.session.user_id);
    next();
    // if not logged in, redirect to error page? alert they need to log in? redirect to login?
    // potential, save their url and once they're logged in, redirect to that url

  }



// Home page
// from db, need username, all resources
app.get("/", (req, res) => {
  // this is used for the initial page render
  // TODO add username for header
  Promise.all([
    knex('resources'),
  ]).then(([results, users]) => {
    res.render("../public/views/index", { user: {username: 'TO CHANGE THROUGH COOKIE'}, resources: results });
  });

});

app.get("/login", (req, res) => {
  res.render("../public/views/login", {
    errors: req.flash('errors'),
    info: req.flash('info')
  });
});

app.post("/login", (req, res) => {
  const findReqEmail = knex('users')
  .select('id', 'password')
  .where({email: req.body.email_login})
  .limit(1);
  findReqEmail.then((results) => {
    const user = results[0];
    if (!user) {
      return Promise.reject({
        type: 409,
        message: 'Bad credentials'
      });
    }
  const comparePasswords = bcrypt.compare(req.body.password_login, user.password);
  return comparePasswords.then((passwordsMatch) => {
    if (!passwordsMatch) {
      return Promise.reject({
        type: 409,
        message: 'Bad credentials'
      });
    }
    return Promise.resolve(user);
    });
  }).then((user) => {
    req.session.user_id = user.id;
    res.redirect('/');
  }).catch((err) => {
    req.flash('errors', err.message);
    res.redirect('/login');
  });
});


app.post("/register", (req, res) => {

  if (!req.body.email_register || !req.body.password_register || !req.body.username_register) {
    req.flash('errors', 'Email, password, and username required');
    res.redirect('/login');
    return;
  }
  const findReqEmailUsername = knex('users')
  .select(1)
  .where({email: req.body.email_register})
  .orWhere({username: req.body.username_register})
  .limit(1);

  findReqEmailUsername.then((results) => {
    if (results.length) {
      return Promise.reject({
        type: 409,
        message: 'Email or username already used'
      });
    }
    return bcrypt.hash(req.body.password_register, 10);
  }).then((passwordDigest) => {
    return knex('users').insert({
      email: req.body.email_register,
      username: req.body.username_register,
      password: passwordDigest
    });
  }).then(() => {
    req.flash('info', 'Account successfully created');
    knex('users').select('users.id')
    .where('users.email', req.body.email_register)
    .then((results) => {
      req.session.user_id = results[0];
    });
    res.redirect('/');
  }).catch((err) => {
    req.flash('errors', err.message);
    res.redirect('/login');
  });
});

//deletes session cookie, logs out, and redirects to home page
app.get("/logout", (req, res) => {
  req.session = undefined;
  res.redirect('/');
});


//see if a topic is picked
app.post("/topics", (req, res) => {
  console.log(req.body);
})

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
