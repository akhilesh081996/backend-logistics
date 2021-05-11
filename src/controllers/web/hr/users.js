const User          = require('../../../models/user')
const Driver        = require('../../../models/driver')
const Agency        = require('../../../models/agency') 
const Role          = require('../../../models/role')
const valid         = require('../../../config/validation')
const Userprofile   = require('../../../models/userprofile')
const tokenverified = false
const fs            = require('fs');
const path          = require('path');
const date          = new Date();
const uniqid        = require('uniqid');
const storage       = require('node-sessionstorage')
const FileType      = require('file-type');
const Log           = require('../../../helpers/log.js');
const Helper        = require('../../../helpers/helper.js');

function decode_base64(data, folder, filename='', user_id ) { 
    /*var buf = Buffer.from(data);
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
                    //throw error;
					return {status:101, msg:error}
                } 
                else {
                    updateUserFile('public/uploads/' + folder + '/'+imagename, user_id)
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
        return false;
    });*/
    var buf = Buffer.from(data.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');
    var imagename ='';
    var mime  = data.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    var value = '.jpg';                    
    if (mime && mime.length) {
        result = mime[1].split("/");
        value  = result[1];
    }

    if(filename){
        imagename = filename + '.'+value;
    }else{
        imagename = Date.now() + '.'+value;
    }
        
    fs.writeFile(path.join(__dirname, '../../../../public/uploads/' + folder + '/', imagename), buf, function(error) {
        if (error) {
            throw error;
        } else {
            updateUserFile('public/uploads/' + folder + '/'+imagename, user_id)
            return imagename;
        }
    });
}

function updateUserFile(file, user_id){
    var update_data = {'profile_image': file}
  
    return User.findByIdAndUpdate(user_id, update_data).exec().then((updateduser) => {
        if (updateduser) {
            {
                return {
                    status: 100,
                    msg: " Successfully updated the profile image",
                }
            }
        }
    }).catch(err => {
        //console.log("Error---",err)
        return {
            status: 101,
            msg: " Oops !! Something went wrong ",
        }
    });
}

// Get agencies total count
function usersCount(agency_id, role_id, order, dir, column_search, search_value, search_regex) {
    const promise = new Promise((resolve, reject) => {
        if (column_search.length) {
            User.aggregate([{
                    $match: { $or: column_search, $and: {'isAdmin':0} }
                },
                { $count: "users" },
                { $unwind: "$users" }
            ]).exec().then((res) => {
                if (res.length) {
                    resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].users });
                } else {
                    resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
                }
            }).catch((err) => {
                reject({ 'status': 101, 'msg': err, 'data': '' });
            });
        } else {
        	if (role_id == '-1' || role_id == '1' || role_id == '2' || role_id == '3') {
	            User.countDocuments({ "status": 1, "isAdmin": 0, "role":Number(role_id),
						"agency_id": { $ne: "0" } }).exec().then((users) => {
	                resolve({ 'status': 100, 'msg': 'Success', 'data': users });
	            }).catch((err) => {
	                reject({ 'status': 101, 'msg': err, 'data': '' });
	            });
            }else{
            	User.countDocuments({ "agency": agency_id, "role": role_id, "isAdmin": 0, 'deleted':0 }).exec().then((users) => {
	                resolve({ 'status': 100, 'msg': 'Success', 'data': users });
	            }).catch((err) => {
	                reject({ 'status': 101, 'msg': err, 'data': '' });
	            });
            }
        }
    });
    return promise
}

// Get agencies list 
function getUsers(agency_id, role_id, start, length, order, dir = 'asc', column_search, search_value, search_regex, fetch_columns) {
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
            User.aggregate([
                { $match: { $or: column_search } }, { $sort: sort },
                { $skip: Number(start) }, { $limit: Number(length) },
                {
                    $lookup: {
                        from: 'agencies',
                        localField: 'agency_id',
                        foreignField: 'agency_id',
                        as: 'agencydetail'
                    }
                },
                { $unwind: '$agencydetail' },
                {
                    $lookup: {
                        from: 'roles',
                        localField: 'role_type',
                        foreignField: 'role',
                        as: 'roledetail'
                    }
                },
                { $unwind: '$roledetail' },
                { $project: fetch_columns }
            ]).exec().then((users) => {
                resolve({ 'status': 100, 'msg': 'Success', 'data': users });
            }).catch((err) => {
                reject({ 'status': 101, 'msg': err, 'data': '' });
            });
        } else {
        	if (role_id == '-1' || role_id == '1' || role_id == '2' || role_id == '3') {
			
	            User.aggregate([
					{ $match: { 
						$and :[
						{ 
							 "status": 1, 
							 "isAdmin": 0, 
							 "role":Number(role_id),
						},
						{"agency_id": { $ne: "0" }}
						
					]} },
//						              {
//                    $lookup: {
//                        from: 'agencies',
//                        localField: 'agency_id',
//                        foreignField: 'agency_id',
//                        as: 'agencydetail'
//                    }
//                },
//                { $unwind: '$agencydetail' },
	                 
//	                {
//	                    $lookup: {
//	                        from: 'roles',
//	                        localField: 'role_type',
//	                        foreignField: 'role',
//	                        as: 'roledetail'
//	                    }
//	                },
//                    { $unwind: '$roledetail' },
//					 {
//						$match:{
//							"roledetail.role_type": Number(role_id)
//						}
//					 },
//                    
                    { $sort: sort },
                    { $project: fetch_columns },
                    { $skip: Number(start) },
                    { $limit: Number(length) },
	            ]).exec().then((users) => {
	                resolve({ 'status': 100, 'msg': 'Success', 'data': users });
	            }).catch((err) => {
	                reject({ 'status': 101, 'msg': err, 'data': '' });
	            });
	        }else{
	        	User.aggregate([
	                { $match: { $and :[{ "agency": agency_id, "role": role_id, "isAdmin": 0}]} },
	                { $sort: sort },
	                { $project: fetch_columns },
	                { $skip: Number(start) },
	                { $limit: Number(length) },
	                {
	                    $lookup: {
	                        from: 'agencies',
	                        localField: 'agency_id',
	                        foreignField: 'agency_id',
	                        as: 'agencydetail'
	                    }
	                },
	                { $unwind: '$agencydetail' },
	                {
	                    $lookup: {
	                        from: 'roles',
	                        localField: 'role_type',
	                        foreignField: 'role',
	                        as: 'roledetail'
	                    }
	                }
	            ]).exec().then((users) => {
	                resolve({ 'status': 100, 'msg': 'Success', 'data': users });
	            }).catch((err) => {
	                reject({ 'status': 101, 'msg': err, 'data': '' });
	            });
	        }
        }
    });
    return promise
}

let self = module.exports = {

    add: (req, h) => {
        if (req.payload) {
		
			// Validations on email and password
			if (!valid.email(req.payload.email)) {
				return {
					status: 101,
					msg: 'Invalid Email'
				}
			}
			if (!valid.emailLength(req.payload.email)) {
				return {
					status: 101,
					msg: 'Invalid Email Length'
				}
			}
			if (req.payload.password) {
				if (!valid.passwordLength(req.payload.password)) {
					return {
						status: 101,
						msg: 'Invalid password length. It must be greater than 6 characters.'
					}
				}
			}
			var rolename = '';
			if(!req.payload.role_name){
				return { "status": 101, "msg": "Role name is missing." }
			}else{
				var trim_string = req.payload.role_name.trim();
				rolename = trim_string.replace(" ", "_").toLowerCase();
			}			

			if (!req.payload.role_id) {
				return { "status": 101, "msg": "Role is missing." }
			}

			let userdata, driverdata, userprofile
			var User_id = uniqid();
			userdata = new User({
				user_id: User_id,
				agency: req.payload.agency_id,
				role_type: req.payload.role_type,
				role:req.payload.role_id,
				first_name: req.payload.first_name,
				last_name: req.payload.last_name,
				email: req.payload.email,
				dob: req.payload.dob,
				contact: req.payload.contact_no,
				password: req.payload.password,
				isAdmin: 0,
				status: 1,
				created_by: req.payload.created_by,
				updated_by: req.payload.created_by
			});

			userdata.password = userdata.generateHash(userdata.password);     

			let custom_fields    = {}
            if("custom_fields" in req.payload){
                custom_fields = req.payload.custom_fields
                if(custom_fields && custom_fields.length > 0){               
                    custom_fields.forEach((current, index)=> {                    
                        if(current.type == "image"){
                            if('val' in current && current.val){
                                var get_file = current.val;
                                var newpath = path.join(__dirname + `/../../../../public/uploads/${req.payload.agency_id}/role/`)
                              
                                fs.mkdirSync(newpath, { recursive: true })
                                var buf = Buffer.from(get_file.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');
                                var imagename ='';
                                var mime  = get_file.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
                                var value = '';                    
                                if (mime && mime.length) {
                                    result = mime[1].split("/");
                                    value  = result[1];
                                }

                                if(value){
                                    imagename = Date.now() + '.'+value;
                                }else{                           
                                    imagename = Date.now() + '.jpg';                            
                                }
                                if (!fs.existsSync(newpath)) {
                                    self.decode_buffer(buf, req.payload.agency_id+'/'+rolename, imagename);
                                    current.val = 'public/uploads/'+req.payload.agency_id+'/'+rolename+'/'+imagename;

                                }else{ 
                                    self.decode_buffer(buf, req.payload.agency_id+'/'+rolename, imagename);
                                    current.val = 'public/uploads/'+req.payload.agency_id+'/'+rolename+'/'+imagename;                           
                                }
                            }else{
                                current.val = '';
                            }                        
                        }
                    })
                }
            }

			if (req.payload.role_type == 1 || req.payload.role_type > 1) {
				driverdata = new Driver({
					user: userdata._id,
					agency:req.payload.agency_id,
					address: req.payload.address,
					city: req.payload.city,
					state: req.payload.state,
					country: req.payload.country,
					pin_code: req.payload.pin_code,
					qualification: req.payload.qualification,
					experience: req.payload.experience,
					salary: req.payload.salary,
					custom_fields: custom_fields,
					created_by: req.payload.created_by,
					updated_by: req.payload.created_by
				});

			} else if (req.payload.role_type > 1 || req.payload.role_type == 1) {
				userprofile = new Userprofile({
					user: userdata._id,
					agency: req.payload.agency_id,
					address: req.payload.address,
					city: req.payload.city,
					state: req.payload.state,
					country: req.payload.country,
					pin_code:req.payload.pin_code,
					//qualification: req.payload.qualification,
					experience: req.payload.experience,
					salary: req.payload.salary,
					custom_fields: custom_fields,
					created_by: req.payload.created_by,
					updated_by: req.payload.created_by
				})
			}
			
			if (req.payload.role_type == 1  || req.payload.role_type > 1 ) {
				return Driver.create(driverdata), User.create(userdata).then((user) => {

					if(req.payload.Userimage){

						var newpath = path.join(__dirname + `/../../../../public/uploads/${req.payload.agency_id}/${rolename}/`)
						//path.join(__dirname, '../../../../public/uploads/' + req.payload.agency_id+'/'+req.payload.role_name)
						if (!fs.existsSync(newpath)) {							
							fs.mkdirSync(newpath, { recursive: true })
							decode_base64(req.payload.Userimage,req.payload.agency_id+'/'+rolename, '' , user._id);
							//return {'status':100, 'msg': 'File Successfully added.' }

						}else{ 
							decode_base64(req.payload.Userimage,req.payload.agency_id+'/'+rolename, '', user._id);
						   //return {'status':100, 'msg': 'File Successfully added.' } 
						}
					}

					// Make json for log
					var log = {
						'operation':'Added the user - '+user.first_name+" "+user.last_name,	
						'created_by':user.created_by,		
						'updated_by':user.updated_by,		
						'agency':user.agency,
						'user':user._id,
						'old_payload':'',
						'new_payload':user,
					}	
					return Log.addLog(log, 'log_users').then((addeduserlog) => { 		
						 return {
							 'status':100, 
							 'msg':'User created Successfully', 'data':user
						 }  
					 }).catch((err2) => { 
						 console.log("Error---", err2); 
						return {
							status: 101,
							msg: "Something went wrong while saving logss."
						};
					}); 
				}).catch((err) => {
					return {'status':101, 'msg': err.message };
				});
			} 
			else {
				return  Driver.create(driverdata),Userprofile.create(userprofile), User.create(userdata).then((user) => {
					// File upload
					if(req.payload.Userimage){
						 var newpath = path.join(__dirname + `/../../../../public/uploads/${req.payload.agency_id}/${rolename}/`)
						//path.join(__dirname, '../../../../public/uploads/' + req.payload.agency_id+'/'+req.payload.role_name)
						if (!fs.existsSync(newpath)) {
						fs.mkdirSync(newpath, { recursive: true })
							decode_base64(req.payload.Userimage,req.payload.agency_id+'/'+rolename, '', user._id);
							// return {'status':100, 'msg': 'File Successfully added.' }                            
						}else{
							decode_base64(req.payload.Userimage,req.payload.agency_id+'/'+rolename, '', user._id);
							//return {'status':100, 'msg': 'File Successfully added.' }
						}
					}

					// Make logs
					var log = {
						'operation':'Added the user - '+user.first_name+" "+user.last_name,	'created_by':user.created_by,		'updated_by':user.updated_by,		'agency':user.agency,
						'user':user._id,
						'old_payload':'',
						'new_payload':user,
					}										
					return Log.addLog(log, 'log_users').then((addeduserlog) => { 		
						 return {
							 'status':100, 
							 'msg':'User created successfully', 'data':user
						 }  
					 }).catch((err2) => {
					 console.log("Error---", err2); 
						return {
							status: 101,
							msg: "Something went wrong while saving logdd."
						};
					}); 
				}).catch((err) => {
					return {'status':101, 'msg': err.message };
				});
			}         
        }
    },

    update: (req, h)=>{
    	// console.log(req.payload,'payload')
        if (req.payload) {
            if(!req.params.id){
			    return {
				   status:101, 
				   msg:'Please send the the user id in the url paramaters'
			    }
			}else{
				if (!valid.email(req.payload.email)) {
					return {
						status: 101,
						msg: 'Invalid Email'
					}
				}
				if (!valid.emailLength(req.payload.email)) {
					return {
						status: 101,
						msg: 'Invalid Email Length'
					}
				}
				if (req.payload.password) {
					if (!valid.passwordLength(req.payload.password)) {
						return {
							status: 101,
							msg: 'Invalid password length. It must be greater than 6 characters.'
						}
					}
				}

				var rolename = '';
				

                // Get the role name
                let get_role_name = Helper.getRoleName(req.payload.role_id);
                
                return get_role_name.then((res) => {
                	
                	if(res.status == 100){
                		if(res.data){
                			let rolename = res.data;
							var userdata, driverdata, userprofile
							userdata = {
								role: req.payload.role_id,
								role_type: req.payload.role_type,
								first_name: req.payload.first_name,
								last_name: req.payload.last_name,
								email: req.payload.email,
								contact: req.payload.contact_no,
								dob: req.payload.dob,
								status: req.payload.status,
								updated_by:req.payload.updated_by
							}

							// Hash the password
							if (req.payload.password) {
								userdata.password = userdata.generateHash(req.payload.password)
							}

							let custom_fields    = {}
				            if("custom_fields" in req.payload){
				                custom_fields = req.payload.custom_fields
				                if(custom_fields && custom_fields.length > 0){               
				                    custom_fields.forEach((current, index)=> {                    
				                        if(current.type == "image"){
				                            if('val' in current && current.val){
				                                var get_file = current.val;
				                                var newpath = path.join(__dirname + `/../../../../public/uploads/${req.payload.agency_id}/role/`)
				                              
				                                fs.mkdirSync(newpath, { recursive: true })
				                                var buf = Buffer.from(get_file.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');
				                                var imagename ='';
				                                var mime  = get_file.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
				                                var value = '';                    
				                                if (mime && mime.length) {
				                                    result = mime[1].split("/");
				                                    value  = result[1];
				                                }

				                                if(value){
				                                    imagename = Date.now() + '.'+value;
				                                }else{                           
				                                    imagename = Date.now() + '.jpg';                            
				                                }
				                                if (!fs.existsSync(newpath)) {
				                                    self.decode_buffer(buf, req.payload.agency_id+'/'+rolename, imagename);
				                                    current.val = 'public/uploads/'+req.payload.agency_id+'/'+rolename+'/'+imagename;

				                                }else{ 
				                                    self.decode_buffer(buf, req.payload.agency_id+'/'+rolename, imagename);
				                                    current.val = 'public/uploads/'+req.payload.agency_id+'/'+rolename+'/'+imagename;                           
				                                }
				                            }else{
				                                current.val = '';
				                            }                        
				                        }
				                    })
				                }
				            }

							if (req.payload.role_type == 1 || req.payload.role_type > 1) {
								driverdata = {
									address: req.payload.address,
									city: req.payload.city,
									state: req.payload.state,
									country: req.payload.country,
									qualification: '',
									experience: req.payload.experience,
									salary: req.payload.salary,
									pin_code: req.payload.pin_code,						
									updated_by:req.payload.updated_by
								}
							} else if (req.payload.role_type > 1 || req.payload.role_type == 1  ) {
								userprofile = {
									address: req.payload.address,
									city: req.payload.city,
									state: req.payload.state,
									country: req.payload.country,
									qualification: '',
									experience: req.payload.experience,
									salary: req.payload.salary,
									pin_code: req.payload.pin_code,		
									status: req.body.status,				
									updated_by:req.payload.updated_by
								}
							}

							let conditions = { _id: req.params.id },
								update_userprofile = userprofile,
								update_user = userdata,
								update_driver = driverdata,
								options = { 'upsert': false, 'new': true }
							
							/* Update user details */
							return User.findOneAndUpdate(conditions, update_user, options).exec().then((result) => {
								if (req.payload.role_type == 1 || req.payload.role_type > 1) {
								
									/* Update driver details */
									return Driver.findOneAndUpdate({user:req.params.id}, update_driver, options)
										.exec().then((doc) => {
											if (doc) {
											
												if(req.payload.Userimage){

													/* Get the role name from role id*/
													var newpath = path.join(__dirname + `/../../../../public/uploads/${req.payload.agency_id}/${rolename}/`)
													//path.join(__dirname, '../../../../public/uploads/' + req.payload.agency_id+'/'+req.payload.role_name)
													if (!fs.existsSync(newpath)) {
														
														fs.mkdirSync(newpath, { recursive: true })
														decode_base64(req.payload.Userimage,req.payload.agency_id+'/'+rolename, '', doc.user);
														// return {'status':100, 'msg': 'File Successfully added.' }                            
													}else{
														
														decode_base64(req.payload.Userimage,req.payload.agency_id+'/'+rolename, '', doc.user);
														//return {'status':100, 'msg': 'File Successfully added.' }
													}
												}
												// Make json for log
												var log = {
													'operation':'Updated the driver - '+result.first_name+" "+result.last_name,	'created_by':result.created_by,		'updated_by':doc.updated_by,		'agency':result.agency,
													'user':result._id,
													'old_payload':{'user':result,'driver':doc},
													'new_payload':{'user':update_user,'driver':update_driver}
												}										
												return Log.addLog(log, 'log_users').then((addeduserlog) => { 		
													return {
														'status':100, 
														'msg':'User Updated Successfully', 'data':result
													}  
												 }).catch((err2) => { 
													return {
														'status': 101,
														'msg': "Something went wrong while saving log."
													};
												});
											}
										}).catch((err) => { 
											console.log("Checkerr-==>>", err);
											return {
												'status': 101,
												'msg': "Something went wrong while saving logaaa."
											};
										});
								} else {

									/* Update userprofile details */
									return Userprofile.findOneAndUpdate({user:req.params.id}, update_userprofile, options).exec().then((res) => {
										if (res) {								
																	
											// Make json for log
											var log = {
												'operation':'Updated the user - '+result.first_name+" "+result.last_name,	'created_by':result.created_by,		'updated_by':result.updated_by,		'agency':result.agency,
												'user':result._id,
												'old_payload':{'user':result,'profile':res},
												'new_payload':{'user':update_user,'profile':update_userprofile}
											}										
											return Log.addLog(log, 'log_users').then((addeduserlog) => { 		
												return {
													'status':100, 
													'msg':'User Updated Successfully', 'data':result
												}  
											}).catch((err) => { 
												return {
													status: 101,
													msg: "Something went wrong while saving log."
												};
											});
										}
									}).catch((err) => { 
											return {
												status: 101,
												msg: "Something went wrong while saving log."
											};
										});
								}					

							}).catch((err) =>{
								return {'status':101, 'msg':err.message}  
							});
                		}
                	}else{
                		return { "status": 101, "msg": res.msg }
                	}
                });

			}
        }
    },

    /* Validation */
    validateUser: (req, h) => {
        if (req.payload.email) {
            return User.findOne({ "email": req.payload.email }).exec().then((result) => {
                if (result) {
                    return { status: "101", msg: "Email already exist" }
                } else{                    
                    return { status: "100", msg: "" }
                }
            })
        }else{
            return { status: "101", msg: "Please send email to check." }
        }
    },
    /* End */

    /* Delete users  */

    delete: (req, h) => {
		if (!req.params.id) {
			return { status: 101, msg: 'User not found' }
		}
		let conditions = { _id: req.params.id }
		let delete_user = {status:0}
		let options = { 'upsert': false, 'new': false }
		return User.findOneAndUpdate(conditions, delete_user).exec().then((res) => {
			if (res){
				
				// Make json for log
				var log = {
					'operation':'Deleted the user - '+res.first_name+' '+res.last_name,	'created_by':res.created_by,		
					'updated_by':res.updated_by,		
					'agency':res.agency,
					'user':res.user,
					'old_payload': res,
					'new_payload': delete_user
				}										
				return Log.addLog(log, 'log_users').then((addeduserlog) => { 		
					 return {
						 'status':100, 
						 'msg':'User deleted successfully'
					 }  
				 }).catch((err2) => { 
					return {
						status: 101,
						msg: "Something went wrong while saving log."
					};
				});
			}else{
				 return {
					status: 101,
					msg: "Please try again later."
				};					
			}
		});
    },

    /* Get Roles details */

    getRoles: (req, h) => {
        const promise = new Promise((resolve, reject) => {
            if (!req.params.id) {
                return { "status": false, "msg": "Please send the id.", "data": '' }
            }
            Role.find({ "agency_id": req.params.id }, 'role_type role_name').exec().then((roles) => {
                resolve({ 'status': 100, 'msg': 'Success', 'data': roles });
            }).catch((err) => {
                reject({ 'status': 101, 'msg': err, 'data': '' });
            });
        })
        return promise;
    },

    /* Get User list */
    fetch: (request, h) => {
        if (request.payload.role_id == '-1') {
            return User.find({ "status": 1, "isAdmin": 0 }).exec().then((users) => {
                users.forEach(ele =>{
                    ele.profile_image = "http://"+request.headers.host+"/"+ele.profile_image;
                })
                // users[0].profile_image = "http://"+request.headers.host+"/"+users[0].profile_image;
                
                return {'status': 100, 'msg':'Success', 'data':users}
            }).catch((error) => { 
                return {'status': 101, 'msg':error}
            });
        } else {
    
             return User.find({ "agency": request.payload.agency_id, "role": request.payload.role_id, "isAdmin": 0 , status:1}).then((users) => {
                if(users.length){
                     users.forEach(ele =>{
                    ele.profile_image = "http://"+request.headers.host+"/"+ele.profile_image;
                })
                  // users[0].profile_image = "http://"+request.headers.host+"/"+users[0].profile_image; 
                  return {'status': 100, 'msg':'Success', 'data':users} 
                }else{
                    return {'status': 101, 'msg':'User not found in this role.'}
                }
               
            /*return User.aggregate([{
                    $match:  { 
                        $or: [
                               { "agency_id" : { $eq: request.payload.agency_id} }, 
                               { "role" : {$eq: request.payload.role_id} }, 
                               { "isAdmin" : {$eq: 0 } }
                            ]
                        }
                    },
                    {$project: {'first_name':true, 'last_name':true,'contact':true, 'status':true, 'agency_id':true, 'role':true,'isAdmin':true}
                }]).exec().then((users) => {*/
                                  
            }).catch((err) => {
                console.log(err);
                return {'status':101, 'msg':err}
            });
        }
    },
    /* End */

    // Get users list for the attendance module
    
    fetchAttendanceUsers: (request, h) => {
    	// if (request.payload.role_id == '-1') {
     //        return User.find({ "status": 1, "isAdmin": 0 }).exec().then((users) => {
     //            // users.forEach(ele =>{
     //            //     ele.profile_image = "http://"+request.headers.host+"/"+ele.profile_image;
     //            // })
     //            // users[0].profile_image = "http://"+request.headers.host+"/"+users[0].profile_image;
                
     //            return {'status': 100, 'msg':'Success', 'data':users}
     //        }).catch((error) => { 
     //            return {'status': 101, 'msg':error}
     //        });
     //    }  else {
     //    	return User.find({ "agency_id": request.payload.agency_id, "role": request.payload.role_id, "isAdmin": 0 }).then((users) => {
     //             if(users.length){
     //            //     users.forEach(ele =>{
     //            //     ele.profile_image = "http://"+request.headers.host+"/"+ele.profile_image;
     //            // })
     //              // users[0].profile_image = "http://"+request.headers.host+"/"+users[0].profile_image; 
     //              return {'status': 100, 'msg':'Success', 'data':users} 
     //            }else{
     //                return {'status': 101, 'msg':'User Not Found'}
     //            }
     //             }).catch((err) => {
     //            console.log(err);
     //            return {'status':101, 'msg':err}
     //        });
     //    }
	    if (request.payload) {
	        const promise = new Promise((resolve, reject) => {
	            let pdata = request.payload
	            let search_value = ''
	            let search_regex = ''
	            let draw = pdata.draw
	            //let draw = 1
	            let start = pdata.start
	            let length = pdata.length
	            let order = ''
	            if (pdata.order) {
	                order = pdata.order
	            }
	           
	            let columns = pdata.columns
	            let column_search = []
	            let i
	            let fetch_columns = {};
	            if (columns) {
	                for (i = 0; i < columns.length; i++) {
	                    let key = columns[i].name
	                    if (pdata.search.value) {

	                        // let pkey = columns[i].data


	                        if (key) {

	                            let c_sr = {
	                                    [key]: { $regex: '.*' + pdata.search.value + '.*', $options: "si" }
	                                }
	                                // Don't remove the below comments. it might be useful for later use
	                                // c_sr.value = pdata.search.value
	                                // c_sr.name = key
	                            column_search.push(c_sr)

	                        }
	                    }
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

	            let columns_valid = [
	                "first_name",
                    "last_name",
                    "user_id",
	                "email",
	                "contact",
	                "roledetail.role_name",
	                "agencyedetail.agency_name"
	            ]

	            if (columns_valid[col]) {
	                order = columns_valid[col];
	            } else {
	                order = null;
	            }

	            agency_id = pdata.agency_id;
	            role_id   = pdata.role_id;
	            // Will use the aganecy id here from session , so don't remove the comments
	            /*if( $this->session->userdata('type') == ROLE_EMPLOYEE){     
	                $current_employee_id = $current_user_id;        
	            }  */
	            let total_records = 0
	            let get_total_records = usersCount(agency_id, role_id, order, dir, column_search, search_value, search_regex);

	            get_total_records.then((res) => {
	                total_records = res.data
	                let records = 0
	                let dataget_records = 0

	                get_records = getUsers(agency_id, role_id, start, length, order, dir, column_search, search_value, search_regex, fetch_columns);
	                get_records.then((res) => {
	                    output = {
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
    }, 

    fetchLast4: (request, h) => {
        const promise = new Promise((resolve, reject) => {
            User.aggregate([{
                    $lookup: {
                        from: "drivers",
                        localField: "user_id",
                        foreignField: "user_id",
                        as: "user4detail"
                    }
                }, { "$unwind": "user4detail" },
                {
                    $lookup: {
                        from: "agencies",
                        localField: "user_id",
                        foreignField: "user_id",
                        as: "user4detail"
                    }
                }, { "$unwind": "user4detail1" },
            ])
        });
        return promise;

    },

    /* Get aggency details */
    getAgency: function(req, h) {
        const promise = new Promise((resolve, reject) => {

            return Agency.find().exec().then((agenciesList) => {

                resolve({ 'status': 100, 'msg': 'Success', 'data': agenciesList });

            }).catch((err) => {
                reject({ 'status': 101, 'msg': err, 'data': '' });
            });
        });
        return promise;

    },

    getAgencyids: function() {
        const promise = new Promise((resolve, reject) => {

            return Agency.find().exec().then((agenciesList) => {

                resolve({ 'status': 100, 'msg': 'Success', 'data': agenciesList });

            }).catch((err) => {
                reject({ 'status': 101, 'msg': err, 'data': '' });
            });
        });
        return promise;

    },
    /* End */

    getUserByID: function(req, h) {

        return User.findById(req.params._id).exec().then((userdetail) => {
            if (userdetail) {
            		// console.log('first block',userdetail)
                if(userdetail.role_type == 1 ||  userdetail.role_type > 1){ 					
                    userdetail.profile_image = "http://"+req.headers.host+"/"+userdetail.profile_image;				
                    return Driver.findOne({ 'user': req.params._id }).exec().then((otherdetail) => {      
						var myProfile = {
                            userdetail: userdetail                           
                        }
                    	if('custom_fields' in otherdetail){

                        if(otherdetail.custom_fields == undefined || otherdetail.custom_fields == 0 ) 
                        {
		                        myProfile.otherdetail = otherdetail;
		                        return {'status':100, 'msg':'Success', 'data':myProfile}
                        }
                        else {
                        	console.log('hello')
                           if(otherdetail.custom_fields.length > 0){
		               
		                        otherdetail.custom_fields.forEach((current, index)=> {
		                            if(current.type == "image"){
		                                current.val = "http://"+req.headers.host+"/"+current.val;
		                            }
		                        })
		                        myProfile.otherdetail = otherdetail;
		                        return {'status':100, 'msg':'Success', 'data':myProfile}
		                    }else{
		                        return {'status':100, 'msg':'Success', 'data':myProfile}
		                    }
                        }

                    		
		                    
		                }
                    }).catch((err) => {
                        return {'status':101, 'msg':err.errmsg}
                    })
                }else {
                	console.log('hello')
                    userdetail.profile_image = "http://"+req.headers.host+"/"+userdetail.profile_image;
                    return Userprofile.findOne({'user': req.params._id }).exec().then((otherdetail) => {
                    		console.log('second block',otherdetail)
                    	var myProfile = {
                            userdetail: userdetail                           
                        }
                        if('custom_fields' in otherdetail){
		                    if(otherdetail.custom_fields.length > 0){
		                        otherdetail.custom_fields.forEach((current, index)=> {
		                            if(current.type == "image"){
		                                current.val = "http://"+req.headers.host+"/"+current.val;
		                            }
		                        })
		                        myProfile.otherdetail = otherdetail;
		                        return {'status':100, 'msg':'Success', 'data':myProfile}
		                    }else{
		                        return {'status':100, 'msg':'Success', 'data':myProfile}
		                    }
		                }
                    }).catch((err1) => {
                        return {'status':101, 'msg':err1.errmsg}
                    })
                }              
            }
        }).catch((err2) => {
            return {'status':101, 'msg':err2.errmsg}
        })
    },

    /* Get recent customers */
    getRecentUsers: (request, h) => {
        const concat =  "http://"+request.headers.host+"/";
        if(request.params.agency_id){
            return User.aggregate([
                            {$match: { "agency_id": request.param.agency_id }},
                            { $sort: {'_id': -1} },
                            { $limit: 5 },
                            { $project: {'first_name':true, 'last_name':true, 'contact':true, 'profile':{$concat:[concat,"$profile_image"]}} }
                        ]).exec().then((result) => {
                if (result) {
                    return { 'status': 100,  'msg': "Success", 'data': result }
                }
            }).catch((err1) => {
                return { 'status': 101,  'msg': "Oops! User list is not fetched. Please try again." }
            });
        }else{
            return User.aggregate([
                            //{$match: { "agency_id": agency_id }},
                            { $sort: {'_id': -1} },
                            { $limit: 5 },
                            { $project: {'first_name':true, 'last_name':true, 'profile':{$concat:[concat,"$profile_image"]}} }
                        ]).exec().then((result) => {
                if (result) {
                    return { 'status': 100,  'msg': "Success", 'data': result }
                }
            }).catch((err1) => {
                return { 'status': 101,  'msg': "Oops! User list is not fetched. Please try again." }
            });
        }
    },

    getAllDriver: (request, h) => {
    	var condition = {'status':1}
    	if(request.payload.agency_id){
			condition = { 'status':1, "agency": request.payload.agency_id, "role_type":1 }
		}
		return User.find(condition, {'_id':true, 'first_name':true, 'last_name':true,'contact':true, 'email':true}).exec().then((driver) => {
				return {
					status: 100,
					msg: "Successfully listed",
					data: driver                         
				}
			}).catch((err) => {
				return {
					status: 101,
					msg: err                             
				}
			});
//		} else{
//			return {
//				status: 101,
//				msg: "Select Agency",                       
//			}
//		}
  	},

  	// Add the files into the folder
    decode_buffer(buf, folder, filename='' ) { 
        return fs.writeFile(path.join(__dirname, '../../../../public/uploads/' + folder + '/', filename), buf, function(error) {
            if (error) {
            } 
            else {
            }
        });
    }
}