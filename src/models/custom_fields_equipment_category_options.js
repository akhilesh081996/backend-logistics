/*
	@author: Harsh CZ
	@since : 21-07-2020 12:05PM (Tuesday)
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const CustomFieldsEquipmentCategoryOptionsSchema = new mongoose.Schema({ 
    agency: {
        type: Schema.Types.ObjectId, ref: 'Agency', required:true
    },
    custom_field_id: {
       type: Schema.Types.ObjectId, ref: 'CustomFieldsEquipmentCategory', required:true
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


module.exports = mongoose.model('CustomFieldsEquipmentCategoryOptions', CustomFieldsEquipmentCategoryOptionsSchema, 'custom_fields_equipment_category_options');