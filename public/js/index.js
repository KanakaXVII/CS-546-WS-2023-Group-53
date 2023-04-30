const validatePassword = async (password) => {
    // Init storage for passwords
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
}

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