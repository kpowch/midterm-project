"use strict";

const bcrypt  = require("bcrypt");
const express = require('express');
const router  = express.Router();
const moment = require('moment');

module.exports = (knex) => {

  router.get("/:user_id", (req, res) => {
    console.log('getting userid page');
    const userId = req.params.user_id;
    let subQueryLikes = knex('likes').select('resource_id').where('user_id', userId);

    knex('users')
      .select('username')
      .where('users.id', req.session.user_id)
      .asCallback((err, results) => {
        if (err) console.error(err);
        if (results[0].username.length > 0) {
          knex('resources')
          .where('creator', userId)
          .orWhereIn('id', subQueryLikes)
          .then((results) => {
            res.render("../public/views/users_user_id", {
              user: {
                username: req.username,
                userid: req.session.user_id
              },
              resources: results,
              icons: {
                science: 'fa fa-flask',
                history: 'fa fa-hourglass-end',
                math: 'fa fa-superscript',
                geography: 'fa fa-globe'
              },
              moment: moment
            });
          }).catch((error) => {
            console.log(error);
          });
        }
    });
    return;
  });

  router.get("/:user_id/editprofile", (req, res) => {
    knex('users')
    .where('id', req.session.user_id)
    .then((results) => {
      let templateVars = {
        user: {
          userid: results[0].id,
          username: results[0].username,
          email: results[0].email,
          password: results[0].password
        },
      }
      res.render('../public/views/users_user_id_editprofile', templateVars);
      return;
    });
  });

  router.post(("/:user_id/editprofile"), (req, res) => {
    const newpassword = req.body.password;
    bcrypt.hash(newpassword, 10, function(err, hash) {
      knex('users')
        .select('password')
        .where('id', req.session.user_id)
        .update({
          password: hash
        }).then((results) => {
          res.redirect(`/users/${req.session.user_id}/editprofile`);
          return;
        }).catch((err) => {
          console.log(err);
        });
    });
  });

  return router;
}
