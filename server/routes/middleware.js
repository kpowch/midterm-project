const express = require('express');
const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);

module.exports = () => {
  // to forbid someone from seeing the page/post
  ensureLoggedIn: function(req, res, next) {
    // TODO: implement me
    // eg: req.userId = 1;
    knex('users').select('username').where('users.id', req.session.user_id)
    .then((results) => {
      return username;
    })
    console.log('Im here, ', req.session.user_id);
    next();
    // if not logged in, redirect to error page? alert they need to log in? redirect to login?
    // potential, save their url and once they're logged in, redirect to that url

  }
  // TODO make another mmiddleware
  return ensureLoggedIn;
}
