/*
	@author: Harsh CZ
	@since : 16-04-2020 12:30PM (Thursday)
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const CustomFieldsVehicleSchema = new mongoose.Schema({ 
    agency: {
        type: Schema.Types.ObjectId, ref: 'Agency',
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
	name:{
		type:String
	},
	title:{
		type:String
	},
    status: {
        type: Number,
        default: 0
    },
	created_by:{ type: Schema.Types.ObjectId, ref: 'User'},
	updated_by:{ type: Schema.Types.ObjectId, ref: 'User'},
}, schemaOptions);


module.exports = mongoose.model('CustomFieldsVehicle', CustomFieldsVehicleSchema, 'custom_fields_vehicle');