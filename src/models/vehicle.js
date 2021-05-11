'use strict';

const mongoose = require('mongoose'),
	  Schema = mongoose.Schema
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
	strict:false
};

const Vehicleschema = new mongoose.Schema({
    registration_no: {type : String  ,required: true, index: { unique: true }  },
    // agency: { type: Schema.Types.ObjectId, ref: 'Agency', required:true },
    registration_date: {type : Date  ,required: true},
    registration_validity:{type : Date  ,required: true},
    no_of_cylinder: {type : Number  ,required: true},
    vehicle_category: { type: Schema.Types.ObjectId, ref: 'VehicleCategory', required:true },
    seating_capacity: {type : Number  ,required: true},
    makers_name: {type : String  ,required: true},
    fuel_type: {type : String  },
    chassis_no: {type : String },
    color: {type : String },
    engine_no:{type : String },
    cubic_capacity:{type: Number},
    no_of_wheels: {type : Number  ,required: true},
    insurance_validity: {type : Date},
    tax_paid_upto:{type : Date  ,required: true},
     // permit_valid_upto:{type : String  ,required: true},
    owner_name: {type : String  ,required: true},
    owner_contact: {type : Number  ,required: true},
    owner_address:{type : String  ,required: true},
    agency:{ type: Schema.Types.ObjectId, ref: 'Agency', required:true },
    vehicle_images: {},
    vehicle_documents:{},     
    custom_fields:{},
    status:{type : Number, default:1},
	  created_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
}, schemaOptions);

module.exports = mongoose.model( 'Vehicle',  Vehicleschema , 'vehicles');
