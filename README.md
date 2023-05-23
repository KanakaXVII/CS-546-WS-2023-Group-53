# CS-546-WS-2023-Group-53
Final project repository for CS-546-WS 2023 course

# Introduction
This project aims to provide a web app that can be used to track personal finances. Please follow the instructions provided to start using the app.

# Steps
1. Install Node packages by running `npm i`
2. Create a `.env` file in the project
3. Copy data from the file labeled `env_data` to the `.env` file
    This ensures that the Sendgrid API works as intended
4. Seed the database by running `node ./tasks/seed.js`
    - This will populate three sample users in the DB
5. Log in
    - Use one of the sample users from the seed by grabbing the respective email and password from the seed file
    - Create a user of your own
        - Important: The app uses Sendgrid for password resets, so please do not use an email you do not own to avoid accidentally sending an email to a random person!
6. Explore the UI!