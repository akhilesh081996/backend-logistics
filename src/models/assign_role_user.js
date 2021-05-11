'use strict';
const mongoose = require('mongoose'),
	 Schema = mongoose.Schema
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const assignroleschema = new mongoose.Schema({
    agency: { type: Schema.Types.ObjectId, ref: 'Agency', required:true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    role_id: { type: Schema.Types.ObjectId, ref: 'Role', required:true },
    // user_Type : { type :String},
    deleted:{ type: Number, default: 0}, //  type 0 for active and 1 for deleted
    status: { type: Number, default: 0}, // type 0 for active and 1 for inactive
	created_by: { type: Schema.Types.ObjectId, ref: 'Agency', required:true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'Agency', required:true }
},schemaOptions);

module.exports = mongoose.model('Assignrolechema', assignroleschema, 'assign_role_to_user');



