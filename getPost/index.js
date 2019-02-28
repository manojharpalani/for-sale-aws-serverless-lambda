'use strict';

var AWS = require('aws-sdk'),
	documentClient = new AWS.DynamoDB.DocumentClient(),
 cognitoClient = new AWS.CognitoIdentityServiceProvider();
 

exports.getPost = function(event, context, callback){
	var params = {
		TableName : process.env.TABLE_NAME,
		Key: {
		    "id": event.id
	    }
	};


	documentClient.get(params, function(err, data){
		if(err){
		    callback(err, null);
		}else{
		    getUserDetails(data.Item, callback);
		}
	});
}

let getUserDetails = function(postData, callback) {
	var userId = postData.userId;
	console.log('UserId : ' + userId);
	var filterExp = "sub =\"" + userId + "\"";
	
	cognitoClient.listUsers({
	    "AttributesToGet": ["given_name"],
	    "Limit": 1,
	    "UserPoolId": process.env.USER_POOL,
	    "Filter": filterExp
	}, function(err, data){
		if(err){
		    callback(err, null);
		}else{
		    returnResults(postData, data.Users[0], callback);
		}
	});


}

let returnResults = function(postData, user, callback) {
	if (user) {
		var userName = user.Attributes[0].Value;
		console.log('User Name: ' + userName);
		postData.userName = userName;
		callback(null, postData);	
	} else {
		callback(new Error("Unable to get user from cognito"), null)
	}
	
}