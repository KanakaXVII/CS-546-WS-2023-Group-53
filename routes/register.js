// Imports
import express from 'express';
import { Router } from 'express';
import * as helpers from '../helpers.js';
import axios from 'axios';
import { userData } from '../data/index.js';
import xss from 'xss';

// Create the router
const router = Router();

// Create routes
router.route('/').get(async (req, res) => {
    // Define the expected inputs
    const inputs = {
        email: undefined,
        firstName: undefined,
        lastName: undefined,
        firstPassword: undefined,
        secondPassword: undefined
    }
    // Try to render the page
    try {
        res.render('register', {
            title: 'Sign Up',
            hasErrors: false,
            inputs: inputs,
            errors: []
        });
    } catch (e) {
        // Format and send error response
        const errorAttrs = helpers.formatError(e);
        return res.status(errorAttrs.status).json({error: errorAttrs.message});
    }
});

router.route('/processRegister').post(async (req, res) => {
    // Get the form data
    const formData = req.body;

    console.log('test');

    // Reformat and sanitize the form inputs 
    const newUserInputs = {
        firstName: xss(formData.firstNameInput),
        lastName: xss(formData.lastNameInput),
        email: xss(formData.emailInput),
        firstPassword: xss(formData.firstPasswordInput),
        secondPassword: xss(formData.secondPasswordInput)
    };
    
    // Validate the form inputs
    const errors = helpers.validateUserInfo(newUserInputs);

    // See if there are any errorss
    if (errors.length > 0) {
        try {
            res.render('register', {
                title: 'Sign Up',
                hasErrors: true,
                inputs: newUserInputs,
                errors: errors
            });

            return;
        } catch (e) {
            // Format and send error response
            const errorAttrs = helpers.formatError(e);
            return res.status(errorAttrs.status).json({error: errorAttrs.message});
        }
    }

    // Create the new user
    try {
        const newUser = await userData.createUser(
            newUserInputs.firstName, 
            newUserInputs.lastName,
            newUserInputs.email,
            newUserInputs.firstPassword
        );
    } catch (e) {
        // Format and send error response
        res.render('register', {
            title: 'Sign Up',
            hasErrors: true,
            inputs: newUserInputs,
            errors: [e[1]]
        });

        return;
    }

    // Redirect to the login screen
    try {
        res.redirect('/login');
    } catch (e) {
        // Format and send error response
        const errorAttrs = helpers.formatError(e);
        return res.status(errorAttrs.status).json({error: errorAttrs.message});
    }
});

// Export the router
export default router;