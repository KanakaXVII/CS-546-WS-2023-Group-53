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

// check date for filters
// const checkDate = async (dateReceived) => {
//     let startDate = new Date(document.getElementById("transactionStartDate").value);
//     let endDate = new Date(document.getElementById("transactionEndDate").value);
//     let paycheckDate = new Date(dateReceived);

//     if (startDate <= paycheckDate && paycheckDate <= endDate) {
//       return true;
//     } else {
//       return false;
//     }
// }



// const filterTable = () => {
//     const query = document.querySelector('#filter').value.toLowerCase();
//     const rows = document.querySelectorAll('tbody tr');

//     rows.forEach((row) => {
//     const data = {
//       date: row.querySelector('td:nth-child(1)').textContent.toLowerCase(),
//       amount: row.querySelector('td:nth-child(2)').textContent.toLowerCase(),
//       notes: row.querySelector('td:nth-child(3)').textContent.toLowerCase(),
//     };

//     if (data.date.includes(query) || data.amount.includes(query) || data.notes.includes(query)) {
//       row.style.display = '';
//     } else {
//       row.style.display = 'none';
//     }
//     });
// };

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
   
// google.charts.load('current', { packages: ['corechart'] });
// google.charts.setOnLoadCallback(drawChart);
// //   console.log(graphData);
//   function drawChart() {
//     let data = google.visualization.arrayToDataTable(graphData);
  
//     let options = {'title':'How Much Pizza I Ate Last Night',
//     'width':400,
//     'height':300};
  
//     let chart = new google.visualization.PieChart(document.getElementById('chart_div'));
//     chart.draw(data, options);
//   }

// Validate new budget form
$('#addBudgetSubmit').on('click', async (event) => {
    // Prevent the default action
    event.preventDefault();

    // Validate the inputs
    let errors = [];
    const categoryErrors = await validateStr('Budget Name', $('#budgetNameInput').val());
    if (categoryErrors.length > 0) {
        categoryErrors.forEach((err) => {
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
