/*
    @author: Harsh CZ
    @since : 24-07-2020 12:31PM (Friday)
*/


const mongoose = require('mongoose'),
	Schema = mongoose.Schema;
const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
	static:false
}

const OrderBlocksSchema = new mongoose.Schema({
    order: { 
        type: Schema.Types.ObjectId, ref: 'Order', required:true  
    },
    driver: { 
        type: Schema.Types.ObjectId, ref: 'User'
    },
    vehicle: {
        type: Schema.Types.ObjectId, ref: 'Vehicle'
    },
    customer: {
        type: Schema.Types.ObjectId, ref: 'Customer', required:true  
    },
    totalprice: {
        type: Number
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
        default:1 // Save as active by default if 1 and the block is deleted if the status is 0
    },
    delivery_date: {
        type: Date,
    },
    address:{
        type: String,
    },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required:true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User', required:true }
}, schemaOptions);

module.exports = mongoose.model('OrderBlocks', OrderBlocksSchema, 'order_blocks');