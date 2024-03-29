import { Router } from 'express';
import { userData, transactionData } from '../data/index.js';
import * as helpers from '../helpers.js';

const router = Router();

router
    .route('/')
    .get(async (req, res) => {
        
            // Get transactions for the logged in user
            // const transactions = await transactionData.getAllByUserId(req.user._id.toString());

            const userId = req.session.profile._id;

            // Perform DB operation to get transactions data
            const transactions = await transactionData.getAllByUserId(
                userId
            );

        
            // Determine if there are transactions to render
            let hasTransactions = undefined;

            if (transactions.length === 0) {
                hasTransactions = false;
            } else {
                hasTransactions = true;
            }

            // Determine if there are any query path parameters to render
            let hasErrors = false;
            let errorMessage = undefined;

            if (Object.keys(req.query).length > 0) {
                hasErrors = req.query.hasErrors;
                errorMessage = req.query.errorMessage;
            }

            // Get the user's payment methods
            const paymentMethodresults = await userData.getPaymentMethodsByID(req.session.profile._id);

            // Determine if a user has 

            // Send the results back
            res.render('addTransaction', {
                title: 'Add Transactions',
                hasErrors: hasErrors,
                errorMessage: errorMessage,
                userId: userId,
                hasTransactions: hasTransactions,
                transactions: transactions,
                paymentMethods: paymentMethodresults.paymentMethods
            });
            return;

    })

router
    .route('/:id')
    .post(async (req, res) => {

        // Get the request body
        const transactionInfo = req.body;
        const userId = req.params.id;

        // Init errors
        let errors = [];

        // Validate params were passed
        if (!transactionInfo || Object.keys(transactionInfo).length === 0) {
            errors.push('There are no fields in the request body.');
        }

        // Validate the rest of the inputs
        try {
            helpers.validateDateString('Transaction Date', transactionInfo.dateInput);
        } catch (e) {
            errors.push(e);
        }

        try {
            helpers.validateString('Method Name', transactionInfo.methodInput);
        } catch (e) {
            errors.push(e);
        }

        try {
            helpers.validateString('Expense Name', transactionInfo.expenseNameInput);
        } catch (e) {
            errors.push(e);
        }

        try {
            helpers.validateNumber('Transaction Amount', Number(transactionInfo.amountInput));
        } catch (e) {
            errors.push(e);
        }

        try {
            helpers.validateString('Transaction Category', transactionInfo.categoryInput);
        } catch (e) {
            errors.push(e);
        }

        // Check if errors were collected
        if (errors.length > 0) {
            res.render('addTransaction', {
                hasErrors: true,
                errors: errors
            });
        }

        // Add new transaction to DB
        const newTransaction = await transactionData.create(
            userId,
            transactionInfo.dateInput,
            transactionInfo.methodInput,
            transactionInfo.expenseNameInput,
            transactionInfo.amountInput,
            transactionInfo.categoryInput
        );

        res.redirect('/transactions');
        return;
    })
    .put(async (req, res) => {
        // Get the request body
        const transactionInfo = req.body;

        // Validate params were passed
        if (!transactionInfo || Object.keys(transactionInfo).length === 0) {
            return res.status(400).json({ error: 'There are no fields in the request body.' });
        }

        try {
            // Get the transaction with the specified ID
            const transaction = await transactionData.get(req.params.id);

            // Validate that the transaction belongs to the logged in user
            if (transaction.userId !== req.user._id.toString()) {
                throw [403, `Error: Transaction does not belong to logged in user`];
            }

            // Update the transaction in the database
            const updatedTransaction = await transactionData.update(
                req.params.id,
                transactionInfo.date,
                transactionInfo.method,
                transactionInfo.expenseName,
                transactionInfo.amount,
                transactionInfo.category
            );

            // Send the results back
            res.json(updatedTransaction);
        } catch (e) {
            // Format and send error response
            const errorAttrs = helpers.formatError(e);
            return res.status(errorAttrs.status).json({ error: errorAttrs.message });
        }
    })
    .delete(async (req, res) => {
        try {
            // Get the transaction with the specified ID
            const transaction = await transactionData.get(req.params.id);

            // Validate that the transaction belongs to the logged in user
            if (transaction.userId !== req.user._id.toString()) {
                throw [403, `Error: Transaction does not belong to logged in user`];
            }

            // Delete the transaction from the database
            await transactionData.remove(req.params.id);

            // Send the results back
            res.json({ success: true });
        } catch (e) {
            // Format and send error response
            const errorAttrs = helpers.formatError(e);
            return res.status(errorAttrs.status).json({ error: errorAttrs.message });
        }
    });

    router.route('/transaction/:id').post(async (req, res) => {

        if(req.query.method === 'DELETE'){
       
        const transactionId = req.params.id;

        // Delete the transaction from the database
        try{
            const deletedTransaction = await transactionData.deleteTransactionByID(transactionId);
        }catch(e){
            res.redirect(`/transactions?hasErrors=true&errorMessage=${e}`);
            return
        }

        res.redirect('/transactions');
        return
    }
    else{
        return res.status(400).json({ error: 'There are no fields in the request body.' });
    }
    });


export default router;
