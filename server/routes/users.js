"use strict";

const express = require('express');
const router  = express.Router();
const isLoggedIn = require('middleware').isLoggedIn;

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

  // runs middleware for all routes
  router.all("/:user_id", isLoggedIn);


  //TODO need to get username, email, and all things that they like/own
  router.get("/:user_id", (req, res) => {

    var results = {
      user: {
        name: 'name',
        email: 'user@email.com'
      }
    };
    res.render('../public/views/users_user_id', results)

  });

  router.get("/:user_id/editprofile", (req, res) => {
    var results = {
      user: {
        name: 'name',
        email: 'user@email.com'
      }
    };
    res.render('../public/views/users_user_id_editprofile', results)

  });

  // TODO should be put?
  router.post("/:user_id/editprofile", (req, res) => {
    const newpassword = req.body.password;
  });

  return router;
}
