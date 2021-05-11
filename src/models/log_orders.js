'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
}

const logorderschema = new mongoose.Schema({
    operation: { type: String },
	order:{ type: Schema.Types.ObjectId, ref: 'Order'},
	order_item:{  type: Schema.Types.ObjectId, ref: 'OrderItem'},
    agency : { type: Schema.Types.ObjectId, ref: 'Agency', required:true },
	created_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
	'old_payload':{type:Object},
	'new_payload':{type:Object}
}, schemaOptions);

module.exports = mongoose.model('LogOrder', logorderschema, 'log_orders');