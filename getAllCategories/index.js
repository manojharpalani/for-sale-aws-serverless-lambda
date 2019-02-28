'use strict';

var AWS = require('aws-sdk'),
	documentClient = new AWS.DynamoDB.DocumentClient(); 

exports.getAllCategories = function(event, context, callback){
	var params = {
		TableName : process.env.TABLE_NAME,
		AttributesToGet: ["id", "name", "displayName"]
	};
	documentClient.scan(params, function(err, data){
		if(err){
		    callback(err, null);
		}else{
		    callback(null, data.Items);
		}
	});
}