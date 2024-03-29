// Imports
import userRoutes from './users.js';
import transactionRoutes from './transactions.js';
import budgetRoutes from './budgets.js';
import loginRoutes from './login.js';
import registerRoutes from './register.js';
import recoveryRoutes from './recovery.js';
import profileRoutes from './profile.js';
import paycheckRoutes from './paychecks.js';
import dashboardRoutes from './dashboard.js';
import logoutRoutes from './logout.js';
import payMethodRoutes from './payMethod.js';

// Build a constructor to glue routes together
const constructorMethod = (app) => {
    // Configure the app to use all routes --> app.use('/<route>', <importedFile>);
    app.use('/login', loginRoutes);
    app.use('/recovery', recoveryRoutes);
    app.use('/register', registerRoutes);
    app.use('/profile', profileRoutes);
    app.use('/users', userRoutes);
    app.use('/transactions', transactionRoutes);
    app.use('/budgets', budgetRoutes);
    app.use('/paychecks', paycheckRoutes);
    app.use('/dashboard', dashboardRoutes);
    app.use('/logout', logoutRoutes);
    app.use('/payMethod', payMethodRoutes);
    
    // Set the default route
    app.use('*', (req, res) => {
        // Send a 404
        // res.status(404).json({error: 'Page does not exist'});
        res.render('error');
    });
};

// Export the constructor
export default constructorMethod; 
