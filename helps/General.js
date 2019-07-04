const User 	= require("../models/User");

var success = (message,data) => {
	return {
		status: 200,
		success: true,
		message: message,
		data: data
	};
};


var failure = (message, data = null) => {
	var response = {
		status: 500,
		success: false,
		message: message
	};

	if (data != null) 
	{
		response.data = data;
	}
	
	return response;
};

module.exports = {
	success,
	failure
}