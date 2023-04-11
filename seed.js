import db from './config/mongoCollections.js

const usersData = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@gmail.com',
    password: 'password1',
    paymentMethods: ['Credit Card', 'Checking Account', 'Cash'],
  },
  {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@gmail.com',
    password: 'password2',
    paymentMethods: ['Debit Card', 'Savings Account', 'PayPal'],
  },
];

const transactionsData = [
  {
    date: '2023-01-10T04:00:000+00:00',
    method: 'Credit Card',
    expenseName: 'Groceries',
    amount: 120,
    category: 'Food',
  },
  {
    date: '2023-01-15T04:00:000+00:00',
    method: 'Checking Account',
    expenseName: 'Rent',
    amount: 900,
    category: 'Housing',
  },
];

const seed = async () => {
  try {
    await db.connect(); // Connect to database

    // Clear users and transactions collections
    await db.users.remove({});
    await db.transactions.remove({});

    // Insert sample users and their transactions
    for (const userData of usersData) {
      const insertedUser = await db.users.insert(userData);
      const user = insertedUser.ops[0];
      const userId = user._id;

      for (const transactionData of transactionsData) {
        const transaction = {
          ...transactionData,
          userId,
        };
        await db.transactions.insert(transaction);
      }
    }

    console.log('Seed data successfully added!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    db.disconnect(); // Disconnect from database
  }
};

seed();
