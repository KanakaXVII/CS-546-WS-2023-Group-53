import express from 'express';
import db from '/config/mongoCollections.js'

const router = express.Router();

router.get('/forgot-password', (req, res) => {
  res.render('forgot-password', { title: 'Forgot Password' });
});

router.post('/reset-password', async (req, res) => {
  const email = req.body.email;

  try {
    const user = await db.users.findOne({ email: email });

    if (!user) {
      res.render('forgot-password', { error: 'User not found', title: 'Forgot Password' });
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
