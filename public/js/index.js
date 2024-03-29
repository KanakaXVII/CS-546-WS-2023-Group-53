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
const validateStr = async (varName, varVal) => {
    // Init storage for errors
    let errors = [];

    // Make sure name is not empty
    if (varVal.trim().length === 0) {
        errors.push(`${varName} must not be empty space`);
    }

    // Make sure name consists of only letters
    const letterPattern = /^[a-zA-Z]+$/;
    if (!letterPattern.test(varVal)) {
        errors.push(`${varName} must consist of only letters`);
    }

    return errors;
};

const validateYear = async (year) => {
    // Init storage for errors
    let errors = [];

    // Convert value to number
    year = Number(year);

    // Make sure the year is within legal bounds
    const currentYear = new Date().getFullYear();
    
    if (year > currentYear + 100 || year < currentYear) {
        errors.push('Year must be between this year and 100 years from now');
    }
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

// Validate amount inputs
const validateAmount = async (varName, varVal) => {
    // make sure it is not empty

    let errors = [];

    if (varVal.trim().length === 0) {
        errors.push(`${varName} must not be empty space`);
    }

    // make sure it contains only numbers
    const numberPattern = /^[0-9]+$/;
    if (!numberPattern.test(varVal)) {
        errors.push(`${varName} must consist of only numbers`);
    }
    
    varVal = Number(varVal);

    // make sure number is not negative
    if (varVal < 0) {
        errors.push(`${varName} must not be negative`);
    }

    return errors;
}

/* Non-function Section */

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
    const firstNameErrors = await validateStr('First Name', $('#firstNameInput').val());
    if (firstNameErrors.length > 0) {
        firstNameErrors.forEach((error) => {
            masterErrorList.push(error);
        });
    }

    const lastNameErrors = await validateStr('Last Name', $('#lastNameInput').val());
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

    console.log(masterErrorList);

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

// date-range filter for transactions
$(function() {
    $('input[name="transactionDateFilter"]').daterangepicker({
      opens: 'left'
    }, function(start, end, label) {
      let startDate = start.format('YYYY-MM-DD');
      let endDate = end.format('YYYY-MM-DD');
      let url = '/dashboard?transaction_start_date=' + startDate + '&transaction_end_date=' + endDate;
      window.location.href = url;
    });
  });

// date-range filter for paychecks
$(function() {
    $('input[name="paychecksDateFilter"]').daterangepicker({
      opens: 'left'
    }, function(start, end, label) {
      let startDate = start.format('YYYY-MM-DD');
      let endDate = end.format('YYYY-MM-DD');
      let url = '/dashboard?paychecks_start_date=' + startDate + '&paychecks_end_date=' + endDate;
      window.location.href = url;
    });
  });


// Validate payment method form
$('#newMethodNameSubmit').on('click', async (event) => {
    // Prevent the default action
    event.preventDefault();

    // Validate the string input
    let errorList = [];
    try {
        methodNameErrors = await validateStr('Payment Method Name', $('#methodNameInput').val());
    } catch (e) {
        errorList.append(e);
    }

    // Check for errors
    if (errorList.length > 0) {
        $('.clientErrors').append(e);
    } else {
        $('#newPaymentMethodForm').submit();
    }
});

// Validate new budget form
$('#addBudgetSubmit').on('click', async (event) => {
    // Prevent the default action
    event.preventDefault();

    // Validate the inputs
    let errors = [];
    const categoryErrors = await validateStr('Budget Name', $('#budgetNameInput').val());
    const  budgetAmountErrors = await validateAmount('Budget Amount', $('#budgetedAmountInput').val());

    if (categoryErrors.length > 0) {
        categoryErrors.forEach((err) => {
            errors.push(err);
        });
    }

    if (budgetAmountErrors.length > 0) {
        budgetAmountErrors.forEach((err) => {
            errors.push(err);
        });
    }

    // Check the errors list
    if (errors.length > 0) {
        // Render the client-side error div
        $('.clientSideErrors').show();

        // Add each error
        errors.forEach((err) => {
            $('.clientSideErrors').append(`<p>${err}</p>`);
        });
    } else {
        $('.addBudgetForm').submit();
    }
});

// validate new transaction form
$('#transactionSubmit').on('click', async (event) => {

    event.preventDefault();

    let errors = [];
    const amountErrors = await validateAmount('amount', $('#amountInput').val());
    const expenseNameErrors = await validateStr('expense name', $('#expenseNameInput').val());
    const paymentMethodErrors = await validateStr('payment method', $('#methodInput').val());
    const categoryErrors = await validateStr('category', $('#categoryInput').val());

    if (amountErrors.length > 0) {
        amountErrors.forEach((err) => {
            errors.push(err);
        });
    }

    if (expenseNameErrors.length > 0) {
        expenseNameErrors.forEach((err) => {
            errors.push(err);
        });
    }

    if (paymentMethodErrors.length > 0) {
        paymentMethodErrors.forEach((err) => {
            errors.push(err);
        });
    }

    if (categoryErrors.length > 0) {
        categoryErrors.forEach((err) => {
            errors.push(err);
        });
    }

    // check the errors list
    if (errors.length > 0) {
        // render the client-side error div
        $('.clientSideErrors').show();

        // add each error
        errors.forEach((err) => {
            $('.clientSideErrors').append(`<p>${err}</p>`);
        });
    }
    else {
        $('.transactionForm').submit();
    }
});

// validate dashboard paycheck amount filter form
$('#paycheckAmountFilter').on('click', async (event) => {
    event.preventDefault();

    let errors = [];

    const minAmountErrors = await validateAmount('min amount', $('#paycheckMinAmount').val());
    const maxAmountErrors = await validateAmount('max amount', $('#paycheckMaxAmount').val());

    if (minAmountErrors.length > 0) {
        minAmountErrors.forEach((err) => {
            errors.push(err);
        });
    }

    if (maxAmountErrors.length > 0) {
        maxAmountErrors.forEach((err) => {
            errors.push(err);
        });
    }

    // check the errors list
    if (errors.length > 0) {
        // render the client-side error div
        $('.clientSideErrors').show();

        // add each error
        errors.forEach((err) => {
            $('.clientSideErrors').append(`<p>${err}</p>`);
        });
    }else {
        $('.paycheckAmountFilter').submit();
    }
});

// validate dashboard transaction amount filter form
$('#transactionAmountFilter').on('click', async (event) => {
    event.preventDefault();

    let errors = [];

    const minAmountErrors = await validateAmount('min amount', $('#transactionMinAmount').val());
    const maxAmountErrors = await validateAmount('max amount', $('#transactionMaxAmount').val());

    if (minAmountErrors.length > 0) {
        minAmountErrors.forEach((err) => {
            errors.push(err);
        });
    }

    if (maxAmountErrors.length > 0) {
        maxAmountErrors.forEach((err) => {
            errors.push(err);
        });
    }

    // check the errors list
    if (errors.length > 0) {
        // render the client-side error div
        $('.clientSideErrors').show();

        // add each error
        errors.forEach((err) => {
            $('.clientSideErrors').append(`<p>${err}</p>`);
        });
    }else {
        $('.transactionAmountFilter').submit();
    }
});

// validate dashboard transaction amount filter form
$('#budgetAmountFilter').on('click', async (event) => {

    event.preventDefault();

    let errors = [];

    const minAmountErrors = await validateAmount('min amount', $('#budgetMinAmount').val());
    const maxAmountErrors = await validateAmount('max amount', $('#budgetMaxAmount').val());

    if (minAmountErrors.length > 0) {
        minAmountErrors.forEach((err) => {
            errors.push(err);
        });
    }

    if (maxAmountErrors.length > 0) {
        maxAmountErrors.forEach((err) => {
            errors.push(err);
        });
    }

    // check the errors list
    if (errors.length > 0) {
        // render the client-side error div
        $('.clientSideErrors').show();

        // add each error
        errors.forEach((err) => {
            $('.clientSideErrors').append(`<p>${err}</p>`);
        });
    }else {
        $('.budgetAmountFilter').submit();
    }
});

// validate paychecks notes
$('#searchByNotes').on('click', async (event) => {

    event.preventDefault();

    let errors = [];

    const notesErrors = await validateStr('notes', $('#paycheckSearchByNotes').val());

    if (notesErrors.length > 0) {
        notesErrors.forEach((err) => {
            errors.push(err);
        });
    }

    // check the errors list
    if (errors.length > 0) {
        // render the client-side error div
        $('.clientSideErrors').show();

        // add each error
        errors.forEach((err) => {
            $('.clientSideErrors').append(`<p>${err}</p>`);
        });
    }else {
        $('.searchByNotes').submit();
    }
});

// validate transactions categories

$('#transactionsCategoryFilter').on('click', async (event) => {

    event.preventDefault();

    let errors = [];

    const catErrors = await validateStr('category', $('#transactionsCategory').val());

    if (catErrors.length > 0) {
        catErrors.forEach((err) => {
            errors.push(err);
        });
    }

    // check the errors list
    if (errors.length > 0) {
        // render the client-side error div
        $('.clientSideErrors').show();

        // add each error
        errors.forEach((err) => {
            $('.clientSideErrors').append(`<p>${err}</p>`);
        });
    }else {
        $('.transactionsCategoryFilter').submit();
    }
});

// validate transactions method

$('#transactionMethodFilter').on('click', async (event) => {

    event.preventDefault();

    let errors = [];

    const catErrors = await validateStr('payment method', $('#transactionsPaymentMethod').val());

    if (catErrors.length > 0) {
        catErrors.forEach((err) => {
            errors.push(err);
        });
    }

    // check the errors list
    if (errors.length > 0) {
        // render the client-side error div
        $('.clientSideErrors').show();

        // add each error
        errors.forEach((err) => {
            $('.clientSideErrors').append(`<p>${err}</p>`);
        });
    }else {
        $('.transactionMethodFilter').submit();
    }
});


// validate transactions expense name
$('#transactionFilterByName').on('click', async (event) => {

    event.preventDefault();

    let errors = [];

    const catErrors = await validateStr('expense name', $('#transactionSearchByName').val());

    if (catErrors.length > 0) {
        catErrors.forEach((err) => {
            errors.push(err);
        });
    }

    // check the errors list
    if (errors.length > 0) {
        // render the client-side error div
        $('.clientSideErrors').show();

        // add each error
        errors.forEach((err) => {
            $('.clientSideErrors').append(`<p>${err}</p>`);
        });
    }else {
        $('.transactionFilterByName').submit();
    }
});


// validate budgets category
$('#budgetsCategoryFilter').on('click', async (event) => {

    event.preventDefault();

    let errors = [];

    const catErrors = await validateStr('category', $('#budgetsCategory').val());

    if (catErrors.length > 0) {
        catErrors.forEach((err) => {
            errors.push(err);
        });
    }

    // check the errors list
    if (errors.length > 0) {
        // render the client-side error div
        $('.clientSideErrors').show();

        // add each error
        errors.forEach((err) => {
            $('.clientSideErrors').append(`<p>${err}</p>`);
        });
    }else {
        $('.budgetsCategoryFilter').submit();
    }
});

//validate year and month
$('#budgetYearAndMonth').on('click', async (event) => {

    event.preventDefault();

    let errors = [];

    const catErrors = await validateStr('Month', $('#budgetMonth').val());
    const yearErrors = await validateStr('Year', $('#budgetYear').val());

    if (catErrors.length > 0) {
        catErrors.forEach((err) => {
            errors.push(err);
        });
    }

    if (yearErrors.length > 0) {
        yearErrors.forEach((err) => {
            errors.push(err);
        });
    }

    // check the errors list
    if (errors.length > 0) {
        // render the client-side error div
        $('.clientSideErrors').show();

        // add each error
        errors.forEach((err) => {
            $('.clientSideErrors').append(`<p>${err}</p>`);
        });
    }else {
        $('.budgetYearAndMonth').submit();
    }
})

// Validate the paycheck form inputs
$('#paycheckSubmit').on('click', async (event) => {
    // Prevent the default action
    event.preventDefault();

    // Validate the amount input
    const amountNum = Number($('#checkAmountInput').val());
    if (amountNum < 0) {
        // Create a new error item
        const newErrorMessage = $('<p>');
        newErrorMessage.text("The amount can't be less than 0");

        // Render the error
        $('#paycheckFormClientErrors').show();
        $('#paycheckFormClientErrors').append(newErrorMessage);
    } else {
        $('#newCheckForm').submit();
    }
});
