'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  strict:true
};

const agencyschema = new mongoose.Schema({
    agency_id: { type: String },
    username: { type: String },
    slug:{ type : String, require:true , index: { unique: true } },
    email: { type: String, required: true, index: { unique: true } },
    contact: { type: Number, required: true },
    password: { type: String, required: true },
    status:{ type: Number},
    deleted:{ type: Number},
    created_at: { type: String },
    agency_name: { type : String }, 
    llc_or_registration_no: { type : String }, 
    address: { type : String } , 
    city: { type : String }, 
    country: { type : String }, 
    postal_code: { type : Number },
    logo:{type : String} ,
    status:{ type : Number },
    type :{ type:Number , default :1},
    //file_path: {type:String},
	created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User' }
}, schemaOptions);

agencyschema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

agencyschema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Agency', agencyschema , 'agencies');
