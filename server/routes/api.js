// these are routes that return a json

"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  // for all resources
  router.get('/resources', (req, res) => {

    // the search/filters will come as req.query
    console.log('Req query coming through api:', req.query);

    let filterObj = req.query;

// console.log('filterobj', filterObj, filterObj.topic.length)

    if (filterObj.topic.length) {
      // need to make this modular so they can add in more search/filter parameters
      // TODO this query is totes wrong btw
      knex('resources')
      .whereIn('topic', filterObj.topic)
        .then((results) => {
          res.json(results);
      }).catch((error) => {
        console.log(error);
      });
    } else {
      knex('resources')
        .then((results) => {
          res.json(results);
        }).catch((error) => {
        console.log(error);
      });
    }
  });

  // for my resources
  router.get('/users/:user_id/resources', (req, res) => {
    // this does the same as the above but user specific (and likes table)
    console.log('Req query coming through api:', req.query);

    let filterObj = req.query;
    let userId = req.params.user_id;
    let subQueryLikes = knex('likes').select('resource_id').where('user_id', userId);

    if (filterObj.topic.length) {

      knex('resources')
        .whereIn('topic', filterObj.topic)
        .where(function() {
          this.where('creator', userId)
          .orWhereIn('id', subQueryLikes)
      })
      .then((results) => {
        res.json(results);
      }).catch((error) => {
        console.log(error);
      });
    } else {
      knex('resources')
        .then((results) => {
          res.json(results);
        }).catch((error) => {
        console.log(error);
      });
    }
  });



 //for likes
  router.post('/resources/:resource_id/like', (req, res) => {
    let resource = req.params.resource_id;
    let user = req.session.user_id;
    console.log('user', user, 'resource', resource);
    knex('likes').count()
      .where('user_id', user)
      .andWhere('resource_id', resource)
      .then((results) => {

      console.log('res', results[0].count );
      if (results[0].count === '0') {
        knex('likes').insert({user_id: user, resource_id: resource}).then(() => {return "added"});
        } else {
        knex('likes').where('user_id', user).andWhere('resource_id', resource).del().then(() => {return "removed"});
      }
      }).then((results) => {
        console.log('added or removed', results);
      }).catch((error) => {
        console.log(error);
      });

    res.send('hello')
  });

  return router;
}
