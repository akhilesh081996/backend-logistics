const mongoose = require('mongoose');
  Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
}

const OrderStagesSchema = new mongoose.Schema({
    stage_name: {
        type: String,
        required:true
    },
    description: {
        type: String
    },
	sort_order: {
        type: Number,
        required:true
    },
    agency : {
        type: Schema.Types.ObjectId, ref: 'Agency', required:true,
        required:true
    },
    status: {
        type: Number,
        required:1
    },
    created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User' }
}, schemaOptions);


module.exports = mongoose.model('OrderStages', OrderStagesSchema, 'order_stages');