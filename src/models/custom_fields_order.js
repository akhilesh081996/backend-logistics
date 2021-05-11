/*
	@author: Harsh CZ
	@since : 16-04-2020 12:53PM (Thursday)
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const CustomFieldsOrderSchema = new mongoose.Schema({ 
    agency_id: {
        type: String,
        required: true
    },
    module: {
        type: Schema.Types.ObjectId, ref: 'Module',
        required: true
    },
	form:{
		type: String,
		required:true
	},
	field_name:{
		type: String
	},
	field_type:{
		type: String,
        required: true
	},
	options:{
		type: Array 
	},
    description: {
        type: String
    },
	placeholder:{
		type:String
	},
	required:{
		type:Boolean
	},
    status: {
        type: Number,
        default: 0
    },
  	created_by:{type:String},
	updated_by:{type:String},
}, schemaOptions);


module.exports = mongoose.model('CustomFieldsOrder', CustomFieldsOrderSchema, 'custom_fields_order');