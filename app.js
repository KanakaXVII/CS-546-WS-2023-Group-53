// Imports
import express from 'express';
import configRoutes from './routes/index.js';

// Configure the app
const app = express();
app.use(express.json());

// Configure routes
configRoutes(app);

// Start the app
app.listen(3000, () => {
    console.log('Started server at http://localhost:3000');
});