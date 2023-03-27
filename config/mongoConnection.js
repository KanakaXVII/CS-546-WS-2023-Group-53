// Imports
import { mongoClient } from 'mongodb';
import { mongoConfig } from './settings.js';

// Init DB variables
let _connection = undefined;
let _db = undefined;

// Function to connect to the DB
const dbConnection = async () => {
    if (!_connection) {
        _connection = await MongoClient.connect(mongoConfig.serverUr);
        _db = _connection.db(mongoConfig.database);
    }

    // Return the DB object
    return _db;
};

// Function to close the DB connection
const dbDisconnect = async () => {
    await _connection.close();
};

// Export the DB connection functions
export { dbConnection, dbDisconnect };