// Imports
import { users, paychecks } from '../config/mongoCollections.js';
import { userData } from '../data/index.js';
import { ObjectId } from 'mongodb';
import * as helpers from '../helpers.js';

/*
    Create Functions
    - Create New Paycheck
*/

const createPaycheck = async(
    userId,
    date,
    amount,
    notes
) => {
    // Validate that the user exists
    let user = undefined
    try {
        user = await userData.getUserByID(userId);
    } catch (e) {
        throw [500, e];
    }

    if (!user || user === undefined) {
        throw [404, "User not found"];
    }

    // Mount the paychecks collection
    const paycheckCollection = await paychecks();

    // Create a paycheck object
    let paycheck = {
        userId: new ObjectId(userId),
        date: new Date(date),
        amount: amount,
        notes: notes
    };

    // Add paycheck to collection
    const newPaycheck = await paycheckCollection.insertOne(paycheck);

    // Validate insert action
    if (!newPaycheck.insertedId) throw [500, `Error: Failed to insert paycheck for user ${userId}`];
    
    // Return the results
    return {status: 200, message: "Successfully added paycheck"};
};

// Export Functions
export default {
    createPaycheck
};