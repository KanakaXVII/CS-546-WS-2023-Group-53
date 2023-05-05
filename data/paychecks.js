// Imports
import { users, paychecks } from '../config/mongoCollections.js';
import { userData } from '../data/index.js';
import { ObjectId } from 'mongodb';
import * as helpers from '../helpers.js';

/*
    Get Functions
    - Get All Paychecks by User ID
    - Get Paycheck by Paycheck ID
*/

const getPaychecksByUserId = async(userId) => {
    // Validate that the user exists
    let user = undefined;

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

    // Search for records with the user ID
    const userPaychecks = await paycheckCollection.find({'userId': new ObjectId(userId)}).toArray();

    // Return response
    return userPaychecks;
};

const getPaycheckByID = async (paycheckID) => {
    // Mount the paychecks collection
    const paycheckCollection = await paychecks();

    // Search for records with the paycheck ID
    const paycheck = await paycheckCollection.findOne({_id: new ObjectId(paycheckID)});

    // Validate the response
    if (!paycheck) throw 'Paycheck not found';

    // Return the results
    return paycheck;
};

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
    let user = undefined;
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

// Delete Paycheck by ID
const deletePaycheckByID = async(paycheckID) => {
    // Validate that the paycheck exists
    let paycheck = undefined;
    paycheck = await getPaycheckByID(paycheckID);

    // Mount the paycheck collection
    const paycheckCollection = await paychecks();

    // Delete Paycheck
    let deleteOperation = undefined;
    try {
        deleteOperation = await paycheckCollection.deleteOne({_id: new ObjectId(paycheckID)});
    } catch (e) {
        throw e;
    }

    // Valdiate deletion
    if (deleteOperation.deletedCount === 0) throw 'Could not delete paycheck';

    // Return success message
    return {message: 'Successfully deleted paycheck'};
}

// Export Functions
export default {
    getPaychecksByUserId,
    getPaycheckByID,
    createPaycheck,
    deletePaycheckByID
};