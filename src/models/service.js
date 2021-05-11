'use strict';

const mongoose = require('mongoose'),
	  Schema = mongoose.Schema
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
	static: false
};

const ServiceSchema = new mongoose.Schema({
    vehicle:{ type: Schema.Types.ObjectId, ref: 'Vehicle', required:true},
    agency:{ type: Schema.Types.ObjectId, ref: 'Agency', required:true},
    registration_no: {type : String  ,required: true},
    service_date: {type : Date  ,required: true},
    total_run:{type : Number  ,required: true},
    service_cost: {type : Number  ,required: true},
    labour_cost:{type : Number  ,required: true},
    total_cost: {type : Number  ,required: true},
    workshop_name: {type : String  ,required: true},
    workshop_contact: {type : Number  ,required: true},
    workshop_address: {type : String  ,required: true},
    work_description: {type : String },  
    custom_fields:{},
	created_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
	updated_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
	status:{type:Number, default:1}
},  schemaOptions);

module.exports = mongoose.model( 'Service',  ServiceSchema , 'service');
