'use strict';

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV || 'development';
const express = require('express');
const bodyParser = require('body-parser');
const sass = require('node-sass-middleware');
const app = express();

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'development']
}));

const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig[ENV]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');

const flash = require('connect-flash');
app.use(flash());

// Middleware to check if logged in and to return username of logged in user
const middleware = require('./routes/middleware')(knex);
const usersRoutes = require('./routes/users');
const resourceRoutes = require('./routes/resources');
const apiRoutes = require('./routes/api');
const pagesRoutes = require('./routes/pages');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//   The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('../public/styles/', sass({
  src: __dirname + '../public/styles',
  dest: __dirname + '../public/styles',
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static('public'));

// Mount all resource routes
app.use('/users', middleware.ensureLoggedIn, middleware.extractUserData, usersRoutes(knex));
app.use('/resources', middleware.extractUserData, resourceRoutes(knex));
app.use('/api', middleware.extractUserData, apiRoutes(knex));
app.use('/', middleware.extractUserData, pagesRoutes(knex));

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});
