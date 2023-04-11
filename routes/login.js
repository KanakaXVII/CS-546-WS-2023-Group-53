// Imports
import express from 'express';
import { Router } from 'express';
import * as helpers from '../helpers.js';
import axios from 'axios';
import { userData } from '../data/index.js';
import bcrypt from 'bcrypt';

// Create the router
const router = Router();

// Create routes
router.route('/').get(async (req, res) => {
    // Try to render the page
    try {
        res.render('../views/login', {
            title: 'Login',
            hasErrors: false,
            errors: []
        });
    } catch (e) {
        // Format and send error response
        const errorAttrs = helpers.formatError(e);
        return res.status(errorAttrs.status).json({error: errorAttrs.message});
    }
});

router.route('/processLogin').post(async (req, res) => {
    // Get form data
    const formData = req.body;

    // Reformat the form inputs
    const userLoginInputs = {
        email: req.body = formData.emailInput,
        password: req.body = formData.passwordInput
    };

    // Search for a user with the matching email
    const user = await userData.getUserByEmail(userLoginInputs.email);

    // Validate the response
    if (!user) {
        try {
            res.render('../views/login', {
                title: 'Login',
                hasErrors: true,
                errors: ['User not found']
            });
        } catch (e) {
            // Format and send error response
            const errorAttrs = helpers.formatError(e);
            return res.status(errorAttrs.status).json({error: errorAttrs.message});
        }
    }

    // Validate the password
    const passwordCheck = await bcrypt.compare(userLoginInputs.password, user.password);
    
    // Process validation
    if (passwordCheck) {
        try {
            res.render('../views/dashboard', { // Placeholder view
                title: 'Dashboard'
            });
        } catch (e) {
            // Format and send error response
            const errorAttrs = helpers.formatError(e);
            return res.status(errorAttrs.status).json({error: errorAttrs.message});
        }
    } else {
        try {
            res.render('../views/login', {
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