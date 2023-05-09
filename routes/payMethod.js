// Imports
import { Router } from 'express';
import { userData } from '../data/index.js';

// Create the router
const router = Router();

// Create routes
router.route('/:payId').delete(async (req, res) => {
    // Grab the current user's ID from session
    const userId = req.session.profile._id;

    // Grab the pay method ID from the parameters
    const payId = req.params.payId;

    // Make the DB call to remove it
    try {
        const removedMethod = await userData.deletePaymentMethodByID(userId, payId);
    } catch (e) {
        return 'Could not delete payment method';
    }

    // Redirect
    res.redirect('/profile');
});

// Export the router
export default router;