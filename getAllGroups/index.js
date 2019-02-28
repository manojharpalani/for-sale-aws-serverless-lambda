'use strict';

var AWS = require('aws-sdk'),
	documentClient = new AWS.DynamoDB.DocumentClient(); 

exports.getAllGroups = function(event, context, callback){
	var params = {
		TableName : process.env.TABLE_NAME,
		AttributesToGet: ["id", "name", "displayName", "domains"]
	};
	documentClient.scan(params, function(err, data){
		if(err){
		    callback(err, null);
		}else{
		    callback(null, data.Items);
		}
	});
}