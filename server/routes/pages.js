"use strict";
//TODO add other routes in here so server.js is cleaner

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  // put all other routes in here
  return router;
}


// add this to server:
// const pagesRoutes = require("./routes/pages");
// app.use('/', pagesRoutes(knex));
