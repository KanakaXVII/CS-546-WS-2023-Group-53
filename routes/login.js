// Imports
import express from 'express';
import { Router } from 'express';
import * as helpers from '../helpers.js';
import axios from 'axios';

// Create the router
const router = Router();

// Create routes
router.route('/').get(async (req, res) => {
    // Try to render the page
    try {
        res.render('../views/login', {
            title: 'Login',
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
    // This needs the remaining user operations created in another branch...
})

// Export the router
export default router;