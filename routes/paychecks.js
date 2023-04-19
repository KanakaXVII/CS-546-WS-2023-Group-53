// Imports
import { Router } from 'express';
import { paycheckData } from '../data/index.js';
import * as helpers from '../helpers.js';

// Create a router
const router = Router();

// Build routes
router
    .route('/:id')
    .post(async (req, res) => {
        // Get the request body and path params
        const paycheckInfo = req.body;
        const userId = req.params.id;

        // Validate that params were passed
        
        // Validate inputs

        // Perform DB operation
        const newPaycheck = await paycheckData.createPaycheck(
            userId,
            paycheckInfo.date,
            paycheckInfo.amount,
            paycheckInfo.notes
        );

        res.json(newPaycheck);
    });

// Export the router
export default router;