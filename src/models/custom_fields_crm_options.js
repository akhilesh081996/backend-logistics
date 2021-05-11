/*
	@author: Harsh CZ
	@since : 08-06-2020 07:07PM (Monday)
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const CustomFieldsCRMOptionsSchema = new mongoose.Schema({ 
    agency: {
        type: Schema.Types.ObjectId, ref: 'Agency', required:true
    },
    custom_field_id: {
       type: Schema.Types.ObjectId, ref: 'CustomFieldsCRM', required:true
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


module.exports = mongoose.model('CustomFieldsCRMOptions', CustomFieldsCRMOptionsSchema, 'custom_fields_crm_options');