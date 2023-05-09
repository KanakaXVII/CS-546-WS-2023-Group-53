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
  for (let i = 0; i < transactionRecords.length; i++) {
    transactionCategories.push(transactionRecords[i].category.toLowerCase());
  }
  transactionCategories = [...new Set(transactionCategories)];
  //end-getting categories for transactions

  //end-transactions

  //budgets
  // Perform DB operation to get budget data
  // const budgetRecords = await budgetData.getBudgetsByUserId(
  //     userId
  // );

  // let hasBudgets = undefined;

  // if (budgetRecords.length === 0) {
  //     hasBudgets = false;
  // } else {
  //     hasBudgets = true;
  // }
  // //end-budgets

  let hasErrors = false;
  let errorMessage = undefined;
  if (Object.keys(req.query).length > 0) {
    hasErrors = req.query.hasErrors;
    errorMessage = req.query.errorMessage;
  }

  // google graph test
  // let graphData = [
  //   ["Task", "Hours per Day"],
  //   ["Work", 8],
  //   ["Eat", 2],
  //   ["Sleep", 8],
  //   ["Exercise", 1],
  //   ["Watch TV", 1],
  //   ["Socialize", 4],
  // ];

  let data = {
    // Placeholder view
    title: "Dashboard",
    hasErrors: hasErrors,
    errorMessage: errorMessage,
    userId: userId,
    hasPaychecks: hasPaychecks,
    hasTransactions: hasTransactions,
    // hasBudgets: hasBudgets,
    paychecks: paycheckRecords,
    transactions: transactionRecords,
    transactionCategories: transactionCategories,
    // budgets: budgetRecords,
    userProfile: req.session.profile,
    // graphData: JSON.stringify(graphData),
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

  // Render the dashboard
  res.render("dashboard", data);
});

// Export router
export default router;
