const valid = require('../../config/validation')
const Package = require('../../models/package')
let storage = require('node-sessionstorage')
const moment = require('moment')
let tokenverified = false
const fs = require('fs');
let path = require('path');
let date = new Date();
const FileType = require('file-type');
const Log = require('../../helpers/log.js');
const { Console } = require('console')



exports.add_package = async(request, h) => {
	var condition = {$and: [{ 'name' : { '$regex' : request.payload.name, '$options' : 'i' } }]}
return Package.find(condition, {}).exec().then((package) => {
        if(package.length > 0 ){
              return { 'status': 101,  'msg': "Package Name  Already Exists" }
        }
        else{
      package = new Package({
     name:request.payload.name,
     amount:request.payload.amount,
     validity:request.payload.validity,
     description : request.payload.description,
     deleted : 0

})
return Package.create(package).then((result) => {
    if(result){
        return {'status':100, 'msg':"Successfully Add Package" }    
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



exports.all_package_list = async(request, h) => {
return Package.find({status:0}).exec().then((package) => {
        if(package.length > 0 ){
              return { 'status': 100,  'msg': "Successfully" ,"data":package }
        }
        else{
             
              return { 'status': 101,  'msg': "Not found", "data":[] }
        }

}).catch((err) => { 
    console.log(err);           
    return {'status':101, 'msg':'Something went wrong. Please try again.'}
});
}





exports.update_package_status = async(request, h) => {
     return Package.find({$and: [{_id: request.payload.package_id}]}).exec().then((packageresult) => {
        if(packageresult.length > 0){
            return Package.findOneAndUpdate({ _id: packageresult[0]._id }, { $set: {status:request.payload.status}}).exec().then((result) => {         
                if (result) {
                    return {
                        status: 100,
                        msg: "Successfully Updated",
                        //  data : result                    
                    }
                }else{                                      
                    return { 'status': 101,  'msg': "Package is not updated. Please try again." }
                }                
            }).catch((err) => {
                return {'status':101, 'msg':err}
            });
          
        }
        else{
            return { 'status': 101,  'msg': "Package not found. Please try again." }
        }
    }).catch((err) => {        
        return { 'status': 101,  'msg': "Package not found. Please try again." }
    });
}