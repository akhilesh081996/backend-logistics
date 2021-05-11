'use strict';

const mongoose = require('mongoose'), 
	  Schema = mongoose.Schema
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
}

const logagencymoduleschema = new mongoose.Schema({
    operation: { type: String },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
	updated_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
	agency_module_id:{ type: Schema.Types.ObjectId, ref: 'AgencyModule', required:true },
	'old_payload':{type:Object},
	'new_payload':{type:Object}
}, schemaOptions);

module.exports = mongoose.model('LogAgencyModule', logagencymoduleschema, 'log_agency_modules');