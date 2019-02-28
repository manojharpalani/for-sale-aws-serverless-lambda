'use strict';

var AWS = require('aws-sdk'),
	documentClient = new AWS.DynamoDB.DocumentClient(); 

exports.getSubGroupsByGroupId = function(event, context, callback){
	var params = {
		TableName : process.env.TABLE_NAME,
		IndexName : process.env.INDEX_NAME,
		ProjectionExpression: ["id", "displayName", "#order"],
		ExpressionAttributeValues: {
           ":groupId": event.groupId
        },
        ExpressionAttributeNames: {
            "#order" : "order"
        },
        KeyConditionExpression: "groupId = :groupId",
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