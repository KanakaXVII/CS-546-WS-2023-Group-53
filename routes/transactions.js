import { Router, render } from 'express';
import { transactionData } from '../data/index.js';
import * as helpers from '../helpers.js';

const router = Router();

router.get('/add', (req, res) => {
    render(res, 'addTransaction', { title: 'Add Transaction' });
});

router
    .route('/')
    .get(async (req, res) => {
        try {
            // Get transactions for the logged in user
            const transactions = await transactionData.getAllByUserId(req.user._id.toString());

            // Send the results back
            res.json(transactions);
        } catch (e) {
            // Format and send error response
            const errorAttrs = helpers.formatError(e);
            return res.status(errorAttrs.status).json({ error: errorAttrs.message });
        }
    })
    .post(async (req, res) => {
        // Get the request body
        const transactionInfo = req.body;

        // Validate params were passed
        if (!transactionInfo || Object.keys(transactionInfo).length === 0) {
            return res.status(400).json({ error: 'There are no fields in the request body.' });
        }

        // Add new transaction to DB
        try {
            // Call the data function
            const newTransaction = await transactionData.create(
                req.user._id.toString(),
                transactionInfo.date,
                transactionInfo.method,
                transactionInfo.expenseName,
                transactionInfo.amount,
                transactionInfo.category
            );

            // Send the results back
            res.json(newTransaction);
        } catch (e) {
            // Format and send error response
            const errorAttrs = helpers.formatError(e);
            return res.status(errorAttrs.status).json({ error: errorAttrs.message });
        }
    });

router
    .route('/:id')
    .get(async (req, res) => {
        try {
            // Get the transaction with the specified ID
            const transaction = await transactionData.get(req.params.id);

            // Validate that the transaction belongs to the logged in user
            if (transaction.userId !== req.user._id.toString()) {
                throw [403, `Error: Transaction does not belong to logged in user`];
            }

            // Send the results back
            res.json(transaction);
        } catch (e) {
            // Format and send error response
            const errorAttrs = helpers.formatError(e);
            return res.status(errorAttrs.status).json({ error: errorAttrs.message });
        }
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

export default router;
