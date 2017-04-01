"use strict";

const bcrypt  = require("bcrypt");
const express = require('express');
const router  = express.Router();


module.exports = (knex) => {

  //TODO need to get username, email, and all things that they like/own
  // need username for header
  // TODO search by user cookie (hard coded right now)
  router.get("/:user_id", (req, res) => {

    function getAllUserResources(userid, cb) {
      var templateVars = {
        user: null,
        resources: null,
        likes: null
      };

      // TODO: Use Promise.all
      knex('users')
        .where('resources.creator', userid)
        .join('resources', 'resources.creator', '=', 'users.id')
        .then((results) => {
          templateVars['user'] = {
                username: 'to be changed'
              }
          templateVars['resources'] = results
          knex('likes')
            .where('likes.user_id', userid)
            .join('resources', 'resources.id', '=', 'likes.resource_id')
            .then((likes) => {
              templateVars['likes']= likes
              cb(templateVars);
          });
      });
    }

    getAllUserResources(3, (templateObject) => {
      console.log(templateObject);
      res.render('../public/views/users_user_id', templateObject);
    });
  });

  // need username, email, password from db
  // TODO change query to look for current user logged in
  router.get("/:user_id/editprofile", (req, res) => {
    knex
      .select('*')
      .from('users')
      .where('id', req.session.user_id)
      .then((results) => {
        // console.log(results[0].id);
        var templateVars = {
          user: {
            userID: results[0].id,
            username: results[0].username,
            email: results[0].email,
            password: '**********'
          }
        }
        // console.log(templateVars);
        res.render('../public/views/users_user_id_editprofile', templateVars)
      })
  });

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
