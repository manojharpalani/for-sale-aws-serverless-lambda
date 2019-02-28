var aws = require('aws-sdk'),
 cognitoClient = new aws.CognitoIdentityServiceProvider();

var ses = new aws.SES({
   region: 'us-west-2'
});

var sourceEmail = 'buysellease@gmail.com';

exports.sendMessage = function(event, context, callback) {
    let fromUserId = event.fromUserId;
    let toUserId = event.toUserId;
    let subject = event.subject;
    let body = event.message;
    
    getFromUserEmail(fromUserId, toUserId, subject, body, callback);
};

let getFromUserEmail = function(fromUserId, toUserId, subject, body, callback) {
	var filterExp = "sub =\"" + fromUserId + "\"";
	
	console.log(filterExp);
	cognitoClient.listUsers({
	    "AttributesToGet": ["email"],
	    "UserPoolId": process.env.USER_POOL,
	    "Limit": 2,
	    "Filter": filterExp
	}, function(err, data){
		if(err){
		    return null;
		}else{
		    console.log("From User:" + JSON.stringify(data));
		    getToUserEmail(data.Users[0].Attributes[0].Value, toUserId, subject, body, callback);
		}
	});
}

let getToUserEmail = function(fromEmail, toUserId, subject, body, callback) {
	var filterExp = "sub =\"" + toUserId + "\"";
	cognitoClient.listUsers({
	    "AttributesToGet": ["email"],
	    "UserPoolId": process.env.USER_POOL,
	    "Limit": 1,
	    "Filter": filterExp
	}, function(err, data){
		if(err){
		    return null;
		}else{
		    console.log("To User:  " + JSON.stringify(data));
		    sendEmail(fromEmail, data.Users[0].Attributes[0].Value, subject, body, callback);
		}
	});
}

let sendEmail = function(fromEmail, toEmail, subject, body, callback) {
    
    var eParams = {
        Destination: {
            ToAddresses: [toEmail],
            CcAddresses: [fromEmail]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: body
                }
            },
            Subject: {
                Data: subject
            }
        },
        Source: sourceEmail,
        ReplyToAddresses: [fromEmail]
    };

    console.log('===SENDING EMAIL===');
    var email = ses.sendEmail(eParams, function(err, data){
        if(err) {
            console.log(err);
            callback(err, null);
        } else {
            console.log("===EMAIL SENT===");
            console.log(data);
            console.log("EMAIL CODE END");
            console.log('EMAIL: ', email);
            callback(null, {"message" : "success"})
        }
    });
}