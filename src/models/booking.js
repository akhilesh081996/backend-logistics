'use strict';

const mongoose = require('mongoose');
//const User = require('../models/user');
var Schema = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
        user_id:{type :String},
        booking_id :{type: String},
        pickup_location: {type :String},
        drop_off_location: {type :String},
        shipping_date_time: {type :String},
        load_dimentions: {type :String},
        prefered_vechicle_type :{type :String},
        bookig_amount:{type : Number},
        load_image:{type :String},
        payment_method: {type : String},  
        booking_creation:{type: String}

});

module.exports = mongoose.model('Booking', bookingSchema, 'bookings');
