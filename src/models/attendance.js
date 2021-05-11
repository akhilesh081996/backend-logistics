'use strict';

const mongoose = require('mongoose'); 
const moment = require('moment');
//const User = require('../models/user'); 
var Schema = mongoose.Schema;

const attendanceschema = new mongoose.Schema({
    user_id: { type: String, required: true },
    date: {
        type: Date,
        default: moment().format("YYYY-MM-DD")
    },
    check_in: { type: String, required: true },
    check_out: { type: String, required: true },
    time_diff: { type: Number },
    notes: { type: String }
});

module.exports = mongoose.model('Attendance', attendanceschema, 'attendance');