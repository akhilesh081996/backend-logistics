const mongoose = require('mongoose'), 
	  Schema = mongoose.Schema
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const ModuleSchema = new mongoose.Schema({ 
   
    module_name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: Number,
        default: 1
    },
    created_by:{
        type: Schema.Types.ObjectId, ref: 'User', required:true
    },
	updated_by:{
        type: Schema.Types.ObjectId, ref: 'User', required:true
    }
}, schemaOptions);


module.exports = mongoose.model('Module', ModuleSchema, 'modules');