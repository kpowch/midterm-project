const express = require('express');

module.exports = (knex) => {
  // to forbid someone from seeing the page/post
  const ensureLoggedIn = function (req, res, next) {

    if (!req.session.user_id) {
      return res.sendStatus(403);
    }

    next();
  }

  // TODO this is how we extract logged in user and pass it to routes. in route, call req.username
  const extractUserData = function (req, res, next) {
    knex('users').where({ id: req.session.user_id }).then(users => {
      if (!users.length) {
        return next()
      }
      req.username = users[0].name
      return next()
    })
  }

  return {
    ensureLoggedIn,
    extractUserData
  };

}
