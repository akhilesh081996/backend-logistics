
const Driver = require('../../models/driver_module')
const valid = require('../../config/validation')
const User = require('../../models/user')
let storage = require('node-sessionstorage')
const moment = require('moment')
let tokenverified = false
const fs = require('fs');
let path = require('path');
let date = new Date();
var uniqid     = require('uniqid');
const FileType = require('file-type');
const Log = require('../../helpers/log.js');
const { Console } = require('console');
const csv = require('csvtojson')
const csvFilePath = `${__dirname}/data.csv`


// for image upload 

function decode_base64(data, folder, filename='', driver_org_id ) {

    var buf = Buffer.from(data);
    // var buf = new Buffer(data, 'base64').toString('binary');
    var imagename ='';
    const promise = new Promise(function(resolve, reject) {
        var types = FileType.fromBuffer(data);

        if(types){
            resolve(types);
        }else{
            reject(types);
        }
    });

    promise.then(function(value) {
        if(value){
            if(filename){
                imagename = filename + '.'+value.ext;
                   
            }else{
                imagename = Date.now() + '.'+value.ext;
            }
           fs.writeFile(path.join(__dirname, '../../../public/uploads/' + folder + '/', imagename), buf, function(error) {
                if (error) {
                    throw error;
                } else {
                    updatedriverimage('public/uploads/' + folder + '/'+imagename, driver_org_id)
                    return imagename;
                }
            });
        }else{
            if(filename){

                imagename = filename + '.jpg';
               
            }else{
                imagename = Date.now() + '.jpg';
                     
            }
        }
    });

    promise.catch(function(value) {
        return {'status':101, msg:value};
    });
   
}


function updatedriverimage(file, driver_id){

    var update_data = {'driver_image': file}
    return Driver.findByIdAndUpdate(driver_id, update_data).exec().then((updateImage) => {
        if (updateImage) {
            {
                return {
                    status: 100,
                    msg: " Successfully updated  ",
                }
            }
        }
    }).catch(err => {
        console.log(err)
        return {
            status: 101,
            msg: " Oops !! Something went wrong ",
        }
    });
}

// end 


function document_decode_base64(data, folder, filename='', driver_org_id ) {

    var buf = Buffer.from(data);
    // var buf = new Buffer(data, 'base64').toString('binary');
    var imagename ='';
    const promise = new Promise(function(resolve, reject) {
        var types = FileType.fromBuffer(data);

        if(types){
            resolve(types);
        }else{
            reject(types);
        }
    });

    promise.then(function(value) {
        if(value){
            if(filename){
                imagename = filename + '.'+value.ext;
                  
            }else{
                imagename = Date.now() + '.'+value.ext;
            }
           fs.writeFile(path.join(__dirname, '../../../public/uploads/' + folder + '/', imagename), buf, function(error) {
                if (error) {
                    throw error;
                } else {
                    updateddriverdocument('public/uploads/' + folder + '/'+imagename, driver_org_id)
                    return imagename;
                }
            });
        }else{
            if(filename){

                imagename = filename + '.jpg';            
            }else{
                imagename = Date.now() + '.jpg';
            }
        }
    });

    promise.catch(function(value) {
        return {'status':101, msg:value};
    });
   
}

 // upload driver document 
 function updateddriverdocument(file, driver_id){
    var update_data = {'driver_document': file}
    // console.log(driver_id,';driver_id')
    return Driver.findByIdAndUpdate(driver_id, update_data).exec().then((updateImage) => {
        if (updateImage) {
            {
                return {
                    status: 100,
                    msg: " Successfully updated  ",
                }
            }
        }
    }).catch(err => {
        console.log(err)
        return {
            status: 101,
            msg: " Oops !! Something went wrong ",
        }
    });
}

// end of driver documnet 
//  driver medical documnet upload 


function medical_document_decode_base64(data, folder, filename='', driver_org_id ) {

    var buf = Buffer.from(data);
    // var buf = new Buffer(data, 'base64').toString('binary');
    var imagename ='';
    const promise = new Promise(function(resolve, reject) {
        var types = FileType.fromBuffer(data);

        if(types){
            resolve(types);
        }else{
            reject(types);
        }
    });

    promise.then(function(value) {
        if(value){
            if(filename){
                imagename = filename + '.'+value.ext;
                   
            }else{
                imagename = Date.now() + '.'+value.ext;
            }
           fs.writeFile(path.join(__dirname, '../../../public/uploads/' + folder + '/', imagename), buf, function(error) {
                if (error) {
                    throw error;
                } else {
                    updateddrivermedicladocument('public/uploads/' + folder + '/'+imagename, driver_org_id)
                    return imagename;
                }
            });
        }else{
            if(filename){

                imagename = filename + '.jpg';            
            }else{
                imagename = Date.now() + '.jpg';
            }
        }
    });

    promise.catch(function(value) {
        return {'status':101, msg:value};
    });
   
}

 function updateddrivermedicladocument(file, driver_id){
    var update_data = {'driver_medical_certificate': file}
    // console.log(driver_id,';driver_id')
    return Driver.findByIdAndUpdate(driver_id, update_data).exec().then((updateImage) => {
        if (updateImage) {
            {
                return {
                    status: 100,
                    msg: " Successfully updated  ",
                }
            }
        }
    }).catch(err => {
        console.log(err)
        return {
            status: 101,
            msg: " Oops !! Something went wrong ",
        }
    });
}

// end of medical  document upload
// document_proo_upload by driver

function proof_document_decode_base64(data, folder, filename='', driver_org_id ) {

    var buf = Buffer.from(data);
    // var buf = new Buffer(data, 'base64').toString('binary');
    var imagename ='';
    const promise = new Promise(function(resolve, reject) {
        var types = FileType.fromBuffer(data);

        if(types){
            resolve(types);
        }else{
            reject(types);
        }
    });

    promise.then(function(value) {
        if(value){
            if(filename){
                imagename = filename + '.'+value.ext;
                   
            }else{
                imagename = Date.now() + '.'+value.ext;
            }
           fs.writeFile(path.join(__dirname, '../../../public/uploads/' + folder + '/', imagename), buf, function(error) {
                if (error) {
                    throw error;
                } else {
                    updateddriverdocumentproof('public/uploads/' + folder + '/'+imagename, driver_org_id)
                    return imagename;
                }
            });
        }else{
            if(filename){

                imagename = filename + '.jpg';            
            }else{
                imagename = Date.now() + '.jpg';
            }
        }
    });

    promise.catch(function(value) {
        return {'status':101, msg:value};
    });
   
}

 function updateddriverdocumentproof(file, driver_id){
    var update_data = {'driver_document_proof': file}
    // console.log(driver_id,';driver_id')
    return Driver.findByIdAndUpdate(driver_id, update_data).exec().then((updateImage) => {
        if (updateImage) {
            {
                return {
                    status: 100,
                    msg: " Successfully updated  ",
                }
            }
        }
    }).catch(err => {
        console.log(err)
        return {
            status: 101,
            msg: " Oops !! Something went wrong ",
        }
    });
}


exports.deleteDriver = async(request, h) => { 
    return Driver.findByIdAndUpdate(request.payload.driver_id,{'deleted':1}).exec().then((result) => {
        return {'status':100, 'msg': 'Driver Deleted Successfully' }  
    }).catch((err) => {
        return {'status':101, 'msg': err };
    });
}


exports.getSingleDriver = async (request, h) => {
    var condition = {'status':0}
    if(  request.payload ){
        condition = { 'status':0 , "_id":request.payload.driver_id }
    }
    return Driver.find(condition, {}).exec().then((Driver) => {
        return {
            status: 100,
            msg: "Successfully listed",
            data: Driver[0]                         
        }
    }).catch((err) => {
        return {
            status: 101,
            msg: err.errmsg                             
        }
    });
}


exports.updateDriver = async (request,h) => { 

    let driver = request.payload  


    return Driver.findById(request.payload._id).exec().then((res_driver) => {
        if(res_driver){
            return Driver.findOneAndUpdate({ _id: res_driver._id }, { $set: driver}).exec().then((result) => {         
                if (result) {
                    return {
                        status: 100,
                        msg: "Successfully Updated",
                        //  data : result                    
                    }
                }else{                                      
                    return { 'status': 101,  'msg': "Driver is not updated. Please try again." }
                }                
            }).catch((err) => {
                return {'status':101, 'msg':err}
            });
          
        }
        else{
            return { 'status': 101,  'msg': "Driver not found. Please try again." }
        }
    }).catch((err) => {        
        return { 'status': 101,  'msg': "Driver not found. Please try again." }
    });
    


}



exports.getAllDriver = function(request, h) {
    if (request.payload) {
        const promise = new Promise((resolve, reject) => {
            let pdata = request.payload
            let search_value = ''
            let search_regex = ''
            let draw = pdata.draw
            let start = pdata.start
            let length = pdata.length
            let order = ''
            if (pdata.order) {
                order = pdata.order
            }
            let columns = pdata.columns
            let column_search = []
            let columns_valid = []
            let i
            let fetch_columns = {};
            if (columns) {
                for (i = 0; i < columns.length; i++) {
                    let key = columns[i].name
                    if (pdata.search.value) {
                        if (key) {

                            let c_sr = {
                                    [key]: { $regex: '.*' + pdata.search.value + '.*', $options: "si" }
                                }
                            column_search.push(c_sr)
                        }
                    }
                    columns_valid.push(key)
                    fetch_columns[key] = true;
                }
            }

            let col = 0;
            let dir = "";
            let j
            if (order) {
                for (j = 0; j < order.length; j++) {
                    col = order[j].column
                    dir = order[j].dir
                }
            }

            if (dir != "asc" && dir != "desc") {
                dir = "asc";
            }

            if (columns_valid[col]) {
                order = columns_valid[col];
            } else {
                order = null;
            }

            agency_id = "";

            
            let total_records = 0
            let get_total_records = driverCount(agency_id, order, dir, column_search, search_value, search_regex);

            get_total_records.then((res) => {
                total_records = res.data
                let records = 0
                let dataget_records = 0

                get_records = getdriver(agency_id, start, length, order, dir, column_search, search_value, search_regex, fetch_columns);
                get_records.then((res) => {
                    output = {
                        "status":100,
                        "msg":"Success",
                        "draw": draw,
                        "recordsTotal": total_records,
                        "recordsFiltered": total_records,
                        "data": res.data
                    }
                    resolve(output)
                }).catch((err) => {
                    console.log("Total record error1- ", err);
                    reject(error)
                })

            }).catch((err) => {
                console.log("Total record error2- ", err);
                reject(error)
            })
        });
        return promise;
    }
}

// Get agencies total count
function driverCount(agency_id, order, dir, column_search, search_value, search_regex) {
    const promise = new Promise((resolve, reject) => {
        if (column_search.length) {
            Driver.aggregate([{
                  $match: { $or: column_search, $and: [{'deleted':0}] }
                },
                { $count: "drivers" },
                { $unwind: "$drivers" }
            ]).exec().then((res) => {
                if (res.length) {
                    resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].drivers });
                } else {
                    resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
                }
            }).catch((err) => {
                reject({ 'status': 101, 'msg': err, 'data': '' });
            });
        } else {
            Driver.countDocuments({}).exec().then((drivers) => {
                resolve({ 'status': 100, 'msg': 'Success', 'data': drivers });
            }).catch((err) => {
                reject({ 'status': 101, 'msg': err, 'data': '' });
            });
        }
    });
    return promise
}

// Get agencies list 
function getdriver(agency_id, start, length, order, dir = 'asc', column_search, search_value, search_regex, fetch_columns) {
    const promise = new Promise((resolve, reject) => {
        let sort = ''
        if (dir == 'asc') {
            dir = 1
        } else {
            dir = -1
        }
        if (order) {
            sort = {
                [order]: dir
            }
        } else {
            sort = { '_id': -1 }
        }
        if (column_search.length) {
            Driver.aggregate([
                { $match: { $or: column_search } }, { $sort: sort },
                { $skip: Number(start) }, { $limit: Number(length) },
                { $project: fetch_columns }
            ]).exec().then((drivers) => {
                resolve({ 'status': 100, 'msg': 'Success', 'data': drivers });
            }).catch((err) => {
                reject({ 'status': 101, 'msg': err, 'data': '' });
            });
        } else {
            Driver.aggregate([
                { $match: {'deleted':0} },
                { $sort: sort },
                { $project: fetch_columns },
                { $skip: Number(start) },
                { $limit: Number(length) }
            ]).exec().then((drivers) => {
                resolve({ 'status': 100, 'msg': 'Success', 'data': drivers });
            }).catch((err) => {
                reject({ 'status': 101, 'msg': err, 'data': '' });
            });
        }
    });
    return promise
}




// validate driveremail

exports.validatedriveremail = (req, h) => {
        const promise = new Promise((resolve, reject) => {
            if (req.payload.driver_email) {
                Driver.find({ "driver_email": req.payload.driver_email }).exec().then((result) => {
                    if (result.length) {
                        resolve({ status: '101', msg: 'Email already exist' })
                    } else
                        resolve({ status: '100', msg: ' ' })
                }).catch((error) => { throw error })
            }
        })
        return promise;
}






exports.driverregister = async(request, h) => {
         var condition = {'contact':request.payload.driver_contact}
      return User.find(condition, {}).exec().then((res_driver) => {
        if(res_driver.length > 0 ){
              return { 'status': 101,  'msg': "Driver_Contact Already Exists" }
        }
        else{
     var User_id = uniqid()
  user = new User({
user_id : User_id,
agency : request.payload.agency,
role_type :request.payload.role_type,
role : request.payload.role,
first_name : request.payload.driver_first_name,
last_name : request.payload.driver_last_name,
email : request.payload.driver_email,
contact : request.payload.driver_contact,
dob : request.payload.driver_date_of_birth,
password : request.payload.driver_password,
created_by: request.payload.created_by,
    updated_by: request.payload.updated_by,
status :0,
deleted: 0 
   })
return User.create(user).then((userresult) => {  

        var Driver_id = uniqid()
    driver = new Driver({
    driver_id : Driver_id,
    user : userresult._id,
    agency:request.payload.agency,
    vechile_id: request.payload.vechile_id,
    trailer_id: request.payload.trailer_id,
    driver_name : request.payload.driver_name,
    driver_experience :request.payload.driver_experience,
    driver_first_name: request.payload.driver_first_name,
    driver_last_name: request.payload.driver_last_name,
    driver_contact: request.payload.driver_contact,
    driver_email: request.payload.driver_email,
    driver_password: request.payload.driver_password,
    driver_licence_type: request.payload.driver_licence_type,
    driver_licence_no: request.payload.driver_licence_no,
    licence_date_of_issue: request.payload.licence_date_of_issue ,
    licence_date_of_expired: request.payload.licence_date_of_expired ,
    driver_date_of_birth: request.payload.driver_date_of_birth ,
    driver_licence_type: request.payload.driver_licence_type ,
    driver_current_address:  request.payload.driver_current_address,
    driver_permanent_address: request.payload.driver_permanent_address ,
    // driver_medical_certificate : request.payload.driver_medical_certificate,
    // driver_document_proof: request.payload.driver_document_proof,
    // driver_document: request.payload.driver_document,
    created_by: request.payload.created_by,
    updated_by: request.payload.updated_by,
})
return Driver.create(driver).then((result) => {
    if(result){
        // uplaod a image  and file  throw base64  
        if(request.payload.driver_image && typeof request.payload.driver_image != "undefined"){
                    var newpath = path.join(__dirname, '../../../public/uploads/' + Driver_id)
                    fs.mkdir(newpath, { recursive: true }, (err) => {
                        if (err) {
                            //return {'status':101, 'msg': "File is not uploaded." }
                        }
                        else {
                            decode_base64(request.payload.driver_image,Driver_id, 'driver_image', driver._id);
                        }
                    });
                }
       // end  of image upload task 

// uplaod a document and pdf throw base64 file 
                   if(request.payload.driver_document && typeof request.payload.driver_document != "undefined"){
                    var newpath = path.join(__dirname, '../../../public/uploads/' + Driver_id)
                    fs.mkdir(newpath, { recursive: true }, (err) => {
                        if (err) {
                            //return {'status':101, 'msg': "File is not uploaded." }
                        }
                        else {
                            document_decode_base64(request.payload.driver_document,Driver_id, 'driver_document', driver._id);
                        }
                    });
                }  
      // end  of image upload task 



// upload driver medical record
    if(request.payload.driver_medical_certificate && typeof request.payload.driver_medical_certificate != "undefined"){
                    var newpath = path.join(__dirname, '../../../public/uploads/' + Driver_id)
                    fs.mkdir(newpath, { recursive: true }, (err) => {
                        if (err) {
                            //return {'status':101, 'msg': "File is not uploaded." }
                        }
                        else {
                            medical_document_decode_base64(request.payload.driver_medical_certificate,Driver_id, 'driver_medical_certificate', driver._id);
                        }
                    });
                } 
// end of function
// upload driver driver_document_proof record
    if(request.payload.driver_document_proof && typeof request.payload.driver_document_proof != "undefined"){
                    var newpath = path.join(__dirname, '../../../public/uploads/' + Driver_id)
                    fs.mkdir(newpath, { recursive: true }, (err) => {
                        if (err) {
                            //return {'status':101, 'msg': "File is not uploaded." }
                        }
                        else {
                            proof_document_decode_base64(request.payload.driver_document_proof,Driver_id, 'driver_document_proof', driver._id);
                        }
                    });
                } 
// end of function
                  return {'status':100, 'msg':"Successfully added Driver" }  

    }else{
        return {'status':101, 'msg':'Something went wrong. Please try again.'}
    }            
    
})




})
.catch((err) => { 
    console.log(err);           
    return {'status':101, 'msg':'Something went wrong. Please try again.'}
});
        }
    }).catch((err) => {        
        return { 'status': 101,  'msg': "Driver not found. Please try again." }
    });
}




exports.driverbulkimport = async(req, h) => {

    // const csvFilePath = `${__dirname}/data.csv`
    
    var newrecord = []
     var alreadyexists = []
     var fieldsarray = ['role','role_type','first_name','agency','password','contact','created_by']
return csv().fromFile(csvFilePath).then(async(jsonObj)=>{
    for (var i = 0; i < jsonObj.length; i++) {
  if(jsonObj[i].role == '' || jsonObj[i].role == null || jsonObj[i].role_type == '' ||
   jsonObj[i].email == '' ||   jsonObj[i].email == null || jsonObj[i].password == '' || jsonObj[i].password == null
    || jsonObj[i].agency == '' || jsonObj[i].agency == null || jsonObj[i].contact == null || jsonObj[i].contact == ''
    ||  jsonObj[i].first_name == '' || jsonObj[i].first_name == null || jsonObj[i].created_by == '' ) {
     return {'status':101 ,'msg' : 'Mandatory fields to always be required' ,'data':fieldsarray}
  }
  else{
    var userdata = await Users.find({ 'email': jsonObj[i].email })
 if(userdata.length > 0){
    alreadyexists.push(jsonObj[i])
 } 
    else{
   var User_id = uniqid();
            userdata = new User({
                user_id: User_id,
                agency: jsonObj[i].agency_id,
                role_type: jsonObj[i].role_type,
                role:jsonObj[i].role_id,
                first_name: jsonObj[i].first_name,
                last_name: jsonObj[i].last_name,
                email: jsonObj[i].email,
                dob: jsonObj[i].dob,
                contact: jsonObj[i].contact_no,
                password: jsonObj[i].password,
                isAdmin: 0,
                status: 1,
                created_by: jsonObj[i].created_by,
                updated_by: jsonObj[i].created_by
            });
            userdata.password = userdata.generateHash(userdata.password); 
            return  User.create(userdata).then((userresult) => {
    var Driver_id = uniqid()
    driver = new Driver({
    driver_id : Driver_id,
    user : userresult._id,
    agency:jsonObj[i].agency,
    vechile_id: jsonObj[i].vechile_id,
    trailer_id: jsonObj[i].trailer_id,
    driver_name : jsonObj[i].driver_name,
    driver_experience :jsonObj[i].driver_experience,
    driver_first_name: jsonObj[i].driver_first_name,
    driver_last_name: jsonObj[i].driver_last_name,
    driver_contact: jsonObj[i].driver_contact,
    driver_email: jsonObj[i].driver_email,
    driver_password: jsonObj[i].driver_password,
    driver_licence_type: jsonObj[i].driver_licence_type,
    driver_licence_no: jsonObj[i].driver_licence_no,
    licence_date_of_issue: jsonObj[i].licence_date_of_issue ,
    licence_date_of_expired: jsonObj[i].licence_date_of_expired ,
    driver_date_of_birth: jsonObj[i].driver_date_of_birth ,
    driver_licence_type: jsonObj[i].driver_licence_type ,
    driver_current_address:  jsonObj[i].driver_current_address,
    driver_permanent_address: jsonObj[i].driver_permanent_address ,
    created_by: request.payload.created_by,
    updated_by: request.payload.updated_by,
})
    return Driver.create(driver).then((result) => {})
   }).catch((err) => {
                    return {'status':101, 'msg': err.message };
                });
                   newrecord.push(jsonObj[i])
 }  
  }
    }
     return {'status':100, 'msg':'Successfully', 'newrecord': newrecord ,'alreadyexists':alreadyexists }
})
.catch((err) => { 
    console.log(err);           
    return {'status':101, 'msg':'Something went wrong. Please try again.'}
});
 }