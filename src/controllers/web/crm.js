const Crmcustomer = require('../../models/crm')
const valid = require('../../config/validation')
const users = require('./hr/users.js')
var tokenverified = false
const fs = require('fs');
var path = require('path');
var date = new Date();
const FileType = require('file-type');
const Log = require('../../helpers/log.js');

function decode_base64(data, folder, filename='', customer_id ) {
   
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
        
    fs.writeFile(path.join(__dirname, '../../../public/uploads/' + folder + '/', imagename), buf, function(error) {
        if (error) {
            throw error;
        } else {
            updateCustomerLogo('public/uploads/' + folder + '/'+imagename, customer_id)
            return imagename;
        }
    });
}

function updateCustomerLogo(file, customer_id){
    var update_data = {'profile': file}
    return Crmcustomer.findByIdAndUpdate(customer_id, update_data).exec().then((updatedcustomer) => {
        if (updatedcustomer) {
            {
                return {
                    status: 100,
                    message: " Successfully updated the logo ",
                }
            }
        }
    }).catch(err => {
        console.log(err)
        return {
            status: 101,
            message: " Oops !! Something went wrong ",
        }
    });
}

let self = module.exports = {
    /* Add customer */

    add: (request, h) => {    
        if (!valid.email(request.payload.email)) {
            return {
                status: 101,
                msg: 'Email is not valid'
            }
        }
        else if (!valid.contact(request.payload.contact_no)) {
            return {
                status: 101,
                msg: "Contact number length should be greater than 8 and numeric."
            }
        }else{
			//Set the custom fields 
			/*if("custom_fields" in request.payload){
				let custom_fields = JSON.parse(request.payload.custom_fields)
				if(custom_fields.length > 0){
					for (i = 0; i < custom_fields.length; i++) {
						for(var key in custom_fields[i]){
							customer.set(key, custom_fields[i][key]);
						}
					}
				}	
			}*/
            let custom_fields    = {}
            if("custom_fields" in request.payload){
                custom_fields = request.payload.custom_fields
                if(custom_fields && custom_fields.length > 0){               
                    custom_fields.forEach((current, index)=> {                    
                        if(current.type == "image"){
                            if('val' in current && current.val){
                                var get_file = current.val;
                                var newpath = path.join(__dirname + `/../../../../public/uploads/${request.payload.agency_id}/role/`)
                              
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
            let customer = new Crmcustomer({
                agency:request.payload.agency_id,
                first_name: request.payload.first_name,
                last_name: request.payload.last_name,
                email: request.payload.email,
                contact_no: request.payload.contact_no,
                alternate_no: request.payload.alternate_no,
                country: request.payload.country,
                city: request.payload.city,
                state: request.payload.state,
                pin_code: request.payload.pin_code,
                address: request.payload.address,
                notes: request.payload.notes,
                status: 1,
                custom_fields: custom_fields,
                created_by:request.payload.created_by,
                updated_by:request.payload.created_by,
            });

            return Crmcustomer.create(customer).then((result) => {
                if(request.payload.profile){
                    var newpath = path.join(__dirname, '../../../public/uploads/' + customer.agency+'/customers')
                    fs.mkdir(newpath, { recursive: true }, (err) => {
                        if (err) {
                            //return {'status':101, 'msg': "File is not uploaded." }
                        }
                        else {
                           decode_base64(request.payload.profile, customer.agency_id+'/customers', 'profile', result._id);
                            //return {'status':100, 'msg': 'File Successfully added.' }
                        }
                    });
                }
				
				// Make json for log
				var log = {
					'operation':'Added the customer - '+result.first_name+' '+result.last_name,	'created_by':result.created_by,		
					'updated_by':result.updated_by,		
					'agency':result.agency,
					'customer':result._id,
					'old_payload':'',
					'new_payload': result
				}										
				return Log.addLog(log, 'log_crm').then((addedcrmlog) => {
					 return { 'status': 100,  'msg': "Customer added successfully", 'data': result }
				 }).catch((err2) => { 
					return {
						status: 101,
						msg: "Something went wrong while adding log."
					};
				}); 
            }).catch((err) => {
                //console.log(err);
                return {'status':101, 'msg':err.message}
            });
        }
    },

    /* Forms Validation */
    validateCRM: (req, h) => {
        if(req.payload){
            if (req.payload.email) {
                return Crmcustomer.findOne({ "email": req.payload.email, 'agency_id': req.payload.agency_id}).exec().then((result) => {
                    if (result) {
                        return { status: '101', message: 'Email already exists.' }
                    } else {
                        return { status: '100', message: '' }
                    }
                })
            }else{
                return { status: '101', message: 'Please send the email to check.' }
            }
        }else{
            return { status: '101', message: 'Please send the email and agency_id.' }
        }      
    },

    validateContact: (req, h) => {
        const promise = new Promise((resolve, reject) => {
            if (req.payload.contact_no) {
                Crmcustomer.find({ "contact_no": req.payload.contact_no }).exec().then((result) => {
                    if (result.length) {
                        resolve({ status: '101', message: 'Contact already exist' })
                    } else {
                        resolve({ status: '100', message: '' })
                    }
                })
            }

        })
        return promise;
    },
    /* End */

    /* Get customers list */
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
                                let c_sr = {
                                    [key]: { $regex: '.*' + pdata.search.value + '.*', $options: "xis" }
                                }
                                // Don't remove the below comments. it might be useful for later use
                                // c_sr.value = pdata.search.value
                                // c_sr.name = key
                                column_search.push(c_sr)
                            }
                        }
						columns_valid.push(key);
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

                agency_id = pdata.agency_id;
                let total_records = 0
                let get_total_records = self.crmCount(agency_id, order, dir, column_search, search_value, search_regex);
                get_total_records.then((res) => {
                    total_records = res.data
                    let records = 0
                    let dataget_records = 0
                    get_records = self.getCrmUsers(agency_id, start, length, order, dir, column_search, search_value, search_regex, fetch_columns);
                    get_records.then((res) => {
                        output = {
							"status":100,
							"msg":"Success",
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

    // Get CRM user total count
    crmCount: function (agency_id, order, dir, column_search, search_value, search_regex) {
        const promise = new Promise((resolve, reject) => {
            let agency = {}
            if (agency_id) {
                agency = agency_id;
            }
            if (column_search.length) {
                Crmcustomer.aggregate([{
                    $match: { $or: column_search }
                },
                { $count: "customers" },
                { $unwind: "$customers" }
                ]).exec().then((res) => {
                    if (res.length) {
                        resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].customers });
                    } else {
                        resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
                    }
                }).catch((err) => {
                    reject({ 'status': 101, 'msg': err, 'data': '' });
                });
            } else {
				var conditions = {'status':1}
                if(agency_id){
					conditions = {'status':1, 'agency':agency_id}
				}
                Crmcustomer.countDocuments(conditions).exec().then((customers) => {
                    resolve({ 'status': 100, 'msg': 'Success', 'data': customers });
                }).catch((err) => {
                    reject({ 'status': 101, 'msg': err, 'data': '' });
                });
            }
        });
        return promise
    },

    // Get CRM user list 
    getCrmUsers: function(agency_id, start, length, order, dir = 'asc', column_search, search_value, search_regex, fetch_columns) {
        
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
                Crmcustomer.aggregate([
                    { $match: { $or: column_search } }, 
					{ $sort: sort },
                    { $skip: Number(start) }, { $limit: Number(length) },
                    { $project: fetch_columns }
                ]).exec().then((customers) => {
					Crmcustomer.populate(customers, {path: 'agency',select: 'agency_name'}, function(err, populatedresult) {
					 	resolve({ 'status': 100, 'msg': 'Success', 'data': populatedresult });
					});
                }).catch((err) => {
                    reject({ 'status': 101, 'msg': err, 'data': '' });
                });
				
            } else {
				var conditions = {'status':1}
                if(agency_id){
					conditions = {'status':1, 'agency':agency_id}
				}
				Crmcustomer.find(conditions,fetch_columns).populate('agency',{'agency_name':1, _id:0}).sort(sort).skip(Number(start)).limit(Number(length)).exec().then((customers) =>{
					resolve({ 'status': 100, 'msg': 'Success', 'data': customers });
				}).catch((err) => {
					reject({ 'status': 101, 'msg': err, 'data': '' });
				});                      
            }    
		});
        return promise
    },

    /* Delete customer */
    delete: (request, h) => {
        if (!request.params._id) {
            return {status:101, msg: 'Customer id is required' };
        }
       
		let conditions = { _id: request.params._id }
				
        return Crmcustomer.findOneAndUpdate(conditions,{status:0}).exec().then((result) => {
            if(result){
				
				// Make json for log
				var log = {
					'operation':'Deleted the customer - '+result.first_name+' '+result.last_name,	'created_by':result.created_by,		
					'updated_by':result.updated_by,		
					'agency':result.agency,
					'customer':result._id,
					'old_payload':{status:0},
					'new_payload':result
				}										
				return Log.addLog(log, 'log_crm').then((addedcrmlog) => {
					 return { 'status': 100,  'msg': "Customer deleted successfully", 'data': result }
				 }).catch((err2) => { 
					return {
						status: 101,
						msg: "Something went wrong while adding log."
					};
				}); 
                return { status:100, msg: 'Customer Deleted Successfully.' }
            }else{
                return { status:101, msg: 'Customer not found' }
            }
           
        }).catch((err) => {
            return { 'status': 100, 'msg': err.errmsg };
        });
    },

    /* Get customer by id */
    getCustomerDetail: (request, h) => {
        if (!request.params._id) {
            return { status:101, msg: 'Customer id is required' };
        }else{
            return Crmcustomer.findById(request.params._id).exec().then((result) => {
                if(result){                   
                    result.profile = "http://"+request.headers.host+"/"+result.profile;
                    if(result.hasOwnProperty('custom_fields')){                    
                        if(result.custom_fields.length > 0){
                            result.custom_fields.forEach((current, index)=> {
                                if(current.type == "image"){
                                    current.val = "http://"+req.headers.host+"/"+current.val;
                                }
                            })
                            
                            return {'status':100, 'msg':'Success', 'data':result}
                        }else{
                            return {'status':100, 'msg':'Success', 'data':result}
                        }
                    }else{
                        return { status:100, msg: 'Success', data:result }
                    }

                }else{                   
                    return { status:101, msg: 'Customer does not found' }
                }   
            }).catch((err) => {
                return { 'status': 101, 'msg': err.errmsg }
            });  
        }
    },

    /* Update customer */
    update: (request, h) => {
        if(request.params._id){			
			let customer = request.payload
			
			//Set the custom fields 
            var custom_fields = {}
			if("custom_fields" in request.payload){
                custom_fields = request.payload.custom_fields
                if(custom_fields.length > 0){               
                    custom_fields.forEach((current, index)=> {                    
                        if(current.type == "image"){
                            if('val' in current && current.val){
                                var get_file = current.val;
                                var newpath = path.join(__dirname + `/../../../public/uploads/${request.payload.agency_id}/customers/`)
                              
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
                                    self.decode_buffer(buf, request.payload.agency_id+'/customers', imagename);
                                    current.val = 'public/uploads/'+request.payload.agency_id+'/customers/'+imagename;

                                }else{ 
                                    self.decode_buffer(buf, request.payload.agency_id+'/customers', imagename);
                                    current.val = 'public/uploads/'+request.payload.agency_id+'/customers/'+imagename;                           
                                }
                            }else{
                                current.val = '';
                            }                        
                        }
                    })
                }
            }
			//delete customer.custom_fields;

            return Crmcustomer.findById(request.params._id).exec().then((res_customer) => {

                // Restore the fields which are only added in add operation and restore the image, if it is already existed.
                if('custom_fields' in res_customer){
                    res_customer.custom_fields.map(ele=>{
                        var index = request.payload.custom_fields.findIndex(x=> x.field_id == ele.field_id);
                        if(index == -1){                        
                            request.payload.custom_fields.push(ele);
                        }else{
                            var new_index;
                            if(new_index = request.payload.custom_fields.findIndex(x=> (x.field_id == ele.field_id))){ 
                                if(!request.payload.custom_fields[new_index].val){
                                    request.payload.custom_fields[index].val = ele.val;
                                }                                
                            }
                           /* if(ele.type == 'image' && ele.val){                           
                                request.payload.custom_fields[index].val = ele.val;
                            }*/
                        }                        
                    });
                }

                // Actual update the role.
                return Crmcustomer.findOneAndUpdate({ _id: request.params._id }, { $set: request.payload}).exec().then((result) => {
                   
                    if (result) {          
                        if((request.payload.profile) && (request.payload.profile != "undefined")){             
    						var newpath = path.join(__dirname, '../../../public/uploads/' + result.agency+'/customers');                            
                            fs.mkdir(newpath, { recursive: true }, (err) => {
                                if (err) {
                                    // return {'status':101, 'msg': "File is not uploaded." }
                                }
                                else {                                   
                                    decode_base64(request.payload.profile, result.agency+'/customers', 'profile', result._id);
                                    //return {'status':100, 'msg': 'File Successfully added.' }
                                }
                            });
                        }
					
    					// Make json for log
    					var log = {
    						'operation':'Updated the customer - '+result.first_name+' '+result.last_name,	'created_by':result.created_by,		
    						'updated_by':result.updated_by,		
    						'agency':result.agency,
    						'customer':result._id,
    						'old_payload':result,
    						'new_payload':request.payload
    					}				
					
    					return Log.addLog(log, 'log_crm').then((addedcrmlog) => {
    						 return { 'status': 100,  'msg': "Customer updated successfully", 'data': result }
    					}).catch((err2) => { 
    						
    						return {
    							status: 101,
    							msg: "Something went wrong while adding log."
    						};
    					}); 
                    }else{					
                        return { 'status': 101,  'msg': "Oops! Customer is not updated. Please try again." }
                    }
                }).catch((err) => {				
                    return { 'status': 101,  'msg': "Oops! Customer is not updated. Please try again." }
                });
            }).catch((err) => {             
                return { 'status': 101,  'msg': "Oops! Customer not found. Please try again." }
            });
        }else{
            return { 'status': 101,  'msg': "Customer ID is missing." }
        }
    },

	getAllCustomers: (request, h) => {
		var condition = {'status':1}
    	if(request.payload.agency_id){
			condition = { 'status':1, "agency": request.payload.agency_id }
		}
			
		return Crmcustomer.find(condition, {'first_name':true, 'last_name':true, '_id':true,'contact_no':true,'email':true}).exec().then((customer) => {
				return {
					status: 100,
					msg: "Successfully listed",
					data: customer                         
				}		
		}).catch((err) => {
			return {
				status: 101,
				msg: err                             
			}
		});
    },
    
	/* Get recent customers */
    getRecentCustomers: (request, h) => {
        const concat =  "http://"+request.headers.host+"/";
        if(request.params.agency_id){
            return Crmcustomer.aggregate([
                        {$match: { "agency_id": request.params.agency_id }},
                        { $sort: {'_id': -1} },
                        { $limit: 5 },
                        { $project: {'first_name':true, 'last_name':true, 'profile_image':{$concat:[concat,"$profile"]}} }
                    ]).exec().then((result) => {
                if (result) {
                    return { 'status': 100,  'msg': "Success", 'data': result }
                }
            }).catch((err1) => {
                return { 'status': 101,  'msg': "Oops! Customer list is not fetched. Please try again." }
            });
        }else{
            return Crmcustomer.aggregate([
                        { $sort: {'_id': -1} },
                        { $limit: 5 },
                        { $project: {'first_name':true, 'last_name':true, 'profile_image':{$concat:[concat,"$profile"]}} }
                    ]).exec().then((result) => {
                if (result) {
                    return { 'status': 100,  'msg': "Success", 'data': result }
                }
            }).catch((err1) => {
                return { 'status': 101,  'msg': "Oops! Customer list is not fetched. Please try again." }
            });
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