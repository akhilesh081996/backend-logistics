'use strict';

const mongoose = require('mongoose'), 
	  Schema = mongoose.Schema

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
}

const logagencyschema = new mongoose.Schema({
    operation: { type: String },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
	updated_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
	agency:{ type: Schema.Types.ObjectId, ref: 'Agency', required:true },
	'old_payload':{type:Object},
	'new_payload':{type:Object}
}, schemaOptions);

module.exports = mongoose.model('LogAgency', logagencyschema, 'log_agencies');