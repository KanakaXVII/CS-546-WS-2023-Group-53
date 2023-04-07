// Imports
import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as helpers from '../helpers.js';

/* 
DB operations involving users will be defined and completed here. This incldues:
- Create New User
- Edit User Information
- Add Payment Method
- Delete User
- Get User
*/

// Create New User
const create = async (
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
    const newInsertedUser = await get(newUserInsertInformation.insertedId.toString());

    // Return the results
    return newInsertedUser;
};

// Get User By ID
const get = async (id) => {
    // Get the DB collection
    const userCollection = await users();

    // Convert the ID to an object ID
    const obj_id = new ObjectId(id);

    // Search for the target record
    const user = await userCollection.findOne(
        {_id: obj_id},
        {projection: {password: 0, paymentMethods: 0}}
    );

    // Validate the response
    if (!user) throw [404, `Error: User not found`];

    // Return results
    return user;
};


// Export functions
export default {
    create, 
    get
};