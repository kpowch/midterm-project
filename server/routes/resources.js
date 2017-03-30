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
    res.render("../public/views/resource_new");
  });

  router.get("/:resource_id", (req, res) => {
    let templateVars = {
      database: db
    }
    res.render("../public/views/resource_id", templateVars);
  });

  router.post("/create", (req, res) => {
    db.push(req.body);
    console.log(db);
  });

  return router;
}
