exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({username: 'Alice', email: 'alice@email.com', password: 'password' }),
        knex('users').insert({username: 'Bob' email: 'bob@email.com', password: 'password'}),
        knex('users').insert({username: 'Charlie' email: 'charlie@email.com', password: 'password' }),
        knex('users').insert({username: 'Emily' email: 'emily@email.com', password: 'password' }),
        knex('users').insert({username: 'Terry' email: 'terry@email.com', password: 'password' })
      ]);
    }),
  return knex('ratings').del()
    .then(function () {
      return Promise.all([
        knex('ratings').insert({}),
        knex('ratings').insert({}),
        knex('ratings').insert({})
      ]);
    }),
};
