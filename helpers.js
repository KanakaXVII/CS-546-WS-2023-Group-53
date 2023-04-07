// Imports
import { ObjectId } from 'mongodb';
import { users } from './config/mongoCollections.js';
import bcrypt from 'bcrypt';

/* ----- String Validation ----- */
const validateString = (varName, varVal) => {
    // Make sure value exists
    if (!varVal) throw `Error: No value provided for ${varName}`;

    // Make sure value is a non-empty string
    if (typeof varVal !== 'string') throw `Error: ${varName} must be a string`;
    if (varVal.trim().length === 0) throw `Error: ${varName} must be a non-empty string`;
}

const validateDateString = (varName, varVal) => {
    // Make sure value is a valid string
    validateString(varName, varVal);

    // Make sure value is a valid date string
    if (isNaN(Date.parse(varVal))) throw `Error: [${varVal}] is not a valid date for ${varName}`;

    // Make sure year is valid
    let varValSplit = varVal.split('/');
    let releaseYear = parseInt(varValSplit[2]);
    validateYear('Release Year', releaseYear, 1900, 2024);
}

const validateWebsite = (varName, varVal) => {
    // Make sure value is a valid string
    validateString(varName, varVal);

    // Check for legal start and end tags
    if (!varVal.startsWith('http://www.')) throw `Error: ${varName} must start with http://www.`;
    if (!varVal.endsWith('.com')) throw `Error: ${varName} must end with .com`;

    // Check to make sure the domain name is greater than 5 characters
    let split_str = varVal.split('.');
    let domain_space = split_str.slice(1, split_str.length - 1);
    domain_space = domain_space.join('.');

    if (domain_space.length < 5) throw `Error: ${varName} domain must be greater than 5 characters. ${domain_space} is not valid.`;
}

const validateEmail = (varName, varVal) => {
    // Make sure value is a valid string
    validateString(varName, varVal);

    // Check for legal a valid email domain format
    if (!varVal.includes('@')) throw `Error: ${varName} does not have a domain (@example.com)`;
}



/* ----- Numerical Validation ----- */
const validateNumber = (varName, varVal) => {
    // Make sure value exists
    if (!varVal) throw `Error: No value provided for ${varName}`;

    // Make sure value is a number
    if (typeof varVal !== 'number') throw `Error: ${varName} must be a number`;
}

const validateYear = (varName, varVal, lowerBound, upperBound) => {
    // Make sure all values are valid numbers
    validateNumber(varName, varVal);
    validateNumber('Lower Year Limit', lowerBound);
    validateNumber('Upper Year Limit', upperBound);

    // Make sure year is in legal bounds
    if (varVal < lowerBound || varVal > upperBound) throw `Error: ${varName} must be between ${lowerBound} and ${upperBound}`;
}

const validateRating = (varName, varVal, decPlaces=1) => {
    // Make sure value is a valid number
    validateNumber(varName, varVal);

    // Make sure the value in allowed bounds
    if (varVal > 5 || varVal < 1) throw `Error: ${varName} must be between 1 and 5`;

    // Make sure that value doesn't exceed allowed decimal places
    let varValString = varVal.toString();
    if (varValString.includes('.')) {
        let varValStringParts = varValString.split('.');
        if (varValStringParts[1].length > decPlaces) throw `Error: ${varName} must be either an integer or a float with one decimal place`;
    }
}



/* ----- Object ID Validation ----- */
const validateObjectId = (varName, varVal) => {
    // Make sure value is a valid string
    validateString(varName, varVal);

    // Make sure ID is valid according to MongoDB
    if (!ObjectId.isValid(varVal)) throw `Error: ${varVal} is not a proper ID value for ${varName}`;
}



/* ----- Array Validation ----- */
const validateArray = (varName, varVal, subType=['string'], minimumVals=0) => {
    // Make sure value exists
    if (!varVal) throw `Error: No value provided for ${varName}`;

    // Make sure value is an array
    if (!Array.isArray(varVal)) throw `Error: ${varName} must be an array`;

    // Make sure the array is not empty
    if (varVal.length === 0) throw `Error: ${varName} must not be empty`;

    // Make sure the array has the minimum required values
    if (varVal.length < minimumVals) throw `Error: ${varName} must have at least ${minimumVals} values`;

    // Check the subtype of the array
    varVal.forEach((val, ind) => {
        // Make sure each element is a legal type
        if (!subType.includes(typeof val)) throw `Error: The value ${val} in ${varName} is not an allowed type`;

        // Make sure each type is a valid value based on type
        if (typeof val === 'string') {
            validateString(`${varName} element ${ind}`, val);
        } else if (typeof val === 'number') {
            validateNumber(`${varName} element ${ind}`, val);
        } else if (typeof val === 'array') {
            validateArray(`${varName} element ${ind}`, val);
        }
    });
}



/* ----- Multi-Input Validations ----- */
const validateUserInfo = (userInfo) => {
    // Create an object for value validation
    const newUserInputs = {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        password: userInfo.password
    };

    // Create some lists for validation by type
    const strInputs = ['firstName', 'lastName', 'password'];

    // Iterate to validate
    for (const [k, v] of Object.entries(newUserInputs)) {
        if (strInputs.includes(k)) {
            // Validate strings
            try {
                validateString(k, v);
            } catch (e) {
                throw [400, e];
            }
        }
    }

    // Validate the email parameter
    try {
        validateEmail('User Email', newUserInputs.email);
    } catch (e) {
        throw [400, e];
    }
};



/* ----- Formatting Helpers ----- */
const formatError = (e) => {
    let errorAttrs = {};
    errorAttrs['status'] = e[0] ? e[0] : 500;
    errorAttrs['message'] = e[1] ? e[1] : 'Internal Server Error';

    return errorAttrs;
};

const saltAndHashPassword = async (password) => {
    // Generate a salt with multile rounds
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password with the salt
    const hash = await bcrypt.hash(password, salt);

    // Return the salty hashed password
    return hash;
};


/* ----- DB Validation Helpers ----- */
const validateEmailDuplicative = async (email) => {
    // Get the collection
    const userCollection = await users();

    // Make sure there are no users with this email already
    const user = await userCollection.findOne({email: email});

    // Validate the results
    if (user !== null) throw `Error: ${email} already has an account`;
};

// Export all functions
export {
    validateString, 
    validateNumber,
    validateYear, 
    validateObjectId, 
    validateArray, 
    validateWebsite,
    validateDateString,
    validateUserInfo,
    validateEmailDuplicative,
    saltAndHashPassword,
    formatError
};