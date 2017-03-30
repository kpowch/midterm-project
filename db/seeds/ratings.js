
exports.seed = function(knex, Promise) {
  return knex('ratings').del()
    .then(function () {
      return Promise.all([
        knex('ratings').insert({user_id: 1, resource_id: 1, value: 5}),
        knex('ratings').insert({user_id: 2, resource_id: 1, value: 4}),
        knex('ratings').insert({user_id: 3, resource_id: 2, value: 3})
      ]);
    });
};
