const OrderItem   = require('../../models/order_item');
const OrderBlocks = require('../../models/order_blocks');
const Order       = require('../../models/order'); 
const OrderStage  = require('../../models/order_stages'); 
const Log         = require('../../helpers/log.js');
var mongoose       = require('mongoose');

	exports.addOrder = function(req, h) {
		const promise = new Promise((resolve, reject) => {
			if(req.payload){
		
		      	let addorder = new Order({
			       title : req.payload.title,
		           description : req.payload.description,
			       totalprice: req.payload.totalprice,
			       agency : req.payload.agency_id,
			       //agency_name: req.payload.agency_name,
		           status: req.payload.status,
			       created_by: req.payload.created_by,
				   updated_by: req.payload.created_by
				})
			
				//Set the custom fields 
				if("custom_fields" in req.payload){
					let custom_fields = JSON.parse(req.payload.custom_fields)
					if(custom_fields.length > 0){
						for (i = 0; i < custom_fields.length; i++) {
							for(var key in custom_fields[i]){
								addorder.set(key, custom_fields[i][key]);
							}
						}
					}	
				}
				
		   		return Order.create(addorder).then((additem) => {
		     		if (additem) {
		       			let myquery = {"order": null }
		       			let newvalues = {$set: {"order": additem._id} }
				  		OrderItem.updateMany(myquery, newvalues).then((res)=>{
					 		if(res){
								// Make json for log
								var log = {
									'operation':'Added the order - '+additem.title,	'created_by':additem.created_by,		
									'updated_by':additem.updated_by,		
									'agency_id':additem.agency_id,
									'orderitem':'',
									'order':additem._id,
									'old_payload':"",
									'new_payload':additem,
								}										
								Log.addLog(log, 'log_orders').then((addedorderlog) => {
									 resolve({status : 100, msg:"Order Placed Successfully", data:additem}) 
								 }).catch((err2) => { 
									return {
										status: 101,
										msg: "Something went wrong while adding log."
									};
								});
							
						  	}else{
								reject({status : 101, msg:"Order Not Place "})
						  	}
						})
				 	}else{
				  		reject({status : 101, msg:"Order Item Not Found"})
					}                      
				}).catch((err2) => {                       
			      	return {
			         	status: 101,
			         	msg: err2.message
			      	};
			  	});
	 		}
		})
		return promise;	
	}

	exports.saveOrder =  function(req, h){
		if(req.payload){
		
			if(req.params.order_id == 0 || !req.params.order_id){
				let addorder = new Order({	      
		           	description : req.payload.description,
		           	vehicle : req.payload.vehicle,
		           	driver : req.payload.driver,
		           	longitude : req.payload.longitude,
		           	latitude : req.payload.latitude,
			       	totalprice: req.payload.totalprice,
			       	delivery_date: req.payload.date,
			       	paid_amount: req.payload.paid_amount,
			       	agency : req.payload.agency,
		           	address: req.payload.address,
			       	created_by: req.payload.updated_by,
				   	updated_by: req.payload.updated_by
				})

				return Order.create(addorder).then((order) => {
		     		if (order) {
		       			return { 'status': 100, 'msg': 'Success', 'data':order }
				  	}
				}).catch((err) => {
					console.log("Error-->>", err);
					return { 'status': 101, 'msg': err.message, 'data':'' }
				})
			}else{
				/*let updateorder = {	      
		           	description : req.payload.description,
		           	vehicle : req.payload.vehicle,
		           	driver : req.payload.driver,
		           	longitude : req.payload.longitude,
		           	latitude : req.payload.latitude,
			       	totalprice: req.payload.totalprice,
			       	delivery_date: req.payload.date,
			       	paid_amount: req.payload.paid_amount,
			       	agency : req.payload.agency,
				   	updated_by: req.payload.updated_by
				}*/
				
				return Order.findByIdAndUpdate(req.params.order_id, req.payload).then((order) => {
					
		     		if (order) {
		       			return { 'status': 100, 'msg': 'Successfully updated.', 'data':order }
				  	}else{

				  		let addorder = new Order({	      
				           	description : req.payload.description,
				           	vehicle : req.payload.vehicle,
				           	driver : req.payload.driver,
				           	longitude : req.payload.longitude,
				           	latitude : req.payload.latitude,
					       	totalprice: req.payload.totalprice,
					       	delivery_date: req.payload.date,
					       	paid_amount: req.payload.paid_amount,
					       	agency : req.payload.agency,
					       	quantity : req.payload.quantity,
					       	created_by: req.payload.updated_by,
						   	updated_by: req.payload.updated_by
						})

						return Order.create(addorder).then((order) => {
				     		if (order) {
				       			return { 'status': 100, 'msg': 'Success', 'data':order }
						  	}
						}).catch((err) => {
							console.log("Error-->>", err);
							return { 'status': 100, 'msg': err.message, 'data':order }
						})

				  		//return { 'status': 100, 'msg': 'Order not found.', 'data':'' }
				  	}
				}).catch((err) => {
					
					return { 'status': 101, 'msg': err.message, 'data':'' }
				})
			}		

		}else{
			return { 'status': 101, 'msg': 'Please send the request parameters in the api to save order.' }
		}
	}

	exports.addOrderItem = function(req, h) {
		if(req.payload){
			//		 if(req.payload.order_id){
			//			 if(req.payload.order_id == '0'){
			//				 req.payload.order_id = {}
			//			 }
			//		 }
			let rowdata = new OrderItem({
				order : null,
				agency : req.payload.agency_id,
				customer: req.payload.items.customer,
				itemname: req.payload.items.itemname,
				itemprice: req.payload.items.itemprice,
				driver: req.payload.items.driver,
				vehicle: req.payload.items.vehicle,
				address: req.payload.items.address,
				delivery_date: req.payload.items.delivery_date,
			  	status : req.payload.items.status,
			  	stage : req.payload.items.stage,
			  	pendingamt:req.payload.items.pendingamt,
			  	paidamt:req.payload.items.paidamt,
			  	created_by:req.payload.created_by,
			  	updated_by:req.payload.created_by
			 })
			
			 	//Set the custom fields 
				if("custom_fields" in req.payload){
					let custom_fields = JSON.parse(req.payload.custom_fields)
					if(custom_fields.length > 0){
						for (i = 0; i < custom_fields.length; i++) {
							for(var key in custom_fields[i]){
								rowdata.set(key, custom_fields[i][key]);
							}
						}
					}	
				}
	   		return OrderItem.create(rowdata).then((additem) => {
				if (additem) {
					
					// Make json for log
					var log = {
						'operation':'Added the order item - '+additem.itemname,	'created_by':additem.created_by,		
						'updated_by':additem.updated_by,		
						'agency':additem.agency,
						'orderitem':additem._id,
						//'order':'',
						'old_payload': '',
						'new_payload': additem		
					}			
					return Log.addLog(log, 'log_orders').then((addedorderlog) => {
						
						if(addedorderlog){
							  return {
								status: 100,
								msg: 'Order Items Successfully Added.',
								data: additem
							}
						}
					 }).catch((err2) => { 
						return {
							status: 101,
							msg: "Something went wrong while adding log."
						};
					});
					
				} else {
					return {
						status: 101,
						msg: 'Opps! Order Items is not added. Please try again.'
					}
				}
			}).catch((err) => {                       
				return {
					status: 101,
					msg: err.message
				};
			});
	    }
	}

	exports.getOrderItemId = function(req,h) {
		const promise = new Promise((resolve, reject) => {
			OrderItem.find({"order_id":0}).select('_id itemprice ').exec().then((get_order_item)=>{
				if(get_order_item){
					resolve({status: 100,msg:'success',data:get_order_item})
				}
				else{
					reject({status: 101,msg: 'order items not found'})
				}
			}).catch((err)=>{return {status: 101, msg: err.message}})
		})
	   return promise;
	}

	exports.getOrderItemByagency = function(req,h) {
	  const promise = new Promise((resolve, reject) => {
		  OrderItem.find({"agency_id":req.params._id,"order_id":0}).exec().then((get_order_item)=>{
		  if(get_order_item){
			resolve({status: 100,msg:'success',data:get_order_item})
		   }
		  else{
			reject({status: 101,msg: 'order items not found'})
		  }
		}).catch((err)=>{return {status: 101, msg: err.errmsg}})


	  })
	   return promise;
	}

	/* Get order list */
	exports.fetch_ajax = (request, h) => {
		if (request.payload) {
			const promise = new Promise((resolve, reject) => {
				 let pdata = request.payload
				 let orderData = [];
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
						 let key = columns[i].name
						 if (pdata.search.value) {
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
					"description",
					"agency_name",
					"totalprice",
					"created_at",
					"status"
				]

				if (columns_valid[col]) {
					order = columns_valid[col];
				} else {
					order = null;
				}

				agency_id = "";
				// Will use the aganecy id here from session , so don't remove the comments
				/*if( $this->session->userdata('type') == ROLE_EMPLOYEE){     
					$current_employee_id = $current_user_id;        
				}  */

				let total_records = 0
				let get_total_records = OrderCount(agency_id, order, dir, column_search, search_value, search_regex);
				get_total_records.then((res) => { 
					total_records = res.data
					let records = 0
					let dataget_records = 0

					get_records = getOrders(agency_id, start, length, order, dir, column_search, search_value, search_regex, fetch_columns);
					get_records.then((res) => {   

						output = {
							"draw": draw,
							"recordsTotal": total_records,
							"recordsFiltered": total_records,
							"data": res.data,
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

	function OrderCount(agency_id, order, dir, column_search, search_value, search_regex) {

	    const promise = new Promise((resolve, reject) => {
	        if (column_search.length) {
	            Order.aggregate([{
	                $match: { $or: column_search}},
	                { $count: "orders" },
	                { $unwind: "$orders"}
	            ]).exec().then((res) => {
	                if (res.length) {
	                    resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].orders });
	                } else {
	                    resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
	                }
	            }).catch((err) => {
	                reject({ 'status': 101, 'msg': err, 'data': '' });
	            });
	        } else {
	            Order.countDocuments({ status: { $ne: 0 } }).exec().then((orders) => {
	                resolve({ 'status': 100, 'msg': 'Success', 'data': orders });
	            }).catch((err) => {
	                reject({ 'status': 101, 'msg': err, 'data': '' });
	            });
	        }
	    });
	    return promise
	}

	// Get agencies list 
	function getOrders(agency_id, start, length, order, dir = 'asc', column_search, search_value, search_regex, fetch_columns) {
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
	            
	           Order.aggregate([
	                { $match: { $or: column_search } }, { $sort: sort },
	                { $skip: Number(start) }, { $limit: Number(length) },
	                { $project: fetch_columns }
	            ]).exec().then((orders) => {
	              
	                resolve({ 'status': 100, 'msg': 'Success', 'data': orders });
	            }).catch((err) => {
	                reject({ 'status': 101, 'msg': err, 'data': '' });
	            });
	        } else {
	            Order.aggregate([
					{$match:{ 'status': { $ne: '0' } }},
	                { $sort: sort },
	                { $project: fetch_columns },
	                { $skip: Number(start) },
	                { $limit: Number(length) }
	            ]).exec().then((orders) => {
	             
	                resolve({ 'status': 100, 'msg': 'Success', 'data': orders });
	            }).catch((err) => {
	                reject({ 'status': 101, 'msg': err, 'data': '' });
	            });
	        }
	    });
	    return promise
	}

	exports.deleteOrder = function(req, h) {
		const promise = new Promise((resolve, reject) => {
	 	Order.findByIdAndUpdate(req.params._id, {status:0}).exec().then((order) => {
					
			let myquery = {"order": req.params._id };
	       	let newvalues = { "status": 0 };
			OrderItem.updateMany(myquery, newvalues).then((orderitem)=>{
			 	
	         	if(orderitem){
				 	// Make json for log
					var log = {
						'operation':'Deleted the order - '+order.title,	'created_by':order.created_by,		
						'updated_by':order.updated_by,		
						'agency':order.agency,
						'orderitem_id':null,
						'order':order._id,
						'old_payload':orderitem,
						'new_payload':newvalues,
					}										
					Log.addLog(log, 'log_orders').then((orderlog) => {
						 resolve({'status': 100, 'msg': "Order Deleted Successfully"})
					 }).catch((err2) => { 
						reject({
							status: 101,
							msg: "Something went wrong while adding log."
						})
					});            
	         	}else{
	             	reject({'status': 101, 'msg': "Oops! Order is not deleted. Please try again."})
	        	}
	 		}).catch((err) => {
	            resolve({ 'status': 100, 'msg': err.errmsg })
	        });
	 	}).catch((err) => {
	            resolve({ 'status': 100, 'msg': err.message })
	        });
	    })
		return promise;
	};

	exports.deleteOrderItem = function(req, h) {
	    const promise = new Promise((resolve, reject) => {
			 
			 
	        OrderItem.findByIdAndUpdate(req.params._id,{status:0}).exec().then((deleted)=>{
	            if(deleted){
					// Make json for log
					var log = {
						'operation':'Deleted the order item - '+deleted.itemname,	'created_by':deleted.created_by,		
						'updated_by':deleted.updated_by,		
						'agency':deleted.agency,
						'orderitem':deleted._id,
						'order':deleted.order,
						'old_payload':deleted,
						'new_payload':{status:0},
					}										
					Log.addLog(log, 'log_orders').then((addedorderlog) => {
						//					 return { 'status': 100, 'msg': 'Role Deleted Succesfully' }
						resolve({"status":100,"msg":"Item Update Successfully"})
					 }).catch((err2) => { 
						resolve ({
							status: 101,
							msg: "Something went wrong while adding log."
						});
					});
	           		
	               resolve({'status': 100, 'msg': "Item Deleted Successfully"})
	            }else{
	               reject({'status': 101, 'msg': "Oops! Item is not deleted. Please try again."})
	            }
	        }).catch((err) => {
	            reject({ 'status': 100, 'msg': err.message })
	        });
	    })
	     return promise;
	};

	// Get full detail of the order
	exports.getOrderDetail = function(req, h) {
	 	
      	return Order.findById(req.params.id).populate('vehicle',{'registration_no':1, 'makers_name':1}).populate('driver',{'first_name':1, 'last_name':1}).exec().then((order) => {
      		
      		if(order){
      			return OrderBlocks.find({ 'order': mongoose.Types.ObjectId(req.params.id), 'status':{$ne:0} }).populate('customer',{'first_name':1, 'last_name':1}).populate('vehicle',{'registration_no':1, 'makers_name':1}).populate('driver',{'first_name':1, 'last_name':1}).exec().then((orderblocks) => {
					
					if(orderblocks && orderblocks.length > 0){
						order.orderblocks = orderblocks;
						return {'status': 100, 'msg': "Success", order:order , order_blocks:orderblocks }
						
					}else{

						order['orderblocks'] = [];
						return {'status': 100, 'msg': "Success", order:order , order_blocks:[]}
					}
				}).catch((err) => {
					return { 'status': 101,  'msg': err.message }
				});
      		}else{
      			return {'status':101, 'msg':'Order not found.'}
      		}
        }).catch((err) => {
            return { 'status': 101,  'msg': err.message }
        });	   
	}

	//Get order items of the customer block id
	exports.getOrderItemsOfCustomerInOrder =  function(req, h) {

		return OrderItem.find({"order_block": req.params.id, "status":{$ne:0}}).populate('vehicle',{'registration_no':1, 'makers_name':1}).populate('driver',{'first_name':1, 'last_name':1}).exec().then((items)=>{
			
			if(items){
				return {status: 100, msg:'Success', data:items}			}
			else{
				return {status: 101, msg: 'Order items not found'}
			}
		}).catch((err)=>{
			return {status: 101, msg: err.message}
		});			  
	}

	exports.updateOrder = function(req, h) {
	 	const promise = new Promise((resolve, reject) => {
     		if(req.params.id){
	      		let orderData = {
	      	 		title : req.payload.title,
	         		description : req.payload.description,
		       		totalprice: req.payload.totalprice,
		       		status:req.payload.status,
					updated_by:req.payload.created_by
	      		}
			
				//Set the custom fields 
				if("custom_fields" in req.payload){
					let custom_fields = JSON.parse(req.payload.custom_fields)
					if(custom_fields.length > 0){
						for (i = 0; i < custom_fields.length; i++) {
							for(var key in custom_fields[i]){
								orderData.set(key, custom_fields[i][key]);
							}
						}
					}	
				}
				delete orderData.custom_fields;
			  	Order.findByIdAndUpdate(req.params.id,orderData).exec().then((res) =>{
					if(res){
					
					// Make json for log
					var log = {
						'operation':'Updated the order - '+res.title,	
						'created_by':res.created_by,		
						'updated_by':res.updated_by,		
						'agency':res.agency,
						'order':res._id,
						'orderitem':null,
						'old_payload':res,
						'new_payload':orderData,
					}										
					Log.addLog(log, 'log_orders').then((addedorderlog) => {
						resolve({"status":100,"msg":"Order Update Successfully"})
					 }).catch((err2) => { 
						resolve ({
							status: 101,
							msg: "Something went wrong while adding log."
						});
					});
				   }else{
						resolve({"status":101,"msg":"Order Not Update"})
				   }  
				}).catch((err) => {
				  	return { 'status': 101,  'msg': "Oops! Order Not Found. Please try again." }
			  	});
	      	}else{
				resolve ({'status':101, 'msg':'Please send the id of the order to update order.'});
	      	}
	    })
    	return promise;  
    }

    // Save row means order items and order blocks
 	exports.updateRow = function(req, h) {
    	//const promise = new Promise((resolve, reject) => {
    
		if(req.payload.customer == '0' || !req.payload.customer){
			return { status: 101, msg: 'Please add the customer for the order item.'	};
		}else{
			if(req.params.id == 0 || req.params.id == 'null'){

				let order_blocks = new OrderBlocks({
					order: req.payload.order,
					driver: req.payload.driver,
					vehicle: req.payload.vehicle,
					customer: req.payload.customer,
					totalprice: req.payload.totalprice,
					agency: req.payload.agency, 
					paid_amount: req.payload.paid_amount,
					longitude: req.payload.longitude,
					latitude: req.payload.latitude,
					delivery_date: req.payload.delivery_date,
					address: req.payload.address,
					created_by: req.payload.updated_by,
					updated_by: req.payload.updated_by
				});
			
				return OrderBlocks.create(order_blocks).then((res) =>{
				
			        if(res){
					  	
			        	// Add the data in order item table
			        	let rowdata = new OrderItem({
							order : res.order,
							agency : res.agency,
							customer: res.customer,
							order_block: res._id,
							itemname: req.payload.items.itemname,
							itemprice: req.payload.items.itemprice,
							driver: req.payload.items.driver,
							vehicle: req.payload.items.vehicle,
							address: req.payload.items.address,
							delivery_date: req.payload.items.delivery_date,
							quantity: req.payload.items.quantity,
						  	status : req.payload.items.status,
						  	stage : req.payload.items.stage,
						  	paid_amount:req.payload.items.paid_amount,
						  	created_by:req.payload.updated_by,
						  	updated_by:req.payload.updated_by
						})
						
				   		return OrderItem.create(rowdata).then((additem) => {
							if (additem) {
								
								// Make json for log
								var log = {
									'operation':'Added the order item - '+additem.itemname,	'created_by':additem.created_by,		
									'updated_by':additem.updated_by,		
									'agency':additem.agency,
									'orderitem':additem._id,
									'old_payload': '',
									'new_payload': additem		
								}			
								return Log.addLog(log, 'log_orders').then((addedorderlog) => {
									
									if(addedorderlog){
										  return {
											status: 100,
											msg: 'Order item successfully saved.',
											data: additem
										}
									}
								 }).catch((err2) => { 
									return {
										status: 101,
										msg: err2.message
									};
								});
								
							} else {
								return {
									status: 101,
									msg: 'Opps! Order Items is not added. Please try again.'
								}
							}
						}).catch((err) => {                       
							return {
								status: 101,
								msg: err.message
							};
						});
	
			        }else{
			        	return {"status":101,"msg":"Item is not updated. Please try again"}
			        }
			    }).catch((err) => {
			    	console.log("Error->>", err);
			        return { 'status': 101,  'msg': err.message}
			    });
			}else{
				let order_blocks = {
					order: req.payload.order,
					driver: req.payload.driver,
					vehicle: req.payload.vehicle,
					customer: req.payload.customer,
					totalprice: 0,
					agency: req.payload.agency, 
					paid_amount: req.payload.paid_amount,
					longitude: '',
					latitude: '',
					delivery_date: req.payload.delivery_date,
					address: req.payload.address,
					updated_by: req.payload.updated_by
				}
			
				return OrderBlocks.findByIdAndUpdate(req.params.id, order_blocks).exec().then((res) =>{
			        if(res){
					 
					    if(!req.payload.items.item_id){

					    	// Add the data in order item table
				        	let rowdata = new OrderItem({
								order : res.order,
								agency : res.agency,
								customer: req.payload.customer,
								order_block: res._id,
								itemname: req.payload.items.itemname,
								itemprice: req.payload.items.itemprice,
								driver: req.payload.items.driver,
								vehicle: req.payload.items.vehicle,
								address: req.payload.items.address,
								delivery_date: req.payload.items.delivery_date,
								quantity: req.payload.items.quantity,
							  	status : req.payload.items.status,
							  	stage : req.payload.items.stage,
							  	paid_amount:req.payload.items.paid_amount,
							  	created_by:req.payload.updated_by,
							  	updated_by:req.payload.updated_by
							})
							
					   		return OrderItem.create(rowdata).then((additem) => {
								if (additem) {
									
									// Make json for log
									var log = {
										'operation':'Added the order item - '+additem.itemname,	'created_by':additem.created_by,		
										'updated_by':additem.updated_by,		
										'agency':additem.agency,
										'orderitem':additem._id,
										'old_payload': '',
										'new_payload': additem		
									}			
									return Log.addLog(log, 'log_orders').then((addedorderlog) => {
										
										if(addedorderlog){
											  return {
												status: 100,
												msg: 'Order item successfully saved.',
												data: additem
											}
										}
									 }).catch((err2) => { 
										return {
											status: 101,
											msg: err2.message
										};
									});
									
								} else {
									return {
										status: 101,
										msg: 'Opps! Order Items is not added. Please try again.'
									}
								}
							}).catch((err) => {                       
								return {
									status: 101,
									msg: err.message
								};
							});
					    }else{

					    	// Update the data in order item table
				        	let rowdata = {
								order : res.order,
								agency : res.agency,
								customer: res.customer,
								order_block: res._id,
								itemname: req.payload.items.itemname,
								itemprice: req.payload.items.itemprice,
								driver: req.payload.items.driver,
								vehicle: req.payload.items.vehicle,
								address: req.payload.items.address,
								delivery_date: req.payload.items.delivery_date,
								quantity: req.payload.items.quantity,
							  	status : req.payload.items.status,
							  	stage : req.payload.items.stage,
							  	paid_amount:req.payload.items.paid_amount,
							  	//created_by:req.payload.updated_by,
							  	updated_by:req.payload.updated_by
							}
						
					   		return OrderItem.findByIdAndUpdate(req.payload.items.item_id, rowdata).exec().then((updateitem) => {
								if (updateitem) {
									
									// Make json for log
									var log = {
										'operation': 'Added the order item - '+updateitem.itemname,	'created_by':updateitem.created_by,		
										'updated_by': updateitem.updated_by,		
										'agency': updateitem.agency,
										'orderitem': updateitem._id,
										'old_payload': updateitem,
										'new_payload': rowdata		
									}			
									return Log.addLog(log, 'log_orders').then((addedorderlog) => {
										
										if(addedorderlog){
											  return {
												status: 100,
												msg: 'Order item successfully saved.',
												data: updateitem
											}
										}
									 }).catch((err2) => { 
										return { status: 101, msg: err2.message	}
									});
									
								} else {
									return { status: 101, msg: 'Opps! Order Items is not added. Please try again.' }
								}
							}).catch((err) => {  
								console.log("Error->>", err);                     
								return { status: 101, msg: err.message }
							});
					    }					  
			        }else{
			        	return {"status":101,"msg":"Item is not updated. Please try again"}
			        }
			    }).catch((err) => {
			        return { 'status': 101,  'msg': "Oops! Item is not updated. Please try again." }
			    });
			}
		}
	}

 	exports.deleteItemsByAgency = function(req, h) {
        const promise = new Promise((resolve, reject) => {
            OrderItem.find(req.payload).remove().exec().then(res =>{
               if(res){
               resolve({"status":100,"msg":"Successfully"})
               }else{
                reject({"status":101,"msg":"Please try again"})
               }
            }).catch((err) => {
                return { 'status': 101,  'msg': "Oops! Item is not geeting deleted. Please try again." }
            })
        })
        return promise;        
    }

 	exports.getTotalOrders = function(req, h) {
        const promise = new Promise((resolve, reject) => {
            if(req.agency_id && req.agency_id !=0){
                Order.find({'agency':req.agency_id}).count().exec().then(res =>{
					var data = {};
                    if(res){
                      
                        data.total_orders = res;
                        resolve({"status":100,"msg":"Successfully", "data":data})
                    }else{
                        resolve ({ 'status': 101, 'msg': "No orders", "data":data })
                        //reject({"status":101,"msg":"Please try again"})
                    }
                }).catch((err) => {
                    console.log(err)
                    return { 'status': 101,  'msg': "Oops! There is some error to fetch the order details. Please try again." }
                })
            }else{
                Order.estimatedDocumentCount().exec().then(res =>{
					var data = {};
                    if(res){
                        data.total_orders = res;
                        resolve({"status":100,"msg":"Successfully", "data":data})
                    }else{                        
                        resolve ({ 'status': 101, 'msg': "No orders", "data":data  })
                        //reject({"status":101,"msg":"Please try again"})
                    }
                }).catch((err) => {
                    console.log(err)
                    return { 'status': 101,  'msg': "Oops! There is some error to fetch the order details. Please try again." }
                })
            }
           
        })
        return promise; 
    }

	/* Add Order Stages */
 	exports.addOrderStage = function(req, h) {
		if(req.payload){
			if(!('agency_id' in req.payload)){
				return {status: 101, msg: "Please select agency in which you added order stage."}
			}else{
				if(!req.payload.agency_id || req.payload.agency_id == null){
				   return {status: 101, msg: "Please select agency in which you added order stage."}
				}			
			}
			return checkOrderStageExists(req.payload.stage_name, req.payload.agency_id).then((res)=>{
				if(res.status == 100){
					return checkOrderStageOrder(req.payload.agency_id).then((res)=>{
						if(res.status == 100){
							let addorderstage = new OrderStage({
							   stage_name : req.payload.stage_name,
							   description : req.payload.description,
							   sort_order: res.order,
							   agency : req.payload.agency_id,
							   status: 1,
							   created_by: req.payload.created_by,
							   updated_by: req.payload.created_by
							})

							return OrderStage.create(addorderstage).then((addedstage) => {
								if (addedstage) {

									// Make json for log
									var log = {
										'operation':'Added the order stage - '+addedstage.stage_name,	'created_by':addedstage.created_by,		
										'updated_by':addedstage.updated_by,		
										'agency':addedstage.agency,
										'order_stage':addedstage._id,
										'new_payload': addedstage,
										'old_payload': addedstage
									}										
									return Log.addLog(log, 'log_order_stages').then((orderstagelog) => {
										 return {status : 100, msg:"Order stage is successfully added"} 
									 }).catch((err2) => { 
										return {
											status: 101,
											msg: "Something went wrong while adding log."
										};
									})
								}
							})
						}else{
							return res;
						}
					}).catch((err) => {
						return { 'status': 101,  'msg': "Oops! Please try again." }
					})
			    }else{
					return res;
				}
			}).catch((err) => {
				return { 'status': 101,  'msg': "Oops! Please try again." }
			})		
	 	}else{
			return {status : 101, msg:"Please add the request parameters in the api"};
	 	}                      	
	}
 
	/* Edit Order Stages */
 	exports.editOrderStage = function(req, h) {
		if(req.payload){
			return checkOrderStageExists(req.payload.name, req.payload.agency_id).then((res)=>{	
				if(res.status == 100){
					return OrderStage.findByIdAndUpdate(req.params._id,req.payload).exec().then((res) =>{
						if(res){
							// Make json for log
							var log = {
								'operation': 'Updated the order stage - '+req.payload.stage_name,	
								'created_by': res.created_by,		
								'updated_by': res.updated_by,		
								'agency': res.agency,
								'order_stage': res._id,
								'old_payload': res,
								'new_payload': req.payload
							}										
							return Log.addLog(log, 'log_order_stages').then((orderstagelog) => {
								 return {status : 100, msg:"Order stage is successfully updated"} 
							 }).catch((err2) => { 
								return {
									status: 101,
									msg: "Something went wrong while adding log."
								};
							});
						}
					})
			    }else{
					return res;
				}
			}).catch((err) => {
				return { 'status': 101,  'msg': "Oops! Please try again." }
			})
	 	}else{
			return {status : 101, msg:"Please add the request parameters in the api"};
	 	}                      	
	}
 
	/* Delete Order Stages */
	exports.deleteOrderStage = function(req, h) {	
		return checkOrderStageAlreadyDeleted(req.params._id).then((res)=>{
			if(res.status == 100){
				let update = {'status':0}
				return OrderStage.findByIdAndUpdate(req.params._id,update).exec().then((orderstage) =>{
					if(orderstage){

						// Make json for log
						var log = {
							'operation':'Deleted the order stage - '+orderstage.stage_name,	
							'created_by':orderstage.created_by,		
							'updated_by':orderstage.updated_by,		
							'agency':orderstage.agency,
							'order_stage':orderstage._id,
							'new_payload': update,
							'old_payload': orderstage
						}										
						return Log.addLog(log, 'log_order_stages').then((orderstagelog) => {
							 return {status : 100, msg:"Order stage is successfully deleted"} 
						 }).catch((err) => { 
							return {
								status: 101,
								msg: "Something went wrong while adding log."
							};
						});
					}
				})
		    }else{
				return res;
			}
		}).catch((err) => {
			return { 'status': 101,  'msg': "Oops! Please try again." }
		})		                 	
	}
 
	/* Get the order stage detils by ID*/
	exports.getOrderStageDetailByID = function(req, h) {
	      return OrderStage.findOne({ _id: req.params.id }).exec().then((orderstage) => {    
			  return {'status': 100, 'msg': "Success", data:orderstage};
	       }).catch((err) => {
	            return { 'status': 101,  'msg': err.message }
	       });
	}
	 
	/* Get agency order list */
	exports.agencyOrderStages = function(req, h){
		 if(req.payload.agency_id){
			 return OrderStage.find({ agency: req.payload.agency_id, status:{$gt:0} }).sort({'sort_order':1}).exec().then((orderstages) => {    
				  return {'status': 100, 'msg': "Success", data:orderstages};
			 }).catch((err) => {
					return { 'status': 101,  'msg': err.message }
			 });
		 }else{
			 return { 'status': 101,  'msg': "Please select agency to get the order stages." }
		 }	 
	}

	/* Get order stages list */
	exports.fetch_stages_ajax = (request, h) => {
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
				 let i
				 let fetch_columns = {};
				 let columns_valid = [];
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
				let agency_id = "";
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
				
				if("agency_id" in pdata){
					
					if(pdata.agency_id){
						agency_id = pdata.agency_id
					}   
				}
				
				let total_records = 0
				let get_total_records = OrderStagesCount(agency_id, order, dir, column_search, search_value, search_regex);
				get_total_records.then((res) => { 
					total_records = res.data
					let records = 0
					let dataget_records = 0

					get_records = getOrderStages(agency_id, start, length, order, dir, column_search, search_value, search_regex, fetch_columns);
					get_records.then((res) => {   

						output = {
							"status": 100,
							"msg": "Success",
							"draw": draw,
							"recordsTotal": total_records,
							"recordsFiltered": total_records,
							"data": res.data,
						}
						resolve(output)
					}).catch((err) => {
						
						reject({'status':101, 'msg':err.message})
					})
				}).catch((err) => {
					
					reject({'status':101, 'msg':err.message})
				})
			});
			return promise;
		}
	}

	// Get order stages total count
	function OrderStagesCount(agency_id, order, dir, column_search, search_value, search_regex) {

	    const promise = new Promise((resolve, reject) => {
	        if (column_search.length) {
	            OrderStage.aggregate([{
	                $match: { $or: column_search}},
	                { $count: "orders" },
	                { $unwind: "$orders"}
	            ]).exec().then((res) => {
	                if (res.length) {
	                    resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].orders });
	                } else {
	                    resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
	                }
	            }).catch((err) => {
	                reject({ 'status': 101, 'msg': err, 'data': '' });
	            });
	        } else {
				var conditions = { 'status': { $ne: 0 } }
				if(agency_id){
					conditions = { 'status': { $ne: 0 }, 'agency': agency_id }
				}
	            OrderStage.countDocuments(conditions).exec().then((orderstages) => {
	                resolve({ 'status': 100, 'msg': 'Success', 'data': orderstages });
	            }).catch((err) => {
	                reject({ 'status': 101, 'msg': err, 'data': '' });
	            });
	        }
	    });
	    return promise
	}

	 // Get order stages list 
	function getOrderStages(agency_id, start, length, order, dir = 'asc', column_search, search_value, search_regex, fetch_columns) {
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
	            //sort = { '_id': -1 }
	            sort = { 'sort_order': 1 }
	        }
	        if (column_search.length) {            
	           OrderStage.aggregate([
	                { $match: { $or: column_search } }, { $sort: sort },
	                { $skip: Number(start) }, { $limit: Number(length) },
	                { $project: fetch_columns }
	            ]).exec().then((orders) => {
	                resolve({ 'status': 100, 'msg': 'Success', 'data': orders });
	            }).catch((err) => {
	                reject({ 'status': 101, 'msg': err.message, 'data': '' });
	            });
	        } else {
				var conditions = { 'status': { $ne: 0 } }
				if(agency_id){
					conditions = { 'status': { $ne: 0 }, 'agency': agency_id }
				}
				
				OrderStage.find(conditions,fetch_columns).populate('agency',{'agency_name':1}).sort(sort).skip(Number(start)).limit( Number(length))
	            .exec().then((orders) => {           
					
	                resolve({ 'status': 100, 'msg': 'Success', 'data': orders });
	            }).catch((err) => {
	                reject({ 'status': 101, 'msg': err.message, 'data': '' });
	            });
	        }
	    });
	    return promise
	}

	function checkOrderStageExists(name, agency_id){
		 return OrderStage.findOne({'stage_name':name,'agency':agency_id, 'status': { $ne: 0 } }).exec().then(stage =>{ 
			 if(stage){
				return {'status':101, msg:"Already existing order stage"};
			 }else{
				return {'status':100, msg:"Not found"}
			 }
		 }).catch((err) => {
				return { 'status': 101,  'msg': "Oops! Please try again." }
		})                                     
	}
			
	function checkOrderStageOrder(agency_id){
		 return OrderStage.findOne({ agency: agency_id }).sort({_id: -1 }).exec().then((find) => {
	         if (find) {
				return {'status':100, msg:"Success", 'order':find.sort_order+1};
			 }else{
				return {'status':100, msg:"Not found", 'order':1}
			 }
		 }).catch((err) => {
				return { 'status': 101,  'msg': "Oops! Please try again." }
		 })                                     
	}

	function checkOrderStageAlreadyDeleted(_id){
		 return OrderStage.findOne({ '_id':_id, status: { $eq: 0 } }).exec().then(stage =>{ 
			 if(stage){
				return {'status':101, msg:"Already deleted order stage"};
			 }else{
				return {'status':100, msg:"Not found"}
			 }
		 }).catch((err) => {
				return { 'status': 101,  'msg': "Oops! Please try again." }
	    })
	}