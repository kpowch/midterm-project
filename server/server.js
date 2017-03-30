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
const ensureLoggedIn  = require('./routes/middleware').ensureLoggedIn;


// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const resourceRoutes = require("./routes/resources");

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

// Home page
// from db, need username, all resources
app.get("/", (req, res) => {
  // knex
  //   .select('*')
  //   .from('users')
  //   .where('id', 3)
  //   .then((results) => {
  //     // console.log(results[0].id);
  //     var templateVars = {
  //       user: {
  //         id: results[0].id,
  //         username: results[0].username,
  //         email: results[0].email,
  //       }
  //     }

  knex('resources')
    .join('users', 'users.id', '=', 'resources.creator')
    .then((results) => {
        console.log(results);
        // for (var resource in results) {
        //   var templateVars = {
        //     user: {
        //       username: results[resource].username
        //     },
        //     resources: {
        //       id: results[resource].id,
        //       title: results[resource].title,
        //       url: results[resource].url,
        //       description: results[resource].description,
        //       topic: results[resource].topic,
        //       creator: results[resource].username,
        //       date_created: results[resource].date_created
        //     }
        //   }
        var templateVars = {
            user: {
              username: 'to be changed'
            },
            resources: results
          }

        res.render("../public/views/index", templateVars);

        //   console.log(templateVars)


  });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
