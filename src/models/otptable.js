'use strict';

const mongoose = require('mongoose');
//const User = require('../models/user');
//var Schema = mongoose.Schema;

const OtpSchema = new mongoose.Schema({
    user_id: {type :String},
    otp:{type : Number},
    generatedAt:{type : String}   
});

module.exports = mongoose.model('Otp', OtpSchema,'otps');
