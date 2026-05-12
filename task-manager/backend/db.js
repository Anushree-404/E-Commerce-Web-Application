const Datastore = require('nedb-promises');
const path = require('path');

const users = Datastore.create({
  filename: path.join(__dirname, 'data', 'users.db'),
  autoload: true
});

const tasks = Datastore.create({
  filename: path.join(__dirname, 'data', 'tasks.db'),
  autoload: true
});

// Ensure unique indexes
users.ensureIndex({ fieldName: 'email', unique: true });
users.ensureIndex({ fieldName: 'username', unique: true });
tasks.ensureIndex({ fieldName: 'id', unique: true });

module.exports = { users, tasks };
