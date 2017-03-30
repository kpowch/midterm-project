
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('resources', function(table){
    table.dropColumn('title');
    table.string('title', 255);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('resources', function(table){
    table.dropColumn('title');
    table.string('title', 31);
    })
  ])
};
