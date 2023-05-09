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
    // hasBudgets: hasBudgets,
    paychecks: paycheckRecords,
    transactions: transactionRecords,
    transactionCategories: transactionCategories,
    // budgets: budgetRecords,
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

  transactionRecords.forEach((transaction) => {
    let result = transaction.date.toLocaleDateString("en-GB", {
      // you can use undefined as first argument
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    transactionAmountByDateData.push([result, Number(transaction.amount)]);
  });

  transactionAmountByDateData = JSON.stringify(transactionAmountByDateData);

  // end-transactions amount  by date

  // transaction amount by category
  let transactionAmountByCategoryData = [["Category", "Amount"]];

  transactionRecords.forEach((transaction) => {
    transactionAmountByCategoryData.push([
      transaction.category.toLowerCase(),
      Number(transaction.amount),
    ]);
  });

  transactionAmountByCategoryData = JSON.stringify(
    transactionAmountByCategoryData
  );

  data.graphData = {
    paycheckGraphData: paycheckGraphData,
    transactionAmountByDateData: transactionAmountByDateData,
    transactionAmountByCategoryData: transactionAmountByCategoryData,
  };

  
  // Render the dashboard
  res.render("dashboard", data);
});

// Export router
export default router;
