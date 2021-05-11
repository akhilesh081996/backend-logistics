var Agency     = require('../../models/agency');
var Driver     = require('../../models/driver');
var Role       = require('../../models/role');
var OrderStage = require('../../models/order_stages');
var Booking    = require('../../models/booking')
var valid      = require('../../config/validation')
const Otp      = require('../../models/otptable')
const bcrypt   = require('bcrypt-nodejs');
var jwt        = require('jsonwebtoken');
const storage  = require('node-sessionstorage')
var nodemailer = require('nodemailer');
const url      = require('url');
var uniqid     = require('uniqid');
var decode;
var tokenverified = false
var jwterr;
const fs = require('fs');
var path = require('path');
var date = new Date()
var imagename;
const FileType = require('file-type');
const Log = require('../../helpers/log.js');

function decode_base64(data, folder, filename='', agency_org_id ) {
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
            fs.writeFile(path.join(__dirname, '../../../../public/uploads/' + folder + '/', imagename), buf, function(error) {
                if (error) {
                    throw error;
                } else {
                    updateAgencyLogo('public/uploads/' + folder + '/'+imagename, agency_org_id)
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

   /* var base64Data = data.replace(/^data:image\/png;base64,/, "");
    fs.writeFile(path.join(__dirname, '../../../../public/uploads/' + folder + '/', imagename), base64Data, 'base64', function(err) {

        updateAgencyLogo('public/uploads/' + folder + '/'+imagename, agency_org_id)
        return imagename;
    });*/

   
}

function updateAgencyLogo(file, agency_id){
    var update_data = {'logo': file}
    return Agency.findByIdAndUpdate(agency_id, update_data).exec().then((updatedagency) => {
        if (updatedagency) {
            {
                return {
                    status: 100,
                    msg: " Successfully updated the logo ",
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

function tokenVarification(token) {
    decode = jwt.decode(token, { complete: true });
    jwt.verify(token, 'secret', function(err, decoded) {
        if (err) {
            jwterr = err.message
        } else {
            tokenverified = true
        }
    })

}

// node mailer api **************** node mailer api ******************** nade mailer api

function emailSender(email, password) {

    //console.log('eanter in node mailer with ' ,email);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'puneet.prajapati@contriverz.com',
            pass: '@Contrive27#'
        }
    });

    var emailform = 'puneet.prajapati@contriverz.com';
    var subject = 'Verification Email from Logistics'
    var text = 'Welcome to the logistics. Your login email is :' + email + 'password :' + password

    var mailOptions = {
        from: emailform,
        to: email,
        subject: subject,
        text: text
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            // console.log(error);
        } else {
            return res.json({
                status: true,
                msg: 'Email sent succesfully',
            });
        }
    });
}

exports.registeragency = function(req, h) {
   
    if (!valid.email(req.payload.email)) {
        return {
            status: 101,
            msg: 'Invalid Email'
        }
    }
    else if (!valid.emailLength(req.payload.email)) {
        return {
            status: 101,
            msg: 'Invalid Email Length'
        }
    }
    else if (!valid.passwordLength(req.payload.password)) {
        return {
            status: 101,
            msg: 'Invalid password Length'
        }
    } 
    else {
        var Agency_id = uniqid();
        var agencydata;
        var userEmail = req.payload.email;
        var userPassword = req.payload.password;
        agencydata = new Agency({
            agency_id: Agency_id,
            username: req.payload.username,
            // slug: req.payload.slug,
            email: req.payload.email,
            contact: req.payload.contact,
            password: req.payload.password,
            status: parseInt(req.payload.status),
            deleted: 0,
            agency_name: req.payload.agency_name,
            llc_or_registration_no: req.payload.llc_or_registration_no,
            address: req.payload.address,
            city: req.payload.city,
            country: req.payload.country,
            postal_code: req.payload.postal_code,
           	created_by:req.payload.created_by,
			updated_by:req.payload.created_by
        });
		
        agencydata.password = agencydata.generateHash(agencydata.password)
        return Agency.create(agencydata).then((agency) => {
                addRoleDriver(agencydata._id, agencydata.agency_name, agencydata.created_by )
                addOrderStages(agencydata._id, agencydata.created_by )
                //emailSender(userEmail, userPassword)
                if(req.payload.imageFile && typeof req.payload.imageFile != "undefined"){
                    var newpath = path.join(__dirname, '../../../../public/uploads/' + Agency_id)
                    fs.mkdir(newpath, { recursive: true }, (err) => {
                        if (err) {
                            //return {'status':101, 'msg': "File is not uploaded." }
                        }
                        else {
                            decode_base64(req.payload.imageFile,Agency_id, 'logo', agency._id);
                            //return {'status':100, 'msg': 'File Successfully added.' }
                        }
                    });
                }
			
				// Make json for log
				var log = {
					'operation':'Add an agency - '+agency.agency_name,	
					'created_by':agency.created_by,		
					'updated_by':agency.created_by,	
					'agency':agency._id,
					'old_payload':null,
					'new_payload':agency
				}							
				return Log.addLog(log, 'log_agency').then((agencymodulelog) => { 		
					 return {'status':100, 'msg': 'Successfully created' }   
				 }).catch((err2) => { 
					return {
						status: 101,
						msg: "Something went wrong while saving log."
					};
				});
               
        }).catch((err) => {
            console.log(err)
            return {'status':101, 'msg': err.message };
        });
    }
}

/* Validation functions */
exports.validateAgencyname = (req, h) => {
    const promise = new Promise((resolve, reject) => {
        if (req.payload.agency_name) {
            Agency.find({ "agency_name": req.payload.agency_name }).exec().then((result) => {
                if (result.length) {
                    resolve({ status: '101', msg: 'Name already exist' })
                } else
                    resolve({ status: '100', msg: ' ' })
            }).catch((error) => { throw error })
        }
    })
    return promise;
}

exports.validateAgencyemail = (req, h) => {
        const promise = new Promise((resolve, reject) => {
            if (req.payload.email) {
                Agency.find({ "email": req.payload.email }).exec().then((result) => {
                    if (result.length) {
                        resolve({ status: '101', msg: 'Email already exist' })
                    } else
                        resolve({ status: '100', msg: ' ' })
                }).catch((error) => { throw error })
            }
        })
        return promise;
}
/* End */

exports.changeStatus = function(req,h){
    if(req.params._id){

        // Get the module name
        if(req.payload){
           
            if('status' in req.payload && req.payload.status){
                                               
                return Agency.findByIdAndUpdate({_id:req.params._id},{status:req.payload.status}, {new:true}).exec().then((res) => { 
                    return { 'status':100, 'msg':'Success','data':res }                             
                }).catch((err) => {
                    return { 'status': 101, 'msg': err, 'data': '' }
                });                 
            }else{
                return { 'status': 101, 'msg': 'Please send the status to change.' };
            }  
        }else{
            return { 'status': 101, 'msg': 'Please send the status to change.' };
        }           
    }else{
        return { 'status': 101, 'msg': 'Please choose the agency.' };
    } 
}

exports.findSlag = function(req, h) {
    return Agency.findOne({
        slug: req.params.slug
    }).exec().then((slug) => {
        if (!slug) {
            return true

        } else {
            return false

        }
    }).catch((err) => {
        console.log(err)
        return { err: err };
    });
};

exports.deleteAgency = function(req, h) {
    return Agency.findOne({_id:req.params._id, deleted:0}).exec().then((agency) => {
        if(agency){
			let new_payload = {'status':0, 'deleted':1}
            return Agency.findByIdAndUpdate(req.params._id, new_payload).exec().then((agency) => {
                console.log(agency)
                if (!agency) {
                    return {
                        status: 101,
                        msg: "Agency not found."
                    }
                } else {
					
					// Make json for log
					var log = {
						'operation':'Delete an agency - '+agency.agency_name,	
						'created_by':agency.created_by,		
						'updated_by':agency.updated_by,	
						'agency':agency._id,
						'new_payload': new_payload,
						'old_payload': agency
					}							
					return Log.addLog(log, 'log_agency').then((agencymodulelog) => { 		
						  return {
								status: 100,
								msg: "Agency Deleted Successfully."
						  }  
					 }).catch((err2) => { 
						return {
							status: 101,
							msg: "Something went wrong while saving log."
						};
					});
                }
            }).catch((err) => {
                //console.log(err)
                return {
                    status: 101,
                    msg: err.message
                }
            });
        }else{
            return {
                status: 101,
                msg: "Agency is already deleted."
            }
        }
    });   
};

exports.getAllAgencies = function(req, h) {
    return Agency.aggregate([
        {$match: {'deleted':0, 'status':1}},
        { $project: req.payload }
    ]).exec().then((agencies) => {
        return {
            status: 100,
            msg: "Successfully listed",
            data: agencies                         
        }
    }).catch((err) => {
        return {
            status: 101,
            msg: err.errmsg                             
        }
    });
}

exports.getAgencydetail = (req, h) => {
    if (req.params._id) {
        return Agency.find({ _id: req.params._id }).exec().then((agency) => {
            if (!agency.length) {
                return {
                    status: 101,
                    msg: 'Agency not found'
                }
            }
            else {
                agency[0].logo =   "http://"+req.headers.host+"/"+agency[0].logo;
                return {
                    status: 100,
                    msg: "Found Agency",
                    data: agency
                }
            }
        }).catch((err) => {
            return { 'status': 101, 'msg': err.errmsg }
        });
    } else {
        return {
            status: 101,
            msg: 'Please send agency id in the parameters'
        }
    }
}

exports.updateAgency = function(req, h) {
    if(req.payload){
        var agencydata;
        var userPassword = req.payload.password;
        
        agencydata = {
            username    : req.payload.username,
            // slug        : req.payload.slug,
            email       : req.payload.email,
            contact     : req.payload.contact,
            status      : req.payload.status,
            agency_name : req.payload.agency_name,
            address     : req.payload.address,
            city        : req.payload.city,
            country     : req.payload.country,
            postal_code : req.payload.postal_code,
            llc_or_registration_no : req.payload.llc_or_registration_no,
			updated_by  : req.payload.updated_by
        }
        if(req.payload.password){
			let agency = new Agency();
            agencydata.password = agency.generateHash(req.payload.password)
        }
        return Agency.findByIdAndUpdate(req.params.id, agencydata).exec().then((updatedagency) => {
            if (updatedagency) {
                if(req.payload.imageFile && typeof req.payload.imageFile != "undefined"){
                    var newpath = path.join(__dirname, '../../../../public/uploads/' + updatedagency.agency_id)
                    fs.mkdir(newpath, { recursive: true }, (err) => {
                        if (err) {
                            //return {'status':101, 'msg': "File is not uploaded." }
                        }
                        else {
                            decode_base64(req.payload.imageFile,updatedagency.agency_id, 'logo', updatedagency._id);
                            //return {'status':100, 'msg': 'File Successfully added.' }
                        }
                    
                    });
                }
				
				// Make json for log
				var log = {
					'operation':'Update an agency - '+updatedagency.agency_name,	
					'created_by':updatedagency.created_by,		
					'updated_by':updatedagency.created_by,	
					'agency':updatedagency._id,
					'old_payload': updatedagency,
					'new_payload': agencydata
				}							
				return Log.addLog(log, 'log_agency').then((agencymodulelog) => { 		
					return {
						status: 100,
						msg: 'Successfully updated'                                               
					}  
				 }).catch((err2) => { 
					return {
						status: 101,
						msg: "Something went wrong while saving log."
					};
				});                               
            }
        }).catch(err => {
            return {
                status: 101,
                msg: err.errmsg                             
            }
        }); 
    }
};

// Add role by default when adding agency
addRoleDriver = function(agency_id, name, created_by) {
    //return Role.findOne().sort({ role_type: -1 }).then((roleType) => {
       
            //if (roleType) {
                var role = new Role({
                    role_name: 'Driver',
                    role_type: 1,
                    description: 'Driver of ' + ' ' + name,
                    permissions: {

                    },
                    agency: agency_id,
					created_by: created_by,
					updated_by: created_by,
                });
               
                return Role.create(role).then((addedrole) => {
                        if (addedrole) {
							
							 return {
                                status: 100,
                                msg: ''
                            }
                        } else {
                            return {
                                status: 101,
                                msg: 'Opps!! Role Not Added Please Add Again'
                            }
                        }
                    })
                    .catch((err2) => {
                        console.log(err2)
                        return {
                            status: 101,
                            code: err2,
                            msg: err2.message
                        };
                    });
            // } else {
            //     return {
            //         status: false,
            //         msg: 'Opps!! Something went wrong !!' 
            //     }
            // }
        // })
        // .catch((err3) => {
        //     return { status: 101, msg:err3.message };
        // });
}

// Add order stages by default when adding agency
addOrderStages = function(agency_id, created_by) {
   	
		if(!agency_id){
		   return {status: 101, msg: "Please select agency in which you added order stage."}
		}			
		let orderstages = [
			  { stage_name: 'Pending', description: '', sort_order: 1, agency: agency_id, status: 1, created_by: created_by, updated_by: created_by },
			  { stage_name: 'Active', description: '', sort_order: 2, agency: agency_id, status: 1, created_by: created_by, updated_by: created_by },
			  { stage_name: 'Completed', description: '', sort_order: 3, agency: agency_id, status: 1, created_by: created_by, updated_by: created_by }
		   ]

		return OrderStage.insertMany(orderstages).then((addedstage) => {
			console.log("Added Stage---->>>>",addedstage);
			if (addedstage.length > 0) {
				
				// Make json for log									
				var i 
				let logs = []
				for(i=0;i<addedstage.length;i++){
					logs.push({
						'operation':'Added the default order stages - '+addedstage[i].stage_name,	'created_by':addedstage[i].created_by,		
						'updated_by':addedstage[i].updated_by,		
						'agency':addedstage[i].agency,
						'order_stage':addedstage[i]._id,
						'new_payload': addedstage[i],
						'old_payload': addedstage[i]
					})	
				}
								
				return Log.addLog(logs, 'log_order_stages').then((orderstagelog) => {
					 return {status : 100, msg:"Order stage is successfully added"} 
				 }).catch((err2) => { 
					return {
						status: 101,
						msg: "Something went wrong while adding log."
					};
				})
			}
		})
			
		
}

/* Get agencies */
exports.fetch_ajax = function(request, h) {
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
            let get_total_records = agenciesCount(agency_id, order, dir, column_search, search_value, search_regex);

            get_total_records.then((res) => {
                total_records = res.data
                let records = 0
                let dataget_records = 0

                get_records = getAgencies(agency_id, start, length, order, dir, column_search, search_value, search_regex, fetch_columns);
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

// Check if the agency is already registerd or not using Registration no., slug and email 
exports.validateAgency = function(request, h) {
    if (request.payload) {   
        return Agency.findOne( request.payload ).exec().then((agency) => {
            if (agency) {
                let key = Object.keys(request.payload)[0];
                return {'status':101, 'msg':key +" '"+request.payload[key]+"'" +' is already registered.'}
            }else{
                return {'status':100, 'msg':''}
            }
        }).catch((err1) => {
            return {'status':101, 'msg':err}
        });        
    }else{
        return {'status':101, 'msg':'Please send at least one parameter to check the duplicacy for agency registration.'}
    }     
}

// Get agencies total count
function agenciesCount(agency_id, order, dir, column_search, search_value, search_regex) {
    const promise = new Promise((resolve, reject) => {
        if (column_search.length) {
            Agency.aggregate([{
                    $match: { $or: column_search, $and: [{'deleted':0}] }
                },
                { $count: "agencies" },
                { $unwind: "$agencies" }
            ]).exec().then((res) => {
                if (res.length) {
                    resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].agencies });
                } else {
                    resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
                }
            }).catch((err) => {
                reject({ 'status': 101, 'msg': err, 'data': '' });
            });
        } else {
            Agency.countDocuments({'deleted':0}).exec().then((agencies) => {
                resolve({ 'status': 100, 'msg': 'Success', 'data': agencies });
            }).catch((err) => {
                reject({ 'status': 101, 'msg': err, 'data': '' });
            });
        }
    });
    return promise
}

// Get agencies list 
function getAgencies(agency_id, start, length, order, dir = 'asc', column_search, search_value, search_regex, fetch_columns) {
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
            Agency.aggregate([
                { $match: { $or: column_search } }, { $sort: sort },
                { $skip: Number(start) }, { $limit: Number(length) },
                { $project: fetch_columns }
            ]).exec().then((agencies) => {
                resolve({ 'status': 100, 'msg': 'Success', 'data': agencies });
            }).catch((err) => {
                reject({ 'status': 101, 'msg': err, 'data': '' });
            });
        } else {
            Agency.aggregate([
                { $match: {'deleted':0} },
                { $sort: sort },
                { $project: fetch_columns },
                { $skip: Number(start) },
                { $limit: Number(length) }
            ]).exec().then((agencies) => {
                resolve({ 'status': 100, 'msg': 'Success', 'data': agencies });
            }).catch((err) => {
                reject({ 'status': 101, 'msg': err, 'data': '' });
            });
        }
    });
    return promise
}