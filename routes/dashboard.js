// Imports
import { Router } from "express";
import { paycheckData, transactionData, budgetData } from "../data/index.js";
import * as helpers from "../helpers.js";

// Create a router
const router = Router();

// Build routes
router.route("/").get(async (req, res) => {
  const userId = req.session.profile._id;
  // paychecks
  // Perform DB operation to get paycheck data
  let paycheckRecords = await paycheckData.getPaychecksByUserId(userId);

  // Determine if there are checks to render
  let hasPaychecks = undefined;

  if (paycheckRecords.length === 0) {
    hasPaychecks = false;
  } else {
    hasPaychecks = true;
  }
  //end-paychecks

  // transactions
  // Perform DB operation to get transaction data
  const transactionRecords = await transactionData.getAllByUserId(userId);

  let hasTransactions = undefined;

  if (transactionRecords.length === 0) {
    hasTransactions = false;
  } else {
    hasTransactions = true;
  }

  // getting categories for transactions
  let transactionCategories = [];
  let transactionPaymentMethods = [];

  if (hasTransactions){
  for (let i = 0; i < transactionRecords.length; i++) {
    transactionCategories.push(transactionRecords[i].category.toLowerCase());
    transactionPaymentMethods.push(
      transactionRecords[i].method.toLowerCase()
    );
  }
  transactionCategories = [...new Set(transactionCategories)];
  transactionPaymentMethods = [...new Set(transactionPaymentMethods)];
}

  //end-getting categories for transactions

  // getting payment methods for transactions
 



  //end-transactions

  // budgets
  // Perform DB operation to get budget data
  const budgetRecords = await budgetData.getBudgetsByUserId(
      userId
  );

  let hasBudgets = undefined;

  if (budgetRecords.length === 0) {
      hasBudgets = false;
  } else {
      hasBudgets = true;
  }

  
  // getting categories for budgets
  let budgetCategories = [];

  if (hasBudgets){
    for (let i = 0; i < budgetRecords.length; i++) {
        budgetCategories.push(budgetRecords[i].category.toLowerCase());
        
    }
    budgetCategories = [...new Set(budgetCategories)];
  }

  // getting years for budgets
  

  //end-budgets
  

  let hasErrors = false;
  let errorMessage = undefined;
  if (Object.keys(req.query).length > 0) {
    hasErrors = req.query.hasErrors;
    errorMessage = req.query.errorMessage;
  }

  let data = {
    // Placeholder view
    title: "Dashboard",
    hasErrors: hasErrors,
    errorMessage: errorMessage,
    userId: userId,
    hasPaychecks: hasPaychecks,
    hasTransactions: hasTransactions,
    hasBudgets: hasBudgets,
    paychecks: paycheckRecords,
    transactions: transactionRecords,
    transactionCategories: transactionCategories,
    transactionPaymentMethods: transactionPaymentMethods,
    budgets: budgetRecords,
    budgetCategories: budgetCategories,
    userProfile: req.session.profile,
  };

  // ---------------------------------------------- paychecks ----------------------------------------------
  // filter paychecks by notes
  if (req.query.paycheckSearchByNotes != undefined) {

    try{
      helpers.validateString("Notes",req.query.paycheckSearchByNotes);
    }catch(err){
      res.render("dashboard", {
        title: "Dashboard",
        hasErrors: true,
        errorMessage: err,
        userId: userId,
      });
      return;
    }
    
    data.paychecks = paycheckRecords.filter((paycheck) => {
      return paycheck.notes
        .toLowerCase()
        .includes(req.query.paycheckSearchByNotes.toLocaleLowerCase());
    });

    if (data.paychecks.length === 0) {
      data.hasPaychecks = false;
      data.hasNoFilteredPaychecks = true;
    } else {
      data.hasPaycheckFilter = true;
    }

    // console.log(paycheckRecords);
  }

  // ------------------------------
  // filter paychecks by date
  if (
    req.query.paychecks_start_date != undefined &&
    req.query.paychecks_end_date != undefined
  ) {

    try{
      helpers.validateString("Start Date",req.query.paychecks_start_date);
      helpers.validateString("End Date",req.query.paychecks_end_date);
    }catch(err){
      res.render("dashboard", {
        title: "Dashboard",
        hasErrors: true,
        errorMessage: err,
        userId: userId,
      });
      return;
    }
    let paychecksStartDate = new Date(req.query.paychecks_start_date);
    let paychecksEndDate = new Date(req.query.paychecks_end_date);

    try{
      if (paychecksStartDate > paychecksEndDate) {
        throw "Start Date cannot be after End Date";
      }
    }catch(err){
      res.render("dashboard", {
        title: "Dashboard",
        hasErrors: true,
        errorMessage: err,
        userId: userId,
      });
      return;
    }


    data.paychecks = paycheckRecords.filter((paycheck) => {
      return (
        paycheck.date >= paychecksStartDate && paycheck.date <= paychecksEndDate
      );
    });

    if (data.paychecks.length === 0) {
      data.hasPaychecks = false;
      data.hasNoFilteredPaychecks = true;
    } else {
      data.hasPaycheckFilter = true;
    }
  }
  //end-filter paychecks by date

  // ------------------------------
  // filter paychecks by amount
  if (
    req.query.paycheckMinAmount != undefined ||
    req.query.paycheckMaxAmount != undefined
  ) {

  

    if (
      req.query.paycheckMinAmount.length > 0 &&
      req.query.paycheckMaxAmount.length > 0
    ) {
      // console.log("both min and max amount");
      try{
       helpers.validateString("Min Amount",req.query.paycheckMinAmount);
        helpers.validateString("Max Amount",req.query.paycheckMaxAmount);
        if(Number(req.query.paycheckMinAmount) > Number(req.query.paycheckMaxAmount)){
          throw "Min Amount cannot be greater than Max Amount";
        }
        if(Number(req.query.paycheckMinAmount) < 0 || Number(req.query.paycheckMaxAmount) < 0){
          throw "Amount cannot be negative";
        }
      }catch(err){
        res.render("dashboard", {
          title: "Dashboard",
          hasErrors: true,
          errorMessage: err,
          userId: userId,
        });
        return;
      }
      data.paychecks = paycheckRecords.filter((paycheck) => {
        return (
          Number(paycheck.amount) >= Number(req.query.paycheckMinAmount) &&
          Number(paycheck.amount) <= Number(req.query.paycheckMaxAmount)
        );
      });
    }

    if (
      req.query.paycheckMinAmount.length > 0 &&
      req.query.paycheckMaxAmount.length === 0
    ) {
      // console.log("min amount only");
      try{
        helpers.validateString("Min Amount",req.query.paycheckMinAmount);
        if (Number(req.query.paycheckMinAmount) < 0) {
          throw "Amount cannot be negative";
        }
      }catch(err){
        res.render("dashboard", {
          title: "Dashboard",
          hasErrors: true,
          errorMessage: err,
          userId: userId,
        });
        return;
      }

      data.paychecks = paycheckRecords.filter((paycheck) => {
        // console.log(
        //   Number(paycheck.amount) >= Number(req.query.paycheckMinAmount)
        // );
        return Number(paycheck.amount) >= Number(req.query.paycheckMinAmount);
      });
    }

    if (
      req.query.paycheckMinAmount.length === 0 &&
      req.query.paycheckMaxAmount.length > 0
    ) {
      // console.log("max amount only");
      try{
        helpers.validateString("Max Amount",req.query.paycheckMaxAmount);
        if (Number(req.query.paycheckMaxAmount) < 0) {
          throw "Amount cannot be negative";
        }
      }catch(err){
        res.render("dashboard", {
          title: "Dashboard",
          hasErrors: true,
          errorMessage: err,
          userId: userId,
        });
        return;
      }

      data.paychecks = paycheckRecords.filter((paycheck) => {
        return Number(paycheck.amount) <= Number(req.query.paycheckMaxAmount);
      });
    }

    if (data.paychecks.length === 0) {
      data.hasPaychecks = false;
      data.hasNoFilteredPaychecks = true;
    } else {
      data.hasPaycheckFilter = true;
    }
  }
  //end-filter paychecks by amount

  // ---------------------------------------------- transactions ----------------------------------------------

  // filter transactions by category
  if (req.query.transactionsCategory != undefined) {
    try{
      helpers.validateString("Category",req.query.transactionsCategory);
    }catch(err){
      res.render("dashboard", {
        title: "Dashboard",
        hasErrors: true,
        errorMessage: err,
        userId: userId,
      });
      return;
    }
    data.transactions = transactionRecords.filter((transaction) => {
      return (
        transaction.category.toLowerCase() ===
        req.query.transactionsCategory.toLocaleLowerCase()
      );
    });



    if (data.transactions.length === 0) {
      data.hasTransactions = false;
      data.hasNoFilteredTransactions = true;
    } else {
      data.hasTransactionFilter = true;
    }
  }
  //end-filter transactions by category



// ----------------------------------------------



  // filter transactions by payment method
  if (req.query.transactionsPaymentMethod != undefined) {
    try{
      helpers.validateString("Payment Method",req.query.transactionsPaymentMethod);
    }catch(err){
      res.render("dashboard", {
        title: "Dashboard",
        hasErrors: true,
        errorMessage: err,
        userId: userId,
      });
      return;
    }
    data.transactions = transactionRecords.filter((transaction) => {
      return (
        transaction.method.toLowerCase() ===
        req.query.transactionsPaymentMethod.toLocaleLowerCase()
      );
    });

    if (data.transactions.length === 0) {
      data.hasTransactions = false;
      data.hasNoFilteredTransactions = true;
    } else {
      data.hasTransactionFilter = true;
    }
  }
  //end-filter transactions by payment method


  // ----------------------------------------------
  // filter transaction by expense name
  if (req.query.transactionSearchByName != undefined) {
    try{
      helpers.validateString("Expense Name",req.query.transactionSearchByName);
    }catch(err){
      res.render("dashboard", {
        title: "Dashboard",
        hasErrors: true,
        errorMessage: err,
        userId: userId,
      });
      return;
    }
    data.transactions = transactionRecords.filter((transaction) => {
      return transaction.expenseName
        .toLowerCase()
        .includes(req.query.transactionSearchByName.toLocaleLowerCase());
    });

    if (data.transactions.length === 0) {
      data.hasTransactions = false;
      data.hasNoFilteredTransactions = true;
    } else {
      data.hasTransactionFilter = true;
    }
  }
  //end-filter transaction by expense name

  // ----------------------------------------------
  // filter transaction by date
  if (
    req.query.transaction_start_date != undefined &&
    req.query.transaction_end_date != undefined
  ) 
  
  {
    try{
      helpers.validateString("Start Date",req.query.transaction_start_date);
      helpers.validateString("End Date",req.query.transaction_end_date);
    }catch(err){
      res.render("dashboard", {
        title: "Dashboard",
        hasErrors: true,
        errorMessage: err,
        userId: userId,
      });
      return;
    }

    let startDate = new Date(req.query.transaction_start_date);
    let endDate = new Date(req.query.transaction_end_date);
    try{
      if(startDate > endDate){
        throw "Start date cannot be greater than end date";
      }
    }catch(err){
      res.render("dashboard", {
        title: "Dashboard",
        hasErrors: true,
        errorMessage: err,
        userId: userId,
      });
      return;
    }
    data.transactions = transactionRecords.filter((transaction) => {
      return transaction.date >= startDate && transaction.date <= endDate;
    });

    if (data.transactions.length === 0) {
      data.hasTransactions = false;
      data.hasNoFilteredTransactions = true;
    } else {
      data.hasTransactionFilter = true;
    }
  }
  //end-filter transaction by date

  // ----------------------------------------------

  // filter transactions by amount
  if (
    req.query.transactionMinAmount != undefined ||
    req.query.transactionMaxAmount != undefined
  ) {
    if (
      req.query.transactionMinAmount.length > 0 &&
      req.query.transactionMaxAmount.length > 0
    ) {
      try{
        helpers.validateString("Min Amount",req.query.transactionMinAmount);
        helpers.validateString("Max Amount",req.query.transactionMaxAmount);
        if (Number(req.query.transactionMinAmount) > Number(req.query.transactionMaxAmount)) {
          throw "Min amount cannot be greater than max amount";
        }

        if (Number(req.query.transactionMinAmount) < 0 || Number(req.query.transactionMaxAmount) < 0) {

            throw "Amount cannot be negative";
          }
      }catch(err){
        res.render("dashboard", {
          title: "Dashboard",
          hasErrors: true,
          errorMessage: err,
          userId: userId,
        });
        return;
      }
      // console.log("both min and max amount");
      data.transactions = transactionRecords.filter((transaction) => {
        return (
          Number(transaction.amount) >=
            Number(req.query.transactionMinAmount) &&
          Number(transaction.amount) <= Number(req.query.transactionMaxAmount)
        );
      });
    }

    if (
      req.query.transactionMinAmount.length > 0 &&
      req.query.transactionMaxAmount.length === 0
    ) {
      // console.log("min amount only");
      try{
        helpers.validateString("Min Amount",req.query.transactionMinAmount);
        if (Number(req.query.transactionMinAmount) < 0) {
          throw "Amount cannot be negative";
        }

      }catch(err){
        res.render("dashboard", {
          title: "Dashboard",
          hasErrors: true,
          errorMessage: err,
          userId: userId,
        });
        return;
      }

      data.transactions = transactionRecords.filter((transaction) => {
        // console.log(
        //   Number(transaction.amount) >= Number(req.query.transactionMinAmount)
        // );
        return (
          Number(transaction.amount) >= Number(req.query.transactionMinAmount)
        );
      });
    }

    if (
      req.query.transactionMinAmount.length === 0 &&
      req.query.transactionMaxAmount.length > 0
    ) {
      try{
        helpers.validateString("Max Amount",req.query.transactionMaxAmount);
        if (Number(req.query.transactionMaxAmount) < 0) {
          throw "Amount cannot be negative";
        }

      }catch(err){
        res.render("dashboard", {
          title: "Dashboard",
          hasErrors: true,
          errorMessage: err,
          userId: userId,
        });
        return;
      }
      // console.log("max amount only");

      data.transactions = transactionRecords.filter((transaction) => {
        return (
          Number(transaction.amount) <= Number(req.query.transactionMaxAmount)
        );
      });
    }

    if (data.transactions.length === 0) {
      data.hasTransactions = false;
      data.hasNoFilteredTransactions = true;
    } else {
      data.hasTransactionFilter = true;
    }
  }
  //end-filter transactions by amount

  // ---------------------------------------------- budgets ----------------------------------------------

  // filter budgets by Category
  if (req.query.budgetCategory != undefined) {

    try{
      helpers.validateString("Budget Category",req.query.budgetCategory);
    }catch(err){
      res.render("dashboard", {
        title: "Dashboard",
        hasErrors: true,
        errorMessage: err,
        userId: userId,
      });
      return;
    }
    
    data.budgets = budgetRecords.filter((budget) => {
      return budget.category.toLocaleLowerCase() === req.query.budgetCategory.toLocaleLowerCase();
    });

    if (data.budgets.length === 0) {
      data.hasBudgets = false;
      data.hasNoFilteredBudgets = true;
    } else {
      data.hasBudgetFilter = true;
    }
  }
  //end-filter budgets by Category

  // ----------------------------------------------
  // filter budgets by amount
  if (
    req.query.budgetMinAmount != undefined ||
    req.query.budgetMaxAmount != undefined
  ) {
    if (
      req.query.budgetMinAmount.length > 0 &&
      req.query.budgetMaxAmount.length > 0
    ) {

      try{
        helpers.validateString("Min Amount",req.query.budgetMinAmount);
        helpers.validateString("Max Amount",req.query.budgetMaxAmount);
        if (Number(req.query.budgetMinAmount) > Number(req.query.budgetMaxAmount)) {
          throw "Min amount cannot be greater than max amount";
        }

        if (Number(req.query.budgetMinAmount) < 0 || Number(req.query.budgetMaxAmount) < 0) {
            
              throw "Amount cannot be negative";
            }

      
      }catch(err){
        res.render("dashboard", {
          title: "Dashboard",
          hasErrors: true,
          errorMessage: err,
          userId: userId,
        });
        return;
      }

      data.budgets = budgetRecords.filter((budget) => {
        return (
          Number(budget.amount) >= Number(req.query.budgetMinAmount) &&
          Number(budget.amount) <= Number(req.query.budgetMaxAmount)
        );
      });
    }

    if (
      req.query.budgetMinAmount.length > 0 &&
      req.query.budgetMaxAmount.length === 0
    ) {

      try{
        helpers.validateString("Min Amount",req.query.budgetMinAmount);
        if (Number(req.query.budgetMinAmount) < 0) {
          throw "Amount cannot be negative";
        }
      }catch(err){
        res.render("dashboard", {
          title: "Dashboard",
          hasErrors: true,
          errorMessage: err,
          userId: userId,
        });
        return;
      }

      data.budgets = budgetRecords.filter((budget) => {
        return Number(budget.amount) >= Number(req.query.budgetMinAmount);
      });
    }

    if (
      req.query.budgetMinAmount.length === 0 &&
      req.query.budgetMaxAmount.length > 0
    ) {

      try{
        helpers.validateString("Max Amount",req.query.budgetMaxAmount);
        if (Number(req.query.budgetMaxAmount) < 0) {
          throw "Amount cannot be negative";
        }
      }catch(err){
        res.render("dashboard", {
          title: "Dashboard",
          hasErrors: true,
          errorMessage: err,
          userId: userId,
        });
        return;
      }

      data.budgets = budgetRecords.filter((budget) => {
        return Number(budget.amount) <= Number(req.query.budgetMaxAmount);
      });
    }

    if (data.budgets.length === 0) {
      data.hasBudgets = false;
      data.hasNoFilteredBudgets = true;
    } else {
      data.hasBudgetFilter = true;
    }
  }
  //end-filter budgets by amount
// ----------------------------------------------
  // filter budgets by month and year
  if (
    req.query.budgetMonth != undefined || req.query.budgetYear != undefined
  ) {
    if (
      req.query.budgetMonth.length > 0 &&
      req.query.budgetYear.length > 0
    ) {

      try{
        helpers.validateString("Budget Month",req.query.budgetMonth);
        helpers.validateString("Budget Year",req.query.budgetYear);
        if (Number(req.query.budgetYear) > 9999 || Number(req.query.budgetYear) < 0) {
          throw "Year cannot be greater than 9999";
        }


      
      }catch(err){
        res.render("dashboard", {
          title: "Dashboard",
          hasErrors: true,
          errorMessage: err,
          userId: userId,
        });
        return;
      }

      data.budgets = budgetRecords.filter((budget) => {
        return (
          budget.month.toLocaleLowerCase() === req.query.budgetMonth.toLocaleLowerCase() &&
          Number(budget.year) === Number(req.query.budgetYear)
        );
      });
    }

    if (
      req.query.budgetMonth.length === 0 &&
      req.query.budgetYear.length > 0
    ) {

      try{
        helpers.validateString("Budget Year",req.query.budgetYear);
       
        if (Number(req.query.budgetYear) > 9999 || Number(req.query.budgetYear) < 0) {
          throw "Year cannot be greater than 9999";
        }
      
      }catch(err){
        res.render("dashboard", {
          title: "Dashboard",
          hasErrors: true,
          errorMessage: err,
          userId: userId,
        });
        return;
      }

      data.budgets = budgetRecords.filter((budget) => {
        return Number(budget.year) === Number(req.query.budgetYear);

      });
    }

    if(data.budgets.length === 0) {
      data.hasBudgets = false;
      data.hasNoFilteredBudgets = true;
    } else {
      data.hasBudgetFilter = true;
    }
  }


  //end-filter budgets by month and year
//----------------------------------------------------------------------------------------------------------------------------------------
  // filtering for the graphs
  // paychecks amount  by date
  let paycheckGraphData = [["Date Received", "Amount"]];

  paycheckRecords.forEach((paycheck) => {
    let result = paycheck.date.toLocaleDateString("en-GB", {
      // you can use undefined as first argument
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    paycheckGraphData.push([result, Number(paycheck.amount)]);
  });

  paycheckGraphData = JSON.stringify(paycheckGraphData);

  // end-paychecks amount  by date

  // transactions amount  by date
  let transactionAmountByDateData = [["Date", "Amount"]];
  let transactionAmountByCategoryData = [["Category", "Amount"]];
  let transactionAmountByPaymentMethodData = [["Payment Method", "Amount"]];
  transactionRecords.forEach((transaction) => {
    let result = transaction.date.toLocaleDateString("en-GB", {
      // you can use undefined as first argument
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });



    transactionAmountByDateData.push([result, Number(transaction.amount)]);
    transactionAmountByCategoryData.push([transaction.category.toLowerCase(),Number(transaction.amount)]);
    transactionAmountByPaymentMethodData.push([transaction.method.toLowerCase(),Number(transaction.amount)]);
  });

  transactionAmountByDateData = JSON.stringify(transactionAmountByDateData);

  transactionAmountByCategoryData = JSON.stringify(
    transactionAmountByCategoryData
  );

  transactionAmountByPaymentMethodData = JSON.stringify(
    transactionAmountByPaymentMethodData
  );

  // budgets amount by category
  let budgetAmountByCategoryData = [["Category", "Amount"]];
  budgetRecords.forEach((budget) => {
    budgetAmountByCategoryData.push([budget.category.toLowerCase(),Number(budget.amount)]);
  });

  budgetAmountByCategoryData = JSON.stringify(budgetAmountByCategoryData);

  data.graphData = {
    paycheckGraphData: paycheckGraphData,
    transactionAmountByDateData: transactionAmountByDateData,
    transactionAmountByCategoryData: transactionAmountByCategoryData,
    transactionAmountByPaymentMethodData: transactionAmountByPaymentMethodData,
    budgetAmountByCategoryData: budgetAmountByCategoryData,
  };

  
  // Render the dashboard
  res.render("dashboard", data);
});

// Export router
export default router;
