"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  // TODO delete this, not needed
  // router.get("/", (req, res) => {
  //   knex
  //     .select("*")
  //     .from("users")
  //     .then((results) => {
  //       res.json(results);
  //   });
  // });

  //TODO need to get username, email, and all things that they like/own
  router.get("/:user_id", (req, res) => {

    var results = {
      "username": "this is my name"
    };
    res.render('../public/views/users_user_id', results)
    // knex
    //   .select("username,")
    //   .from("users")
    //   .then((results) => {
    //     res.json(results);
    // });
  });

  router.get("/:user_id/editprofile", (req, res) => {
    res.render('../public/views/users_user_id_editprofile')

  });

  // TODO should be put?
  router.post("/:user_id/editprofile", (req, res) => {
    const newpassword = req.body.password;
  });

  return router;
}
