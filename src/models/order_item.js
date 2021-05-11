const mongoose = require('mongoose'),
	  Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const OrderItemSchema = new mongoose.Schema({
    order : {
        type: Schema.Types.ObjectId, ref: 'Order', required:true
    },
    order_block : {
        type: Schema.Types.ObjectId, ref: 'OrderBlocks'
    },
    agency : {
        type: Schema.Types.ObjectId, ref: 'Agency', required:true
    },
    customer: {
        type: Schema.Types.ObjectId, ref: 'Customer', required:true
    },
    itemname: {
        type: String,
    },
    itemprice: {
        type: Number,
    },
    quantity: {
        type: Number,
    },
    driver: { 
        type: Schema.Types.ObjectId, ref: 'User'  
    },
    vehicle: {
        type: Schema.Types.ObjectId, ref: 'Vehicle'
    },
    address: {
        type: String,
    },
    delivery_date: {
        type: String,
    },
    paid_amount: {
        type: String,
    },
    status: {
        type: String,
        default:1,
        required:true
    },
    longitude: {
        type: Number,
    },
    latitude: {
        type: Number,
    },
    address:{
        type: String,
    },
	stage: {
       type: Schema.Types.ObjectId, ref: 'OrderStages', required:true
    },
	created_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User', required:true }
}, schemaOptions);


module.exports = mongoose.model('OrderItem', OrderItemSchema, 'order_items');