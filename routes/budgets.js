import { Router, render } from 'express';
import { budgetData, userData } from '../data/index.js';
import * as helpers from '../helpers.js';

const router = Router();

router.get('/add', (req, res) => {
    render(res, 'addBudget', { title: 'Add Budget' });
});

router
  .route('/')
  .post(async (req, res) => {

    const authToken = req.headers.authorization;
    const userId = await helpers.validateAuthToken(authToken);

    const budgetInfo = req.body;


    if (!budgetInfo || Object.keys(budgetInfo).length === 0) {
      return res.status(400).json({ error: 'There are no fields in the request body.' });
    }


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


    const budgetId = req.params.id;


    try {
      const budget = await budgetData.get(budgetId);


      res.json(budget);
    } catch (e) {

      const errorAttrs = helpers.formatError(e);
      return res.status(errorAttrs.status).json({ error: errorAttrs.message });
    }
  })
  .put(async (req, res) => {

    const authToken = req.headers.authorization;
    await helpers.validateAuthToken(authToken);

    const budgetId = req.params.id;

    const budgetInfo = req.body;

    if (!budgetInfo || Object.keys(budgetInfo).length === 0) {
      return res.status(400).json({ error: 'There are no fields in the request body.' });
    }

    try {
      helpers.validateBudgetInfo(budgetInfo);
    } catch (e) {
      const errorAttrs = helpers.formatError(e);
      return res.status(errorAttrs.status).json({ error: errorAttrs.message });
    }

    try {
      const updatedBudget = await budgetData.update(budgetId, budgetInfo);

      res.json(updatedBudget);
    } catch (e) {
      const errorAttrs = helpers.formatError(e);
      return res.status(errorAttrs.status).json({ error: errorAttrs.message });
    }
  })
  .delete(async (req, res) => {
    const authToken = req.headers.authorization;
    await helpers.validateAuthToken(authToken);

        const budgetId = req.params.id;

        try {
          const deletedBudget = await budgetData.remove(budgetId);
 
          res.json(deletedBudget);
        } catch (e) {
          const errorAttrs = helpers.formatError(e);
          return res.status(errorAttrs.status).json({ error: errorAttrs.message });
        }
  });
    
export default router;

