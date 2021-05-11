var Module        = require('../../models/module');
var AgencyModule  = require('../../models/agency_module');
const Log         = require('../../helpers/log.js');
const global      = require('../../config/constant.js');

let self = module.exports = {
	
	add: (req, h) => {
		if(req.payload){
			return Module.findOne({'module_name':req.payload.module_name}).exec().then((exists) => {
				if(exists){
				   return {
						status: 101,
						msg: req.payload.module_name + " module already exists in database"
					};
				}else{

					// Create slug
					var slug = req.payload.module_name.trim().toLowerCase().split(' ').join('_');
				
				    var module = new Module({
						module_name: req.payload.module_name,
						slug: slug,
						description: req.payload.description,
						created_by: req.payload.created_by,
						updated_by: req.payload.created_by
					});

					return Module.create(module).then((addedmodule) => {               
						if (addedmodule) {
							
							// Make json for log
							var log = {
								'operation':'Added new module - '+addedmodule.module_name,	'created_by':addedmodule.created_by,		
								'updated_by':addedmodule.created_by,	
								'module_id':addedmodule._id
							}							
							return Log.addLog(log, 'log_modules').then((addedmodulelog) => { 		
								return {
									status: 100,
									msg: 'Module is successfully added.'
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
								msg: 'Opps! Module is not added. Please try again.'
							}
						}
					}).catch((err2) => {   
						return {
							status: 101,
							msg: "There is an error. Please try again."
						};
					});
				}				
			})
			
		}else{
			return {'status':101, 'msg': "Please try again."}
		}
	},
	
	list: (req, h) => {
		
		return AgencyModule.find({'status':1,'agency':req.params.agency_id},{'_id':0,'module':1}).populate('module',{'module_name':1}).then((modules) => {  
			if (modules.length > 0) {
				let options = global.OPTIONS
				let data = {modules:modules, options:options}
				return {status:100, msg:"Success", data: data}

			} else {
				return {
					status: 101,
					msg: "Module is not found."
				}
			}
		}).catch((err) => {   
			return {
				status: 101,
				msg: "There is an error. Please try again."
			};
		});
	},
	
	// Api to assign the module to agency
	assignModule: (req, h) => {
		if(req.payload){		 
			return AgencyModule.findOne({'module':req.payload.module_id, 'agency':req.payload.agency_id}).exec().then((exists) => {
				if(exists){
					//				   return {					   
					//						status: 101,
					//						msg: "This module already assigned to the agency"
					//					}
					var agency_module = {
						updated_by: req.payload.current_user,
						status:req.payload.status
					};
					return AgencyModule.findOneAndUpdate({'module':req.payload.module_id,'agency':req.payload.agency_id},agency_module).then((agencymodule) => {   
						
						if (agencymodule) {
							let log_msg = "Assigned a module - ";
							let msg = "Module is successfully assigned.";
							if(agency_module.status == 0){
								log_msg = "Unassigned a module - ";
								msg = "Module is successfully unassigned.";
							}
							// Make json for log
							var log = {
								'operation':log_msg+req.payload.module_name,	'created_by':agencymodule.created_by,		
								'updated_by':agency_module.updated_by,	
								'agency_module_id':agencymodule._id,
								'old_payload':agencymodule,
								'new_payload':agency_module,
							}							
							return Log.addLog(log, 'log_agency_modules').then((agencymodulelog) => { 		
								return {
									status: 100,
									msg: msg
								}   
							 }).catch((err2) => { 
								console.log("Error---", err2)
								return {
									status: 101,
									msg: "Something went wrong while saving log."
								};
							});
						}
					}).catch((err)=>{
						console.log("Error---", err)
						return {
							status: 101,
							msg: "Something went wrong while updating."
						};
					})
				}else{
					var agency_module = new AgencyModule({
						module: req.payload.module_id,
						agency: req.payload.agency_id,
						created_by: req.payload.current_user,
						updated_by: req.payload.current_user,
						status:req.payload.status
					});
					return AgencyModule.create(agency_module).then((agencymodule) => {               
						if (agencymodule) {
							
							// Make json for log
							var log = {
								'operation':'Assigned a module - '+req.payload.module_name,	'created_by':agencymodule.created_by,		
								'updated_by':agencymodule.created_by,	
								'agency_module_id':agencymodule._id,
								'old_payload':null,
								'new_payload':agency_module,
							}							
							return Log.addLog(log, 'log_agency_modules').then((agencymodulelog) => { 		
								return {
									status: 100,
									msg: 'Module is successfully assigned.'
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
								msg: 'Opps! Module is not assigned. Please try again.'
							}
						}
					}).catch((err2) => {  
						
						return {
							status: 101,
							msg: "There is an error. Please try again."
						};
					});
				}				
			})
			
		}else{
			return {'status':101, 'msg': "Please try again."}
		}
	},
	
	// Api to fetch the modules assigned to agency
	getAgencyModules: (req, h) =>{
		if(req.params.agency_id && req.params.agency_id !=0 ){
		  	var conditions = {"status":{"$gt":0}, "agency":req.params.agency_id}
			return AgencyModule.find(conditions,{'agency':1, 'module':1, 'status':1}).populate('module', {'module_name':1, 'slug':1}).exec().then((assigned_modules) => {				
				return {
					status: 100,
					msg: "Successfully listed",
					data: assigned_modules                         
				}
			}).catch((err) => {
				return {
					status: 101,
					msg: err.message                             
				}
			});
		}else{
			return {
				status: 101,
				msg: "Please choose agency for which modules are requesting."                             
			}
		}		
	},
	
	getAllModules: (req, h) =>{
		return Module.find({"status":{"$gt":0}},req.payload).exec().then((modules) => {
			return {
				status: 100,
				msg: "Successfully listed",
				data: modules                         
			}
		}).catch((err) => {
			return {
				status: 101,
				msg: err.message                             
			}
		});
	},
		
	allModules: (req, h) => {
		if (req.payload) {
            const promise = new Promise((resolve, reject) => {
                let pdata = req.payload
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
									//columns_valid.push(key)
                                }
                            }
                        }
                        fetch_columns[key] = true;
                    }
                }
           
                let col = 0;
                let dir = "";
                if (dir != "asc" && dir != "desc") {
                    dir = "asc";
                }

                let columns_valid = [
                    "module_name",
                    "_id",
                    "description",
					"created_at"
                ]

                if (columns_valid[col]) {
                    order = columns_valid[col];
                } else {
                    order = null;
                }
              
                let total_records = 0
                let get_total_records = self.modulesCount(order, dir, column_search, search_value, search_regex);
                get_total_records.then((res) => {					
                    total_records = res.data
                    get_records = self.getModules( start, length, order, dir, column_search, search_value, search_regex, fetch_columns);
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
						
                        resolve({"status":101, "msg":"There is some error. Please try again."})
                    })
                }).catch((err) => {
                  	resolve({"status":101, "msg":"There is some error. Please try again."})
                })
            });
            return promise;
        }
		//		return Module.find({'status':1},{'_id':1,'module_name':1}).then((modules) => {  
		//			if (modules.length > 0) {
		//				let options = global.OPTIONS
		//				let data = {modules:modules, options:options}
		//				return {status:100, msg:"Success", data: data}
		//
		//			} else {
		//				return {
		//					status: 101,
		//					msg: "Module is not found."
		//				}
		//			}
		//		}).catch((err) => {   
		//			return {
		//				status: 101,
		//				msg: "There is an error. Please try again."
		//			};
		//		});
	},
	
	// Get Modules total count
    modulesCount: function (order, dir, column_search, search_value, search_regex) {
        const promise = new Promise((resolve, reject) => {
            if (column_search.length) {
               
            } else {
                Module.countDocuments().exec().then((modules) => {					
                    resolve({ 'status': 100, 'msg': 'Success', 'data': modules });
                }).catch((err) => {
                    reject({ 'status': 101, 'msg': err, 'data': '' });
                });
            }
        });
        return promise
    },
	
	// Get Modules list
    getModules: function (start, length, order, dir, column_search, search_value, search_regex,fetch_columns) {
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
				
			} else{
				
				var conditions = {status:{$gt:0}};
				Module.find(conditions,fetch_columns).populate('agency',{'agency_name':1}).sort(sort).skip(Number(start)).limit(Number(length)).exec().then((modules) => {
					
					resolve({ 'status': 100, 'msg': 'Success', 'data': modules });
				}).catch((err) => {
					reject({ 'status': 101, 'msg': err, 'data': '' });
				});
			}
            
        });
        return promise;
    },
	
	update: (request, h) => {
		
		if(!request.payload){
		   return { 'status':101, 'msg': 'Please send the parameters in the api'}; 
		}else{
			if(!request.payload.updated_by){
			   return { 'status':101, 'msg': 'Please add the user who modifies this module.'}; 				
		    }else{		

				// Check whether there is any other module which having same name.				
			    return Module.findOne({ '_id': { $ne: request.params._id}, 'module_name':request.payload.module_name }).exec().then((result) => {
				   
					if(result){                         	                      
					   return { 'status':100, 'msg': 'Module name already exists', 'data':result }
					}else{

						// Create slug
						var slug = request.payload.module_name.trim().toLowerCase().split(' ').join('_');
						request.payload['slug'] = slug;
						
						// Update Query
						return Module.findOneAndUpdate({_id:request.params._id },{ $set: request.payload },{ returnOriginal: false }).exec().then((result) => {
							if(result){
								
								// Make json for log
								var log = {
									'operation':'Updated new module - '+result.module_name,	'created_by':result.created_by,		
									'updated_by':result.updated_by,	
									'module_id':result._id
								}							
								return Log.addLog(log, 'log_modules').then((modulelog) => { 		
									return { 'status':100, 'msg': 'Successfully updated module.', 'data':result };    
								 }).catch((err2) => { 
									return {
										status: 101,
										msg: "Something went wrong while saving log."
									};
								}); 
							  
							}else{
								return { 'status':101, 'msg': 'Cannot find the module.', 'data':'' }; 
							}                          
						}).catch((err) => {
							console.log(err);
							return {'status':101, 'msg':err.message}
						});
					}			   
				}).catch((err) => {
					return {'status':101, 'msg':err.message}
				});
			}		  
		}        
    },
	
	delete: (request, h) => {
		
		return Module.findOne({'_id':request.params._id, 'status':0}).exec().then((exists) =>{
			
			if(exists){
				return {
					status: 101,
					msg: "Module is already deleted."
				}
			}else{
				return Module.findByIdAndUpdate(request.params._id, {status:0}).exec().then((module) => {	
				
					if (module) {

						// Make json for log
						var log = {
							'operation':'Deleted the module - '+module.module_name,	
							'created_by':module.created_by,		
							'updated_by':module.updated_by,
							'module_id':module._id
						}										
						return Log.addLog(log, 'log_modules').then((addedmodulelog) => {
							 return { 'status': 100, 'msg': 'Module deleted succesfully' }
						 }).catch((err) => { 
							return {
								status: 101,
								msg: "Something went wrong while adding log."
							};
						}); 

					}else{
						return { 'status': 101, 'msg': "Oops! Module is not deleted. Please try again." }
					}
				}).catch((err) => {
					return { 'status': 101, 'msg': err }
				})
			}											   
		}).catch((err) => {			
			return { 'status': 101, 'msg': err }
		})
	},
	
	// Get customer by id
    getModuleDetail: (request, h) => {
        if (!request.params._id) {
            return { status:101, msg: 'Module id is required' };
        }else{
            return Module.findById(request.params._id).exec().then((result) => {
                if(result){                   
                    return { status:100, msg: 'Success', data:result }
                }else{                   
                    return { status:101, msg: 'Module does not found' }
                }   
            }).catch((err) => {
                return { 'status': 101, 'msg': err.errmsg }
            });  
        }
    },
	
}


