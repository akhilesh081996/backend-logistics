var LogRole        = require('../../models/log_roles');
var LogOrder       = require('../../models/log_orders');
var LogVehicle     = require('../../models/log_vehicles');
var LogService     = require('../../models/log_services');
var LogUser        = require('../../models/log_users');
var LogCRM         = require('../../models/log_crm');
var LogCustomField = require('../../models/log_custom_fields');
var Module         = require('../../models/module');
var mongoose       = require('mongoose');
var self = module.exports = {    
	
	/* Get logs list */
    getLogs: (request, h) => {     		
		
		if (request.payload) {
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
			// let module  = pdata.module
			let column_search = []
			let columns_valid = []
			let i
			let fetch_columns = {};
			if (columns) {
				for (i = 0; i < columns.length; i++) {
					let key = columns[i].name;
					if (pdata.search.value) {					
						if (key) {
							//if (key != 'agency.agency_name') {
								let c_sr = {
										[key]: { $regex: '.*' + pdata.search.value + '.*', $options: "si" }
									}
									// Don't remove the below comments. it might be useful for later use
									// c_sr.value = pdata.search.value
									// c_sr.name = key
								column_search.push(c_sr)
							//}
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

			let agency_id = pdata.agency_id;

			// Get the module name
            let get_module_name = self.getModuleName( pdata.module );
            
            return get_module_name.then((res) => {
            	
            	if(res.status == 100){
            		
            		if(res.data){
            			let module = res.data;
						let total_records = 0
						let get_total_records = self.logsCount(agency_id, module, order, dir, column_search, search_value, search_regex);

						return get_total_records.then((res) => {
							
							total_records = res.data
							let records = 0
							let dataget_records = 0

							get_records = self.getAllLogs(agency_id, module, start, length, order, dir, column_search, search_value, search_regex);
							return get_records.then((res) => {
								return output = {
									"status":100,
									"recordsTotal": total_records,
									"recordsFiltered": total_records,
									"data": res.data
								}
							}).catch((err) => {
								console.log("Error->>", err);
								return {'status':101, 'msg': err.message}
							})

						}).catch((err) => {
							return {'status':101, 'msg': err.message}
						})
					}else{
						return {'status':101, 'msg':'Module not found.'}
					}
				}else{
					return {'status':101, 'msg':res.msg}
				}
			}).catch((err) => {
				return {'status':101, 'msg': err.message}
			})
		}
    },
	
	/* Get logs total count */
    logsCount: function(agency_id, module, order, dir, column_search, search_value, search_regex) {
        const promise  = new Promise((resolve, reject) => {
           
            if(column_search.length){
            	let conditions = { $or: column_search }
	            if (agency_id) {
	                conditions = {$or: column_search, $and:[{'agency': mongoose.Types.ObjectId(agency_id)}]}
	            }
	           
            	if(module == "role"){
	            	LogRole.aggregate([
						{
	                        $match: conditions
	                    },
	                    { $count: "logs" } 
	                ]).exec().then((res) => {	                	
	                    if (res.length) {
	                        resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].logs });
	                    } else {
	                        resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
	                    }
	                }).catch((err) => {
	                    reject({ 'status': 101, 'msg': err, 'data': '' });
	                });
		        }
		        else if(module == "order"){					
					LogOrder.aggregate([
						{
	                        $match: conditions
	                    },
	                    { $count: "logs" } 
	                ]).exec().then((res) => {;
	                    if (res.length) {
	                        resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].logs });
	                    } else {
	                        resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
	                    }
	                }).catch((err) => {
	                    reject({ 'status': 101, 'msg': err, 'data': '' });
	                });
		        }
		        else if(module == "crm"){	
					LogCRM.aggregate([
						{
	                        $match: conditions
	                    },
	                    { $count: "logs" } 
	                ]).exec().then((res) => {
	                    if (res.length) {
	                        resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].logs });
	                    } else {
	                        resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
	                    }
	                }).catch((err) => {
	                    reject({ 'status': 101, 'msg': err, 'data': '' });
	                });
				} 
				else if(module == "vehicle"){					
					LogVehicle.aggregate([
						{
	                        $match: conditions
	                    },
	                    { $count: "logs" } 
	                ]).exec().then((res) => {
	                    if (res.length) {
	                        resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].logs });
	                    } else {
	                        resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
	                    }
	                }).catch((err) => {
	                    reject({ 'status': 101, 'msg': err, 'data': '' });
	                });
				}
				else if(module == "user"){					
					LogUser.aggregate([
						{
	                        $match: conditions
	                    },
	                    { $count: "logs" } 
	                ]).exec().then((res) => {
	                    if (res.length) {
	                        resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].logs });
	                    } else {
	                        resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
	                    }
	                }).catch((err) => {
	                    reject({ 'status': 101, 'msg': err, 'data': '' });
	                });				
				}
				else if(module == "custom_fields"){					
					LogCustomField.aggregate([
						{
	                        $match: conditions
	                    },
	                    { $count: "logs" } 
	                ]).exec().then((res) => {
	                    if (res.length) {
	                        resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].logs });
	                    } else {
	                        resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
	                    }
	                }).catch((err) => {
	                    reject({ 'status': 101, 'msg': err, 'data': '' });
	                });					
				}
				else if(module == "service"){					
					LogService.aggregate([
						{
	                        $match: conditions
	                    },
	                    { $count: "logs" } 
	                ]).exec().then((res) => {
	                    if (res.length) {
	                        resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].logs });
	                    } else {
	                        resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
	                    }
	                }).catch((err) => {
	                    reject({ 'status': 101, 'msg': err, 'data': '' });
	                });					
				}
            }else{
            	let conditions = {}
	            if (agency_id) {
	                conditions = {'agency': mongoose.Types.ObjectId(agency_id)}
	            }
            	if(module == "role"){				   						
					LogRole.countDocuments(conditions).exec().then((logs) => {						
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});					
				}
				else if(module == "order"){				
					LogOrder.countDocuments(conditions).exec().then((logs) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});					
				}  
				else if(module == "crm"){					
					LogCRM.countDocuments(conditions).exec().then((logs) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});					
				}   
				else if(module == "vehicle"){
					LogVehicle.countDocuments(conditions).exec().then((logs) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});
				}
				else if(module == "user"){				
					LogUser.countDocuments(conditions).exec().then((logs) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});
				}			
				else if(module == "custom_fields"){					
					LogCustomField.countDocuments(conditions).exec().then((logs) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});					
				}
				else if(module == "service"){					
					LogService.countDocuments(conditions).exec().then((logs) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});					
				}
            }
        });
        return promise
    },
	
	/* Get logs list */
    getAllLogs: function(agency_id, module, start, length, order, dir = 'asc', column_search, search_value, search_regex) {
		
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
           
            if(column_search.length){
            	var conditions = { $or: column_search }
	            if(agency_id){
	            	conditions = { $or: column_search, $and:[{'agency': mongoose.Types.ObjectId(agency_id)}] }
	            } 
				if(module == "role"){
					
					LogRole.aggregate([
						{ $match: conditions}, 			
						{
							$lookup: {
								from: 'agencies',
								localField: 'agency',
								foreignField: '_id',
								as: 'agency'
							}
						},	
						{ $unwind: "$agency"},
						{
							$lookup: {
								from: 'users',
								localField: 'created_by',
								foreignField: '_id',
								as: 'user'
							}
						},
						{ $unwind:  {
				            path: "$user",
				            preserveNullAndEmptyArrays: true
				        }},			      	
						{ $sort: sort },
						{ $skip: Number(start) },
						{ $limit: Number(length) }						
					]).exec().then((logs) => {   
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});					
				}
				else if(module == "order"){
					
					LogOrder.aggregate([							
				        { $match: conditions}, 	
						{
							$lookup: {
								from: 'agencies',
								localField: 'agency',
								foreignField: '_id',
								as: 'agency'
							}
						},
						{
							$lookup: {
								from: 'users',
								localField: 'created_by',
								foreignField: '_id',
								as: 'user'
							}
						},
						{ $unwind:  {
				            path: "$user",
				            preserveNullAndEmptyArrays: true
				        }},					
						{ $sort: sort },
						{ $skip: Number(start) },
						{ $limit: Number(length) }						
					]).exec().then((logs) => {   
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});					
				}
				else if(module == "crm"){
					
					LogCRM.aggregate([
						{ $match: conditions}, 	
						{
							$lookup: {
								from: 'agencies',
								localField: 'agency',
								foreignField: '_id',
								as: 'agency'
							}
						},
						{
							$lookup: {
								from: 'users',
								localField: 'created_by',
								foreignField: '_id',
								as: 'user'
							}
						},
						{ $unwind:  {
				            path: "$user",
				            preserveNullAndEmptyArrays: true
				        }},		
						{ $sort: sort },
						{ $skip: Number(start) },
						{ $limit: Number(length) }						
					]).exec().then((logs) => {   
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});					
				}
				else if(module == "vehicle"){					
					LogVehicle.aggregate([
						{ $match: conditions}, 	
						{
							$lookup: {
								from: 'agencies',
								localField: 'agency',
								foreignField: '_id',
								as: 'agency'
							}
						},	
						{
							$lookup: {
								from: 'users',
								localField: 'created_by',
								foreignField: '_id',
								as: 'user'
							}
						},
						{ $unwind:  {
				            path: "$user",
				            preserveNullAndEmptyArrays: true
				        }},			       	
						{ $sort: sort },
						{ $skip: Number(start) },
						{ $limit: Number(length) }
					]).exec().then((logs) => {   
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});					
				}
				else if(module == "user"){
					
					LogUser.aggregate([
						{ $match: conditions}, 	
						{
							$lookup: {
								from: 'agencies',
								localField: 'agency',
								foreignField: '_id',
								as: 'agency'
							}
						},
						{
							$lookup: {
								from: 'users',
								localField: 'created_by',
								foreignField: '_id',
								as: 'user'
							}
						},
						{ $unwind:  {
				            path: "$user",
				            preserveNullAndEmptyArrays: true
				        }},				      
						{ $sort: sort },
						{ $skip: Number(start) },
						{ $limit: Number(length) }
					]).exec().then((logs) => {   
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});					
				}
				else if(module == "custom_fields"){
					
					LogCustomField.aggregate([
						{ $match: conditions}, 	
						{
							$lookup: {
								from: 'agencies',
								localField: 'agency',
								foreignField: '_id',
								as: 'agency'
							}
						},
						{
							$lookup: {
								from: 'users',
								localField: 'created_by',
								foreignField: '_id',
								as: 'user'
							}
						},
						{ $unwind:  {
				            path: "$user",
				            preserveNullAndEmptyArrays: true
				        }},				        
						{ $sort: sort },
						{ $skip: Number(start) },
						{ $limit: Number(length) }
					]).exec().then((logs) => {   
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});					
				}
				else if(module == "service"){
					LogService.aggregate([
						{ $match: conditions}, 	
						{
							$lookup: {
								from: 'agencies',
								localField: 'agency',
								foreignField: '_id',
								as: 'agency'
							}
						},
						{
							$lookup: {
								from: 'users',
								localField: 'created_by',
								foreignField: '_id',
								as: 'user'
							}
						},
						{ $unwind:  {
				            path: "$user",
				            preserveNullAndEmptyArrays: true
				        }},					 	
						{ $sort: sort },
						{ $skip: Number(start) },
						{ $limit: Number(length) }
					]).exec().then((logs) => {   
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});
				}
            }else{
				var conditions = {}
				if(agency_id){
					conditions = {'agency': mongoose.Types.ObjectId(agency_id)}
				}

				if(module == "role"){
					
					LogRole.aggregate([
						{ $match: conditions },
						{
							$lookup: {
								from: 'agencies',
								localField: 'agency',
								foreignField: '_id',
								as: 'agency'
							}
						},
						{ $unwind: "$agency" },
						{
							$lookup: {
								from: 'users',
								localField: 'created_by',
								foreignField: '_id',
								as: 'user'
							}
						},
						{ $unwind:  {
				            path: "$user",
				            preserveNullAndEmptyArrays: true
				        }},
						{ $sort: sort },
						{ $skip: Number(start) },
						{ $limit: Number(length) },						
					]).exec().then((logs) => {
						
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});					
				}
				else if(module == "order"){
					
					LogOrder.aggregate([
						{ $match: conditions },
						{
							$lookup: {
								from: 'agencies',
								localField: 'agency',
								foreignField: '_id',
								as: 'agency'
							}
						},
						{ $unwind: "$agency" },
						{
							$lookup: {
								from: 'users',
								localField: 'created_by',
								foreignField: '_id',
								as: 'user'
							}
						},
						{ $unwind:  {
				            path: "$user",
				            preserveNullAndEmptyArrays: true
				        }},
						{ $sort: sort },
						{ $skip: Number(start) },
						{ $limit: Number(length) }							
					]).exec().then((logs) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});
					
				}
				else if(module == "crm"){
					
					LogCRM.aggregate([
						{ $match: conditions },
						{
							$lookup: {
								from: 'agencies',
								localField: 'agency',
								foreignField: '_id',
								as: 'agency'
							}
						},
						{
							$lookup: {
								from: 'users',
								localField: 'created_by',
								foreignField: '_id',
								as: 'user'
							}
						},
						{ $unwind:  {
				            path: "$user",
				            preserveNullAndEmptyArrays: true
				        }},						
						{ $sort: sort },
						{ $skip: Number(start) },
						{ $limit: Number(length) }						
					]).exec().then((logs) => {   
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});					
				}
				else if(module == "vehicle"){
					if (column_search.length) {
					
					} else{
						LogVehicle.aggregate([
							{ $match: conditions },
							{
								$lookup: {
									from: 'agencies',
									localField: 'agency',
									foreignField: '_id',
									as: 'agency'
								}
							},
							{ $unwind: "$agency" },
							{
								$lookup: {
									from: 'users',
									localField: 'created_by',
									foreignField: '_id',
									as: 'user'
								}
							},
							{ $unwind:  {
					            path: "$user",
					            preserveNullAndEmptyArrays: true
					        }},
							{ $sort: sort },
							{ $skip: Number(start) },
							{ $limit: Number(length) }
						]).exec().then((logs) => {
							
							resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
						}).catch((err) => {
							reject({ 'status': 101, 'msg': err, 'data': '' });
						});
					}
				}
				else if(module == "service"){
					LogService.aggregate([
						{ $match: conditions },
						{
							$lookup: {
								from: 'agencies',
								localField: 'agency',
								foreignField: '_id',
								as: 'agency'
							}
						},
						{ $unwind: "$agency" },
						{
							$lookup: {
								from: 'users',
								localField: 'created_by',
								foreignField: '_id',
								as: 'user'
							}
						},
						{ $unwind:  {
				            path: "$user",
				            preserveNullAndEmptyArrays: true
				        }},
						{ $sort: sort },
						{ $skip: Number(start) },
						{ $limit: Number(length) }
					]).exec().then((logs) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});
					
				}
				else if(module == "user"){
					
					LogUser.aggregate([
						{ $match: conditions },
						{
							$lookup: {
								from: 'agencies',
								localField: 'agency',
								foreignField: '_id',
								as: 'agency'
							}
						},
						{ $unwind: "$agency" },
						{
							$lookup: {
								from: 'users',
								localField: 'created_by',
								foreignField: '_id',
								as: 'user'
							}
						},
						{ $unwind:  {
				            path: "$user",
				            preserveNullAndEmptyArrays: true
				        }},
						{ $sort: sort },
						{ $skip: Number(start) },
						{ $limit: Number(length) }
					]).exec().then((logs) => {
						
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});
					
				}
				else if(module == "custom_fields"){
					
					LogCustomField.aggregate([
						{ $match: conditions },
						{
							$lookup: {
								from: 'agencies',
								localField: 'agency',
								foreignField: '_id',
								as: 'agency'
							}
						},
						{ $unwind: "$agency" },
						{
							$lookup: {
								from: 'users',
								localField: 'created_by',
								foreignField: '_id',
								as: 'user'
							}
						},
						{ $unwind:  {
				            path: "$user",
				            preserveNullAndEmptyArrays: true
				        }},
						{ $sort: sort },
						{ $skip: Number(start) },
						{ $limit: Number(length) }
					]).exec().then((logs) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});
					
				}else if(module == "service"){
					LogService.aggregate([
						{ $match: conditions },
						{
							$lookup: {
								from: 'agencies',
								localField: 'agency',
								foreignField: '_id',
								as: 'agency'
							}
						},
						{ $unwind: "$agency" },
						{
							$lookup: {
								from: 'users',
								localField: 'created_by',
								foreignField: '_id',
								as: 'user'
							}
						},
						{ $unwind:  {
				            path: "$user",
				            preserveNullAndEmptyArrays: true
				        }},
						{ $sort: sort },
						{ $skip: Number(start) },
						{ $limit: Number(length) }
					]).exec().then((logs) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': logs });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});
				}
            }
        });
        return promise;
    },

    // Get the module name from module ID
	getModuleName : function (module) {
		if(module){
		
			return Module.findById(module, {'slug':1, '_id':0}).then((name) => {  
			
				if(name){
					return { 'status': 100, 'msg': "Success", 'data':name.slug};
				}else{
					return { 'status': 101, 'msg': "Module not found", 'data':''};
				}				
			}).catch((err) => {
				return { 'status': 101, 'msg': err.message };
			});
		}
	},
}