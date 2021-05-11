'use strict';

const mongoose = require('mongoose');
//const User = require('../models/user');
var Schema = mongoose.Schema;

const loadschema = new mongoose.Schema({
    load_id: {type :String},
    load_type: { type : String }, 
});

module.exports = mongoose.model('Load', loadschema, 'loads');
