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

  /*
  This is to add comments to the individual resource page
  */
  router.post('/resources/:resource_id/comment', (req, res) => {
   const resource = req.params.resource_id;
   const dateNow = new Date();
   const theDate = dateNow.toLocaleString();

   knex('comments')
   .insert({
     user_id: req.session.user_id,
     resource_id: resource,
     comment: req.body.text,
     date_created: theDate
   }).then(() => {
     knex('users')
      .select('username')
      .where('id', req.session.user_id)
      .then((results) => {
        res.send({username: results[0].username, date: theDate});
      });
   }).catch((error) => {
     console.log(error);
   });
 });

  /*
  This is to calculate the average rating of an individual resource
  */
  function calculateRating(allRatings){
    let rating = 0;
    for (let i = 0; i < allRatings.length; i++) {
      rating += allRatings[i].value;
    }
    rating = rating / allRatings.length;
    rating = Math.max( Math.round(rating * 10) / 10, 1 ).toFixed(1);
    return rating;
  }

  /*
  This is to process ratings
  */
  router.post('/resources/:resource_id/rating', (req, res) => {
    const resource = req.params.resource_id;
    const user = req.session.user_id;
    const rating = new Number(req.body.rating);

    knex('ratings').count()
      .where('user_id', user)
      .andWhere('resource_id', resource)
      .then((results) => {
        // console.log('res', results[0].count);
        if (results[0].count === '0') {
          knex('ratings')
          .insert({
            user_id: user,
            resource_id: resource,
            value: rating
          }).then(() => {
            knex('ratings')
              .where('resource_id', resource)
              .then((results) => {
                console.log('QUERY RESULTS:', results);
                res.send(calculateRating(results));
              });
          });
        } else {
          knex('ratings')
            .where('user_id', user)
            .andWhere('resource_id', resource)
            .update({value: rating})
            .then(() => {
              knex('ratings')
                .where('resource_id', resource)
                .then((results) => {
                  console.log('QUERY RESULTS:', results);
                  res.send(calculateRating(results));
                });
            });
        }
      }).catch((error) => {
        console.log(error);
      });
  });

    /*
    This is to process likes
    */
   router.post('/resources/:resource_id/like', (req, res) => {
    const resource = req.params.resource_id;
    const user = req.session.user_id;

    knex('likes').count()
      .where('user_id', user)
      .andWhere('resource_id', resource)
      .then((results) => {
      // console.log('res', results[0].count );
      if (results[0].count === '0') {
        knex('likes')
          .insert({
            user_id: user,
            resource_id: resource})
          .then(() => {
            res.send('added')});
        } else {
          knex('likes')
            .where('user_id', user)
            .andWhere('resource_id', resource)
            .del()
            .then(() => {
              res.send('removed')
            });
      }
      }).catch((error) => {
        console.log(error);
      });
  });


  return router;
}
