'use strict';
const mongoose = require('mongoose'),
	 Schema = mongoose.Schema
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const Userprofile = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    first_name: { type: String },
    last_name: { type: String },
    agency: { type: Schema.Types.ObjectId, ref: 'Agency', required:true },
    user_image: { type: String },
    social_sec_number: { type: Number },
    address: { type: String },
    state: { type: String},
    city: { type: String},
    country: { type: String },
    pin_code: { type: Number },
    status: { type: Number },
    qualification: { type: String },
    experience: { type: Number },
    salary: { type: Number },
    custom_fields:{},
	created_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User', required:true }
},schemaOptions);

module.exports = mongoose.model('Userprofile', Userprofile, 'userprofile');