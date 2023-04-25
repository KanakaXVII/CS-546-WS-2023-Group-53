// Imports
import { Router } from 'express';
import { paycheckData } from '../data/index.js';
import * as helpers from '../helpers.js';

// Create a router
const router = Router();

// Build routes
router
    .route('/')
    .get(async (req, res) => {
        // Get the request path params
        const userId = req.session.profile._id;

        // Perform DB operation to get paycheck data
        const paycheckRecords = await paycheckData.getPaychecksByUserId(
            userId
        );

        // Determine if there are checks to render
        let hasPaychecks = undefined;

        if (paycheckRecords.length === 0) {
            hasPaychecks = false;
        } else {
            hasPaychecks = true;
        }
        
        // Render paycheck data
        res.render('../views/paychecks', {
            title: 'Paychecks',
            hasErrors: false,
            errors: [],
            userId: userId,
            hasPaychecks: hasPaychecks,
            paychecks: paycheckRecords
        });
    });

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
            paycheckInfo.checkDateInput,
            paycheckInfo.checkAmountInput,
            paycheckInfo.checkNotesInput
        );

        res.redirect('/paychecks');
    });

// Export the router
export default router;