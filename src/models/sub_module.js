const mongoose = require('mongoose'), 
	  Schema = mongoose.Schema
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const subModuleSchema = new mongoose.Schema({ 

   module_id:{
        type: Schema.Types.ObjectId, ref: 'Module', required:true
    },
    sub_module_name: {
        type: String,
        required: true
    },
    deleted: {
        type: Number,
          default: 0
    },
    description: {
        type: String
    },
    status: {
        type: Number,
        default: 0
    },
    created_by:{
        type: Schema.Types.ObjectId, ref: 'User', required:true
    },
    updated_by:{
        type: Schema.Types.ObjectId, ref: 'User', required:true
    }
    
}, schemaOptions);


module.exports = mongoose.model('SubModule', subModuleSchema, 'submodules');