// Imports
import { budgets } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as transactionsData from './transactions.js';

/*
DB operations involving budgets will be defined and completed here. This includes:
- Create Budget
- Edit Budget
- Delete Budget
- Get Budget
*/

// Create Budget
const create = async (userId, month, year, budgets) => {
  // Create a new object
  const budgetInfo = {
    userId: ObjectId(userId),
    month: month,
    year: year,
    budgets: budgets,
    totalSpend: 0,
    totalBudget: budgets.reduce((total, budget) => total + budget.budgetedAmount, 0),
  };

  // Write to DB
  const budgetCollection = await budgets();
  const result = await budgetCollection.insertOne(budgetInfo);

  if (result.insertedCount === 0) {
    throw 'Could not create budget';
  }

  return await get(result.insertedId);
};

// Get Budget by ID
const get = async (id) => {
  const budgetCollection = await budgets();

  const obj_id = new ObjectId(id);
  const budget = await budgetCollection.findOne({ _id: obj_id });

  if (!budget) {
    throw 'Budget not found';
  }

  // get transactions for user for the month and year
  const transactions = await getTransactionsForUser(budget.userId, budget.month, budget.year);
  const updatedBudget = {
    ...budget,
    totalSpend: transactions.reduce((total, transaction) => total + transaction.amount, 0),
  };

  return updatedBudget;
};

// Edit Budget
const update = async (id, budgetUpdates) => {
  const budgetCollection = await budgets();
  const obj_id = new ObjectId(id);
  const budget = await budgetCollection.findOne({ _id: obj_id });

  if (!budget) {
    throw 'Budget not found';
  }

  const updatedBudget = {
    ...budget,
    ...budgetUpdates,
  };

  // get transactions for user for the month and year
  const transactions = await getTransactionsForUser(updatedBudget.userId, updatedBudget.month, updatedBudget.year);
  updatedBudget.totalSpend = transactions.reduce((total, transaction) => total + transaction.amount, 0);
  updatedBudget.totalBudget = updatedBudget.budgets.reduce((total, budget) => total + budget.budgetedAmount, 0);

  const result = await budgetCollection.replaceOne({ _id: obj_id }, updatedBudget);
  if (result.modifiedCount === 0) {
    throw 'Could not update budget';
  }

  return await get(id);
};

// Delete Budget
const remove = async (id) => {
  const budgetCollection = await budgets();
  const obj_id = new ObjectId(id);

  const result = await budgetCollection.deleteOne({ _id: obj_id });
  if (result.deletedCount === 0) {
    throw 'Could not delete budget';
  }

  return true;
};

// Export functions
export default {
  create,
  get,
  update,
  remove,
};
