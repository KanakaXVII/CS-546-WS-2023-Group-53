// Imports
import express from "express";
import { Router } from "express";
import * as helpers from "../helpers.js";
import axios from "axios";
import {
  userData,
  transactionData,
  paycheckData,
  budgetData,
} from "../data/index.js";
import bcrypt from "bcrypt";

// Create the router
const router = Router();

// Create routes
router.route("/").get(async (req, res) => {
  // Try to render the page
  try {
    res.render("../views/login", {
      title: "Login",
      hasErrors: false,
      errors: [],
    });
  } catch (e) {
    // Format and send error response
    const errorAttrs = helpers.formatError(e);
    return res.status(errorAttrs.status).json({ error: errorAttrs.message });
  }
});

router.route("/processLogin").post(async (req, res) => {
  // Get form data
  const formData = req.body;

  // Reformat the form inputs
  const userLoginInputs = {
    email: (req.body = formData.emailInput),
    password: (req.body = formData.passwordInput),
  };

  // Search for a user with the matching email
  const user = await userData.getUserByEmail(userLoginInputs.email);

  // Validate the response
  if (!user) {
    try {
      res.render("../views/login", {
        title: "Login",
        hasErrors: true,
        errors: ["User not found"],
      });
    } catch (e) {
      // Format and send error response
      const errorAttrs = helpers.formatError(e);
      return res.status(errorAttrs.status).json({ error: errorAttrs.message });
    }
  }

  // Validate the password
  const passwordCheck = await bcrypt.compare(
    userLoginInputs.password,
    user.password
  );

  // Process validation
  if (passwordCheck) {
    // Store the email and ID for the session
    const moddedUserProfile = user;
    delete user["password"];

    req.session.profile = moddedUserProfile;

    // Render the dashboard
    res.redirect("/dashboard");
  } else {
    try {
      res.render("../views/login", {
        title: "Login",
        hasErrors: true,
        errors: ["Password is Incorrect"],
      });
    } catch (e) {
      // Format and send error response
      const errorAttrs = helpers.formatError(e);
      return res.status(errorAttrs.status).json({ error: errorAttrs.message });
    }
  }
});

router.route("/logout").get(async (req, res) => {
  // Destroy the session
  req.session.destroy();

  // Redirect to the login page
  return res.redirect("/login");
});

router.route("/dashboard").get(async (req, res) => {
  // Validate the session
  if (!req.session.profile) {
    // Redirect to the login page
    return res.redirect("/login");
  }

  const userId = req.session.profile._id;

  // Get the user's transactions
  const transactions = await transactionData.getTransactionsByUserId(userId);

  // Get the user's paychecks
  const paychecks = await paycheckData.getPaychecksByUserId(userId);

  // Get the user's budgets
  const budgets = await budgetData.getBudgetsByUserId(userId);

  // Render the dashboard
  res.render("../views/dashboard", {
    // Placeholder view
    title: "Dashboard",
    userProfile: req.session.profile,
    transactions: transactions,
    paychecks: paychecks,
    budgets: budgets
  });
});

// Export the router
export default router;
