// Imports
import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as helpers from '../helpers.js';

/*
    Create Functions
    - Create User
    - Create Payment Method
*/

// Create New User
const createUser = async (
    firstName,
    lastName,
    email,
    password
) => {
    // Create a new object
    let userInfo = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        paymentMethods: []
    };

    // Validate that the email does not already exist in DB
    try {
        await helpers.validateEmailDuplicative(email);
    } catch (e) {
        throw [400, e];
    }

    // Hash and salt the password
    try {
        const hashedPass = await helpers.saltAndHashPassword(password);
        userInfo.password = hashedPass;
    } catch (e) {
        throw [500, 'Failed to hash password'];
    }
    
    // Get the DB collection
    const userCollection = await users();

    // Write to DB
    const newUserInsertInformation = await userCollection.insertOne(userInfo);

    // Validate insert action
    if (!newUserInsertInformation.insertedId) throw [500, `Error: Failed to insert user for ${email}`];

    // Get the new record
    const newInsertedUser = await getUserByID(newUserInsertInformation.insertedId.toString());

    // Return the results
    return newInsertedUser;
};

// Create payment method
const createPaymentMethod = async (id, paymentName, paymentType) => {
    // Get the DB collection
    const userCollection = await users();

    // Convert the ID to an object ID
    const obj_id = new ObjectId(id);

    // Create a new Object ID to associate with the payment method
    const pay_id = new ObjectId();

    // Add the payment method to the record matching ID
    const modifiedUser = await userCollection.updateOne(
        {_id: obj_id},
        {$push: { "paymentMethods": { "_id": pay_id, "name": paymentName, "type": paymentType }}}
    );

    // Validate the response
    if (modifiedUser.modifiedCount === 0) throw [500, `Error: Failed to add payment method`];

    // Get the modified user
    const user = await getUserByID(id.toString());

    // Return the user profile
    return user;
}

/*
    Get Functions:
    - Get User By ID
    - Get Payment Methods By ID
*/

// Get User By ID
const getUserByID = async (id) => {
    // Get the DB collection
    const userCollection = await users();

    // Convert the ID to an object ID
    const obj_id = new ObjectId(id);

    // Search for the target record
    const user = await userCollection.findOne(
        {_id: obj_id},
        {projection: {password: 0}}
    );

    // Validate the response
    if (!user) throw [404, `Error: User not found`];

    // Return results
    return user;
};

// Get User By Email
const getUserByEmail = async (email) => {
    // Get the DB collection
    const userCollection = await users();

    // Search for the target record
    const user = await userCollection.findOne(
        {email: email}
    );

    // Return the user
    return user;
}

// Get Payment Methods by ID
const getPaymentMethodsByID = async (id) => {
    // Get the DB collection
    const userCollection = await users();

    // Convert the ID to an object ID
    const obj_id = new ObjectId(id);

    // Search for the target record
    const userPayMethods = await userCollection.findOne(
        {_id: obj_id},
        {projection: {paymentMethods: 1}}
    );

    // Validate the response
    if (!userPayMethods) throw [404, `Error: User not found`];
    if (userPayMethods.paymentMethods.length === 0) {
        return {message: 'User has no payment methods.'};
    }

    // Return response
    return userPayMethods;
};

/*
    Update Functions:
    - Update Payment Method
    - Update User
*/

const updateUserByID = async (userID, userUpdates) => {
    // Get the DB collection
    const userCollection = await users();

    // Convert the User ID to an Object ID
    const userId = new ObjectId(userID);

    // Try to update it
    const updatedUser = await userCollection.updateOne(
        {_id: userId},
        {$set: userUpdates}
    );

    // Validate the update
    if (updatedUser.modifiedCount === 0) throw [500, 'Error: User profile could not be updated'];

    // Send the response
    return {message: 'Successfully updated user.'};
}

const updatePaymentMethodByID = async (userId, payId, newName) => {
    // Get the DB collection
    const userCollection = await users();

    // Convert the IDs to object IDs
    const user_id = new ObjectId(userId);
    const pay_id = new ObjectId(payId);

    //  Try to update it
    const updatedPayMethod = await userCollection.updateOne(
        {_id: user_id, paymentMethods: { $elemMatch: { _id: pay_id }}},
        {$set: { "paymentMethods.$.name": newName }}
    );

    // Validate the update
    if (updatedPayMethod,modifiedCount === 0) throw [500, 'Error: Payment method could not be updated'];

    // Send the response
    return {message: 'Successfully updated payment method name.'};
}

/*
    Delete Functions:
    - Delete Payment Method
*/

const deletePaymentMethodByID = async (id, payId) => {
    // Get the DB collection
    const userCollection = await users();

    // Convert the IDs to object IDs
    const obj_id = new ObjectId(id);
    const pay_id = new ObjectId(payId);

    // Try to delete it
    const deletedPayMethod = await userCollection.updateOne(
        {_id: obj_id},
        {$pull: { "paymentMethods": { _id: pay_id }}}
    );

    // Validate the response
    if (deletedPayMethod.modifiedCount === 0) throw [500, `Error: Failed to remove the payment method: ${payMethod}`];

    // Return results
    return {message: "Successfully deleted payment method."};
};


// Export functions
export default {
    createUser,
    createPaymentMethod,
    getUserByID,
    getUserByEmail,
    getPaymentMethodsByID,
    updateUserByID,
    updatePaymentMethodByID,
    deletePaymentMethodByID
};