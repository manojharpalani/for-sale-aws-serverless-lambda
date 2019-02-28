'use strict';

var AWS = require('aws-sdk'),
	documentClient = new AWS.DynamoDB.DocumentClient(); 

exports.updatePost = function(event, context, callback){
	let title = event.data.title;
	let price = event.data.price;
	let desc = event.data.description;
	let condition = event.data.condition;
	let firmOnPrice = event.data.firmOnPrice;
	let image = event.data.image;
	let images = event.data.images;
	let group = event.data.group;
	let subGroups = event.data.subGroups;
	let category = event.data.category;
	
	let finalUpdateExpression = "set ";
	let updateAttributes = [];
	let expressionAttributeValues = {};
	let expressionAttributeNames = {};
	
	var updatedDateTime = (new Date).getTime();
	updateAttributes.push('updatedDateTime = :updatedDateTime');
	expressionAttributeValues[':updatedDateTime'] = updatedDateTime;

	if (title) {
		updateAttributes.push('title = :title');
		expressionAttributeValues[':title'] = title;
	}
	
	if (price) {
		updateAttributes.push('price = :price');
		expressionAttributeValues[':price'] = price;
	}
	
	if (condition) {
		updateAttributes.push('#condition = :condition');
		expressionAttributeValues[':condition'] = condition;
		expressionAttributeNames['#condition'] = 'condition';
	}
	
	if (desc) {
		updateAttributes.push('description = :description');
		expressionAttributeValues[':description'] = desc;
	}
	
	if (!(firmOnPrice == null)) {
		updateAttributes.push('firmOnPrice = :firmOnPrice');
		expressionAttributeValues[':firmOnPrice'] = firmOnPrice;
	}	
	
	if (image) {
		updateAttributes.push('image = :image');
		expressionAttributeValues[':image'] = image;
	}
	
	if (images) {
		updateAttributes.push('images = :images');
		expressionAttributeValues[':images'] = images;
	}
	
	if (group) {
		updateAttributes.push('group = :group');
		expressionAttributeValues[':group'] = group;
	}
	
	if (subGroups) {
		updateAttributes.push('subGroups = :subGroups');
		expressionAttributeValues[':subGroups'] = subGroups;
	}
	
	if (category) {
		updateAttributes.push('category = :category');
		expressionAttributeValues[':category'] = category;
	}
	
	for (let i = 0; i < updateAttributes.length; i++) {
		finalUpdateExpression += updateAttributes[i];
		if (i+1 !== updateAttributes.length) {
			finalUpdateExpression += ', ';
		}
	}
	
	console.log('UpdateExpression: ' + finalUpdateExpression);
	console.log('ExpressionAttributeValues: ' + JSON.stringify(expressionAttributeValues));
	
	var params = {
		TableName : process.env.TABLE_NAME,
		Key: {
		"id": event.id
		},
		UpdateExpression: finalUpdateExpression,
		ExpressionAttributeValues: expressionAttributeValues,
		ReturnValues:"UPDATED_NEW"
	};
	
	if (Object.keys(expressionAttributeNames).length > 0) {
		params['ExpressionAttributeNames'] = expressionAttributeNames;
	}
	
	documentClient.update(params, function(err, data){
		if(err){
		    callback(err, null);
		}else{
		    callback(null, data.Attributes);
		}
	});
}