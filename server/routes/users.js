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
    var templateVars = {
      user: {
        name: 'name',
        email: 'user@email.com'
      }
    };
    res.render('../public/views/users_user_id', templateVars)

  });

  // need username, email, password from db
  router.get("/:user_id/editprofile", (req, res) => {
    knex
      .select('*')
      .from('users')
      .where('id', 1)
      .then((results) => {
        // console.log(results[0].id);
        var templateVars = {
          user: {
            id: results[0].id,
            username: results[0].username,
            email: results[0].email,
            password: results[0].password
          }
        }
        console.log(templateVars);
        res.render('../public/views/users_user_id_editprofile', templateVars)
      })


  });

  // TODO should be put?
  router.post("/:user_id/editprofile", (req, res) => {
    const newpassword = req.body.password;
  });

  return router;
}
