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
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true
}));



/* Middleware Functions */

// Route Logging Middleware
app.use(async (req, res, next) => {
    // Exlude the public hits
    if (!req.originalUrl.startsWith('/public') && req.originalUrl !== '/favicon.ico') {
        // Determine if user is authed
        let userAuthed = false;
        if (req.session.profile) {
            userAuthed = true;
        }

        // Log it
        console.log(`INFO: ${req.method} ${req.originalUrl} - (User Authed: ${userAuthed})`);
        next();
    } else {
        next();
    }
});

// Password Reset Check
app.use(async (req, res, next) => {
    // Determine if there is an active session
    if (req.session.profile) {
       // Determine if the user is not already on the password reset page
        if (req.originalUrl !== '/recovery/changePassword')  {
            // Determine if the user is in password reset mode
            if (req.session.profile.status === 'password-reset') {
                // Redirect them to the recovery page
                res.redirect('recovery/changePassword');
                return;
            }
        } 
    }

    // Continue
    next();
});

/* End Middleware Functions */



// Configure routes
configRoutes(app);

// Start the app
app.listen(3000, () => {
    console.log('Started server at http://localhost:3000');
});