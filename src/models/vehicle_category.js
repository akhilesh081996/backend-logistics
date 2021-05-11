/*
	@author: Harsh CZ
	@since : 14-07-2020 03:45PM (Tuesday)
*/

const mongoose = require('mongoose'),
 	Schema = mongoose.Schema;
const schemaOptions = {
  	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  	//strict:false
};

const vehiclecategorychema = new mongoose.Schema({
    category_name : {type:String, required: true },
    agency: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    description: {type: String},
    status: {type: Number, default:1},
    custom_fields:{},
	  created_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User', required:true }
}, schemaOptions);

module.exports = mongoose.model('VehicleCategory', vehiclecategorychema, 'vehicle_category');