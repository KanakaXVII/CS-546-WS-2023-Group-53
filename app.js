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

// express-handlebars helper functions
// const hbs = exphbs.create({
//     defaultLayout: 'main',
//     helpers: {
//         // Helper function to determine if a user is logged in
//         matchQuery: function(row) {
//             const query = document.querySelector('#filter').value.toLowerCase();
//             const date = row.date.toLowerCase();
//             const amount = row.amount.toString().toLowerCase();
//             const notes = row.notes.toLowerCase();
      
//             return date.includes(query) || amount.includes(query) || notes.includes(query);
//           }
//         }
//     }
// );

// const hbs = exphbs.create({
//     defaultLayout: 'main',
//     helpers: {
//         json(content) {
//             return JSON.stringify(content);
//         }
//     }
// });



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
        maxAge: 900000 // 15 Minutes
    }
}));



/* Middleware Functions */

// Route Logging Middleware (Keep At Top of Middleware)
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

// Redirect unauthenticated users
app.use(async (req, res, next) => {
    // Exclude login and registration pages
    if (req.originalUrl !== '/login' && req.originalUrl !== '/register' && req.originalUrl !== '/login/processLogin' && req.originalUrl !== '/register/processRegister') { // Change to /login once the route is fixed in index
        // Check if user is authed
        if (!req.session.profile) {
            // Log action
            console.log('Redirecting unauthenticated user to login');

            // Redirect to the login page
            res.redirect('/login'); // Change to /login once the route is fixed in index
            return;
        }
    }

    // Continue 
    next();
});

// Redirect authenticated users
app.use(async (req, res, next) => {
    // Include login and registration pages
    if (req.originalUrl === '/login' || req.originalUrl === '/register' || req.originalUrl === '/login/processLogin' || req.originalUrl === '/register/processRegister') {

        // Check is user is authed
        if (req.session.profile) {
            // Log action
            console.log('Redirecting authenticated user to dashbaord');
            
            // Redirect to the dashboard
            res.redirect('/dashboard');
            return;
        }
    }

    // Continue
    next();
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
                res.redirect('/recovery/changePassword');
                return;
            }
        } 
    }

    // Continue
    next();
});

// Check for paycheck deletions via button
app.use('/paychecks/paycheck/:id', async (req, res, next) => {
    // Check to see if there is a parameter in the URL
    if (req.query) {
        // Check if the query is for a DELETE method
        if (req.query.realMethod === 'DELETE') {
            // Change the request method to a DELETE method
            req.method = 'DELETE';
        }
    }

    // Continue
    next();
});

app.delete('/paychecks/paycheck/:id', async (req, res, next) => {
    next();
});

// Check for user deletion via button
app.use('/users/:id', async (req, res, next) => {
    // Check to see if there is a parameter in the URL
    if (req.query) {
        // Check if the query is for a DELETE method
        if (req.query.realMethod === 'DELETE') {
            // Change the request method to a DELETE method
            req.method = 'DELETE';
        }
    }

    // Continue
    next();
});

app.delete('/users/:id', async (req, res, next) => {
    next();
});

// Check for budget deletion via button
app.use('/budgets/budget/:id', async (req, res, next) => {
    // Check to see if there is a parameter in the URL
    if (req.query) {
        // Check if the query is for a DELETE method
        if (req.query.realMethod === 'DELETE') {
            // Change the request method to a DELETE method
            req.method = 'DELETE';
        }
    }

    // Continue
    next();
});

// Check for pay method deletion via button
app.use('/payMethod/:payId/', async (req, res, next) => {
    // Check to see if there is a parameter in the URL
    if (req.query) {
        // Check if the query is for a DELETE method
        if (req.query.realMethod === 'DELETE') {
            // Change the request method to a DELETE method
            req.method = 'DELETE';
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
