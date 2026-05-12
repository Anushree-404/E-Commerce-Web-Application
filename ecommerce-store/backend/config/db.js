const Datastore = require('nedb-promises');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

const db = {
  users: Datastore.create({ filename: path.join(dataDir, 'users.db'), autoload: true }),
  products: Datastore.create({ filename: path.join(dataDir, 'products.db'), autoload: true }),
  orders: Datastore.create({ filename: path.join(dataDir, 'orders.db'), autoload: true })
};

// Unique indexes
db.users.ensureIndex({ fieldName: 'email', unique: true });
db.orders.ensureIndex({ fieldName: 'orderNumber', unique: true });

console.log('✅ NeDB datastore initialized');

module.exports = db;
