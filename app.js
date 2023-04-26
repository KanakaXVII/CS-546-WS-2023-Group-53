// Imports
import express from 'express';
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from 'express-session';

// Create variables for the path directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create and configure the app
const app = express();
const _static = express.static(__dirname + '/public');

app.use('/public', _static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure the template engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Set the app up to use sessions
app.use(session({
    name: 'AuthCookie',
    secret: 'super_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 30000 // 30 seconds
    }
}));

// Configure routes
configRoutes(app);

// Start the app
app.listen(3000, () => {
    console.log('Started server at http://localhost:3000');
});
