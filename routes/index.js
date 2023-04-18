// Imports
import userRoutes from './users.js';
import transactionRoutes from './transactions.js';
import budgetRoutes from './budgets.js';
import loginRoutes from './login.js';
import registerRoutes from './register.js';
import forgotPasswordRoutes from './forgot-password.js';
import profileRoutes from './profile.js';

// Build a constructor to glue routes together
const constructorMethod = (app) => {
    // Configure the app to use all routes --> app.use('/<route>', <importedFile>);
    app.use('/', loginRoutes);
    app.use('/recovery', forgotPasswordRoutes);
    app.use('/register', registerRoutes);
    app.use('/profile', profileRoutes);
    app.use('/users', userRoutes);
    app.use('/transactions', transactionRoutes);
    app.use('/budgets', budgetRoutes);
    
    // Set the default route
    app.use('*', (req, res) => {
        // Send a 404
        res.status(404).json({error: 'Page does not exist'});
    });
};

// Export the constructor
export default constructorMethod; 
