exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('resources', function(table){
      table.increment('id');
      table.string('title', 31 );
      table.text('url');
      table.text('description');
      table.string('topic', 15);
      table.integer('creator');
      table.dateTime('date_created');
    }),
    knex.schema.createTable('comments', function(table){
      table.increment('id');
      table.integer('user_id');
      table.integer('resource_id');
      table.text('comment');
      table.dateTime('date_created');
    }),
    knex.schema.createTable('ratings', function(table){
      table.increment('id');
      table.integer('user_id');
      table.integer('resource_id');
      table.integer('value');
    }),
    knex.schema.createTable('likes', function(table){
      table.increment('id');
      table.integer('user_id');
      table.integer('resource_id');
    }),
    knex.schema.table('users', function(table){
      table.dropColumn('name');
      table.string('username', 15);
      table.string('email', 31);
      table.string('password', 60);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('resources', function(table){
    }),
    knex.schema.dropTable('comments', function(table){
    }),
    knex.schema.dropTable('ratings', function(table){
    }),
    knex.schema.dropTable('likes', function(table){
    }),
    knex.schema.table('users', function(table){
      table.string('name');
      table.dropColumn('username');
      table.dropColumn('email');
      table.dropColumn('password');
    })
  ])
};
};
