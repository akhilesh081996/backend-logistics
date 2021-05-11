'use strict';

const mongoose = require('mongoose');
//const User = require('../models/user');
var Schema = mongoose.Schema;

const goodsSchema = new mongoose.Schema({
    goods_id: {type :String},
    goods_type: { type : String }, 
});

module.exports = mongoose.model('Good', goodsSchema, 'goods');
