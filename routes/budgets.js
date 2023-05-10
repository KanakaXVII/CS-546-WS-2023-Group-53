// Imports
import { Router } from 'express';
import { budgetData, userData } from '../data/index.js';
import * as helpers from '../helpers.js';
import xss from 'xss';

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
    let month = xss(splitDate[1]);
    let year = xss(splitDate[0]);
    let amount = xss(req.body.budgetedAmountInput);
    let category = xss(req.body.budgetNameInput);

    // Validate the inputs
    try {
      helpers.validateString('Budget Month', month);
    } catch (e) {
      res.redirect(`/budgets?hasErrors=true&errorMessage=${e}`);
      return;
    }

    try {
      // Make sure the year is within legal bounds
      const currentYear = new Date().getFullYear();
      helpers.validateYear('Budget Year', Number(year), currentYear, currentYear+100);
    } catch (e) {
      res.redirect(`/budgets?hasErrors=true&errorMessage=${e}`);
      return;
    }

    try {
      helpers.validateNumber('Budget Amount', Number(amount));
    } catch (e) {
      res.redirect(`/budgets?hasErrors=true&errorMessage=${e}`);
      return;
    }

    try {
      helpers.validateString('Budget Name', category);
    } catch (e) {
      res.redirect(`/budgets?hasErrors=true&errorMessage=${e}`);
      return;
    }

    // Convert numerical inputs to numerical types
    month = Number(month);
    year = Number(year);
    amount = Number(amount);

    // Get the month name
    const monthVals = await helpers.convertMonth(month);

    // Add the new budget
    try {
      const newBudget = await budgetData.createBudget(
        req.session.profile._id.toString(),
        monthVals.monthStr,
        year,
        category,
        amount
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