"use strict";

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

module.exports = (knex) => {
  // Home page
  router.get('/', (req, res) => {
    // this is used for the initial page render
    // TODO add username for header
    let currentUser = '';
    if (!req.session.user_id) {
      console.log(req.session.user_id);
      console.log('no cookie');
      knex('resources')
      .then((rows) => {
        res.render('../public/views/index', { user: undefined, resources: rows });
        return;
      });
    } else {
      console.log(req.session.user_id);
      knex('users').select('username').where('users.id', req.session.user_id)
      .asCallback((err, results) => {
        if (err) throw err;
        console.log(results[0]);
        if (results[0].username.length > 0) {
          currentUser = results[0].username;
          let ID = req.session.user_id;
          knex('resources')
          .then((rows) => {
          res.render('../public/views/index', { user: {username: currentUser, userID: ID}, resources: rows });
          return;
          });
        }
      });
    }
  });

  router.get('/login', (req, res) => {
      res.render('../public/views/login', {
      errors: req.flash('errors'),
      info: req.flash('info')
    });
    req.session = null;
  });

  router.post('/login', (req, res) => {
    const findReqEmail = knex('users')
    .select('id', 'password')
    .where({email: req.body.email_login})
    .limit(1);
    findReqEmail.then((results) => {
      const user = results[0];
      if (!user) {
        return Promise.reject({
          type: 409,
          message: 'Bad credentials'
        });
      }
      const comparePasswords = bcrypt.compare(req.body.password_login, user.password);
      return comparePasswords.then((passwordsMatch) => {
      if (!passwordsMatch) {
        return Promise.reject({
          type: 409,
          message: 'Bad credentials'
        });
      }
      return Promise.resolve(user);
      });
    }).then((user) => {
      req.session.user_id = user.id;
      res.redirect('/');
    }).catch((err) => {
      req.flash('errors', err.message);
      res.redirect('/login');
    });
  });


  router.post('/register', (req, res) => {

    if (!req.body.email_register || !req.body.password_register || !req.body.username_register) {
      req.flash('errors', 'Email, password, and username required');
      res.redirect('/login');
      return;
    }
    const findReqEmailUsername = knex('users')
    .select(1)
    .where({email: req.body.email_register})
    .orWhere({username: req.body.username_register})
    .limit(1);

    findReqEmailUsername.then((results) => {
      if (results.length) {
        return Promise.reject({
          type: 409,
          message: 'Email or username already used'
        });
      }
      return bcrypt.hash(req.body.password_register, 10);
    }).then((passwordDigest) => {
      return knex('users').insert({
        email: req.body.email_register,
        username: req.body.username_register,
        password: passwordDigest
      });
    }).then(() => {
      req.flash('info', 'Account successfully created, please log in');
      knex('users').select('users.id')
      .where('users.email', req.body.email_register)
      .then((results) => {
        req.session.user_id = results[0].id;
        console.log('register cookie', results[0]);
        res.redirect('/');
        return;
      });
    }).catch((err) => {
      req.flash('errors', err.message);
      res.redirect('/login');
      return;
    });
  });

  //deletes session cookie, logs out, and redirects to home page
  router.post('/logout', (req, res) => {
    console.log(req.session);
    req.session = null;
    res.redirect('/');
  });

  //see if a topic is picked
  router.post('/topics', (req, res) => {
    console.log(req.body);
  })

  // put all other routes in here
  return router;
}
