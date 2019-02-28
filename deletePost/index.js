'use strict';

var AWS = require('aws-sdk'),
	documentClient = new AWS.DynamoDB.DocumentClient(); 

exports.deletePost = function(event, context, callback){
	var params = {
		TableName : process.env.TABLE_NAME,
		Key: {
		    "id": event.id
	    }
	};
	documentClient.delete(params, function(err, data){
		if(err){
		    callback(err, null);
		}else{
		    callback(null, data);
		}
	});
}