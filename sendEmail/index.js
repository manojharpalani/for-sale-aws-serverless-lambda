var aws = require('aws-sdk');
var ses = new aws.SES({
   region: 'us-west-2'
});

exports.handler = function(event, context) {
    console.log("Send Email Event: ", event);

    var eParams = {
        Destination: {
            ToAddresses: [event.toAddress]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: event.body
                }
            },
            Subject: {
                Data: event.subject
            }
        },
        Source: "buysellease@gmail.com"
    };

    console.log('===SENDING EMAIL===');
    var email = ses.sendEmail(eParams, function(err, data){
        if(err) {
            console.log(err);
        } else {
            console.log("===EMAIL SENT===");
            console.log(data);
            console.log("EMAIL CODE END");
            console.log('EMAIL: ', email);
            context.succeed(event);
        }
    });

};