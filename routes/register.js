// Imports
import exporess from 'express';
import { Router } from 'express';
import * as helpers from '../helpers.js';
import axios from 'axios';

// Create the router
const router = Router();

// Create routes
router.route('/').get(async (req, res) => {
    // Try to render the page
    try {
        res.render('../views/register', {
            title: 'Sign Up',
            errors: []
        });
    } catch (e) {
        // Format and send error response
        const errorAttrs = helpers.formatError(e);
        return res.status(errorAttrs.status).json({error: errorAttrs.message});
    }
});

// Export the router
export default router;