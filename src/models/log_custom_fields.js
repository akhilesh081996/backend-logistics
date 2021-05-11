'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const logcustomfieldschema = new mongoose.Schema({
    operation: { type: String },
    created_by: {  type: Schema.Types.ObjectId, ref: 'User', required:true  },
	updated_by: {  type: Schema.Types.ObjectId, ref: 'User', required:true },
	custom_field_id:{type:String},
    agency : { type: Schema.Types.ObjectId, ref: 'Agency', required:true  },
	module:{ type: Schema.Types.ObjectId, ref: 'Module', required:true },
}, schemaOptions);

module.exports = mongoose.model('LogCustomField', logcustomfieldschema, 'log_custom_fields');