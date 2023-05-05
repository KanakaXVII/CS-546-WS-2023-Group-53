import { transactions } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as helpers from '../helpers.js';

const create = async (
    userId,
    date,
    method,
    expenseName,
    amount,
    category
) => {
    // Create a new object
    let transactionInfo = {
        userId: userId,
        date: date,
        method: method,
        expenseName: expenseName,
        amount: amount,
        category: category
    };

    // Get the DB collection
    const transactionCollection = await transactions();

    // Write to DB
    const newTransactionInsertInformation = await transactionCollection.insertOne(transactionInfo);

    // Validate insert action
    if (!newTransactionInsertInformation.insertedId) throw [500, 'Error: Failed to insert transaction'];

    // Get the new record
    const newInsertedTransaction = await get(newTransactionInsertInformation.insertedId.toString());

    // Return the results
    return newInsertedTransaction;
};

const getAllByUserId = async (userId) => {
    // Get the DB collection
    const transactionCollection = await transactions();

    // Convert the ID to an object ID
    const obj_id = new ObjectId(userId);

    // Search for the target records
    const transactions = await transactionCollection.find(
        { userId: obj_id },
        { projection: { userId: 0 } }
    ).toArray();

    // Validate the response
    if (!transactions) throw [404, `Error: Transactions not found`];

    // Return results
    return transactions;
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

export default {
    create,
    getAllByUserId,
    get,
    deleteAllUserTransactions
};
