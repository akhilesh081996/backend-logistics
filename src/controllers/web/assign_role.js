const AssignuserRole = require('../../models/assign_role_user')
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
const { Console } = require('console')


exports.assign_module_to_user = async(request, h) => {
	var condition = {$and: [{role_id: request.payload.role_id}, 
                            {userId: request.payload.userId}]}

return AssignuserRole.find(condition, {}).exec().then((modulelength) => {
        if(modulelength.length > 0 ){
               return {'status':100, 'msg':"Successfully Assigin  Module" }   
        }
        else{
  assignuserRole = new AssignuserRole({

    agency:request.payload.agency_id,
    role_id:request.payload.role_id,
    userId:request.payload.userId,
    created_by:request.payload.created_by,
    updated_by:request.payload.updated_by

})
return AssignuserRole.create(assignuserRole).then((result) => {
    if(result){
        return {'status':100, 'msg':"Successfully Assigin  Module" }    
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



exports.get_assigned_role = async(request, h) => {


    return AssignuserRole.find({userId: request.payload.userId},function(err,rows){
        if(rows.length>0){
           return { 'status': 100,  'msg': " Successfully" , data:rows }
        }
        else{
            return { 'status': 101,  'msg': " Not Found" , data:[] }
        }}).populate({"path":"role_id" ,select:"role_name"})

    }



exports.delete_assign_role = async(request, h) => {
    console.log(request.payload.deleted,'request.payload.deleted')
     return AssignuserRole.find({$and: [{role_id: request.payload.role_id}, 
                            {userId: request.payload.userId}]}).exec().then((roleresult) => {
        if(roleresult.length > 0){
            return AssignuserRole.findOneAndUpdate({ _id: roleresult[0]._id }, { $set: {deleted:request.payload.deleted}}).exec().then((result) => {         
                if (result) {
                    return {
                        status: 100,
                        msg: "Successfully Updated",
                        //  data : result                    
                    }
                }else{                                      
                    return { 'status': 101,  'msg': "Role is not updated. Please try again." }
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



