// Imports
import { Router } from 'express';
import { budgetData, userData } from '../data/index.js';
import * as helpers from '../helpers.js';

// Create a router
const router = Router();

// Build Routes
router
  .route('/')
  .post(async (req, res) => {
    // Validate user is authenticated
    const authToken = req.headers.authorization;
    const userId = await helpers.validateAuthToken(authToken);

    // Get the request body
    const budgetInfo = req.body;

    // Validate params were passed
    if (!budgetInfo || Object.keys(budgetInfo).length === 0) {
      return res.status(400).json({ error: 'There are no fields in the request body.' });
    }

    // Validate the inputs
    try {
      helpers.validateBudgetInfo(budgetInfo);
    } catch (e) {
      // Format and send error response
      const errorAttrs = helpers.formatError(e);
      return res.status(errorAttrs.status).json({ error: errorAttrs.message });
    }

    // Create new budget for user
    try {
      // Call the data function
      const newBudget = await budgetData.create(userId, budgetInfo.month, budgetInfo.year, budgetInfo.budgets);

      // Send the results back
      res.json(newBudget);
    } catch (e) {
      // Format and send error response
      const errorAttrs = helpers.formatError(e);
      return res.status(errorAttrs.status).json({ error: errorAttrs.message });
    }
  });

router
  .route('/:id')
  .get(async (req, res) => {
    // Validate user is authenticated
    const authToken = req.headers.authorization;
    await helpers.validateAuthToken(authToken);

    // Get the ID parameter
    const budgetId = req.params.id;

    // Get budget by ID
    try {
      const budget = await budgetData.get(budgetId);

      // Send the results back
      res.json(budget);
    } catch (e) {
      // Format and send error response
      const errorAttrs = helpers.formatError(e);
      return res.status(errorAttrs.status).json({ error: errorAttrs.message });
    }
  })
  .put(async (req, res) => {
    // Validate user is authenticated
    const authToken = req.headers.authorization;
    await helpers.validateAuthToken(authToken);

    // Get the ID parameter
    const budgetId = req.params.id;

    // Get the request body
    const budgetInfo = req.body;

    // Validate params were passed
    if (!budgetInfo || Object.keys(budgetInfo).length === 0) {
      return res.status(400).json({ error: 'There are no fields in the request body.' });
    }

    // Validate the inputs
    try {
      helpers.validateBudgetInfo(budgetInfo);
    } catch (e) {
      // Format and send error response
      const errorAttrs = helpers.formatError(e);
      return res.status(errorAttrs.status).json({ error: errorAttrs.message });
    }

    // Update budget by ID
    try {
      const updatedBudget = await budgetData.update(budgetId, budgetInfo);

      // Send the results back
      res.json(updatedBudget);
    } catch (e) {
      // Format and send error response
      const errorAttrs = helpers.formatError(e);
      return res.status(errorAttrs.status).json({ error: errorAttrs.message });
    }
  })
  .delete(async (req, res) => {
    // Validate user is authenticated
    const authToken = req.headers.authorization;
    await helpers.validateAuthToken(authToken);

        // Get the ID parameter
        const budgetId = req.params.id;

        // Delete budget by ID
        try {
          const deletedBudget = await budgetData.remove(budgetId);
    
          // Send the results back
          res.json(deletedBudget);
        } catch (e) {
          // Format and send error response
          const errorAttrs = helpers.formatError(e);
          return res.status(errorAttrs.status).json({ error: errorAttrs.message });
        }
  });
    
// Export the router
export default router;

