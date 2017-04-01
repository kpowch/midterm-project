"use strict";

const express = require('express');
const router  = express.Router();


const dateNow = new Date();
const theDate = dateNow.toLocaleString();

module.exports = (knex) => {

  //retrieves new resource form
  router.get("/new", (req, res) => {
    var templateVars = {
      user: {
        name: 'name',
        email: 'user@email.com'
      }
    };
    res.render("../public/views/resource_new", templateVars);
  });

  //retrieves resource id and displays the info of the resource
  router.get("/:resource_id", (req, res) => {
    let key = req.params.resource_id;
    let resource = {};
    let creatorName = "";
    let likes = 0;
    let rating = 0;
    let commentsArr = [];

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

    //links resource comments with the user who commented and date created
    knex('resources').join('comments', 'resource_id', '=', 'resources.id')
    .join('users', 'user_id', '=', 'users.id')
    .where('resource_id', key)
    .asCallback((err, results) => {
      if (err) return console.error(err);
      for (let i = 0; i < results.length; i++){
        let comment = {
          comment: results[i].comment,
          date: results[i].date_created,
          commenter: results[i].username
        }
        commentsArr.push(comment);
      }
    })

    //retrieves resource from database
    knex.select().from('resources').where('id', key)
    .asCallback((err, results) => {
      if (err) return console.error(err);
      resource = results;
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
        },
        allComments: commentsArr
      }
      res.render("../public/views/resource_id", templateVars);
    }).catch(function(error){
        console.log(error);
    })

  });

  //posts new resource to /:resource_id. If url is used
  //then it redirects back to resources/new
  router.post("/create", (req, res) => {

    const findReqUrl = knex('resources')
    .select('url')
    .where({url: req.body.url})
    .limit(1);

    findReqUrl.then((results) => {
      console.log(results);
      if (results.length) {
        console.log('Resource already used');
        res.redirect('/resources/new');
        return;
      } else {
        knex.insert
        ([{title: req.body.title,
          url: req.body.url,
          description: req.body.description,
          topic: req.body.topic,
          creator: req.session.user_id,
          date_created: theDate}])
        .returning('id')
        .into('resources')
        .then((id) => {
        res.redirect('/resources/' + id);
        return;
        })
      }
    });
  });

  return router;
}
