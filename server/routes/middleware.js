const express = require('express');
const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);

module.exports = () => {
  // to forbid someone from seeing the page/post
  ensureLoggedIn: function(req, res, next) {

    let currentUser = '';

    //checks for a logged in user, if no cookie-session, currentUser an empty string
    if(req.session.user_id === undefined) {
      let templateVars = {
          user: {
            username: currentUser
          }
        }
        res.render(templateVars);
        return;
      } else {
        knex('users').select('username').where('users.id', req.session.user_id)
        .asCallback((err, results) => {
        if (err) console.error(err);

        if (results[0].username.length > 0) {
        currentUser = results[0].username;
        let templateVars = {
          user: {
            username: currentUser,
            userID: req.session.user_id
          }
        }
        res.render(templateVars);
        return;
        }
      });
    }
    // if not logged in, redirect to error page? alert they need to log in? redirect to login?
    // potential, save their url and once they're logged in, redirect to that url

  }
  // TODO make another mmiddleware
  return ensureLoggedIn;
}
