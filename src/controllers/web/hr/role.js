var Role            = require('../../../models/role');
var Users           = require('../../../models/user');
var Agency          = require('../../../models/agency');
var CustomFieldRole = require('../../../models/custom_fields_role');
const storage       = require('node-sessionstorage');
const Log           = require('../../../helpers/log.js');
const fs            = require('fs');
const path          = require('path');
const FileType      = require('file-type');

let self = module.exports = {
    addRole: (req, h) => {
        if (req.payload.role_name == '') {
            return {
                status: 101,
                message: 'Role name is missing!!'
            }
        } else {
            
			//Check the custom fields and their required property
//			self.getCustomFields(req.payload.agency_id, req.payload.module, req.payload.form).then((fields) =>{			
//			}).catch((field_err) => {
//				console.log(field_err)
//			})
			let role_permissions = {}
            let custom_fields    = {}
			if("permissions" in req.payload){
				role_permissions = req.payload.permissions
			}
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
                                    self.decode_buffer(buf, req.payload.agency_id+'/role', imagename);
                                    current.val = 'public/uploads/'+req.payload.agency_id+'/role/'+imagename;

                                }else{ 
                                    self.decode_buffer(buf, req.payload.agency_id+'/role', imagename);
                                    current.val = 'public/uploads/'+req.payload.agency_id+'/role/'+imagename;                           
                                }
                            }else{
                                current.val = '';
                            }                        
                        }
                    })
                }
            }
			return Role.find({ agency: req.payload.agency_id }).sort({_id: -1 }).exec().then((find) => {
                if (find.length) {
                    return Role.find({ agency: req.payload.agency_id, role_name: req.payload.role_name }).sort({ role_type: -1 }).exec().then((finded) => {
						
                            if (finded && finded.length == 0) { 
                                var role1 = new Role({
                                    role_name: req.payload.role_name,
                                    role_type: find[0].role_type + 1,
                                    description: req.payload.description,
									permissions: role_permissions,
                                    custom_fields: custom_fields,
                                    agency: req.payload.agency_id,
									created_by: req.payload.created_by,
									updated_by: req.payload.created_by
                                });
								
								//Set the dynamic 
								//role1.set('field1', 'Custom field 1 value');
                                return Role.create(role1).then((addedrole) => {                       
                                    if (addedrole) {

										// Make json for log
										var log = {
											'operation':'Added new role - '+addedrole.role_name,	
                                            'created_by':addedrole.created_by,		
                                            'updated_by':addedrole.updated_by,		
                                            'agency':addedrole.agency,
											'role':addedrole._id,
											'old_payload': null,
											'new_payload':addedrole
										}										
										return Log.addLog(log, 'log_roles').then((addedrolelog) => { 		
											return {
												status: 100,
												msg: 'Role is successfully added.'
											}   
										 }).catch((err2) => { 
											return {
												status: 101,
												msg: "Something went wrong while saving log."
											};
                                		});
                                       
                                    } else {
                                        return {
                                            status: 101,
                                            msg: 'Opps! Role is not added. Please try again.'
                                        }
                                    }
                                }).catch((err2) => {    
                                    return {
                                        status: 101,
                                        msg: req.payload.role_name + " " + "Already Exist in Database"
                                    };
                                });
                            } else {
                                return {
                                    status: 101,
                                    msg: 'Role is already in existence. Please try with the different role name.'
                                }
                            }
                        })
                        .catch((err3) => {                            
                            return { status: 101, msg: err3.message };
                        });
                }else{
                    var role1 = new Role({
                        role_name: req.payload.role_name,
                        role_type: 1,
                        description: req.payload.description,
                        permissions: role_permissions,
                        custom_fields: custom_fields,
                        agency: req.payload.agency_id,
						created_by: req.payload.created_by,
						updated_by: req.payload.created_by
                    });
                    return Role.create(role1).then((addedrole) => {                         
                        if (addedrole) {
							
							var log = {
								'operation':'Added new role - '+addedrole.role_name,	
                                'created_by':addedrole.created_by,
								'updated_by':addedrole.updated_by,
								'agency':addedrole.agency_id,
								'role':addedrole._id,
                                'old_payload': null,
                                'new_payload':addedrole
							}
							Log.addLog(log, 'log_roles');
                            return {
                                status: 100,
                                msg: 'Role is successfully added.'
                            }
							
                        } else {
                            return {
                                status: 101,
                                msg: 'Opps! Something went wrong while saving log.'
                            }
                        }
                    }).catch((err2) => {                       
                        return {
                            status: 101,
                            msg: req.payload.role_name + " " + "Already Exist in Database"
                        };
                    });
                }
              
            }).catch((err1) => {
                return { 'status': 101, 'msg' :err1.errmsg };
            });
        }
    },

    getAllRoles: (req, h) => {
        return Role.aggregate([{
            $lookup: {
                from: 'agencies',
                localField: 'agency_id',
                foreignField: 'agency_id',
                as: 'agency'
            }
        }]).exec().then((roles) => {
                if (roles) {
                    var message = storage.getItem('message')
                    storage.removeItem('message')
                    return h.view('rolelist', {
                        title: 'Using handlebars in Hapi',
                        status: true,
                        message: message,
                        Roles: roles,
                    }, { layout: 'layout' })
                }
            }
        ).catch((err1) => {
            console.log(err1)
            return { err1: err1 };
        });
    },

    getRoleDetail: (req, h) => {
        return Role.findOne({ _id: req.params.id }).exec().then((role) => {
            if (role) {
                if('custom_fields' in role){
                    if(role.custom_fields.length > 0){
                        role.custom_fields.forEach((current, index)=> {
                            if(current.type == "image"){
                                current.val = "http://"+req.headers.host+"/"+current.val;
                            }
                        })
                        return { 'status': 100,  'msg': "Success", 'data': role }
                    }else{
                        return { 'status': 100,  'msg': "Success", 'data': role }
                    }
                }
                
            }
        }).catch((err) => {
            return { 'status': 101,  'msg': err.errmsg }
        });
    },

    update: (req, h) => {
        var permissions   = {}
        var custom_fields = {}
        if("permissions" in req.payload){
        	permissions = req.payload.permissions
        }
      	if("custom_fields" in req.payload){
            custom_fields = req.payload.custom_fields
            if(custom_fields.length > 0){               
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
                                self.decode_buffer(buf, req.payload.agency_id+'/role', imagename);
                                current.val = 'public/uploads/'+req.payload.agency_id+'/role/'+imagename;

                            }else{ 
                                self.decode_buffer(buf, req.payload.agency_id+'/role', imagename);
                                current.val = 'public/uploads/'+req.payload.agency_id+'/role/'+imagename;                           
                            }
                        }else{
                            current.val = '';
                        }                        
                    }
                })
            }
        }
        
        return Role.findById(req.params._id).exec().then((role) => {
            
            // Restore the fields which are only added in add operation and restore the image, if it is already existed.
            if('custom_fields' in role){
                role.custom_fields.map(ele=>{
                    var index = req.payload.custom_fields.findIndex(x=> x.field_id == ele.field_id);
                    if(index == -1){                        
                        req.payload.custom_fields.push(ele);
                    }else{
                        var new_index;
                        if(new_index = req.payload.custom_fields.findIndex(x=> (x.field_id == ele.field_id))){ 
                            if(!req.payload.custom_fields[new_index].val){
                                req.payload.custom_fields[index].val = ele.val;
                            }                                
                        }
                        /* if(ele.type == 'image' && ele.val){                           
                            req.payload.custom_fields[index].val = ele.val;
                        }*/
                    }
                    
                });
            }
            
            // Actual update the role.
            return Role.update({ _id: req.params._id }, { $set: req.payload}).exec().then((role) => {
                if (role) {
                    
                    // Make json for log
                    var log = {
                        'operation':'Updated the role - '+role.role_name,   'created_by':role.created_by,       
                        'updated_by':role.updated_by,       
                        'agency':role.agency,
                        'role':role._id,
                        'old_payload': role,
                        'new_payload': req.payload
                    }                                       
                    return Log.addLog(log, 'log_roles').then((addedrolelog) => {
                        return { 'status': 100,  'msg': "Role is successfully updated.", 'data': role }
                     }).catch((err2) => {                         
                        return {
                            status: 101,
                            msg: "Something went wrong while adding log."
                        };
                    });                
                }
            }).catch((err1) => {
                return { 'status': 101,  'msg': "Oops! Role is not updated. Please try again." }
            });

        }).catch((err1) => {
            return { 'status': 101,  'msg': "Oops! This role doesn't found." }
        });      
    },

    deleteRole: (req, h) => {
         		
		return Role.findByIdAndUpdate(req.params._id, {status:0}).exec().then((role) => {
            if (role) {
				// Make json for log
				var log = {
					'operation':'Deleted the role - '+role.role_name,	'created_by':role.created_by,		
					'updated_by':role.updated_by,		
					'agency':role.agency,
					'role':role._id,
					'new_payload': {status:0},
					'old_payload': role
				}										
				return Log.addLog(log, 'log_roles').then((addedrolelog) => {
					 return { 'status': 100, 'msg': 'Role Deleted Succesfully' }
				 }).catch((err2) => { 
					return {
						status: 101,
						msg: "Something went wrong while adding log."
					};
				}); 
               
            }else{
                return { 'status': 101, 'msg': "Oops! Role is not deleted. Please try again." }
            }
        }).catch((err) => {
            return { 'status': 100, 'msg': err.message }
        });
    },

    getReqData: (req, h) => {
        return Agency.find({}).exec().then((agenciesList) => {
            if (agenciesList) {
                var errmessage = storage.getItem('errmessage')
                storage.removeItem('errmessage')
                return h.view('addrole', {
                    title: 'Using handlebars in Hapi',
                    status: true,
                    errmessage: errmessage,
                    AgenciesList: agenciesList,
                }, { layout: 'layout' });
            }

        }).catch((err) => {
            console.log(err)
            return { err: err };

        });

    },

    /* Get roles list */
    fetch_ajax: (request, h) => {
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
                        let key = columns[i].name;
                        if (pdata.search.value) {
                            if (key) {
                                if (key != 'agency.agency_name') {
                                    let c_sr = {
                                            [key]: { $regex: '.*' + pdata.search.value + '.*', $options: "si" }
                                        }
                                        // Don't remove the below comments. it might be useful for later use
                                        // c_sr.value = pdata.search.value
                                        // c_sr.name = key
                                    column_search.push(c_sr)
                                }
                            }
                        }
						columns_valid.push(key)
                        fetch_columns[key] = true;
                    }
                }
           
                let col = 0;
                let dir = "";
                if (dir != "asc" && dir != "desc") {
                    dir = "asc";
                }

//                let columns_valid = [
//                    "role_type",
//                    "role_name",
//                    "agency.agency_name",
//                    "description"
//                ]

                if (columns_valid[col]) {
                    order = columns_valid[col];
                } else {
                    order = null;
                }
                //let j
                // let sort = {}
                // if (order) {
                //     for (j = 0; j < order.length; j++) {
                //         col = order[j].column
                //         dir = order[j].dir
                //         sort[col] = dir
                //     }
                // } else {
                //     sort = { '_id': -1 }
                // }
                agency_id = pdata.agency_id;
				
                let total_records = 0
                let get_total_records = self.rolesCount(agency_id, column_search);
                get_total_records.then((res) => {
                    total_records = res.data
                    get_records = self.getRoles(agency_id, start, length, order, dir, column_search, search_value, search_regex, fetch_columns);
                    get_records.then((res) => {
                        output = {
							"status": 100,
							"msg": "Success",
                            "recordsTotal": total_records,
                            "recordsFiltered": total_records,
                            "data": res.data
                        }
                        resolve(output)
                    }).catch((err) => {
						console.log('Error1', err)
                        resolve({"status":101, "msg":"There is some error. Please try again."})
                    })
                }).catch((err) => {
					console.log('Error2', err)
                  	resolve({"status":101, "msg":"There is some error. Please try again."})
                })
            });
            return promise;
        }
    },
	
    // Get roles total count
    rolesCount: function(agency_id, column_search) {
        const promise = new Promise((resolve, reject) => {

            if (column_search.length) {
                Role.aggregate([{
                        $match: { $or: column_search,$and:[{'status':1}] }
                    },
                    {
                        $lookup: {
                            from: 'agencies',
                            localField: 'agency_id',
                            foreignField: 'agency_id',
                            as: 'agency'
                        }
                    },
                    { $count: "roles" }, { $unwind: "$roles" }
                ]).exec().then((res) => {
                    if (res.length) {
                        resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].roles });
                    } else {
                        resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
                    }
                }).catch((err) => {
                    reject({ 'status': 101, 'msg': err, 'data': '' });
                });
				
            } else {	
				
				var conditions = {'status':1}
                if (agency_id) {
					conditions = { 'agency': agency_id, 'status':1 }
                }
				Role.countDocuments(conditions).exec().then((roles) => {
					resolve({ 'status': 100, 'msg': 'Success', 'data': roles });
				}).catch((err) => {
					reject({ 'status': 101, 'msg': err, 'data': '' });
				});
            }
        });
        return promise
    },

    // Get roles list 
    getRoles: function(agency_id, start, length, order, dir = 'asc', column_search, search_value, search_regex, fetch_columns) {
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
                Role.aggregate([
//					{
//                        $lookup: {
//                            from: 'agencies',
//                            localField: 'agency_id',
//                            foreignField: 'agency_id',
//                            as: 'agency'
//                        }
//                    },
                    { $match: { $or: column_search , $and:[{'status':1}]} }, { $sort: sort },
                    { $skip: Number(start) }, { $limit: Number(length) },
                    { $project: fetch_columns },
                    //{ $unwind: "$agency" }
                ]).exec().then((roles) => {
					Role.populate(roles, {path: 'agency',select: 'agency_name'}, function(err, populatedresult) {
					 	resolve({ 'status': 100, 'msg': 'Success', 'data': populatedresult });
					});
                    resolve({ 'status': 100, 'msg': 'Success', 'data': populatedresult });
                }).catch((err) => {
                    reject({ 'status': 101, 'msg': err, 'data': '' });
                });
            } else {
				var conditions = {'status':1}
                if (agency_id) {
					conditions = {'status':1, 'agency':agency_id}
                }
				
				Role.find(conditions,{'role_type':1,'role_name':1,'description':1,'agency':1}).populate('agency',{'agency_name':1}).sort(sort).skip(Number(start)).limit(Number(length)).exec().then((roles) => {				
					
					resolve({ 'status': 100, 'msg': 'Success', 'data': roles });
				}).catch((err) => {
					resolve ({ 'status': 101, 'msg': err, 'data': '' });
				});
            }
        });
        return promise
    },

    // Get Roles by the Agency id
    getAgencyRoles: (request, h) => {
        if(request.params.agency_id){
            return Role.find({'agency': request.params.agency_id, 'status':1}, {'role_type':true, 'role_name':true, '_id':true}).exec().then(roles => {
                    if (roles) {
                        return { 'status': 100,  'msg': "Success", 'data': roles }
                    }
                }).catch((err) => {
                    return { 'status': 101,  'msg': err.message }
            });
        }else{
            return { 'status': 101,  'msg': 'Agency ID is missing.' }
        }        
    },
	
	// Get Roles by the Agency id
    getCustomFields: (agency_id, module, form) => {
        if(agency_id){
            return CustomFieldRole.find({'agency_id':agency_id, 'module':module, 'form':form, 'status':1}).exec().then((res) => {
				 if(res){
					 return {
						 'status':100, 'msg':'Success','data':res
					 }
				 }
			 }).catch((err) => {
				return { 'status': 101, 'msg': err, 'data': '' }
			 });
        }else{
            return { 'status': 101,  'msg': 'Agency ID is missing.' }
        }        
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