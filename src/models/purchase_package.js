const mongoose = require('mongoose'),
 	Schema = mongoose.Schema;
const schemaOptions = {
  	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
};

const purchasepackagechema = new mongoose.Schema({
    pck_id : { type: Schema.Types.ObjectId, ref: 'Package', required:true  },
    agency_id:{ type: Schema.Types.ObjectId, ref: 'Agency', required:true},
    purchase_status : {type:Number , defualt: 0} ,   // 0 means item purchase and 1 means inactive purchase 
    purchase_date : {type:String,required:true },
    deleted: {type: Number, defualt :0},
    status: {type: Number, default:0},
}, schemaOptions);

module.exports = mongoose.model('Purchase_Package', purchasepackagechema, 'purchase_package');
