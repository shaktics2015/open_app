/*
 * 		at http://localhost:3000/api/status. 
 */

var mongoose = require('mongoose');

const route = 'status'; 	// Route: 'status' routes to /status
const modelId = 'Status';   

var Schema = new mongoose.Schema({ 
    client_id: {
		type: String,
		unique: true,
		required: true
	},
	username: {
        type: String, 
        required: true
    }, 
	caller_address: String,
	flag: {type: Number, default: 1}, // 1:- Online, 2:- disconnected
},{timestamps: true}); 

module.exports = {
	model: mongoose.model(modelId, Schema),
	route: route
} 