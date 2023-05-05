// Validate password inputs
const validatePassword = async (password) => {
    // Init storage for errors
    let errors = [];

    // Make sure password is at least 8 characters long
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    // Make sure password contains at least one lowercase letter
    const oneLowerPattern = /^(?=.*[a-z])/;
    if (!oneLowerPattern.test(password)) {
        errors.push('Password must contain at least 1 lowercase letter');
    }

    // Make sure password contains at least one uppercase letter
    const oneUpperPattern = /^(?=.*[A-Z])/;
    if (!oneUpperPattern.test(password)) {
        errors.push('Password must contain at least 1 uppercase letter');
    }

    // Make sure password contains at least one number
    const oneNumPattern = /^(?=.*\d)/;
    if (!oneNumPattern.test(password)) {
        errors.push('Password must contain at least 1 number');
    }

    // Make sure password has at least one symbol
    const oneSymbolPattern = /^(?=.*[!@#$%^&*_+.<>/?-])/;
    if (!oneSymbolPattern.test(password)) {
        errors.push('Password must contain at least 1 symbol (! @ # $ % ^ & * _ + . < > / ? -');
    }

    return errors;
};

// Valdiate name inputs
const validateName = async (name) => {
    // Init storage for errors
    let errors = [];

    // Make sure name is not empty
    if (name.trim().length === 0) {
        errors.push('Name must not be empty space');
    }

    // Make sure name consists of only letters
    const letterPattern = /[a-zA-Z]/;
    if (!letterPattern.test(name)) {
        errors.push('Name must consist of only letters');
    }

    return errors;
};

// Validate email inputs
const validateEmail = async (emailAddress) => {
    // Init storage for errors
    let errors = [];

    // Make sure email address has an @ sign
    if (!emailAddress.includes('@')) {
        errors.push('Email address is invalid (must contain an @)');
    }

    // Make sure email address has at least 3 characters before the @
    const splitOnAt = emailAddress.split('@');
    if (splitOnAt[0].length < 3) {
        errors.push('Email address must have at least 3 characters');
    }

    return errors;
}

// Client-side validation for change password form
$('#changePasswordFormSubmit').on('click', async (event) => {
    // Prevent the default action
    event.preventDefault();

    // Aggregate errors
    let masterErrorList = [];

    // Validate the password inputs
    const firstPasswordErrors = await validatePassword($('#firstPasswordInput').val());
    if (firstPasswordErrors.length > 0) {
        firstPasswordErrors.forEach((error) => {
            // Add error to master list
            masterErrorList.push(`New Password Error: ${error}`);
        });
    }

    const secondPasswordErrors = await validatePassword($('#secondPasswordInput').val());
    if (secondPasswordErrors.length > 0) {
        secondPasswordErrors.forEach((error) => {
            // Add error to master list
            masterErrorList.push(`Confirm Password Error: ${error}`);
        });
    }

    // Valdiate that the two new passwords match
    if ($('#firstPasswordInput').val() !== $('#secondPasswordInput').val()) {
        // Add error to master list
        masterErrorList.push('New passwords do not match');
    }

    // Check master list
    if (masterErrorList.length > 0) {
        // Show the client error div
        $('#clientErrors').show();

        masterErrorList.forEach((error) => {
            // Add each error to the list
            $('.clientErrorList').append(`<li>${error}</li>`)
        });
    } else {
        $('#changePasswordForm').submit();
    }
});

// Client-side validation for registration form
$('#registerFormSubmit').on('click', async (event) => {
    // Prevent the default action
    event.preventDefault();

    // Aggregate errors
    let masterErrorList = [];

    // Validate the email input
    const emailErrors = await validateEmail($('#emailInput').val());
    if (emailErrors.length > 0) {
        emailErrors.forEach((error) => {
            masterErrorList.push(error);
        });
    }

    // Validate the name parameters
    const firstNameErrors = await validateName($('#firstNameInput').val());
    if (firstNameErrors.length > 0) {
        firstNameErrors.forEach((error) => {
            masterErrorList.push(error);
        });
    }

    const lastNameErrors = await validateName($('#lastNameInput').val());
    if (lastNameErrors.length > 0) {
        lastNameErrors.forEach((error) => {
            masterErrorList.push(error);
        });
    }

    // Validate the passwords
    const firstPasswordErrors = await validatePassword($('#firstPasswordInput').val());
    if (firstPasswordErrors.length > 0) {
        firstPasswordErrors.forEach((error) => {
            // Add error to master list
            masterErrorList.push(`New Password Error: ${error}`);
        });
    }

    const secondPasswordErrors = await validatePassword($('#secondPasswordInput').val());
    if (secondPasswordErrors.length > 0) {
        secondPasswordErrors.forEach((error) => {
            // Add error to master list
            masterErrorList.push(`Confirm Password Error: ${error}`);
        });
    }

    // Valdiate that the two new passwords match
    if ($('#firstPasswordInput').val() !== $('#secondPasswordInput').val()) {
        // Add error to master list
        masterErrorList.push('New passwords do not match');
    }

    // Check master list
    if (masterErrorList.length > 0) {
        // Show the client error div
        $('#clientErrors').show();

        masterErrorList.forEach((error) => {
            // Add each error to the list
            $('.clientErrorList').append(`<li>${error}</li>`)
        });
    } else {
      $('.registerForm').submit();
    }
});

// Allow the user to confirm that they actually want to delete their user
$('#deleteProfileButton').on('click', async (event) => {
    // Prevent the default action
    event.preventDefault();

    // Grab the link
    const next = $('#deleteProfileButton').attr('href');
    console.log(next);

    // Offer a confirmation prompt
    if (window.confirm('Are you sure you want to delete your profile? This is permanent and data cannot be recovered...')) {
        window.location.href = next;
    } else {
        location.reload();
    }
});