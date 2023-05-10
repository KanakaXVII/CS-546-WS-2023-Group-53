// Imports
import express from 'express';
import { userData } from '../data/index.js';
import * as helpers from '../helpers.js';
import sgMail from '@sendgrid/mail';
import bcrypt from 'bcrypt';
import xss from 'xss';

// Create the router
const router = express.Router();

// Render the password reset form
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password', { title: 'Forgot Password' });
});

// Process a reset password request
router.post('/reset-password', async (req, res) => {
  // Extract the email from body parameters
  const email = xss(req.body.email);

  // Validate the input
  try {
    helpers.validateEmail('Email Input', email);
  } catch (e) {
    res.render('forgot-password', { error: e, title: 'Forgot Password' });
    return;
  }

  // Check to make sure email exists
  let user = undefined;
  try {
    // Try to find the user in the database
    user = await userData.getUserByEmail(email);

    // Validate that a user was found
    if (!user) {
      res.render('forgot-password', { error: 'User not found', title: 'Forgot Password' });
      return;
    }
  } catch (error) {
    res.render('forgot-password', { error: 'An error occurred', title: 'Forgot Password' });
    return;
  }

  // Generate a new temporary password
  const tempPassword = Math.random().toString(36).substr(2, 8);

  // Salt and hash the password
  const tempPasswordHash = await helpers.saltAndHashPassword(tempPassword);

  // Update the user's password
  const response = await userData.updateUserByID(user._id, {password: tempPasswordHash});

  // Configure SendGrid
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Configure the message to send to the user
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM,
    subject: 'Lux Trax - Password Reset',
    text: `You have requested a new password for Lux Trax. Please use the temporary password below to login and change your password.\n\n${tempPassword}`
  };

  // Send the temporary password to the user's email using SendGrid
  try {
    const sgResult = await sgMail.send(msg);
  } catch (e) {
    console.log(`Something went wrong - ${e}`);
  }
  
  // Change the user's status to "password-reset" to trigger a forced password change
  if (user.status !== 'password-reset') {
    try {
      const updatedUser = await userData.updateUserByID(user._id.toString(), {status: 'password-reset'});
      console.log(updatedUser);
    } catch (e) {
      res.render('forgot-password', { error: e[1], title: 'Forgot Password' });
      return;
    }
  }

  // If everything is successful, redirect back to the login page
  res.redirect('/login');
  return;
});

// Process for user to change their password
router
  .route('/changePassword')
  .get(async (req, res)=> {
    // Determine if user is in password reset state
    let resetRequired = false;
    if (req.session.profile.status === 'password-reset') {
      resetRequired = true;
    }

    // Render the page
    res.render('changePassword', {
      resetRequired: resetRequired,
      hasErrors: false
    });
    return;
  })

  .post(async (req, res) => {
    // Create an object for the inputs
    const userInputs = {
      currentPasswordInput: xss(req.body.currentPasswordInput),
      firstPasswordInput: xss(req.body.firstPasswordInput),
      secondPasswordInput: xss(req.body.secondPasswordInput)
    };

    // Init errors
    let errors = [];

    // Validate inputs
    try {
      helpers.validatePassword('Current Password', userInputs.currentPasswordInput);
    } catch (e) {
      errors.push(e);
    }

    try {
      helpers.validatePassword('First Password', userInputs.firstPasswordInput);
    } catch (e) {
      errors.push(e);
    }

    try {
      helpers.validatePassword('Second Password', userInputs.secondPasswordInput);
    } catch (e) {
      errors.push(e);
    }

    // Check if errors were collected
    if (errors.length > 0) {
      res.render('changePassword', {
        hasErrors: true,
        errorMessage: errors
      });
    }

    // Ensure the new password is different from the current one
    const currentUserDBRecord = await userData.getUserByID(req.session.profile._id);
    const currentPassword = currentUserDBRecord.password;

    // Compare current password to new password
    const passwordCheck = await bcrypt.compare(userInputs.currentPasswordInput, currentPassword);
    if (!passwordCheck) {
      res.render('changePassword', {
        hasErrors: true,
        errorMessage: 'Current Password does not match records'
      });
      return;
    }

    // Ensure two new password inputs match
    if (userInputs.firstPasswordInput !== userInputs.secondPasswordInput) {
      res.render('changePassword', {
        hasErrors: true,
        errorMessage: 'New passwords do not match'
      });
      return;
    }

    // Hash and salt the password
    let newPassword = undefined;
    try {
      const hashedPass = await helpers.saltAndHashPassword(userInputs.firstPasswordInput);
      newPassword = hashedPass;
    } catch (e) {
        throw [500, 'Failed to hash password'];
    }

    // Update the user's profile
    try {
      const updatedUser = await userData.updateUserByID(req.session.profile._id, {password: newPassword, status: 'active'});
    } catch (e) {
      res.render('changePassword', {
        hasErrors: true,
        errorMessage: 'Error updating password...try again'
      });
    }

    // Update the session
    req.session.profile.status = 'active';

    // Redirect to the user's profile
    res.redirect('/profile');
    return;
  });

export default router;
