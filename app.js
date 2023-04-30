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

// Middleware to check if the user is logged in
app.use('/profile', (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).render('login', { error: 'You must be logged in to view this page' });
    } else {
        next();
    }
});

app.use('/users', (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).render('login', { error: 'You must be logged in to view this page' });
    } else {
        next();
    }
});

app.use('/transactions', (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).render('login', { error: 'You must be logged in to view this page' });
    } else {
        next();
    }
});

app.use('/budgets', (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).render('login', { error: 'You must be logged in to view this page' });
    } else {
        next();
    }
});

app.use('/paychecks', (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).render('login', { error: 'You must be logged in to view this page' });
    } else {
        next();
    }
});

app.use('/recovery', (req, res, next) => {
    if (req.session.user) {
        return res.status(403).render('login', { error: 'You are already logged in' });
    } else {
        next();
    }
});

app.use('/register', (req, res, next) => {
    if (req.session.user) {
        return res.status(403).render('dashboard', { error: 'You are already logged in' });
    } else {
        next();
    }
});

app.use('/', (req, res, next) => {
    if (req.session.user) {
        return res.status(403).render('dashboard', { error: 'You are already logged in' });
    } else {
        return res.status(403).render('login', { error: 'Please login before moving further' });
    }
});



// Configure routes
configRoutes(app);

// Start the app
app.listen(3000, () => {
    console.log('Started server at http://localhost:3000');
});
