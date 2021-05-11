'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const userModel = new Schema({
    user_id: { type: String },
    agency: {  type: Schema.Types.ObjectId, ref: 'Agency', required:true },
    role_type: { type: Number, required: true },
	role:{ type: Schema.Types.ObjectId, ref: 'Role', required:true },
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, index: { unique: true } },
    contact: { type: Number, required: true },
    dob: { type: String },
    password: { type: String, required: true },
    status: { type: Number },
    deleted: { type: Number },
    isAdmin: { type: Number },
    profile_image: { type: String },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
	'old_payload':{type:Object},
	'new_payload':{type:Object}
}, schemaOptions);

userModel.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userModel.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userModel, 'users');