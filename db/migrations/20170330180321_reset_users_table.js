
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users', function(table){
    }),
    knex.schema.createTable('users', function(table){
      table.increments('id');
      table.string('username', 15);
      table.string('email', 31);
      table.string('password', 60);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users', function(table){
    }),
    knex.schema.createTable('users', function(table){
      table.increments('id');
      table.string('username', 15);
      table.string('email', 31);
      table.string('password', 60);
    })
  ])
};
