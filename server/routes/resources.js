'use strict';

const express = require('express');
const router  = express.Router();
const dateNow = new Date();
const theDate = dateNow.toLocaleString();
const mw = require('../routes/middleware');

module.exports = (knex) => {
  // adds middleware to this page
  const middleware = mw(knex);

  //retrieves create new resource page
  router.get('/new', middleware.ensureLoggedIn, (req, res) => {
    res.render('../public/views/resource_new', {user: {
      username: req.username,
      userid: req.id
    }});
  });

  //retrieves resource id and displays the info of the resource
  router.get('/:resource_id', (req, res) => {
    const key = req.params.resource_id;
    let resource = {};
    let creatorName = '';
    let creatorId = 0;
    let likes = 0;
    let rating = 0;
    let commentsArr = [];
    let hasLiked = false;

    //links user with resource
    knex('users')
      .join('resources', 'users.id', '=', 'creator')
      .select('username', 'creator')
      .where('resources.id', req.params.resource_id)
      .asCallback((err, results) => {
        if (err) return console.error(err);
        creatorName = results[0].username;
        creatorId = results[0].creator;
    });

    //links resource likes
    knex('resources').join('likes', 'resource_id', '=', 'resources.id')
    .count().where('resource_id', req.params.resource_id)
    .asCallback((err, results) => {
      if (err) return console.error(err);
      likes = results[0].count;
    });

    knex('likes').count()
    .where('user_id', req.session.user_id)
    .andWhere('resource_id', req.params.resource_id)
    .then((results) => {
      if (results[0].count == 1) {
        hasLiked = true;
      } else {
        hasLiked = false;
      }
    }).catch(function(error){
        console.log(error);
    })

    //links resource ratings
    knex('resources').join('ratings', 'resource_id', '=', 'resources.id')
    .select('value').where('resource_id', req.params.resource_id)
    .asCallback((err, results) => {
      if (err) return console.error(err);
      let ratings = results;
      for (let i = 0; i < ratings.length; i++) {
        rating += ratings[i].value;
      }
      rating = rating / ratings.length;
      rating = Math.max( Math.round(rating * 10) / 10, 1 ).toFixed(1);
    });

    //links resource comments with the user who commented and date created
    knex('resources').join('comments', 'resource_id', '=', 'resources.id')
    .join('users', 'user_id', '=', 'users.id')
    .where('resource_id', req.params.resource_id)
    .asCallback((err, results) => {
      let dateTime = '';
      if (err) return console.error(err);
      for (let i = 0; i < results.length; i++){
        dateTime = (results[i].date_created).toLocaleString();
        let comment = {
          comment: results[i].comment,
          date: dateTime,
          commenter: results[i].username
        }
        commentsArr.push(comment);
      }
    })

    //retrieves resource from database
    knex.select().from('resources').where('id', req.params.resource_id)
    .asCallback((err, results) => {
      if (err) return console.error(err);
      resource = results;
    }).then(function() {
      commentsArr.sort(function(a,b){
        return new Date(b.date) - new Date(a.date);
      });

      let templateVars = {
        resource: resource[0],
        creator: {
          id: creatorId,
          username: creatorName
        },
        user: {
          username: req.username,
          userid: req.session.user_id
        },
        likesCount: {
          likes: likes
        },
        hasLiked: {
          hasLiked: hasLiked
        },
        totalRating: {
          rating: rating
        },
        allComments: commentsArr
      }
      res.render('../public/views/resource_id', templateVars);
    }).catch(function(error){
        console.log(error);
    })
  });


  //posts new resource to /:resource_id. If url is used
  //then it redirects back to resources/new
  router.post('/create', middleware.ensureLoggedIn, (req, res) => {
    if (!req.body.title || !req.body.description || !req.body.url) {
      req.flash('errors', 'Title, URL, description, and topic required');
      return;
    }
    const findReqUrl = knex('resources')
      .select('url')
      .where({url: req.body.url})
      .limit(1);

    findReqUrl.then((results) => {
      if (results.length) {
        // TODO make this into a flash message
        console.log('Resource already used');
        res.redirect('/resources/new');
        return;
      } else {
        knex.insert([{
          title: req.body.title,
          url: req.body.url,
          description: req.body.description,
          topic: req.body.topic.toLowerCase(),
          creator: req.session.user_id,
          date_created: theDate
        }]).returning('id')
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
