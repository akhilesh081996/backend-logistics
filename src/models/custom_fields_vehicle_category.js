/*
	@author: Harsh CZ
	@since : 15-07-2020 02:43PM (Wednesday)
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const CustomFieldsVehicleCategorySchema = new mongoose.Schema({ 
    agency: {
        type: Schema.Types.ObjectId, ref: 'Agency',
        required: true
    },
    module: {
        type: Schema.Types.ObjectId, ref: 'VehicleCategory',
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

module.exports = mongoose.model('CustomFieldsVehicleCategory', CustomFieldsVehicleCategorySchema, 'custom_fields_vehicle_category');