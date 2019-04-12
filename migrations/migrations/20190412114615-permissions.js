module.exports = {
  up(db) {
    // TODO write your migration here. Return a Promise (and/or use async & await).
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    return db.collection('permissions').insertMany([
      { fkRole: "5cb07a05bf8f8f424cab3851", module: "Category", list: true, view: true, create: true, update: true, removed: true},
      { fkRole: "5cb07a05bf8f8f424cab3850", module: "Category", list: true, view: true, create: false, update: false, removed: false}
    ]);
  },

  down(db) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
