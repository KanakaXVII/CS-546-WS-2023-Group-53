// Imports
import { Router } from 'express';
import { userData, paycheckData, transactionData, budgetData } from '../data/index.js';
import * as helpers from '../helpers.js';
import xss from 'xss';

// Create a router
const router = Router();

// Build Routes
router
    .route('/')
    .post(async (req, res) => {
        // Get the request body
        const userInfo = req.body;

        // Validate params were passed
        if (!userInfo || Object.keys(userInfo).length === 0) {
            return res.status(400).json({error: 'There are no fields in the request body.'});
        }

        // Sanitize inputs
        for (const key in userInfo) {
            userInfo[key] = xss(userInfo[key]);
        }

        // Validate the inputs
        try {
            helpers.validateUserInfo(userInfo);
        } catch (e){
            // Format and send error response
            const errorAttrs = helpers.formatError(e);
            return res.status(errorAttrs.status).json({error: errorAttrs.message});
        }

        // Add new user to DB
        try {
            // Call the data function
            const newUser = await userData.createUser(
                userInfo.firstName,
                userInfo.lastName,
                userInfo.email,
                userInfo.password
            );
            
            // Send the results back
            res.json(newUser);
        } catch (e) {
            // Format and send error response
            const errorAttrs = helpers.formatError(e);
            return res.status(errorAttrs.status).json({error: errorAttrs.message});
        }
    });

router
    .route('/:id')
    .post(async (req, res) => {
        // Get the form data
        const formData = req.body;

        // Determine if user has any pay methods
        let hasPayMethods = undefined;
        if (req.session.profile.paymentMethods.length === 0) {
            hasPayMethods = false;
        } else {
            hasPayMethods = true;
        }

        // Init new payload for DB
        const profileChanges = {};

        // Init errors
        let errors = [];

        // Validate entries and add them to DB payload
        for (const [k, v] of Object.entries(formData)) {
            if (v !== '') {
                // Validate the input
                try{
                    await helpers.validateString(k, v);
                    profileChanges[k] = v;
                } catch (e) {
                    errors.push(e);
                }
            }
        }

        // Re-render page if there are errors
        if (errors.length > 0) {
            res.render('profile', {
                title: 'Profile',
                profile: req.session.profile,
                errors: errors,
                hasErrors: true,
                changeSuccess: false,
                hasPayMethods: hasPayMethods
            });

            return;
        }

        // Update the user info in the DB
        try {
            const updatedUser = await userData.updateUserByID(req.session.profile._id, profileChanges);
        } catch (e) {
            res.render('profile', {
                title: 'Profile',
                profile: req.session.profile,
                errors: errors,
                hasErrors: true,
                changeSuccess: true,
                hasPayMethods: hasPayMethods
            });

            return;
        }

        // Render the profile page with new updates and a success message
        res.redirect('/profile');
    })
        
    .delete(async (req, res) => {
        // Get the ID param
        const userID = req.params.id;        

        // Validate the input
        try {
            // Validate object ID parameter
            helpers.validateObjectId('User ID', userID);
        } catch (e) {
            // Format and send error response
            const errorAttrs = helpers.formatError(e);
            return res.status(errorAttrs.status).json({error: errorAttrs.message});
        }

        // Init storage for errors
        let errors = [];

        // Delete all records associated with the user
        let deleteOperations = {};
        try {
            deleteOperations['paychecks'] = await paycheckData.deleteAllUserPaychecks(userID);
        } catch (e) {
            errors.push(e);
        }

        try {
            deleteOperations['transactions'] = await transactionData.deleteAllUserTransactions(userID);
        } catch (e) {
            errors.push(e);
        }

        try {
            deleteOperations['budgets'] = await budgetData.deleteAllUserBudgets(userID);
        } catch (e) {
            errors.push(e);
        }

        // Delete the user
        try {
            deleteOperations['user'] = await userData.deleteUserByID(userID);
        } catch (e) {
            errors.push(e);
        }

        // Check if there are any errors
        if (errors.length > 0) {
            res.render('profile', {
                title: 'Profile',
                profile: req.session.profile,
                errors: errors,
                hasErrors: true
            });

            return;
        }

        // Remove the profile from session
        req.session.profile = undefined;

        // Redirect to the login page
        res.redirect('/');
    });

router
    .route('/:id/payment')
    .post(async (req, res) => {
        // Get the request body and ID param
        const payMethodName = xss(req.body.methodNameInput);
        const id = req.params.id;

        // Init errors
        let errors = [];

        // Validate the inputs
        try {
            // Validate ID input
            helpers.validateObjectId('User ID', id);
        } catch (e) {
            // Add error to list
            errors.push(e);
        }

        // Add the payment method
        try {
            // Call the data function
            const modifiedUser = await userData.createPaymentMethod(id, payMethodName);
        } catch (e) {
            // Add error to list
            errors.push(e);
        }

        // Check for payment methods
        const payMethods = await userData.getPaymentMethodsByID(req.session.profile._id);
        let hasPayMethods = false;
        if (payMethods.paymentMethods.length > 0) {
            hasPayMethods = true
        }

        // Check for errors
        if (errors.length > 0) {
            res.render('profile', {
                title: 'Profile',
                profile: req.session.profile,
                hasErrors: true,
                errorList: errors,
                changeSuccess: false,
                hasPayMethods: hasPayMethods
            });

            return;
        }

        // Redirect to the profile page
        res.redirect('/profile'); 
        return;
    })
    .get(async (req, res) => {
        // Get the ID param
        const id = req.params.id;

        // Validate the ID param
        try {
            helpers.validateObjectId('User ID', id);
        } catch (e) {
            // Format and send error response
            const errorAttrs = helpers.formatError(e);
            return res.status(errorAttrs.status).json({error: errorAttrs.message});
        }

        // Get the payment methods
        try {
            // Call the data function
            const userPayMethods = await userData.getPaymentMethodsByID(id);

            // Send results back
            res.json(userPayMethods);
        } catch (e) {
            // Format and send error response
            const errorAttrs = helpers.formatError(e);
            return res.status(errorAttrs.status).json({error: errorAttrs.message});
        }
    })
    .patch(async (req, res) => {
        // Get the request body and the user ID
        const payId = req.body.id;
        const newName = req.body.newName;
        const userId = req.params.id;

        // Validate the inputs
        try {
            // Validate the ID values
            helpers.validateObjectId('Pay Method ID', payId);
            helpers.validateObjectId('User ID', userId);

            // Validate the new name
            helpers.validateString('New Pay Method Name', newName);
        } catch (e) {
            // Format and send error response
            const errorAttrs = helpers.formatError(e);
            return res.status(errorAttrs.status).json({error: errorAttrs.message});
        }

        // Update the method
        try {
            // Call the data function
            const response = await userData.updatePaymentMethodByID(userId, payId, newName);

            // Return the response
            res.json(response);
        } catch (e) {
            // Format and send error response
            const errorAttrs = helpers.formatError(e);
            return res.status(errorAttrs.status).json({error: errorAttrs.message});
        }
    })
    .delete(async (req, res) => {
        // Get the request body and user ID
        const payId = req.body._id;
        const id = req.params.id;

        console.log(req.params);
        console.log(req.body);

        // Validate inputs
        try {
            // Validate payMethod
            helpers.validateObjectId('Pay Method ID', payId);

            // Validate Object ID
            helpers.validateObjectId('User ID', id);
        } catch (e) {
            // Format and send error response
            const errorAttrs = helpers.formatError(e);
            return res.status(errorAttrs.status).json({error: errorAttrs.message});
        }

        // Delete the method
        try {
            // Call the data function
            const response = await userData.deletePaymentMethodByID(id, payId);

            // Return the response
            res.json(response);
        } catch (e) {
            // Format and send error response
            const errorAttrs = helpers.formatError(e);
            return res.status(errorAttrs.status).json({error: errorAttrs.message});
        }
    });

router
    .route('/:id/payment/:payId')
    .delete(async (req, res) => {
        // Get te request parameters
        const userId = req.params.id;
        const payMethodId = req.params.payId;

        console.log(userId);
        console.log(payMethodId);
    });

// Export the router
export default router;