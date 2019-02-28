'use strict';

var AWS = require('aws-sdk'),
	documentClient = new AWS.DynamoDB.DocumentClient(); 

exports.searchPosts = function(event, context, callback){
	var limit = event.limit ? parseInt(event.limit) : 40;
	var paginationKey = event.paginationKey;
	var priceFrom = event.priceFrom ? parseInt(event.priceFrom) : 0;
	var priceTo = event.priceTo ? parseInt(event.priceTo) : 99999;
	var category = event.category;
	var group = event.group;
	var subGroup = event.subGroup;
	var query = event.query;
	var currentUserId = event.currentUserId;
	var userId = event.userId;
	var status = event.status;
	
    var expressionAttributeNames = {
           "#group": "group",
           "#status": "status"
    };
    
    var expressionAttributeValues = {
           ":group": group
    };
    
    var filterExpressions = [];
    
    if (priceTo) {
    	filterExpressions.push('(price BETWEEN :priceFrom and :priceTo)');
    	expressionAttributeValues[':priceFrom'] = priceFrom;
    	expressionAttributeValues[':priceTo'] = priceTo;
    }
    
    if (query) {
    	filterExpressions.push('contains (title, :query)');
    	expressionAttributeValues[':query'] = query;
    }
    
    if (category) {
        filterExpressions.push('category = :category');
        expressionAttributeValues[':category'] = category;
    }

    if (userId) {
        filterExpressions.push('userId = :userId');
        expressionAttributeValues[':userId'] = userId;
    }

    if (currentUserId) {
        filterExpressions.push('(NOT userId = :currentUserId)');
        expressionAttributeValues[':currentUserId'] = currentUserId;
    }
    
    if (subGroup) {
        filterExpressions.push('contains (subGroup, :subGroup)');
        expressionAttributeValues[':subGroup'] = subGroup;
    }

	// Query for only status = active
	if (!status) {
		status = 'active'
	}
	filterExpressions.push('#status = :status');
	expressionAttributeValues[':status'] = status;
	
	var finalFilterExpression = andFilters(filterExpressions);
	
    console.log('FilterExpression: ' + finalFilterExpression);
    console.log('ExpressionAttributeNames: ' + JSON.stringify(expressionAttributeValues));
    
	var params = {
		TableName : process.env.TABLE_NAME,
		IndexName : process.env.INDEX_NAME,
		ProjectionExpression: 'id, title, price, image, thumbnail, updatedDateTime',
		ExpressionAttributeNames: expressionAttributeNames,
		ExpressionAttributeValues: expressionAttributeValues,
        KeyConditionExpression: "#group = :group",
        ScanIndexForward: false,
        Limit: limit
    };
	
	if (finalFilterExpression) {
		params['FilterExpression'] = finalFilterExpression;
	}
	
	if (paginationKey) {
		var tokens = paginationKey.split('|');
		console.log(tokens);
		if (tokens.length !== 3) {
			callback(new Error('Invalid paginationKey, Use format <id>|<updatedDateTime>|<group>'), null);
		}
    	params['ExclusiveStartKey'] = { "id" : tokens[0],
    		"updatedDateTime": parseFloat(tokens[1]),
    		"group": tokens[2]
    	};
    }
    
    console.log('Query ' + JSON.stringify(params));
    
	documentClient.query(params, function(err, data){
		if(err){
		    callback(err, null);
		}else{
			console.log('Data: ' + JSON.stringify(data));
			var response = {};
			var paginationKey;
			response['posts'] = data.Items;
			response['count'] = data.Count;
			if (data.LastEvaluatedKey) {
				paginationKey = data.LastEvaluatedKey['id'] + '|' + data.LastEvaluatedKey['updatedDateTime'] + '|' + data.LastEvaluatedKey['group'];
			}
			response['paginationKey'] = paginationKey;
		    callback(null, response);
		}
	});
}

let andFilters = function(filterExpressions) {
	var finalFilterExpression = "";
	for (let i = 0; i < filterExpressions.length; i++) {
		finalFilterExpression += filterExpressions[i];
		if (i+1 != filterExpressions.length) {
			finalFilterExpression += " and ";
		}
	}
	return finalFilterExpression;
}