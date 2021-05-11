/*
	@author: Harsh CZ
	@since : 22-07-2020 02:22PM (Wednesday)
*/

const mongoose = require('mongoose'),
 	Schema = mongoose.Schema;
const schemaOptions = {
  	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
};

const packagechema = new mongoose.Schema({
    name : {type:String, required: true },
    amount: {type: String},
    validity: {type: String},
    description : {type:String},
    deleted: {type: Number, defualt :0},
    status: {type: Number, default:0},
}, schemaOptions);

module.exports = mongoose.model('Package', packagechema, 'package');