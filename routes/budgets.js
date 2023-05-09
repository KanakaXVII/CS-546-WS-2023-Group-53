// Imports
import { Router } from 'express';
import { budgetData, userData } from '../data/index.js';
import * as helpers from '../helpers.js';

// Create a router
const router = Router();

// Build routes
router
  .route('/')
  .get(async (req, res) => {
    // Get the users ID from session
    const userId = req.session.profile._id;

    // Perform DB operation to get budget data
    const budgetRecords = await budgetData.getBudgetsByUserId(userId);

    // Determine if there are budgets to render
    let hasBudgets = false;

    if (budgetRecords.length > 0) {
      hasBudgets = true;
    }

    // Check fir query path parameters
    let hasErrors = false;
    let errorMessage = undefined;
    if (Object.keys(req.query).length > 0) {
      hasErrors = req.query.hasErrors;
      errorMessage = req.query.errorMessage;
    }

    // Render the budgets page
    res.render('budgets', {
      title: 'Budgets',
      hasBudgets: hasBudgets,
      budgets: budgetRecords,
      hasErrors: hasErrors,
      errorMessage: errorMessage
    });
  })

  .post(async (req, res) => {
    // Split inputs
    const splitDate = req.body.monthYearInput.split('-');
    let month = splitDate[1];
    let year = splitDate[0];
    let amount = req.body.budgetedAmountInput;
    let name = req.body.budgetNameInput;

    // Convert numerical inputs to numerical types
    month = Number(month);
    year = Number(year);
    amount = Number(amount);

    // Get the month name
    const monthVals = await helpers.convertMonth(month);

    // Determine if it is recurring or not
    let recurring = false;
    if (req.body.recurringInput) {
      recurring = true;
    }

    // Add the new budget
    try {
      const newBudget = await budgetData.createBudget(
        req.session.profile._id.toString(),
        monthVals.monthStr,
        year,
        name,
        amount,
        recurring
      );
      } catch (e) {
        res.redirect(`/budgets?hasErrors=true&errorMessage=${e}`);
        return;
      }

    // Redirect back to the budgets page
    res.redirect('/budgets');
    return;
  });

router
  .route('/budget/:id')
  .delete(async (req, res) => {
    // Get the request body params
    const budgetID = req.params.id;

    // Perform DB operation to delete it
    try {
      const deletedBudget = await budgetData.deleteBudgetByID(budgetID);
    } catch (e) {
      res.redirect(`/budgets?hasErrors=true&errorMessage=${e}`);
      return;
    }

    // Redirect back to the budgets page
    res.redirect('/budgets');
    return;
  });

// Export the router
export default router;