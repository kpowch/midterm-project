const express = require('express');

module.exports = (knex) => {
  // redirects user to home if they're not logged in
  //TODO give feedback that they need to log in
  const ensureLoggedIn = function (req, res, next) {
    console.log('checking cookies')
    if (!req.session.user_id) {
      return res.redirect('/login');
    }
    next();
  }

  // TODO this is how we extract logged in user and pass it to routes. in route, call req.username
  const extractUserData = function (req, res, next) {
    console.log('extracting user data')
    if(!req.session.user_id) {
      req.username = null;
      return next()
    } else {
      knex('users')
        .where({ id: req.session.user_id })
        .then(users => {
          if (!users.length) {
            req.username = null;
            return next()
        }
        req.username = users[0].username;
        req.id = users[0].id;
        return next();
      })
    }
  }

  return {
    ensureLoggedIn,
    extractUserData
  };
}
