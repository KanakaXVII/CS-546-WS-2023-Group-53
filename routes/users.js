// Imports
import { Router } from 'express';
import { userData } from '../data/index.js';
import * as helpers from '../helpers.js';

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
            const newUser = await userData.create(
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

// Export the router
export default router;