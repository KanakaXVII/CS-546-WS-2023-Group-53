// Imports
import express from 'express';
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import forgotPasswordRouter from './routes/forgot-password';

// Create variables for the path directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create and configure the app
const app = express();
const _static = express.static(__dirname + '/public');

app.use('/public', _static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', forgotPasswordRouter);

// Configure the template engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Configure routes
configRoutes(app);

// Start the app
app.listen(3000, () => {
    console.log('Started server at http://localhost:3000');
});
