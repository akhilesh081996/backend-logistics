'use strict';
const mongoose = require('mongoose'),
	 Schema = mongoose.Schema
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const trailerschema = new mongoose.Schema({
    agency: { type: Schema.Types.ObjectId, ref: 'Agency', required:true },
    trailer_type: { type: String },
    registration_no :{type:String ,required:true},
    trailer_break_controller: { type: String },
    color: { type: String },
    trailer_capacity: { type: String },
    trailer_lights: { type: Array },
    trailer_wheels: { type: String },
    trailer_materials: { type: String },
    trailer_height: { type: String },
    trailer_width: { type: String },
    trailer_length: { type: String },
    trailer_hydrolic :{type: String },
    maker_name: { type: String },
    tax_paid_upto: { type: String },
    insurance_vaild: { type: String },
    Registration_vaild: { type: String },
    owner_name: { type: String },
    owner_contact_number: { type: String },
    permanent_address: { type: String },
    trailer_groundClearance : {type: String},
    trailer_document : {type:String},
    trailer_electronic :{type:String},
    deleted:{ type: Number, default: 0}, //  type 0 for active and 1 for deleted
    status: { type: Number, default: 0}, // type 0 for active and 1 for inactive
	  created_by: { type: Schema.Types.ObjectId, ref: 'Agency', required:true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'Agency', required:true }
},schemaOptions);

module.exports = mongoose.model('Trailerschema', trailerschema, 'trailerschema');