/*
	@author: Harsh CZ
	@since : 21-07-2020 12:02PM (Tuesday)
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const CustomFieldsEquipmentCategorySchema = new mongoose.Schema({ 
    agency: {
        type: Schema.Types.ObjectId, ref: 'Agency',
        required: true
    },
    module: {
        type: Schema.Types.ObjectId, ref: 'EquipmentCategory',
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

module.exports = mongoose.model('CustomFieldsEquipmentCategory', CustomFieldsEquipmentCategorySchema, 'custom_fields_equipment_category');