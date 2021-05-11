/*
	@author: Harsh CZ
	@since : 08-06-2020 07:10PM (Monday)
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const CustomFieldsVehicleOptionsSchema = new mongoose.Schema({ 
    agency: {
        type: Schema.Types.ObjectId, ref: 'Agency', required:true
    },
    custom_field_id: {
       type: Schema.Types.ObjectId, ref: 'CustomFieldsVehicle', required:true
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


module.exports = mongoose.model('CustomFieldsVehicleOptions', CustomFieldsVehicleOptionsSchema, 'custom_fields_vehicle_options');