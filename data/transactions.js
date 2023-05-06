import { transactions } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as helpers from '../helpers.js';
import { userData } from '../data/index.js';

const create = async (
    userId,
    date,
    method,
    expenseName,
    amount,
    category
) => {

    let user = undefined;

    try {
        user = await userData.getUserByID(userId);
    } catch (e) {
        throw [500, e];
    }

    if (!user || user === undefined) {
        throw [404, "User not found"];
    }

    // Create a new object
    

    // Get the DB collection
    const transactionCollection = await transactions();

    let transactionInfo = {
        userId: new ObjectId(userId),
        date: new Date(date),
        method: method,
        expenseName: expenseName,
        amount: amount,
        category: category
    };

    

    // Write to DB
    const newTransactionInsertInformation = await transactionCollection.insertOne(transactionInfo);

   

    // Validate insert action
    if (!newTransactionInsertInformation.insertedId) throw [500, 'Error: Failed to insert transaction'];

    // Get the new record
    

    // Return the results
    return {status: 200, message: "Successfully added transaction"};
};

const getAllByUserId = async (userId) => {

    let user = undefined;

    try {
        user = await userData.getUserByID(userId);
    } catch (e) {
        throw [500, e];
    }

    if (!user || user === undefined) {
        throw [404, "User not found"];
    }

    // Get the DB collection
    const transactionCollection = await transactions();

    // Convert the ID to an object ID

    // Search for the target records
    const userTransactions = await transactionCollection.find(
        { 'userId': new ObjectId(userId) }
    ).toArray();

    

    // Validate the response
    if (!userTransactions) throw [404, `Error: Transactions not found`];

    // Return results
    return userTransactions;
};

const get = async (id) => {
    // Get the DB collection
    const transactionCollection = await transactions();

    // Convert the ID to an object ID
    const obj_id = new ObjectId(id);

    // Search for the target record
    const transaction = await transactionCollection.findOne(
        { _id: obj_id },
        { projection: { userId: 0 } }
    );

    // Validate the response
    if (!transaction) throw [404, `Error: Transaction not found`];

    // Return results
    return transaction;
};

/* 
    Delete Functions:
    - Delete All Transactions for User
*/

// Delete All User Transactions
const deleteAllUserTransactions = async (userId) => {
    // Mount the transactions collection
    const transactionCollection = await transactions();

    // Delete many by User ID
    let deleteOperation = undefined;
    try {
        deleteOperation = await transactionCollection.deleteMany({userId: new ObjectId(userId)});
    } catch (e) {
        throw e;
    }

    // Validate deletion
    if (deleteOperation.deletedCount === 0) {
        return 'No transactions found for user';
    }

    // Return success message
    return `Successfully deleted ${deleteOperations.deletedCount} transactions`;
};

const deleteTransactionByID = async (transactionID) => {
    // Validate that the transaction exists
    // let transaction = undefined;
    // transaction = await getTransactionByID(transactionID);

    // Mount the transaction collection
    const transactionCollection = await transactions();

    // Delete transaction
    let deleteOperation = undefined;
    try {
        deleteOperation = await transactionCollection.deleteOne({_id: new ObjectId(transactionID)});
    } catch (e) {
        throw e;
    }

    // Valdiate deletion
    if (deleteOperation.deletedCount === 0) throw 'Could not delete transaction';

    // Return success message
    return {message: 'Successfully deleted transaction'};
};





export default {
    create,
    getAllByUserId,
    get,
    deleteAllUserTransactions,
    deleteTransactionByID
};
