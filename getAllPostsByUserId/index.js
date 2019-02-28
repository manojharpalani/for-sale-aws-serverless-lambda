'use strict';

var AWS = require('aws-sdk'),
	documentClient = new AWS.DynamoDB.DocumentClient(); 

exports.getAllPostsByUserId = function(event, context, callback){
	var params = {
		TableName : process.env.TABLE_NAME,
		IndexName : process.env.INDEX_NAME,
		ExpressionAttributeValues: {
           ":userId": event.userId
        },
        KeyConditionExpression: "userId = :userId",
        ScanIndexForward: false
	};
	documentClient.query(params, function(err, data){
		if(err){
		    callback(err, null);
		}else{
		    callback(null, data.Items);
		}
	});
}