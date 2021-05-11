'use strict';

const mongoose = require('mongoose');

const logmoduleschema = new mongoose.Schema({
    operation: { type: String },
    created_by: { type: String },
	updated_by: { type:String},
	module_id:{ type:String},
	created_at: {
		type:Date,
		// `Date.now()` returns the current unix timestamp as a number
    	default: Date.now
	}
});

module.exports = mongoose.model('LogModule', logmoduleschema, 'log_modules');