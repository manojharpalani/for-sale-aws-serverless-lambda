exports.handler = function(event, context, callback) {
    // This Lambda function returns a flag to indicate if a user should be auto-confirmed.

    // Perform any necessary validations.

    // Impose a condition that the minimum length of the username of 5 is imposed on all user pools.
    if (event.userName.length < 5) {
        var error = new Error('User name should be atleast 5 char!');
        context.done(error, event);
    }

    // Access your resource which contains the list of emails of users who were invited to sign up

    // Compare the list of email IDs from the request to the approved list
    if (!event.request.userAttributes.email.endsWith('@gmail.com')) {
            var error = new Error('Email should be @gmail.com!');
            context.done(error, event);
    }
    // Return result to Cognito
    context.done(null, event);
};