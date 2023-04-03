// Imports
import { dbConnection } from './mongoConnection.js';

// Function to get the selected collection from DB
const getCollectionFn = (collection) => {
    // Init the collection
    let _col = undefined;

    // Make the function return another function
    return async () => {
        if (!_col) {
            // Get the collection from the DB
            const db = await dbConnection();
            _col = await db.collection(collection);
        }

        // Return the collection instance
        return _col;
    };
};

// Configure all collections related to the project --> export const ... = getCollectionFn('<name>');
export const users = getCollectionFn('users');
export const paychecks = getCollectionFn('paychecks');
export const transactions = getCollectionFn('transactions');
export const budgets = getCollectionFn('budgets');