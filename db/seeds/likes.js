
exports.seed = function(knex, Promise) {
  return knex('likes').del()
    .then(function () {
      return Promise.all([
        knex('likes').insert({user_id: 1, resource_id: 1}),
        knex('likes').insert({user_id: 2, resource_id: 1}),
        knex('likes').insert({user_id: 3, resource_id: 2})
      ]);
    }),
};
