"use strict";

const bcrypt  = require("bcrypt");
const express = require('express');
const router  = express.Router();


module.exports = (knex) => {

  //TODO need to get username, email, and all things that they like/own
  // need username for header
  // TODO search by user cookie (hard coded right now)
  router.get("/:user_id", (req, res) => {

    let userId = req.params.user_id;
    let subQueryLikes = knex('likes').select('resource_id').where('user_id', userId);
    let currentUser = '';

    if(req.session.user_id === undefined) {
      knex('resources')
      .where('creator', userId)
      .orWhereIn('id', subQueryLikes)
      .then((results) => {
      res.render("../public/views/users_user_id", { user: {username: currentUser}, resources: results });
      }).catch((error) => {
      console.log(error);
      });
      return;
    } else {
      knex('users').select('username').where('users.id', req.session.user_id)
      .asCallback((err, results) => {
      if (err) console.error(err);
      if (results[0].username.length > 0) {
        currentUser = results[0].username;
        knex('resources')
        .where('creator', userId)
        .orWhereIn('id', subQueryLikes)
        .then((results) => {
        res.render("../public/views/users_user_id", { user: {username: currentUser, userID: req.session.user_id}, resources: results });
        }).catch((error) => {
          console.log(error);
        });
      }
    });
    return;
    }
  });

  // need username, email, password from db
  // TODO change query to look for current user logged in
  router.get("/:user_id/editprofile", (req, res) => {

    if (!req.session.user_id) {
      res.redirect('/');
      return;
    } else {
      knex
      .select('*')
      .from('users')
      .where('id', req.session.user_id)
      .then((results) => {
        var templateVars = {
          user: {
            userID: results[0].id,
            username: results[0].username,
            email: results[0].email,
            password: '**********' //might be an issue
          }
        }
        res.render('../public/views/users_user_id_editprofile', templateVars);
        return;
      });
    }
  });

  // NEED TO FIX PROPER UPDATE PASSWORD
  // TODO should be put?
  // TODO will have to hash this password as well.
  // TODO change query to look for current user logged in
  router.post("/:user_id/editprofile", (req, res) => {
    const newpassword = req.body.password;
    console.log(newpassword);

    knex('users')
      .where('id', req.session.user_id)
      .update({
        password: bcrypt.hash(newpassword, 10)
      })
      //TODO don't know what it doesn't work if this callback isn't here
      .then((results) => {
        console.log(results);
      }).catch((err) => {
        console.log(err);
      });
  });

  return router;
}
