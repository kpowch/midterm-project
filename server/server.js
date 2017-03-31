"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

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
  res.render("../public/views/login");
});

app.post("/register", (req, res) => {
  // TODO check if email is unique
  // TODO check if username is unique
  // hash password -- future
  // insert contents into database
  // redirect to '/'
  console.log(req.body.email_register);
  knex.select().from('users').where('users.email', req.body.email_register)
  .asCallback((err, results) =>{
    console.log(results[0]);
    if (results[0].email || results[0].username) {
      console.log('Already taken!');
      res.redirect('/');
      return;
    }


  });
})

//see if a topic is picked
app.post('/topics', (req, res) => {
  console.log(req.body);
})

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
