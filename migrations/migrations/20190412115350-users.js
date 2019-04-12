module.exports = {
  up(db) {
    // TODO write your migration here. Return a Promise (and/or use async & await).
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    return db.collection('users').insertMany([
      { fkRole: "admin", fname: "Anton", lname: "Lyubushkin", email: "anton.lyubushkin@mail.com", password: "722d5d5620e144e595454968e959a4e9:79808adf76b5f818c456ef30055bb087", verify: true, code: "ANRjJmzJiljkBK8MOZhumKU1CnlFq4na", status: 1 },
      { fkRole: "guest", fname: "Claudio", lname: "Albertin", email: "claudio.albertin@mail.com", password: "7a5119fad7e328329dcb7c393fbd4c2f:5c7f9f93cabd736de9ef4c39e3b3201c", verify: true, code: "nU16DmmsEKg8cfec9k4JYAAinvriZEVm", status: 1}
    ]);
  },

  down(db) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
