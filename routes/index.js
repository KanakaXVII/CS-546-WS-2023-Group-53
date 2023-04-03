// Imports
import userRoutes from './users.js';

// Build a constructor to glue routes together
const constructorMethod = (app) => {
    // Configure the app to use all routes --> app.use('/<route>', <importedFile>);
    app.use('/users', userRoutes);
    
    // Set the default route
    app.use('*', (req, res) => {
        // Send a 404
        res.status(404).json({error: 'Page does not exist'});
    });
};

// Export the constructor
export default constructorMethod; 