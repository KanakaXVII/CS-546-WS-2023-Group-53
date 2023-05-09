// Imports
import express from 'express';
import { Router } from 'express';
import * as helpers from '../helpers.js';
import axios from 'axios';
import { userData } from '../data/index.js';
import bcrypt from 'bcrypt';
import xss from 'xss';

// Create the router
const router = Router();

// Create routes
router.route('/').get(async (req, res) => {
    // Try to render the page
    try {
        res.render('login', {
            title: 'Login',
            hasErrors: false,
            errors: []
        });
        
        // return;
    } catch (e) {
        // Format and send error response
        const errorAttrs = helpers.formatError(e);
        return res.status(errorAttrs.status).json({error: errorAttrs.message});
    }
});

router.route('/processLogin').post(async (req, res) => {
    // Get form data
    const formData = req.body;

    // Init errors
    let errors = [];

    // Validate the inputs
    try {
        helpers.validateString('Login Email', formData.emailInput);
    } catch (e) {
        errors.push(e);
    }

    try {
        helpers.validateString('Login Password', formData.passwordInput);
    } catch (e) {
        errors.push(e);
    }

    // Reformat the form inputs
    const userLoginInputs = {
        email: req.body = xss(formData.emailInput),
        password: req.body = xss(formData.passwordInput)
    };

    // Search for a user with the matching email
    const user = await userData.getUserByEmail(userLoginInputs.email);

    // Validate the response
    if (!user || user === null) {
        try {
            res.render('login', {
                title: 'Login',
                hasErrors: true,
                errors: ['User not found']
            });
            return;
        } catch (e) {
            // Format and send error response
            errors.push(e);
        }
    }

    // Validate the password
    const passwordCheck = await bcrypt.compare(userLoginInputs.password, user.password);

    // Check if errors were collected
    if (errors.length > 0) {
        res.render('login', {
            title: 'Login',
            hasErrors: true,
            errors: errors
        });
    }
    
    // Process validation
    if (passwordCheck) {
        // Store the email and ID for the session
        const moddedUserProfile = user;
        delete user['password'];

        req.session.profile = moddedUserProfile;

        // Render the dashboard
        res.redirect('/dashboard');
    } else {
        try {
            res.render('login', {
                title: 'Login',
                hasErrors: true,
                errors: ['Password is Incorrect']
            });
        } catch (e) {
            // Format and send error response
            const errorAttrs = helpers.formatError(e);
            return res.status(errorAttrs.status).json({error: errorAttrs.message});
        }
    }
});

// Export the router
export default router;