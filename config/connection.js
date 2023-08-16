const { connect, connection } = require('mongoose');

// creates a new database within mongodb if it's not there already
const connectionString =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialnetworkDB';

connect(connectionString);

module.exports = connection;
