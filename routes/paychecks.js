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
        // Get the users ID
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

        // Determine if there are any query path parameters to render
        let hasErrors = false;
        let errorMessage = undefined;
        if (Object.keys(req.query).length > 0) {
            hasErrors = req.query.hasErrors;
            errorMessage = req.query.errorMessage;
        }
                
        // Render paycheck data
        res.render('paychecks', {
            title: 'Paychecks',
            hasErrors: hasErrors,
            errorMessage: errorMessage,
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

        // Perform DB operation
        const newPaycheck = await paycheckData.createPaycheck(
            userId,
            paycheckInfo.checkDateInput,
            paycheckInfo.checkAmountInput,
            paycheckInfo.checkNotesInput
        );

        res.redirect('/paychecks');
    })

router
    .route('/paycheck/:id')
    .delete(async (req, res) => {
        // Get the request body params
        const paycheckID = req.params.id;
        
        // Perform DB operation to delete it
        try {
            const deletedPaycheck = await paycheckData.deletePaycheckByID(paycheckID);
        } catch (e) {
            res.redirect(`/paychecks?hasErrors=true&errorMessage=${e}`);
            return;
        }

        // Redirect back to the paychecks page
        res.redirect('/paychecks');
        return;
    });
    
router
    .route('/edit/:id')
    .put(async (req, res) => {
        // Get the request body and path params
        const paycheckInfo = req.body;
        const paycheckId = req.params.id;

        // Perform DB operation
        const updatedPaycheck = await paycheckData.updatePaycheck(
            paycheckId,
            paycheckInfo.checkDateInput,
            paycheckInfo.checkAmountInput,
            paycheckInfo.checkNotesInput
        );

        res.json(updatedPaycheck);
    });

router
    .route('/delete/:id')
    .delete(async (req, res) => {
        // Get the path params
        const paycheckId = req.params.id;

        // Perform DB operation
        const deletedPaycheck = await paycheckData.deletePaycheck(paycheckId);

        res.json(deletedPaycheck);
    });


// Export the router
export default router;
