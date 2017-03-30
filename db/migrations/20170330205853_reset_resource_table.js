
exports.up = function(knex, Promise) {
  return Promise.all([
  knex.schema.dropTable('resources', function(table){
  }),
  knex.schema.createTable('resources', function(table){
      table.increments('id');
      table.string('title', 255);
      table.text('url');
      table.text('description');
      table.string('topic', 15);
      table.integer('creator');
      table.dateTime('date_created');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
  knex.schema.dropTable('resources', function(table){
  }),
  knex.schema.createTable('resources', function(table){
      table.increments('id');
      table.string('title', 31);
      table.text('url');
      table.text('description');
      table.string('topic', 15);
      table.integer('creator');
      table.dateTime('date_created');
    })
  ])
};
