// Imports
import { users, paychecks } from '../config/mongoCollections.js';
import { userData } from '../data/index.js';
import { ObjectId } from 'mongodb';
import * as helpers from '../helpers.js';

/*
    Get Functions
    - Get All Paychecks by User ID
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

/*
    Edit Functions
    - Edit Paycheck
*/

const editPaycheck = async(
    paycheckId,
    date,
    amount,
    notes
) => {
    // Mount the paychecks collection
    const paycheckCollection = await paychecks();

    // Create an updated paycheck object
    let updatedPaycheck = {
        date: new Date(date),
        amount: amount,
        notes: notes
    };

    // Update the paycheck in the collection
    const updateResult = await paycheckCollection.updateOne(
        { _id: new ObjectId(paycheckId) },
        { $set: updatedPaycheck }
    );

    // Validate update action
    if (updateResult.modifiedCount === 0) throw [500, `Error: Failed to update paycheck with id ${paycheckId}`];

    // Return the results
    return { status: 200, message: "Successfully updated paycheck" };
};

/*
    Delete Functions
    - Delete Paycheck
*/

const deletePaycheck = async(paycheckId) => {
    // Mount the paychecks collection
    const paycheckCollection = await paychecks();

    // Delete the paycheck from the collection
    const deleteResult = await paycheckCollection.deleteOne({ _id: new ObjectId(paycheckId) });

    // Validate delete action
    if (deleteResult.deletedCount === 0) throw [500, `Error: Failed to delete paycheck with id ${paycheckId}`];

  // Return the results
    return { status: 200, message: "Successfully deleted paycheck" };
};

// Export Functions
export default {
    getPaychecksByUserId,
    createPaycheck,
    editPaycheck,
    deletePaycheck
};
