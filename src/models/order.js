const mongoose = require('mongoose'),
	  Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
	static:false
}

const OrderSchema = new mongoose.Schema({
    description: {
        type: String, required:true
    },
    totalprice: {
        type: Number
    },
    driver: { 
        type: Schema.Types.ObjectId, ref: 'User'
    },
    vehicle: {
        type: Schema.Types.ObjectId, ref: 'Vehicle'
    },
    agency : {
        type: Schema.Types.ObjectId, ref: 'Agency', required:true
    },
    paid_amount: {
        type: String,
    },
     longitude: {
        type: Number,
    },
    latitude: {
        type: Number,
    },
    status: {
        type: Number, 
        default:2 // Save as draft if 2 and order created if status 1
    },
     delivery_date: {
        type: String,
    },
    address:{
        type: String,
    },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User', required:true }
}, schemaOptions);

module.exports = mongoose.model('Order', OrderSchema, 'orders');