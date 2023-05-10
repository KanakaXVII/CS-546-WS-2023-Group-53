// Imports
import { Router } from 'express';
import { paycheckData } from '../data/index.js';
import * as helpers from '../helpers.js';
import xss from 'xss';

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
        // Get the request body and path params and sanitize them
        const paycheckInfo = req.body;
        for (const key in paycheckInfo) {
            paycheckInfo[key] = xss(paycheckInfo[key]);
        }

        // Init errors
        let errors = [];

        // Validate inputs
        try {
            helpers.validateDateString('Paycheck Date', paycheckInfo.checkDateInput);
        } catch (e) {
            errors.push(e);
        }

        try {
            helpers.validateNumber('Paycheck Amount', Number(paycheckInfo.checkAmountInput));
        } catch (e) {
            errors.push(e);
        }

        try {
            helpers.validateString('Paycheck Notes', paycheckInfo.checkNotesInput);
        } catch (e) {
            errors.push(e);
        }

        const userId = xss(req.params.id);

        // Perform DB operation
        const newPaycheck = await paycheckData.createPaycheck(
            userId,
            paycheckInfo.checkDateInput,
            Number(paycheckInfo.checkAmountInput),
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

// Export the router
export default router;