"use strict";

const express = require('express');
const router  = express.Router();
const fs = require('fs');

const db = [{
  "title": "subway",
  "url": "www.shubway.com",
  "description": "Tutorial on subway",
  "topic": "food",
  "creator": "4",
  "date_created": "10/23/2017"
}]

module.exports = (knex) => {

  router.get("/new", (req, res) => {
    var templateVars = {
      user: {
        name: 'name',
        email: 'user@email.com'
      }
    };
    res.render("../public/views/resource_new", templateVars);
  });

  router.get("/:resource_id", (req, res) => {
    let templateVars = {
      database: db,
      user: {
        name: 'name',
        email: 'user@email.com'
      }
    }
    res.render("../public/views/resource_id", templateVars);
  });

  router.post("/create", (req, res) => {
    //receive resource from req.body
    //insert req.body into database
    //retrieve newly created id from database
    //redirect to resources/id
    res.send(db);
  });

  return router;
}
