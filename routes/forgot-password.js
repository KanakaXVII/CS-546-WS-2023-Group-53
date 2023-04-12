// Imports
import express from 'express';
import { userData } from '../data/index.js';
import * as helpers from '../helpers.js';

// Create the router
const router = express.Router();

// Render the password reset form
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password', { title: 'Forgot Password' });
});

// Process a reset password request
router.post('/reset-password', async (req, res) => {
  // Extract the email from body parameters
  const email = req.body.email;

  // Check to make sure email exists
  try {
    // Try to find the user in the database
    const user = await userData.getUserByEmail(email);

    // Validate that a user was found
    if (!user) {
      res.render('forgot-password', { error: 'User not found', title: 'Forgot Password' });
      return;
    }

    // Generate a new temporary password
    const tempPassword = Math.random().toString(36).substr(2, 8);

    // Salt and hash the password
    const tempPasswordHash = await helpers.saltAndHashPassword(tempPassword);

    // Update the user's password
    const response = await userData.updateUserByID(user._id, {password: tempPasswordHash});

    // Send the temporary password to the user's email (NOT SURE WHICH SERVICE TO USE)

    // If everything is successful, redirect back to the login page
    res.render('login', {
      message: 'A temporary password has been sent to your email address.',
      title: 'Login',
    });
  } catch (error) {
    res.render('forgot-password', { error: 'An error occurred', title: 'Forgot Password' });
  }
});

export default router;
