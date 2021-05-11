/*
	Author: Harsh CZ
	Date: 15-04-2020 01:38PM
*/

const mongoose = require('mongoose');
const CustomFieldsSchema = new mongoose.Schema({ 
    agency_id: {
        type: String,
        required: true
    },
    module: {
        type: String,
        required: true
    },
	form:{
		type: String,
		required:true
	},
	field_name:{
		type: String
	},
	field_type:{
		type: String,
        required: true
	},
    description: {
        type: String
    },
    status: {
        type: Number,
        default: 2
    },
    created_at: {
        type : Date, 
        default: Date.now
    },
	updated_at:{type:Date,default: Date.now},
	created_by:{type:String},
	updated_by:{type:String},
});


module.exports = mongoose.model('Customfields', CustomFieldsSchema, 'custom_fields');