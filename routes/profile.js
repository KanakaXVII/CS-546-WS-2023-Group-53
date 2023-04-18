// Imports
import express from 'express';
import { Router } from 'express';
import * as helpers from '../helpers.js';
import axios from 'axios';
import { userData } from '../data/index.js';

// Create the router
const router = Router();

// Create routes
router.route('/').get(async (req, res) => {
    // Grab the email from user's session variables
    const userEmail = req.session.profile.email;

    // Get the user's profile from DB
    const userProfile = await userData.getUserByEmail(userEmail);

    // Remove password from the profile for security purposes
    delete userProfile['password'];

    // Determine if the user has any payment methods
    let hasPayMethods = undefined;
    if (userProfile.paymentMethods.length === 0) {
        hasPayMethods = false;
    } else {
        hasPayMethods = true;
    }

    // Render the page
    res.render('profile', {
        title: 'Profile',
        profile: userProfile,
        hasErrors: false,
        changeSuccess: false,
        hasPayMethods: hasPayMethods
    });
});

// Export the router
export default router;