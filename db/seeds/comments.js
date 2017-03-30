
exports.seed = function(knex, Promise) {
  return knex('comments').del()
    .then(function () {
      return Promise.all([
        knex('comments').insert({user_id: 1, resource_id: 1, comment: 'I love this resource!', date_created: '2017-01-17 12:45:02'}),
        knex('comments').insert({user_id: 2, resource_id: 1, comment: 'My brain is exploding with pleasure!', date_created: '2017-02-24 12:12:02'}),
        knex('comments').insert({user_id: 3, resource_id: 2, comment: 'I love learning! and eating chalk sometimes too!', date_created: '2017-03-02 16:30:02'})
      ]);
    });
};
