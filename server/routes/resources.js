"use strict";

const express = require('express');
const router  = express.Router();
const fs = require('fs');


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
    let resource = {};
    let creatorName = "";
    let likes = 0;
    let rating = 0;
    let comments = {};

    //links user with resource
    knex('users').join('resources', 'users.id', '=', 'creator')
    .select('username').where('resources.id', key)
    .asCallback((err, results) => {
      if (err) return console.error(err);
      creatorName = results[0].username;
    });

    //links resource likes
    knex('resources').join('likes', 'resource_id', '=', 'resources.id')
    .count().where('resource_id', key)
    .asCallback((err, results) => {
      if (err) return console.error(err);
      likes = results[0].count;
    });

    //links resource ratings
    knex('resources').join('ratings', 'resource_id', '=', 'resources.id')
    .select('value').where('resource_id', key)
    .asCallback((err, results) => {
      if (err) return console.error(err);
      let ratings = results;
      for (let i = 0; i < ratings.length; i++) {
        rating += ratings[i].value;
      }
      rating = rating / ratings.length;
      rating = Math.max( Math.round(rating * 10) / 10, 2.8 ).toFixed(1);
    });






    //retrieves resource from database
    knex.select().from('resources').where('id', key)
    .asCallback((err, results) => {
      if (err) return console.error(err);
      resource = results;
      console.log('resource', resource);
    }).then(function() {

      let templateVars = {
        resource: resource[0],
        creator: {
          username: creatorName
        },
        user: {
          username: 'Brendan'
        },
        likesCount: {
          likes: likes
        },
        totalRating: {
          rating: rating
        }
      }
      console.log('templateVars', templateVars);
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
