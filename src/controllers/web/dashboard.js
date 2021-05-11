var Agency    = require('../../models/agency');
var Driver    = require('../../models/driver');
var Role      = require('../../models/role');
var Order     = require('../../models/order');
var OrderItem = require('../../models/order_item');

const bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

const url = require('url');

var self = module.exports = {
	
	/* Get the total orders and their total earnings */
    getTotalOrdersAndTotalEarning: (res, h) => {
        const promise = new Promise((resolve, reject) => {
			var match = {}
			if(res.payload){
				if(res.payload.agency_id){
				   match = {agency_id:res.payload.agency_id}
				}
			}
			 
			
			Order.aggregate([
				{ $match: match }, 
				{
					
					$group:
  					{ 
						_id : null, 
					 totalAmount : { $sum: "$totalprice" } 
					 , totalOrders: { $sum: 1 }
					}
			 	},
				 { $project: { _id: 0 } }
			 ]).exec().then(res =>{
//				console.log("Result --->>",res);
				return resolve({status:100, data:res, msg:"Success"});
			}).catch((err2) => {
				console.log(err2)
				return resolve({
					status: 101,
					code: "Please try again."
				});
			});
			
		});
		return promise;
    },
	
	/* Get the top 5 customers and their total payouts */
	getTopCustomersAndTheirPayouts: (res, h) => {
        const promise = new Promise((resolve, reject) => {
			var match = {}
			if(res.payload){
				if(res.payload.agency_id){
				   match = {agency_id:res.payload.agency_id}
				}
			}
			
			OrderItem.aggregate([					
				{ $group:
				  { 
					  _id : '$customer', 
					  total_amount : { $sum: "$itemprice" }
				  }				  
				},
				{$sort:{total_amount:-1}},
				{ $limit : 5 }
			]).exec().then(res =>{
				return resolve({status:100, data:res, msg:"Success"});
			}).catch((err2) => {
				//console.log(err2)
				return resolve({
					status: 101,
					code: "Please try again."
				});
			});
			
		});
		return promise;
		//return h.view('attendance');
    },
	
	/* Get the top customer who has paid the most */
	getTopCustomer: (req, h) => {
        const promise = new Promise((resolve, reject) => {
			var match = {}
			if(req.payload){
				if(req.payload.agency_id){
				   match = {agency_id:req.payload.agency_id}
				}
			}
			 			
			OrderItem.aggregate([	
				{$match:match},
				{
					 $lookup: {
						from: "crm",
						localField: "_id",
						foreignField: "customer",
						as: "customers"
					}
				},
//				{ $unwind:
//				 	{ path: "$customers",
//					  preserveNullAndEmptyArrays: true
//					}
//				},
//				{ $group:
//				  { 
//					  _id : '$customer', 
//					  customer:{"$first":"getCustomer.first_name"},
//					  total_amount : { $sum: "$itemprice" }
//				  }				  
//				},
				{
					$project:{
						"_id":1,
						"customer":1,
						"vehicle":1,
						"driver":1,
						"agency_id":1,
						"order_id":1
					}
				},
//				{$sort:{total_amount:-1}},
				{ $limit : 1 }
			]).exec().then(res =>{
				console.log(res);
				return resolve({status:100, data:res, msg:"Success"});
			}).catch((err2) => {
				console.log(err2)
				return resolve({
					status: 101,
					code: "Please try again."
				});
			});
			
		});
		return promise;
    },
	
	/* Get the top customer who has paid the most */
	getTopDriversGotMostOrders: (res, h) => {
        const promise = new Promise((resolve, reject) => {
			var match = {}
			if(res.payload){
				if(res.payload.agency_id){
				   match = {agency_id:res.payload.agency_id}
				}
			}
			 			
			OrderItem.aggregate([					
				{ $group:
				  { 
					  _id : '$driver', 
					  orders : { $sum: 1 }
				  }				  
				},
				{$sort:{orders:-1}},
				{ $limit : 5 }
			]).exec().then(res =>{
				return resolve({status:100, data:res, msg:"Success"});
			}).catch((err2) => {
				//console.log(err2)
				return resolve({
					status: 101,
					code: "Please try again."
				});
			});
			
		});
		return promise;
    },
	
	/* Get the top customer who has paid the most */
	getTopDriverGotMostOrders: (res, h) => {
        const promise = new Promise((resolve, reject) => {
			var match = {}
			if(res.payload){
				if(res.payload.agency_id){
				   match = {agency_id:res.payload.agency_id}
				}
			}
			console.log('hhhhhhhhhhhhhh');
			OrderItem.aggregate([
				{
					 $lookup: {
						from: "drivers",
						localField: "_id",
						foreignField: "driver",
						as: "getDriver"
					}
				},
				{ $unwind: "$getDriver" },
//				{
//					 $lookup: {
//						from: "users",
//						localField: "user_id",
//						foreignField: "drivers.user_id",
//						as: "users"
//					}
//				},
//				{ $unwind: "$users" },
//				{ $group:
//				  { 
////					  "_id": {
////					  	"driverId": "$drivers._id",
////					  	"full_name": "$users.first_name"
////					  },
//					  _id : '$driver',
//					  driver_id:{"$first":"$driver"},
//					  driver_name: {"$first":"$drivers"},
//					  orders : { $sum: 1 }
//				  }				  
//				},
				
				{$match:match},
				//{ $sort:{orders:-1} },
			//	{ $limit : 1 },
//				{
//					$project: {
//						"_id": 1,
//						"driver_name": "$drivers.first_name",
//						"lastName": "$drivers.last_name",
//						//"orders":90
//					}
//				},
			]).exec().then(res =>{
				resolve({status:100, data:res, msg:"Success"});
			}).catch((err2) => {
				console.log(err2)
				resolve({
					status: 101,
					code: "Please try again."
				});
			});
			
		});
		return promise;
    },
}