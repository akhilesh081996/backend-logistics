'use strict';
const mongoose = require('mongoose'),
	 Schema = mongoose.Schema
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const driverSchema = new mongoose.Schema({
    agency: { type: Schema.Types.ObjectId, ref: 'Agency', required:true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required:true }, //driver as a user 
    vechile_id: { type: Schema.Types.ObjectId, ref: 'Vechile' ,required:false ,default :null},
    trailer_id: { type: Schema.Types.ObjectId, ref: 'Trailerschema' ,required:false ,default :null },
    user: { type: Schema.Types.ObjectId, ref: 'User', required:true },
     driver_experience :{type:String},
    driver_first_name: { type: String },
    driver_last_name: { type: String },
    driver_contact: { type: String },
    driver_email: { type: String },
    driver_password: { type: String },
    driver_licence_type: { type: String },

    driver_id: { type: String },
    driver_licence_no: { type: String },
    driver_image: { type: String },
    licence_date_of_issue: { type: String },
    licence_date_of_expired: { type: String },
    driver_date_of_birth: { type: String },
    driver_current_address: { type: String },
    driver_permanent_address: { type: String },
    driver_medical_certificate:{type: String},
    driver_document_proof:{type:String},
    driver_document:{type:String},
    deleted:{ type: Number, default: 0}, //  type 0 for active and 1 for deleted
    status: { type: Number, default: 0}, // type 0 for active and 1 for inactive
	created_by: { type: Schema.Types.ObjectId, ref: 'Agency', required:true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'Agency', required:true }
},schemaOptions);

module.exports = mongoose.model('DriverSchema', driverSchema, 'driverSchema');


// unique fields 
// contact number 
