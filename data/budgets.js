// Imports
import { budgets } from '../config/mongoCollections.js';
import { userData } from '../data/index.js';
import { ObjectId } from 'mongodb';
import transactionData from './transactions.js';

/*
  Get Functions:
  - Get Budget By ID
  - Get All Budgets by User ID
*/

// Get budget by ID
const getBudgetByID = async (budgetId) => {
  // Mount the budgets collection
  const budgetCollection = await budgets();

  // Search for a record with the budget ID
  const budget = await budgetCollection.findOne({_id: new ObjectId(budgetId)});

  // Validate the response
  if (!budget) throw 'Budget not found';

  // Return the results
  return budget;
};

// Get all budgets by User ID
const getBudgetsByUserId = async (userId) => {
  // Validate that the user exists
  let user = undefined;

  try {
    user = await userData.getUserByID(userId);
  } catch (e) {
    throw [500, e];
  }

  if (!user || user === undefined) {
    throw [404, 'User not found'];
  }

  // Mount the budgets collection
  const budgetCollection = await budgets();

  // Search for records with the user ID
  const userBudgets = await budgetCollection.find({'userId': new ObjectId(userId)}).toArray();

  // Return response
  return userBudgets;
};

/*
  Create Functions:
  - Create New Budget
*/

// Create a new budget
const createBudget = async (userId, month, year, name, amount) => {

  // Validate that the user exists
  let user = undefined;

  try {
    user = await userData.getUserByID(userId);
  } catch (e) {
    throw [500, e];
  }

  if (!user || user === undefined) {
    throw [404, 'User not found'];
  }

  // Mount the budgets collection
  const budgetCollection = await budgets();

  // Make sure budget item is not duplicative
  const dupeBudget = await budgetCollection.find({
    userId: new ObjectId(userId),
    month: month,
    year: year,
    category: category
  }).toArray();

  if (dupeBudget.length > 0) {
    throw 'Budget already exists!'
  }

  // Create a budget object
  let budget = {
    userId: new ObjectId(userId),
    month: month,
    year: year,
    name: name,
    amount: amount
  };

  // Add budget to collection
  const newBudget = await budgetCollection.insertOne(budget);

  // Validate insert action
  if (!newBudget.insertedId) throw [500, `Error: Failed to insert paycheck for user ${userId}`];

  // Return the results
  return 'Successfully added budget';
};

/*
  Delete Functions:
  - Delete Budget By ID
  - Delete All Budgets for User
*/

// Delete budget by ID
const deleteBudgetByID = async (budgetId) => {
  // Valdiate that the budget exists
  let budget = undefined;
  budget = await getBudgetByID(budgetId);

  // Mount the budgets collection
  const budgetCollection = await budgets();

  // Delete the budget from DB
  let deleteOperation = undefined;
  try {
    deleteOperation = await budgetCollection.deleteOne({_id: new ObjectId(budgetId)});
  } catch (e) {
    throw e;
  }

  // Validate deletion
  if (deleteOperation.deletedCount === 0) throw 'Could not delete paycheck';

  // Return success message
  return 'Successfully deleted budget';
};

// Delete All User Budgets
const deleteAllUserBudgets = async (userId) => {
  // Mount the budgets collection
  const budgetCollection = await budgets();

  // Delete many by User ID
  let deleteOperation = undefined;
  try {
    deleteOperation = await budgetCollection.deleteMany({userId: new ObjectId(userId)});
  } catch (e) {
    throw e;
  }

  // Validate deletion
  if (deleteOperation.deletedCount === 0) {
    return 'No budgets found for user';
  }

  // Return success message
  return `Successfully deleted ${deleteOperation.deletedCount} budgets`;
};

// Export functions
export default {
  getBudgetByID,
  getBudgetsByUserId,
  createBudget,
  deleteBudgetByID,
  deleteAllUserBudgets
};
