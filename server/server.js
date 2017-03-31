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
const ensureLoggedIn  = require('./routes/middleware').ensureLoggedIn;
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


// Home page
// from db, need username, all resources
app.get("/", (req, res) => {
  // this is used for the initial page render
  // TODO add username for header
  Promise.all([
    knex('resources'),
    knex('users').where({ id: 2 })
  ]).then(([results, users]) => {
    res.render("../public/views/index", { resources: results });
  });

});

app.get("/login", (req, res) => {
  res.render("../public/views/login", {
    errors: req.flash('errors'),
    info: req.flash('info')
  });
});

app.post("/register", (req, res) => {
  // TODO check if email is unique
  // TODO check if username is unique
  // hash password -- future
  // insert contents into database
  // set cookie session from newly created user
  // redirect to '/'
  let passwordDigest = '';

  if (!req.body.email_register || !req.body.password_register || !req.body.username_register) {
    console.log('email, password, and username required');
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
        message: 'email or username already used'
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


//see if a topic is picked
app.post('/topics', (req, res) => {
  console.log(req.body);
})

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
