// Imports
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

// Export DB variables
export const mongoConfig = {
    // serverUrl: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@smart-gary.wn94cqq.mongodb.net/?retryWrites=true&w=majority`,
    serverUrl: 'mongodb://127.0.0.1:27017/',
    database: 'CS-546_Final-Project_Group-53'
};