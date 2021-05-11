'use strict';
const mongoose = require('mongoose'),
	  Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const Driverschema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    agency: { type: Schema.Types.ObjectId, ref: 'Agency', required:true },
    //social_sec_number: { type: Number },
    address: { type: String },
    city: { type: String },
    state: { type: String},
    country: { type: String },
    pin_code: { type: Number },
    status: { type: Number, default:1 },
    //qualification: { type: String },
    experience: { type: Number },
    salary: { type: Number },
    custom_fields:{},
	created_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User', required:true }
}, schemaOptions);

module.exports = mongoose.model('Driver', Driverschema, 'drivers');