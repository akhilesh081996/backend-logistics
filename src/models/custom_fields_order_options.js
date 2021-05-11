/*
	@author: Harsh CZ
	@since : 09-06-2020 10:41AM (Tuesday)
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const CustomFieldsOrderOptionsSchema = new mongoose.Schema({ 
     agency: {
        type: Schema.Types.ObjectId, ref: 'Agency', required:true
    },
    custom_field_id: {
       type: Schema.Types.ObjectId, ref: 'CustomFieldsOrder', required:true
    },
	option_name:{
		type: String
	},
    status: {
        type: Number,
        default: 1
    },
	created_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User', required:true }
}, schemaOptions);


module.exports = mongoose.model('CustomFieldsOrderOptions', CustomFieldsOrderOptionsSchema, 'custom_fields_order_options');