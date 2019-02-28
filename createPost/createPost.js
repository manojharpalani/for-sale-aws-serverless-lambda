'use strict';

var AWS = require('aws-sdk'),
	uuid = require('uuid'),
	documentClient = new AWS.DynamoDB.DocumentClient(); 

exports.createPost = function(event, context, callback){
	var createdDateTime = (new Date).getTime();
	
	if (!event.title) {
		callback(new Error('Missing title'), null);
	}
	
	if (!event.price) {
		callback(new Error('Missing price'), null);
	}
	
	if (!event.userId) {
		callback(new Error('Missing userId'), null);
	}
	
	if (!event.group) {
		callback(new Error('Missing group'), null);
	}
	
	if (!event.condition) {
		callback(new Error('Missing condition'), null);
	}
	
	if (!event.firmOnPrice) {
		callback(new Error('Missing firmOnPrice'), null);
	}
	
	if (!event.subGroups) {
		callback(new Error('Missing subGroups'), null);
	}
	
	var params = {
		Item : {
			"id" : uuid.v1(),
			"createdDateTime" : createdDateTime,
			"updatedDateTime" : createdDateTime,
			"title" : event.title,
			"price" : Number.parseFloat(event.price),
			"description" : event.description,
			"condition": event.condition,
			"firmOnPrice": event.firmOnPrice,
			"images" : [],
			"category": event.category,
			"userId": event.userId,
			"group": event.group,
			"subGroups": event.subGroups,
			"status": "active"
		},
		TableName : process.env.TABLE_NAME
		};
	documentClient.put(params, function(err, data){
		if (err) {
			callback(err, null)
		} else {
			callback(err, params.Item);	
		}
		
	});
}