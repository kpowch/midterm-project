"use strict";

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const moment = require('moment')

module.exports = (knex) => {
  // Home page
  router.get('/', (req, res) => {
    console.log('get /')
    console.log(req.username)
    // this is used for the initial page render
      knex('resources')
        .then((rows) => {
          console.log(rows);
          res.render('../public/views/index', {

            resources: rows,
            user: {
              username: req.username,
              userid: req.id
            },
            icons: {
              science: 'fa fa-flask',
              history: 'fa fa-hourglass-end',
              math: 'fa fa-superscript',
              geography: 'fa fa-globe'
            },
            moment: moment
          });
          return;
        });
  });

  router.get('/login', (req, res) => {
    console.log('get login')
    console.log(req.username)
    if(req.session.user_id) {
      return res.redirect('/');
    }
    res.render('../public/views/login', {
      errors: req.flash('errors'),
      info: req.flash('info'),
      user: {
        username: req.username,
        userid: req.id
      }
    });
  });

  router.post('/login', (req, res) => {
    console.log('post login')
    console.log(req.username)
    const findReqEmail = knex('users')
      .select('id', 'password')
      .where({email: req.body.email_login})
      .limit(1);

    findReqEmail.then((results) => {
      const user = results[0];
      if (!user) {
        return Promise.reject({
          type: 409,
          message: 'Bad credentials. Email or password incorrect.'
        });
      }

      const comparePasswords = bcrypt.compare(req.body.password_login, user.password);
      return comparePasswords.then((passwordsMatch) => {
      if (!passwordsMatch) {
        return Promise.reject({
          type: 409,
          message: 'Bad credentials. Email or password incorrect.'
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
    console.log('post register')
    console.log(req.username)
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
      return knex('users')
        .insert({
          email: req.body.email_register,
          username: req.body.username_register,
          password: passwordDigest
        });
    }).then(() => {
      knex('users')
        .select('users.id')
        .where('users.email', req.body.email_register)
        .then((results) => {
          req.session.user_id = results[0].id;
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
    console.log('post logout')
    console.log(req.username)
    req.session = null;
    res.redirect('/');
  });

  return router;
}
