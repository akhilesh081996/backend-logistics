const valid = require('../../config/validation')
const PurchasePackage = require('../../models/purchase_package')
let storage = require('node-sessionstorage')
const moment = require('moment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
let tokenverified = false
const fs = require('fs');
let path = require('path');
let date = new Date();
const FileType = require('file-type');
const Log = require('../../helpers/log.js');
const { Console } = require('console')


exports.buy_purchase_package = async(request, h) => {

      purchasepackage = new PurchasePackage({

     pck_id:request.payload.pck_id,
     agency_id:request.payload.agency_id,
     purchase_date:request.payload.purchase_date,
     deleted : 0,
     purchase_status: 0,
     status : 0
})

return PurchasePackage.create(purchasepackage).then((result) => {
    if(result){
        return {'status':100, 'msg':"Successfully Purchase Package" }    
    }else{
        return {'status':101, 'msg':'Something went wrong. Please try again.'}
    }			
    
}).catch((err) => { 
    console.log(err);           
    return {'status':101, 'msg':'Something went wrong. Please try again.'}
});


}




// cancel purchase status

exports.delete_purchase = async(request, h) => {
     return PurchasePackage.find({$and: [{_id: request.payload.purchase_id}, 
                            {agency_id: request.payload.agency_id}]}).exec().then((purchaseresult) => {
        if(purchaseresult.length > 0){
            return PurchasePackage.findOneAndUpdate({ _id: purchaseresult[0]._id }, { $set: {deleted:request.payload.deleted}}).exec().then((result) => {         
                if (result) {
                    return {
                        status: 100,
                        msg: "Successfully deleted",
                        //  data : result                    
                    }
                }else{                                      
                    return { 'status': 101,  'msg': "Purchase is not deleted. Please try again." }
                }                
            }).catch((err) => {
                return {'status':101, 'msg':err}
            });
          
        }
        else{
            return { 'status': 101,  'msg': "User not found. Please try again." }
        }
    }).catch((err) => {        
        return { 'status': 101,  'msg': "User not found. Please try again." }
    });
}



// All Purchase details

exports.All_purchase_details = async(request, h) => {


    return PurchasePackage.find({deleted:0},function(err,rows){
        if(rows.length>0){
           return { 'status': 100,  'msg': " Successfully" , data:rows }
        }
        else{
            return { 'status': 101,  'msg': " Not Found" , data:[] }
        }}).populate({"path":"pck_id" }).populate({"path":"agency_id" })

    }


  // end 
  
// get single package detail
exports.get_single_package_detail = async(request, h) => {


    return PurchasePackage.find({_id: request.payload.purchase_id},function(err,rows){
        if(rows.length>0){
           return { 'status': 100,  'msg': " Successfully" , data:rows }
        }
        else{
            return { 'status': 101,  'msg': " Not Found" , data:[] }
        }}).populate({"path":"pck_id" }).populate({"path":"agency_id" })

    }


// get single agency detail
exports.get_single_agency_packages = async(request, h) => {
	let pipeline = [
   {"$match":{"agency_id":ObjectId(request.payload.agency_id)}},
   {"$lookup":{"from":"package", "localField":"pck_id","foreignField":"_id", "as":"packagedetail" }},
   {"$lookup":{"from":"agencies", "localField":"agency_id","foreignField":"_id", "as":"agencyedetail" }},
    {"$unwind":"$packagedetail"},
  {"$unwind":"$agencyedetail"},
]
 var purchase_details = await PurchasePackage.aggregate(pipeline)
 if(purchase_details.length > 0) {
      return { 'status': 100,  'msg': "Successfully" ,data:purchase_details }
 }
 else{
        return { 'status': 101,  'msg': "Not found" ,data:[] }
 }
  }

