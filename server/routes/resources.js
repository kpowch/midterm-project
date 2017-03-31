"use strict";

const express = require('express');
const router  = express.Router();
const fs = require('fs');

// const db = [{
//   "title": "subway",
//   "url": "www.shubway.com",
//   "description": "Tutorial on subway",
//   "topic": "food",
//   "creator": "4",
//   "date_created": "10/23/2017"
// }]

let fakeUserCookie = 1;

module.exports = (knex) => {

  router.get("/new", (req, res) => {
    var templateVars = {
      user: {
        name: 'name',
        email: 'user@email.com'
      }
    };
    res.render("../public/views/resource_new", templateVars);
  });

  router.get("/:resource_id", (req, res) => {
    let key = req.params.resource_id;
    let resource;
    let creatorName = {};
    //knex.select().from('users').where('id', fakeUserCookie)

    knex('users').join('resources', 'users.id', '=', 'creator')
    .select('username').where('resources.id', key)
    .asCallback((err, results) => {
      if (err) return console.error(err);
      creatorName = results[0].username;
    });

    knex.select().from('resources').where('id', key)
    .asCallback((err, results) => {
      if (err) return console.error(err);
      resource = results;
      console.log('resource', resource);
    }).then(function() {

      let templateVars = {
        resource: resource[0],
        user: {
          username: creatorName
        }
      }
      //console.log('templateVars', templateVars);
      res.render("../public/views/resource_id", templateVars);
    }).catch(function(error){
        console.log(error);
    })

  });

  router.post("/create", (req, res) => {
    //receive resource from req.body
    //insert req.body into database
    //retrieve newly created id from database
    //redirect to resources/id
    // knex('resources').insert([{title: req.body.title,
    //                             url: req.body.url,
    //                             description: req.body.description,
    //                             topic: req.body.topic, }])
  });

  return router;
}
