/*
	@author: Harsh CZ
	@since : 22-07-2020 02:22PM (Wednesday)
*/

const mongoose = require('mongoose'),
 	Schema = mongoose.Schema;
const schemaOptions = {
  	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
};

const taxchema = new mongoose.Schema({
    tax_name : {type:String, required: true },
    agency: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    description: {type: String},
    value: {type: String},
    type: {type: String},
    status: {type: Number, default:1},
	created_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User', required:true }
}, schemaOptions);

module.exports = mongoose.model('Tax', taxchema, 'tax');