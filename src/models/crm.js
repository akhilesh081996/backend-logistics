const mongoose = require('mongoose'),
	  Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  strict:false
};

const CrmSchema = new mongoose.Schema({ 
    agency: {  type: Schema.Types.ObjectId, ref: 'Agency', required:true },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contact_no: {
        type: Number,
        minlength: 10,
        required: true,
        unique: true
    },
    alternate_no: {
        type: Number,
        minlength: 10
    },
    country: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    pin_code: {
        type: Number
    },
    address: {
        type: String
    },
    notes: {
        type: String
    },
    status: {
        type: Number,
        default: 1
    },
    profile:{
        type:String
    },
    custom_fields:{},
	created_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User', required:true }
}, schemaOptions);

module.exports = mongoose.model('Customer', CrmSchema, 'crm');