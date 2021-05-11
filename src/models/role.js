'use strict';

const mongoose = require('mongoose'), 
	  Schema = mongoose.Schema
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  strict:false
};

const roleschema = new mongoose.Schema({
    role_name: { type: String },
    role_type: { type: Number },
    description: { type: String },
    permissions: {},
    custom_fields:{},
    // permissions: {
    //     crm: { type: Array },
    //     hr: { type: Array },
    //     report: { type: Array },
    //     vehicle: { type: Array },
    //     driver: { type: Array },
    // },
	status:{type:Number, default:1},
	created_by:{type:String},
	updated_by:{type:String},
	agency: { type: Schema.Types.ObjectId, ref: 'Agency', required:true }
}, schemaOptions);

module.exports = mongoose.model('Role', roleschema, 'roles');