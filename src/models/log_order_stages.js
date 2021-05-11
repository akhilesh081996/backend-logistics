'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
}

const logorderstageschema = new mongoose.Schema({
    operation: { type: String },
	order_stage:{ type: Schema.Types.ObjectId, ref: 'OrderStages'},
    agency : { type: Schema.Types.ObjectId, ref: 'Agency', required:true },
	created_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
	'old_payload':{type:Object},
	'new_payload':{type:Object}
}, schemaOptions);

module.exports = mongoose.model('LogOrderStage', logorderstageschema, 'log_order_stages');