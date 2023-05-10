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

  // google graph test
  //  let graphData = {
  //   Mushrooms: 3,
  //   Onions: 1,
  //   Olives: 1,
  //   Zucchini: 1,
  //   Peppers: 2,
  //   Sausage: 1,
  //  }

  // let graphData = [
  //   ['Category', 'Amount'],
  //   ['Mushrooms', 3],
  //   ['Onions', 1],
  //   ['Olives', 1],
  //   ['Zucchini', 1],
  //   ['Peppers', 2],
  //   ['Sausage', 1],
  // ];

  // let graphData = {
  //   category
  // }

  //  graphData = JSON.stringify(graphData);

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

  // filter paychecks by notes
  if (req.query.paycheckSearchByNotes != undefined) {
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

  // filter transactions by category
  if (req.query.transactionsCategory != undefined) {
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

  // filter transactions by payment method
  if (req.query.transactionsPaymentMethod != undefined) {
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

  // filter transaction by expense name
  if (req.query.transactionSearchByName != undefined) {
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

  // filter transaction by date
  if (
    req.query.transaction_start_date != undefined &&
    req.query.transaction_end_date != undefined
  ) {
    let startDate = new Date(req.query.transaction_start_date);
    let endDate = new Date(req.query.transaction_end_date);
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

  // filter paychecks by date
  if (
    req.query.paychecks_start_date != undefined &&
    req.query.paychecks_end_date != undefined
  ) {
    let paychecksStartDate = new Date(req.query.paychecks_start_date);
    let paychecksEndDate = new Date(req.query.paychecks_end_date);

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

  // filter transactions by amount
  if (
    req.query.transactionMinAmount != undefined ||
    req.query.transactionMaxAmount != undefined
  ) {
    if (
      req.query.transactionMinAmount.length > 0 &&
      req.query.transactionMaxAmount.length > 0
    ) {
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

      data.transactions = transactionRecords.filter((transaction) => {
        console.log(
          Number(transaction.amount) >= Number(req.query.transactionMinAmount)
        );
        return (
          Number(transaction.amount) >= Number(req.query.transactionMinAmount)
        );
      });
    }

    if (
      req.query.transactionMinAmount.length === 0 &&
      req.query.transactionMaxAmount.length > 0
    ) {
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

      data.paychecks = paycheckRecords.filter((paycheck) => {
        console.log(
          Number(paycheck.amount) >= Number(req.query.paycheckMinAmount)
        );
        return Number(paycheck.amount) >= Number(req.query.paycheckMinAmount);
      });
    }

    if (
      req.query.paycheckMinAmount.length === 0 &&
      req.query.paycheckMaxAmount.length > 0
    ) {
      // console.log("max amount only");

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

  // filter budgets by Category
  if (req.query.budgetCategory != undefined) {
    
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

  // filter budgets by amount
  if (
    req.query.budgetMinAmount != undefined ||
    req.query.budgetMaxAmount != undefined
  ) {
    if (
      req.query.budgetMinAmount.length > 0 &&
      req.query.budgetMaxAmount.length > 0
    ) {

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

      data.budgets = budgetRecords.filter((budget) => {
        return Number(budget.amount) >= Number(req.query.budgetMinAmount);
      });
    }

    if (
      req.query.budgetMinAmount.length === 0 &&
      req.query.budgetMaxAmount.length > 0
    ) {

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

  // filter budgets by month and year
  if (
    req.query.budgetMonth != undefined || req.query.budgetYear != undefined
  ) {
    if (
      req.query.budgetMonth.length > 0 &&
      req.query.budgetYear.length > 0
    ) {

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
