// Imports
import * as helpers from '../helpers.js';
import { Router } from 'express';

// Create the router
const router = Router();

// Create routes
router.route('/').get(async (req, res) => {
    // Remove the user's session
    req.session.profile = undefined;

    // Redirect the user to the login page
    res.redirect('/login');
});

export default router;