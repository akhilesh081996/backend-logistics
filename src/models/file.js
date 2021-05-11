'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const FileSchema = new mongoose.Schema({
    type: { type: String },
    module: { type: String },
    file_name: { type: String },
    path: { type: String },
    user_id: { type: Number },
    created_by: { type: Number },
    created_at: { type: String }
});

module.exports = mongoose.model('File', FileSchema, 'files');