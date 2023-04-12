// Imports
import express from 'express';
import { userData } from '../data/index.js';

// Create the router
const router = express.Router();

// Render the password reset form
router.get('/forgot-password', (req, res) => {
  res.render('../views/forgot-password', { title: 'Forgot Password' });
});

// Process a reset password request
router.post('/reset-password', async (req, res) => {
  // Extract the email from body parameters
  const email = req.body.email;

  // Check to make sure email exists
  try {
    const user = await db.users.findOne({ email: email });

    if (!user) {
      res.render('../views/forgot-password', { error: 'User not found', title: 'Forgot Password' });
      return;
    }

    // Generate a new temporary password
    const tempPassword = Math.random().toString(36).substr(2, 8);

    // Update the user's password
    await db.users.updateOne({ _id: user._id }, { $set: { password: tempPassword } });

    // Send the temporary password to the user's email (NOT SURE WHICH SERVICE TO USE)

    res.render('login', {
      message: 'A temporary password has been sent to your email address.',
      title: 'Login',
    });
  } catch (error) {
    res.render('forgot-password', { error: 'An error occurred', title: 'Forgot Password' });
  }
});

export default router;
