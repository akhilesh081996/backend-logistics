const SubModule = require('../../models/sub_module')
const Agency = require('../../models/agency')
const AgencyModule = require('../../models/agency_module')
const Modules = require('../../models/module')
const valid = require('../../config/validation')
const Users = require('../../models/user')
let storage = require('node-sessionstorage')
const moment = require('moment')
let tokenverified = false
const fs = require('fs');
let path = require('path');
let date = new Date();
const FileType = require('file-type');
const Log = require('../../helpers/log.js');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const { Console } = require('console')


exports.create_sub_module  = async(request, h) => {
	var condition = {$and: [{sub_module_name: request.payload.sub_module_name},{module_id:request.payload.module_id}]}
return SubModule.find(condition, {}).exec().then((submodulelength) => {
        if(submodulelength.length > 0 ){
              return { 'status': 101,  'msg': "sub_module  Already Assign" }
        }
        else{
  subModule = new SubModule({
    module_id:request.payload.module_id,
    sub_module_name:request.payload.sub_module_name.trim().toLowerCase().split(' ').join('_'),
    description:request.payload.description,
    created_by :request.payload.created_by,
    updated_by :request.payload.updated_by,
     deleted : 0 ,
     status : 0

})
return SubModule.create(subModule).then((result) => {
    if(result){
        return {'status':100, 'msg':"Successfully Assigin  sub_module" }    
    }else{
        return {'status':101, 'msg':'Something went wrong. Please try again.'}
    }			
    
}).catch((err) => { 
    console.log(err);           
    return {'status':101, 'msg':'Something went wrong. Please try again.'}
});
}
})
}

exports.delete_sub_module = async(request, h) => {
     return SubModule.find({$and: [{module_id: request.payload.module_id}, 
                            {_id: request.payload.sub_module_id}]}).exec().then((submoduleresult) => {
        if(submoduleresult.length > 0){
            return SubModule.findOneAndUpdate({ _id: submoduleresult[0]._id }, { $set: {deleted:request.payload.deleted}}).exec().then((result) => {         
                if (result) {
                    return {
                        status: 100,
                        msg: "Successfully Updated",
                        //  data : result                    
                    }
                }else{                                      
                    return { 'status': 101,  'msg': "SubModule is not Deleted. Please try again." }
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


// fetch single agency module 
exports.single_agency_module_sub_module = async(request, h) => {
   let pipeline = [
   {"$match":{"agency":ObjectId(request.payload.agency_id)}},
   {"$lookup":{"from":"modules", "localField":"module","foreignField":"_id", "as":"moduledetails" }},
   {"$lookup":{"from":"agencies", "localField":"agency","foreignField":"_id", "as":"agencyedetail" }},
   {"$lookup":{"from":"submodules", "localField":"module","foreignField":"module_id", "as":"submodules" }},
   {"$unwind":"$moduledetails"},
   {"$unwind":"$agencyedetail"},
   {"$unwind":"$submodules"},
   {
        "$match":{
            "submodules.deleted": 0
        }
     },
]
 var agency_module_details = await AgencyModule.aggregate(pipeline)
 if(agency_module_details.length > 0) {

      return { 'status': 100,  'msg': "Successfully" ,data:agency_module_details }
 }
 else{
        return { 'status': 101,  'msg': "Not found" ,data:[] }
 }
  
  }



// edit sub module  feature  with name 

 
exports.update_sub_module = async (request,h) => { 
    let sub_module = request.payload  
    return SubModule.findById(request.payload.submodule_id).exec().then((submoduledetail) => {
        if(submoduledetail){
    return SubModule.findOneAndUpdate({ _id: submoduledetail._id }, { $set:sub_module}).exec().then((result) => {         
                if (result) {
                    return {
                        status: 100,
                        msg: "Successfully Updated",                 
                    }
                }else{                                      
                    return { 'status': 101,  'msg': "Sub_module is not updated. Please try again." }
                }                
            }).catch((err) => {
                return {'status':101, 'msg':err}
            });
        }
        else{
            return { 'status': 101,  'msg': "submodule_id not found. Please try again." }
        }
    }).catch((err) => {        
        return { 'status': 101,  'msg': "submodule_id not found. Please try again." }
    });
}


//

 // fetch single module aand its sub module details
exports.singlemodule_and_sub_module = async(request, h) => {
  console.log(request.payload.module_id)
   let pipeline = [
   {"$match":{"_id":ObjectId(request.payload.module_id)}},
   {"$lookup":{"from":"submodules", "localField":"_id","foreignField":"module_id", "as":"submodules" }},
   // {"$unwind":"$moduledetails"},
   // // {"$unwind":"$agencyedetail"},
   {"$unwind":"$submodules"},
   {
        "$match":{
            "submodules.deleted": 0
        }
     },
]
 var agency_module_details = await Modules.aggregate(pipeline)
 if(agency_module_details.length > 0) {

      return { 'status': 100,  'msg': "Successfully" ,data:agency_module_details }
 }
 else{
        return { 'status': 101,  'msg': "Not found" ,data:[] }
 }
  
  }