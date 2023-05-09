// Imports
import { userData, transactionData, budgetData, paycheckData } from '../data/index.js';

/*
    Seed Logistics:
        This seed file will be used to add 3 users to the database. Each user will be different and will
        be configured with data for each module as well. For example, one of the seed users will have
        a user profile, some transaction history, a budget or two, and some paychecks.

        Note: Since this app does have the ability to reset emails via Sendgrid API, I will not be
        random test emails. I want to avoid sending emails to anyone on accident. All emails used in
        the seed file will be Google aliases for my own email address.
*/

const seed = async () => {
    // Start Message
    console.log('Beginning to seed database...');

    /* 
        User 1
        Name: Samantha Shannon
        Email: jarrin.sacayanan+samantha+shannon@gmail.com
        Password: OrangeTree4Me!
    */

    // Create the new user
    const user1Profile = {
        firstName: 'Samantha',
        lastName: 'Shannon',
        email: 'jarrin.sacayanan+samantha+shannon@gmail.com',
        password: 'OrangeTree4Me!'
    };

    try {
        const addUser1 = await userData.createUser(
            user1Profile.firstName,
            user1Profile.lastName,
            user1Profile.email,
            user1Profile.password
        );
    } catch (e) {
        console.log(e);
    }

    // Retrieve the new user
    const user1 = await userData.getUserByEmail(user1Profile.email);

    // Add some payment methods to the user
    const user1wallet = ['Credit Card', 'Checking Account'];
    user1wallet.forEach(async (item) => {
        try {
            const newMethod = await userData.createPaymentMethod(user1._id, item);
        } catch (e) {
            console.log(e);
        }
    });

    // Add transactions for user
    try {
        const newTransaction = await transactionData.create(
            user1._id,
            '3/15/2023',
            'Credit Card',
            'Books',
            65.40,
            'Personal Spending'
        );
    } catch (e) {
        console.log(e);
    }

    try {
        const newTransaction = await transactionData.create(
            user1._id,
            '3/17/2023',
            'Checking Account',
            'Red Lobster',
            122.65,
            'Restaurants'
        );
    } catch (e) {
        console.log(e);
    }

    try {
        const newTransaction = await transactionData.create(
            user1._id,
            '3/15/2023',
            'Credit Card',
            'Books',
            65.40,
            'Personal Spending'
        );
    } catch (e) {
        console.log(e);
    }

    // Add paychecks for the user
    try {
        const newPaycheck = await paycheckData.createPaycheck(
            user1._id,
            '3/1/2023',
            4000,
            "I love being a famous author!"
        );
    } catch (e) {
        console.log(e);
    }

    try {
        const newPaycheck = await paycheckData.createPaycheck(
            user1._id,
            '3/15/2023',
            4500,
            ''
        );
    } catch (e) {
        console.log(e);
    }

    try {
        const newPaycheck = await paycheckData.createPaycheck(
            user1._id,
            '4/1/2023',
            2000,
            "Book sales were down..."
        );
    } catch (e) {
        console.log(e);
    }

    // Add a budget to the user
    const user1BudgetInput = {
        userId: user1._id,
        month: 'March',
        year: 2023,
        name: 'Books',
        amount: 150,
        recurring: true
    };

    try {
        const user1NewBudget = await budgetData.createBudget(
            user1BudgetInput.userId,
            user1BudgetInput.month,
            user1BudgetInput.year,
            user1BudgetInput.name,
            user1BudgetInput.amount,
            user1BudgetInput.recurring
        );
    } catch (e) {
        console.log(e);
    }

    /*
        User 2
        Name: Rick Riordan
        Email: jarrin.sacayanan+rick+riordan@gmail.com
        Password: Gr33k_Life
    */

    // Create the new user
    const user2Profile = {
        firstName: 'Rick',
        lastName: 'Riordan',
        email: 'jarrin.sacayanan+rick+riordan@gmail.com',
        password: 'Gr33k_Life'
    };

    try {
        const addUser2 = await userData.createUser(
            user2Profile.firstName,
            user2Profile.lastName,
            user2Profile.email,
            user2Profile.password
        );
    } catch (e) {
        console.log(e);
    }

    // Retrieve the new user
    const user2 = await userData.getUserByEmail(user2Profile.email);

    // Add some payment methods to the user
    const user2wallet = ['Cash', 'Discover Card'];
    user2wallet.forEach(async (item) => {
        try {
            const newMethod = await userData.createPaymentMethod(user2._id, item);
        } catch (e) {
            console.log(e);
        }
    });

    // Add transactions for user
    try {
        const newTransaction = await transactionData.create(
            user2._id,
            '3/11/2023',
            'Cash',
            'McDonalds',
            22.49,
            'Restaurants'
        );
    } catch (e) {
        console.log(e);
    }

    try {
        const newTransaction = await transactionData.create(
            user2._id,
            '3/19/2023',
            'Cash',
            'McDonalds',
            44.11,
            'Restaurants'
        );
    } catch (e) {
        console.log(e);
    }

    try {
        const newTransaction = await transactionData.create(
            user2._id,
            '3/25/2023',
            'Discover Card',
            'Books',
            30.00,
            'Personal Spending'
        );
    } catch (e) {
        console.log(e);
    }

    // Add paychecks for the user
    try {
        const newPaycheck = await paycheckData.createPaycheck(
            user2._id,
            '3/1/2023',
            6000,
            "Percy Jackson Money!"
        );
    } catch (e) {
        console.log(e);
    }

    try {
        const newPaycheck = await paycheckData.createPaycheck(
            user2._id,
            '3/15/2023',
            6700,
            'More Percy Jackson Money'
        );
    } catch (e) {
        console.log(e);
    }

    try {
        const newPaycheck = await paycheckData.createPaycheck(
            user2._id,
            '4/1/2023',
            1000,
            "Less Percy Jackson Money..."
        );
    } catch (e) {
        console.log(e);
    }

    // Add a budget to the user
    const user2BudgetInput = {
        userId: user2._id,
        month: 'March',
        year: 2023,
        name: 'Restaurants',
        amount: 300,
        recurring: true
    };

    try {
        const user2NewBudget = await budgetData.createBudget(
            user2BudgetInput.userId,
            user2BudgetInput.month,
            user2BudgetInput.year,
            user2BudgetInput.name,
            user2BudgetInput.amount,
            user2BudgetInput.recurring
        );
    } catch (e) {
        console.log(e);
    }

    /*
        User 3
        Name: Laini Taylor
        Email: jarrin.sacayanan+laini+taylor@gmail.com
        Password: !DreamStrangely5!
    */

    // Create the new user
    const user3Profile = {
        firstName: 'Laini',
        lastName: 'Taylor',
        email: 'jarrin.sacayanan+laini+taylor@gmail.com',
        password: '!DreamStrangely5!'
    };

    try {
        const addUser3 = await userData.createUser(
            user3Profile.firstName,
            user3Profile.lastName,
            user3Profile.email,
            user3Profile.password
        );
    } catch (e) {
        console.log(e);
    }

    // Retrieve the new user
    const user3 = await userData.getUserByEmail(user3Profile.email);

    // Add some payment methods to the user
    const user3wallet = ['Bank Card', 'Savings Account', 'PayPal Account'];
    user2wallet.forEach(async (item) => {
        try {
            const newMethod = await userData.createPaymentMethod(user3._id, item);
        } catch (e) {
            console.log(e);
        }
    });

    // Add transactions for user
    try {
        const newTransaction = await transactionData.create(
            user3._id,
            '3/1/2023',
            'Savings Account',
            'Lulu Lemon Leggings',
            106.77,
            'Clothes'
        );
    } catch (e) {
        console.log(e);
    }

    try {
        const newTransaction = await transactionData.create(
            user3._id,
            '3/19/2023',
            'PayPal Account',
            'Red Lobster',
            22.11,
            'Restaurants'
        );
    } catch (e) {
        console.log(e);
    }

    try {
        const newTransaction = await transactionData.create(
            user3._id,
            '3/30/2023',
            'Bank Card',
            'Books',
            90.43,
            'Personal Spending'
        );
    } catch (e) {
        console.log(e);
    }

    // Add paychecks for the user
    try {
        const newPaycheck = await paycheckData.createPaycheck(
            user3._id,
            '3/1/2023',
             6500,
            "Strange the Dreamer"
        );
    } catch (e) {
        console.log(e);
    }

    try {
        const newPaycheck = await paycheckData.createPaycheck(
            user3._id,
            '3/15/2023',
             5050,
            'Publisher endorsement'
        );
    } catch (e) {
        console.log(e);
    }

    try {
        const newPaycheck = await paycheckData.createPaycheck(
             user3._id,
            '4/1/2023',
            10000,
            ""
        );
    } catch (e) {
        console.log(e);
    }

    // Add a budget to the user
    const user3BudgetInput = {
        userId: user3._id,
        month: 'March',
        year: 2023,
        name: 'Clothes',
        amount: 500,
        recurring: true
    };

    try {
        const user3NewBudget = await budgetData.createBudget(
            user3BudgetInput.userId,
            user3BudgetInput.month,
            user3BudgetInput.year,
            user3BudgetInput.name,
            user3BudgetInput.amount,
            user3BudgetInput.recurring
        );
    } catch (e) {
        console.log(e);
    }

    // End Message
    console.log('Done seeding database!');
    return;
};

seed();