// Imports
import { Router } from 'express';
import { paycheckData } from '../data/index.js';
import * as helpers from '../helpers.js';

// Create a router
const router = Router();

// Build routes
router
    .route('/')
    .get(async (req, res) => {
        // Render the dashboard
        res.render('../views/dashboard', { // Placeholder view
            title: 'Dashboard',
            userProfile: req.session.profile
        });
    });

// Export router
export default router;