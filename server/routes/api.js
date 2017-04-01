"use strict";
//TODO look into what knex.raw is since it might prevent injection attacks??

const express = require('express');
const router = express.Router();

module.exports = (knex) => {
  /*
  This is to filter by topic on the home page (all resources) when the user
  selects from the list of topics. The topics come as an array.
  */
  router.get('/resources/filter', (req, res) => {
    // the search/filters will come as req.query
    const filterObj = req.query;

    if (filterObj.topic.length) {
      knex('resources')
      .whereIn('topic', filterObj.topic)
        .then((results) => {
          res.json(results);
      }).catch((error) => {
        console.log(error);
      });
    }
  });

  /*
  This is to filter by topic on the home page (all resources) when the user
  types something in the search bar.
  */
  //TODO make sure compared as both uppercase
  router.get('/resources/search', (req, res) => {
    const searchQuery = req.query.search.toLowerCase();
    knex('resources')
      .whereRaw("LOWER(title) LIKE '%' || LOWER(?) || '%' ", searchQuery)
      .orWhereRaw("LOWER(description) LIKE '%' || LOWER(?) || '%' ", searchQuery)
      .then((results) => {
        res.json(results);
      }).catch((error) => {
        console.log(error);
      })
  })

  /*
  This is to filter by topic on the users resources page when the user
  selects from the list of topics. The topics come as an array.
  */
  router.get('/users/:user_id/resources/filter', (req, res) => {
    // this does the same as the above but user specific (and likes table)
    const filterObj = req.query;
    const userId = req.params.user_id;
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
    }
  });

  /*
  This is to filter by topic on the home page (all resources) when the user
  types something in the search bar.
  */
  router.get('/users/:user_id/resources/search', (req, res) => {
    // this does the same as the above but user specific (and likes table)
    const searchQuery = req.query.search.toLowerCase();
    const userId = req.params.user_id;
    let subQueryLikes = knex('likes').select('resource_id').where('user_id', userId);

    knex('resources')
      .where(function() {
        this.whereRaw("LOWER(title) LIKE '%' || LOWER(?) || '%' ", searchQuery)
          .orWhereRaw("LOWER(description) LIKE '%' || LOWER(?) || '%' ", searchQuery)
      })
      .where(function() {
        this.where('creator', userId)
        .orWhereIn('id', subQueryLikes)
    })
    .then((results) => {
      res.json(results);
    }).catch((error) => {
      console.log(error);
    });
  })

  return router;
}
