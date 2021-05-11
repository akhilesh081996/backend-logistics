const mongoose = require('mongoose'), 
	  Schema = mongoose.Schema
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const AgencyModuleSchema = new mongoose.Schema({ 
   
    module: {
        type: Schema.Types.ObjectId, ref: 'Module', required:true,
    },
    agency: {
        type: Schema.Types.ObjectId, ref: 'Agency', required:true,
    },
    status: {
        type: Number,
        default: 1
    },
    created_by:{
        type: Schema.Types.ObjectId, ref: 'User'
    },
	updated_by:{
        type: Schema.Types.ObjectId, ref: 'User'
    }
}, schemaOptions);


module.exports = mongoose.model('AgencyModule', AgencyModuleSchema, 'agency_modules');