const Vehicle = require('../../models/vehicle')
const Service = require('../../models/service')
const Users = require('../../models/user')
const VehicleCategory = require('../../models/vehicle_category');
const Agencies = require('../../models/agency')
const valid = require('../../config/validation')
let storage = require('node-sessionstorage')
const moment = require('moment')
let tokenverified = false
const fs = require('fs');
let path = require('path');
let date = new Date();
const FileType = require('file-type');
const Log = require('../../helpers/log.js');
const csv = require('csvtojson')
const csvFilePath = `${__dirname}/data.csv`

function decode_base64(data, folder, filename='', vehicle_id ) {
    /*var buf = Buffer.from(data);
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
					
                    updateVehicleLogo('public/uploads/' + folder + '/'+imagename, vehicle_id)
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
        
    fs.writeFile(path.join(__dirname, '../../../public/uploads/' + folder + '/', imagename), buf, function(error) {
        if (error) {
            throw error;
        } else {
            updateVehicleLogo('public/uploads/' + folder + '/'+imagename, vehicle_id)
            return imagename;
        }
    });   
}

// Update vehicle logo or images
function updateVehicleLogo(file, vehicle_id){
    var update_data = {'vehicle_images': file}
    return Vehicle.findByIdAndUpdate(vehicle_id, update_data).exec().then((updatedvehicle) => {
        if (updatedvehicle) {
            {
                return {
                    status: 100,
                    message: " Successfully updated the logo ",
                }
            }
        }
    }).catch(err => {
        return {
            status: 101,
            message: " Oops !! Something went wrong ",
        }
    });
}

let self = module.exports = {
    add: (request, h) => {
        
		let custom_fields    = {}
        if("custom_fields" in request.payload){
            custom_fields = request.payload.custom_fields
            if(custom_fields && custom_fields.length > 0){               
                custom_fields.forEach((current, index)=> {                    
                    if(current.type == "image"){
                        if('val' in current && current.val){
                            var get_file = current.val;
                            var newpath = path.join(__dirname + `/../../../public/uploads/${request.payload.agency_id}/vehicle/`)
                          
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
                                self.decode_buffer(buf, request.payload.agency_id+'/vehicle', imagename);
                                current.val = 'public/uploads/'+request.payload.agency_id+'/vehicle/'+imagename;

                            }else{ 
                                self.decode_buffer(buf, request.payload.agency_id+'/vehicle', imagename);
                                current.val = 'public/uploads/'+request.payload.agency_id+'/vehicle/'+imagename;                           
                            }
                        }else{
                            current.val = '';
                        }                        
                    }
                })
            }
        }
        // Make dynamic current_user_id later
        vehicle = new Vehicle({
            agency:request.payload.agency_id,
            registration_no: request.payload.registration_no,
            registration_date: request.payload.registration_date,
            registration_validity: request.payload.registration_validity,
            no_of_cylinder: request.payload.no_of_cylinder,
            vehicle_category: request.payload.vehicle_category,
            seating_capacity: request.payload.seating_capacity,
            makers_name: request.payload.makers_name,
            fuel_type: request.payload.fuel_type,
            chassis_no: request.payload.chassis_no,
            color: request.payload.color,
            engine_no: request.payload.engine_no,
            cubic_capacity: request.payload.cubic_capacity,
            no_of_wheels: request.payload.no_of_wheels,
            insurance_validity: request.payload.insurance_validity,
            tax_paid_upto: request.payload.tax_paid_upto,
            owner_name: request.payload.owner_name,
            owner_contact: request.payload.owner_contact,
            owner_address: request.payload.owner_address,
            custom_fields: custom_fields,
            created_by: request.payload.created_by,
            updated_by: request.payload.created_by
        });
        return Vehicle.create(vehicle).then((result) => {
			if(result){
				if(request.payload.vehicle_images){
					var newpath = path.join(__dirname, '../../../public/uploads/' + result.agency+'/vehicle')

					fs.mkdir(newpath, { recursive: true }, (err) => {
						if (err) {
							//return {'status':101, 'msg': "File is not uploaded." }
						}
						else {
							decode_base64(request.payload.vehicle_images, result.agency+'/vehicle', '', result._id);
							//return {'status':100, 'msg': 'File Successfully added.' }
						}
					});
				 }
				// Make json for log
				var log = {
					'operation':'Added new vehicle of registration - '+result.registration_no,	
					'created_by': result.created_by,		
					'updated_by': result.created_by,		
					'agency': result.agency,
					'vehicle': result._id,
					'old_payload': '',
					'new_payload': result,
					'registration_no': result.registration_no
				}										
				return Log.addLog(log, 'log_vehicles').then((addedvehiclelog) => { 		
					return {'status':100, 'msg':"Successfully added vehicle"}   
				 }).catch((err2) => { 
					return {
						status: 101,
						msg: "Something went wrong while saving log."
					};
				});
             
			}else{
                return {'status':101, 'msg':'Something went wrong. Please try again.'}
            }			
            
        }).catch((err) => {            
            return {'status':101, 'msg':'Something went wrong. Please try again.'}
        });
    },

	/* Vehicle form validation */
    validateRegistration: (req, h) => {
        const promise = new Promise((resolve, reject) => {
            if (req.payload.registration_no) {
                Vehicle.find({ "registration_no": req.payload.registration_no }).exec().then((result) => {
                    if (result.length) {
                        resolve({ status: '101', message: 'Registration number already exist' })
                    } else {
                        resolve({ status: '100', message: '' })
                    }
                })
            }
           
            var time = Date.now()
            for (let i = 0; i < data["vehicle_images[]"].length; i++) {
                var newname1 = time++
                    newname1 = newname1 + path.extname(request.payload["vehicle_images[]"][i].hapi.filename)
                vehicle_images_paths.push(newname1);
                data["vehicle_images[]"][i].pipe(fs.createWriteStream(newpath + newname1))
            }
            for (let j = 0; j < data["vehicle_documents[]"].length; j++) {
               
                var newname2 = Date.now() + path.extname(request.payload["vehicle_documents[]"][j].hapi.filename)
                vehicle_documents_paths.push(newname2);
                data["vehicle_documents[]"][j].pipe(fs.createWriteStream(newpath + newname2))
            }
            vehicle.vehicle_images = vehicle_images_paths;
            vehicle.vehicle_documents = vehicle_documents_paths;
            // vehicle.save((err, savedVehicle) => {
            //     if (err) {
            //         console.log(err)
            //         reject(err);
            //     }
            //     return resolve(h.redirect('/vehicles', {
            //         message: storage.setItem('message', 'Vehicle Added Successfully'),
            //         status: true
            //     }));
            // });
        });
        return promise;
    },

    getVehicleCategory: (request, h) => {
        const promise = new Promise((resolve, reject) => {
            Vehiclecategory.find({ "agency_id": request.payload.agency_id }, (error, category) => {
                if (error) {
                    console.error(error);
                }
                resolve({ 'status': 100, 'msg': 'Success', 'data': category });
            })
        });
        return promise;
    },

    getAllVehicle: (request, h) => {
        var condition = {'status':1}
    	if(request.payload.agency_id){
			condition = { 'status':1, "agency": request.payload.agency_id }
		}
		return Vehicle.find(condition, {'_id':true, 'registration_no':true, 'makers_name':true,'owner_name':true, 'owner_contact':true,
					'fuel_type':true,'engine_no':true}).exec().then((vehicle) => {
			return {
				status: 100,
				msg: "Successfully listed",
				data: vehicle                         
			}
		}).catch((err) => {
			return {
				status: 101,
				msg: err.errmsg                             
			}
		});
        //		}else{
        //			return { 'status': 101,  'msg': "Select Agency" }
        //		  
        //        }
    },

    delete: (request, h) => {
        return Vehicle.findByIdAndUpdate(request.params._id,{'status':0}).exec().then((result) => {
       
		    // Make json for log	
			var log = {
				'operation':'Delete vehicle having registration no.- '+result.registration_no,	
				'created_by': result.created_by,		
				'updated_by': result.created_by,		
				'agency': result.agency,
				'vehicle': result._id,
				'old_payload': result,
				'new_payload': {'status':0},
				'registration_no': result.registration_no
			}
			return Log.addLog(log, 'log_vehicles').then((addedvehiclelog) => { 		
				return {'status':100, 'msg': 'Vehicle Deleted Successfully' }
			 }).catch((err2) => { 
				return {
					status: 101,
					msg: "Something went wrong while saving log."
				};
			});
            
        }).catch((err) => {
            return {'status':101, 'msg': err };
        });
    },

    fetchById: (request, h) => {
        if (!request.params._id) {
            return {'status':101, 'msg': 'Vehicle id is required' };
        }
        return Vehicle.findById(request.params._id).exec().then((vehicle) => {
            if(vehicle){
                if(vehicle.vehicle_images){
                    vehicle.vehicle_images = "http://"+request.headers.host+"/"+vehicle.vehicle_images;        
                }                
                if(typeof vehicle.custom_fields != 'undefined'){
                    if(vehicle.custom_fields.length > 0){
                        vehicle.custom_fields.forEach((current, index)=> {
                            if(current.type == "image"){
                                current.val = "http://"+request.headers.host+"/"+current.val;
                            }
                        })                        
                        return {'status':100, 'msg':'Success', 'data':vehicle}
                    }else{
                        return {'status':100, 'msg':'Success', 'data':vehicle}
                    }
                }else{
                    return { status:100, msg: 'Success', data:vehicle }
                }
            }else{
                return ({'status':101, 'msg':'No vehicle detail found.', 'data':''});
            }           

        }).catch((err) => {            
            return {'status':101, 'msg': 'Something went wrong.' };
        });
    },

    update: (request, h) => {
		let vehicle = request.payload

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

        return Vehicle.findById(request.params._id).exec().then((res_vehicle) => {
            if(res_vehicle){

                // Restore the fields which are only added in add operation and restore the image, if it is already existed.
                if('custom_fields' in res_vehicle && typeof res_vehicle.custom_fields != "undefined"){
                    res_vehicle.custom_fields.map(ele=>{
                        var index = vehicle.custom_fields.findIndex(x=> x.field_id == ele.field_id);
                        if(index == -1){                        
                            vehicle.custom_fields.push(ele);
                        }else{
                            var new_index;
                            if(new_index = vehicle.custom_fields.findIndex(x=> (x.field_id == ele.field_id))){ 
                                if(!vehicle.custom_fields[new_index].val){
                                    vehicle.custom_fields[index].val = ele.val;
                                }                                
                            }                           
                        }                    
                    });
                }
               
                if('vehicle_images' in vehicle && vehicle.vehicle_images && (vehicle.vehicle_images != "undefined")){    
                 
                    var newpath = path.join(__dirname, '../../../public/uploads/' + vehicle.agency_id+'/vehicle');                       
                    fs.mkdirSync(newpath, { recursive: true })
                    var buf = Buffer.from(vehicle.vehicle_images.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');
                    var imagename ='';
                    var mime  = vehicle.vehicle_images.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
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
                        self.decode_buffer(buf, vehicle.agency_id+'/vehicle', imagename);
                        vehicle.vehicle_images = 'public/uploads/'+vehicle.agency_id+'/vehicle/'+imagename;

                    }else{ 
                        self.decode_buffer(buf, vehicle.agency_id+'/vehicle', imagename);
                        vehicle.vehicle_images = 'public/uploads/'+vehicle.agency_id+'/vehicle/'+imagename;                           
                    }
                }
             
                // Actual update the vehicle.
                return Vehicle.findOneAndUpdate({ _id: request.params._id }, { $set: vehicle}).exec().then((result) => {       
                  
                    if (result) {
                       
                        // Make json for log
                        var log = {
                            'operation':'Updated a vehicle of registration - '+result.registration_no,  
                            'created_by': result.created_by,        
                            'updated_by': result.created_by,        
                            'agency': result.agency,
                            'vehicle': result._id,
                            'old_payload': result,
                            'new_payload': request.payload,
                            'registration_no': result.registration_no
                        }                                       
                        return Log.addLog(log, 'log_vehicles').then((addedvehiclelog) => {      
                            return { 'status':100, 'msg': 'Successfully updated.', 'data':result }
                        }).catch((err2) => { 
                            return {
                                status: 101,
                                msg: "Something went wrong while saving log."
                            };
                        });
                    }else{                                      
                        return { 'status': 101,  'msg': "Vehicle is not updated. Please try again." }
                    }                
                }).catch((err) => {
                    return {'status':101, 'msg':err}
                });
            }else{
                return { 'status': 101,  'msg': "Vehicle not found. Please try again." }
            }            
        }).catch((err) => { 
            console.log("error->", err);            
            return { 'status': 101,  'msg': "Vehicle not found. Please try again." }
        });
    },

    /* Get vehicles list */
    fetch_ajax: (request, h) => {
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
            let column_search = []
            let i
            if (columns) {
                for (i = 0; i < columns.length; i++) {
                    if (pdata.search.value) {
                        let key = columns[i].name;
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
                "registration_no",
                "maker_name",
                "agency.agency_name",
                "owner_name",
                "owner_contact_no"
            ]

            if (columns_valid[col]) {
                order = columns_valid[col];
            } else {
                order = null;
            }

            agency_id = pdata.agency_id;
            // Will use the aganecy id here from session , so don't remove the comments
            /*if( $this->session->userdata('type') == ROLE_EMPLOYEE){     
                $current_employee_id = $current_user_id;        
            }  */
            let total_records = 0
            let get_total_records = self.vehiclesCount(agency_id, order, dir, column_search, search_value, search_regex);

            return get_total_records.then((res) => {
                total_records = res.data
                let records = 0
                let dataget_records = 0

                get_records = self.getVehicles(agency_id, start, length, order, dir, column_search, search_value, search_regex);
                return get_records.then((res) => {
                    return output = {
                        "status":100,
                        "recordsTotal": total_records,
                        "recordsFiltered": total_records,
                        "data": res.data
                    }
                }).catch((err) => {
                    return {'status':101, 'msg':'Something went wrong.'}
                })

            }).catch((err) => {
                return {'status':101, 'msg':'Something went wrong.'}
            })
        }
    },

    // Get all maintenance logs
    fetchAjaxService: (request, h) => {
        if (request.payload) {
            const promise  = new Promise((resolve, reject) => {
                let pdata  = request.payload
                let search_value = ''
                let search_regex = ''
                let draw   = pdata.draw
                let start  = pdata.start
                let length = pdata.length
                let order  = ''
                if (pdata.order) {
                    order = pdata.order
                }

                let columns = pdata.columns
                let column_search = []
                let i
                if (columns) {
                    for (i = 0; i < columns.length; i++) {
                        if (pdata.search.value) {
                            let key = columns[i].name;
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
                    "_id",
                    "service_date",
                    "workshop_name",
                    "workshop_contact",
                    "total_cost"
                ]

                if (columns_valid[col]) {
                    order = columns_valid[col];
                } else {
                    order = null;
                }

                agency_id = "";
                //agency_id = "dna0twdafk5yykcgt";
                // Will use the aganecy id here from session , so don't remove the comments
                /*if( $this->session->userdata('type') == ROLE_EMPLOYEE){     
                    $current_employee_id = $current_user_id;        
                }  */
                let total_records = 0
                let get_total_records = self.serviceLogCount(agency_id, order, dir, column_search, search_value, search_regex);

                get_total_records.then((res) => {
                    total_records = res.data
                    let records = 0
                    let get_records = 0

                    get_records = self.getServiceLogs(agency_id, start, length, order, dir, column_search, search_value, search_regex);
                    get_records.then((res) => {
                       /* records = res.data
                        let data = []
                        let k

                        if (total_records > 0) {
                            for (k = 0; k < records.length; k++) {
                                let action_btns = "";
								action_btns = '<div class="tabledit-toolbar btn-toolbar" style="text-align: left;"><div class="btn-group btn-group-sm" style="float: none;"><a title="Edit maintenance entry"  href="/update-vehicle/' + records[k]['_id'] + '" class="tabledit-edit-button btn btn-primary waves-effect waves-light" style="float: none;margin: 5px;"><span class="icofont icofont-ui-edit"></span></a><a href="/delete-vehicle/' + records[k]['_id'] + '" class="tabledit-delete-button btn btn-danger waves-effect waves-light" style="float: none;margin: 5px;" title="Delete maintenance entry"><span class="icofont icofont-ui-delete"></span></a></div></div>';

                                new_data = [
                                    '',
                                    records[k]['_id'],
                                    records[k]['service_date'],
                                    records[k]['workshop_name'],
                                    records[k]['workshop_contact'],
                                    records[k]['total_cost'],
                                    //action_btns
                                ]
                                data.push(new_data)
                            }
                        }*/
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
						resolve({'status':101, 'msg':'Error! Please try again.'});
                    })
                }).catch((err) => {
					resolve({'status':101, 'msg':'Error! Please try again.'});
                })
            });
            return promise;
        }
    },

    // Get vehicles total count
    vehiclesCount: function(agency_id, order, dir, column_search, search_value, search_regex) {
        const promise = new Promise((resolve, reject) => {
            let agency = {}
            if (agency_id) {
                agency = agency_id
            }

            if (column_search.length) {
                Vehicle.aggregate([{
                        $match: { $or: column_search }
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
				var condititons = {'status':1}
				if(agency_id){
				   condititons = {'status':1, 'agency': agency_id}
				}
                Vehicle.countDocuments(condititons).exec().then((vehicles) => {
                    resolve({ 'status': 100, 'msg': 'Success', 'data': vehicles });
                }).catch((err) => {
                    reject({ 'status': 101, 'msg': err, 'data': '' });
                });
            }
        });
        return promise
    },

    // Get vehicles list 
    getVehicles: function(agency_id, start, length, order, dir = 'asc', column_search, search_value, search_regex) {

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

			var columns = {'registration_no':1, 'owner_name':1, 'status':1, 'agency':1}
			if (column_search.length) {
				Vehicle.aggregate([{
						$lookup: {
							from: 'agencies',
							localField: 'agency_id',
							foreignField: 'agency_id',
							as: 'agency'
						}
					},
					{ $match: { $or: column_search } }, { $sort: sort },
					{ $skip: Number(start) }, { $limit: Number(length) },
					{ $unwind: "$agency" }
				]).exec().then((vehicles) => {
					resolve({ 'status': 100, 'msg': 'Success', 'data': vehicles });
				}).catch((err) => {
					reject({ 'status': 101, 'msg': err, 'data': '' });
				});
			} else{
				var conditions = {'status':1}
				if(agency_id){
				   conditions = {'status':1, 'agency':agency_id}
				}
				Vehicle.find(conditions, columns).populate('agency', {'agency_name':1, '_id':0}).sort(sort).skip(Number(start)).limit(Number(length)).exec().then((vehicles) => {
					resolve({ 'status': 100, 'msg': 'Success', 'data': vehicles });
				}).catch((err) => {
					reject({ 'status': 101, 'msg': err, 'data': '' });
				});
			}
        });
        return promise;
    },

    fetchVehicleList: (request, h) => {
       
        const promise = new Promise((resolve, reject) => {
            Vehicle.find((error, vehiclesList) => {
                if (error) {
                    console.error(error);
					resolve({'status':101, 'data':'', 'msg':"Error! Please try again."});
                }
              	resolve({'status':100, 'data':vehiclesList, 'msg':"Success"});
            });
        });
        return promise;
    },

    addNewService: (req, h) => {
		return Vehicle.findById(req.params._id).exec().then((exists)=>{

		    let custom_fields    = {}
            if("custom_fields" in req.payload){
                custom_fields = req.payload.custom_fields
                if(custom_fields && custom_fields.length > 0){               
                    custom_fields.forEach((current, index)=> {                    
                        if(current.type == "image"){
                            if('val' in current && current.val){
                                var get_file = current.val;
                                var newpath = path.join(__dirname + `/../../../public/uploads/${req.payload.agency_id}/service/`)                              
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
                                    self.decode_buffer(buf, req.payload.agency_id+'/service', imagename);
                                    current.val = 'public/uploads/'+req.payload.agency_id+'/service/'+imagename;

                                }else{ 
                                    self.decode_buffer(buf, req.payload.agency_id+'/service', imagename);
                                    current.val = 'public/uploads/'+req.payload.agency_id+'/service/'+imagename;                           
                                }
                            }else{
                                current.val = '';
                            }                        
                        }
                    })
                }
            }

			if(exists){
				const service_and_main_details = new Service({
					vehicle: req.params._id,
					agency: exists.agency,
					registration_no: exists.registration_no,
					service_date: req.payload.service_date,
					service_cost: req.payload.service_cost,
					total_run: req.payload.total_run,
					labour_cost: req.payload.labour_cost,
					total_cost: req.payload.total_cost,
					workshop_name: req.payload.workshop_name,
					workshop_contact: req.payload.workshop_contact,
					workshop_address: req.payload.workshop_address,
					work_description: req.payload.work_description,
                    custom_fields: custom_fields,
					created_by: req.payload.created_by,
					updated_by: req.payload.created_by
				});
			
				return Service.create(service_and_main_details).then((serviceDetails) => {    
                   
					if (!serviceDetails) {                  
						return { 'status':101, 'data':'', 'msg':"Error! Please try again." }
						
					}else{
						
						// Make json for log
						var log = {
							'operation':'Added service of vehicle - '+serviceDetails.registration_no,	
							'created_by':serviceDetails.created_by,		
							'updated_by':serviceDetails.created_by,		
							'agency':serviceDetails.agency,
							'service':serviceDetails._id,
							'vehicle':serviceDetails.vehicle,
							'old_payload': '',
							'new_payload': serviceDetails,
						}										
						return Log.addLog(log, 'log_services').then((addedservicelog) => { 		
							return {'status':100, 'msg': "Service Details Added Successfully", 'data':serviceDetails}
						 }).catch((err2) => { 
							return {
								status: 101,
								msg: "Something went wrong while saving log."
							}
						})
					}
				}).catch((err) => {
                    //console.log("err-->>", err); 
                    return {
                        status: 101,
                        msg: err.message
                    }
                })
			}
			else{
				return {
					status: 101,
					msg: "Vehicle doesn't exist."
				}
			}
		}).catch((err)=>{
			return {
				status: 101,
				msg: "Please try again."
			}
		})
    },

    // Get the detail of service from service id.
    getServiceByID: (req, h) => {
        return Service.findById( req.params._id ).exec().then((serviceDetails) => {
           
            if (serviceDetails) {
                  if(typeof serviceDetails.custom_fields != 'undefined'){
                    if(serviceDetails.custom_fields.length > 0){
                        serviceDetails.custom_fields.forEach((current, index)=> {
                            if(current.type == "image"){
                                current.val = "http://"+req.headers.host+"/"+current.val;
                            }
                        })
                        
                        return {'status':100, 'msg':'Success', 'data':serviceDetails}
                    }else{
                        return {'status':100, 'msg':'Success', 'data':serviceDetails}
                    }
                }else{
                    return { status:100, msg: 'Success', data:serviceDetails }
                }
            }else{
				return ({'status':101, 'msg':'No Service detail found.', 'data':''});
			}
        }).catch((err1) => {
            console.log(err1)
			return ({'status':101, 'msg':'Error! Please try again.', 'data':''});
        });
    },
	
	getServiceByVehicleID: (req, h) => {
        return Service.find({ vehicle: req.params.vehicle_id , status:1}).exec().then((serviceDetails) => {
            if (serviceDetails) {
				return ({'status':100, 'msg':'Success', 'data':serviceDetails});
            }
        }).catch((err1) => {
			return ({'status':101, 'msg':'Error! Please try again.', 'data':''});
        });
    },

    // Check if the vehicle is already registerd or not using Registration ID 
    validateVehicle: (req,h) => {
        if(req.payload){
            return Vehicle.findOne({ 'registration_no': req.payload.registration_no, 'agency':req.payload.agency_id}).exec().then((vehicle) => {
                if (vehicle) {
                    return {'status':101, 'msg':'Vehicle is already registered.'}
                }else{
                    return {'status':100, 'msg':''}
                }
            }).catch((err1) => {
                return {'status':101, 'msg':err}
            });
        }else{
            return {'status':101, 'msg':'Please send the vehicle registration no.'}
        }       
    },

    // Get service logs total count
    serviceLogCount: function(agency_id, order, dir, column_search, search_value, search_regex) {
        const promise = new Promise((resolve, reject) => {
            let agency = {}
            if (agency_id) {
                agency = agency_id
            }

            if (column_search.length) {
                Service.aggregate([{
                        $match: { $or: column_search }
                    },
                    { $count: "services" }, { $unwind: "$services" }
                ]).exec().then((res) => {
                    if (res.length) {
                        resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].services });
                    } else {
                        resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
                    }
                }).catch((err) => {
                    reject({ 'status': 101, 'msg': err, 'data': '' });
                });
            } else {
				var conditions = {'status':1}
				if(agency_id){
				   conditions = {'agency':agency_id, 'status':1}
				}
                Service.countDocuments(conditions).exec().then((services) => {
                    resolve({ 'status': 100, 'msg': 'Success', 'data': services });
                }).catch((err) => {
                    reject({ 'status': 101, 'msg': err, 'data': '' });
                });
            }
        });
        return promise
    },

    /* Get service log list */ 
    getServiceLogs: function(agency_id, start, length, order, dir = 'asc', column_search, search_value, search_regex) {

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
                Service.aggregate([{
                        $lookup: {
                            from: 'vehicles',
                            localField: 'vehicle_id',
                            foreignField: '_id',
                            as: 'vehicle'
                        }
                    },
                    { $match: { $or: column_search } }, { $sort: sort },
                    { $skip: Number(start) }, { $limit: Number(length) },
                    { $unwind: "$vehicle" }
                ]).exec().then((services) => {                   
                    resolve({ 'status': 100, 'msg': 'Success', 'data': services });
                }).catch((err) => {
                    reject({ 'status': 101, 'msg': err, 'data': '' });
                });
			}
			else {
				var conditions = {'status':1}
				if(agency_id){
				   conditions = {'agency':agency_id, 'status':1}
				}
				var columns = {'registration_no':1,'registration_date':1,'service_cost':1, 'labour_cost':1, 'total_cost':1, 'workshop_name':1, 'workshop_contact':1}

				Service.find(conditions, columns).populate('agency',{'agency.agency_name':1,'_id':0}).sort().skip().limit().exec().then((services)=>{
                    resolve({ 'status': 100, 'msg': 'Success', 'data': services });
                }).catch((err) => {
                    reject({ 'status': 101, 'msg': err, 'data': '' });
                });
            }
        });
        return promise
    },
	
	updateService: (request, h) => {
	
        let service = request.payload
      
        //Set the custom fields 
        var custom_fields = {}
        if("custom_fields" in service){
            custom_fields = service.custom_fields
            if(custom_fields.length > 0){               
                custom_fields.forEach((current, index)=> {                    
                    if(current.type == "image"){
                        if('val' in current && current.val){

                            var get_file = current.val;                          
                            var newpath = path.join(__dirname + `/../../../public/uploads/${service.agency_id}/service/`)                          
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
                                self.decode_buffer(buf, service.agency_id+'/service', imagename);
                                current.val = 'public/uploads/'+service.agency_id+'/service/'+imagename;

                            }else{ 
                                self.decode_buffer(buf, service.agency_id+'/service', imagename);
                                current.val = 'public/uploads/'+service.agency_id+'/service/'+imagename;                           
                            }
                        }else{
                            current.val = '';
                        }                        
                    }
                })
            }
        }
        //delete vehicle.custom_fields;

        return Service.findById(request.params._id).exec().then((res_service) => {
            if(res_service){

                // Restore the fields which are only added in add operation and restore the image, if it is already existed.
                if('custom_fields' in res_service){
                    res_service.custom_fields.map(ele=>{
                        var index = service.custom_fields.findIndex(x=> x.field_id == ele.field_id);
                        if(index == -1){                        
                            service.custom_fields.push(ele);
                        }else{
                            var new_index;
                            if(new_index = service.custom_fields.findIndex(x=> (x.field_id == ele.field_id))){ 
                                if(!service.custom_fields[new_index].val){
                                    service.custom_fields[index].val = ele.val;
                                }
                                //if(ele.type == 'image' && ele.val){  
                                //}
                            }
                        }                    
                    });
                }
               
                // Actual update the service.
                return Service.findOneAndUpdate({ _id: request.params._id }, { $set: service}).exec().then((result) => {
                    if(result){

                        // Make json for log
                        var log = {
                            'operation':'Updated service of vehicle - '+result.registration_no, 
                            'created_by':result.created_by,     
                            'updated_by':result.updated_by,     
                            'agency':result.agency,
                            'service':result._id,
                            'vehicle':result.vehicle,
                            'old_payload': result,
                            'new_payload': request.payload                  
                        }                                       
                        return Log.addLog(log, 'log_services').then((addedservicelog) => {      
                            return { 'status':100, 'msg': 'Successfully updated service log.', 'data':result }
                        }).catch((err2) => { 
                            return {
                                status: 101,
                                msg: "Something went wrong while saving log."
                            }
                        })
                      
                    }else{
                        return { 'status':101, 'msg': 'Cannot find the service log of the vehicle.', 'data':'' }; 
                    }                          
                }).catch((err) => {
                    console.log(err);
                    return {'status':101, 'msg':err}
                });
            }else{
                return { 'status':101, 'msg': 'Cannot find the service log of the vehicle.', 'data':'' }; 
            }
            
        }).catch((err) => {
            console.log(err);
            return {'status':101, 'msg':err}
        });

    },
	
	/* Delete service log  */
    deleteService: (request, h) => {
        if (!request.params._id) {
            return {status:101, msg: 'Service log id is required' };
        }
        return Service.findByIdAndUpdate(request.params._id, {status:0}).exec().then((result) => {            
            if(result){
				
				// Make json for log	
				var log = {
					'operation':'Deleted the service - '+result.registration_no,
					'created_by':result.created_by,		
					'updated_by':result.updated_by,		
					'agency':result.agency,
					'service':result._id,
					'vehicle':result.vehicle,
					'old_payload': result,
					'new_payload': {status:0}		
				}
				return Log.addLog(log, 'log_services').then((addedvehiclelog) => { 		
					return {'status':100, 'msg': 'Service deleted successfully' }
				 }).catch((err2) => { 
					return {
						status: 101,
						msg: "Something went wrong while saving log."
					};
				});
                return { status:100, msg: 'Service log is deleted successfully.' }
            }else{
                return { status:101, msg: 'Service log not found for the vehicle' }
            }
        }).catch((err) => {
            return { 'status': 101, 'msg': err.errmsg };
        });
    },

    // Add the files into the folder
    decode_buffer: (buf, folder, filename='' ) => { 
        return fs.writeFile(path.join(__dirname, '../../../public/uploads/' + folder + '/', filename), buf, function(error) {
            if (error) {
            } 
            else {
            }
        });
    },

    // Get vehicle categories
    getCategories: (request, h) => {
        if (!request.params.id) {
            return {status:101, msg: 'Please choose agency.' };
        }else{
            return VehicleCategory.find({'agency': request.params.id, 'status':1 }).exec().then((categories) => {           
                if (categories) {   
                    return { status:100, msg: 'Success', data:categories }
                }else{
                    return ({'status':101, 'msg':'No vehicle category found.', 'data':''});
                }
            }).catch((err1) => {                
                return ({'status':101, 'msg':'Error! Please try again.', 'data':''});
            });
        }
    },

    vehiclebulkimport : async(req, h) => {

         var newrecord = []
     var alreadyexists = []
     var fieldsarray = ['agency_id','registration_no','no_of_wheels','registration_date','tax_paid_upto','owner_address','owner_name','created_by','makers_name','vehicle_category']
return csv().fromFile(csvFilePath).then(async(jsonObj)=>{
    for (var i = 0; i < jsonObj.length; i++) {
  if(jsonObj[i].agency_id == '' || jsonObj[i].agency_id == null || jsonObj[i].agency_id == '' ||
   jsonObj[i].registration_no == '' ||   jsonObj[i].registration_no == null || jsonObj[i].vehicle_category == '' || jsonObj[i].vehicle_category == null
    || jsonObj[i].seating_capacity == '' || jsonObj[i].seating_capacity == null || jsonObj[i].makers_name == null || jsonObj[i].makers_name == ''
    ||  jsonObj[i].no_of_wheels == '' || jsonObj[i].no_of_wheels == null 
    || jsonObj[i].tax_paid_upto == ''  || jsonObj[i].owner_name == ''  || jsonObj[i].owner_contact == ''
     || jsonObj[i].owner_address == '' || jsonObj[i].owner_address == '' 
      || jsonObj[i].created_by == '' || jsonObj[i].registration_date == '' || jsonObj[i].registration_date == null ) {
     return {'status':101 ,'msg' : 'Mandatory fields to always be required' ,'data':fieldsarray}
  }
  else{
    var userdata = await Vehicle.find({ 'registration_no': jsonObj[i].registration_no })
 if(userdata.length > 0){
    alreadyexists.push(jsonObj[i])
 } 
    else{

         vehicle = new Vehicle({
            agency:jsonObj[i].agency_id,
            registration_no: jsonObj[i].registration_no,
            registration_date: jsonObj[i].registration_date,
            registration_validity: jsonObj[i].registration_validity,
            no_of_cylinder: jsonObj[i].no_of_cylinder,
            vehicle_category: jsonObj[i].vehicle_category,
            seating_capacity: jsonObj[i].seating_capacity,
            makers_name: jsonObj[i].makers_name,
            fuel_type: jsonObj[i].fuel_type,
            chassis_no: jsonObj[i].chassis_no,
            color: jsonObj[i].color,
            engine_no: jsonObj[i].engine_no,
            cubic_capacity: jsonObj[i].cubic_capacity,
            no_of_wheels: jsonObj[i].no_of_wheels,
            insurance_validity: jsonObj[i].insurance_validity,
            tax_paid_upto: jsonObj[i].tax_paid_upto,
            owner_name: jsonObj[i].owner_name,
            owner_contact: jsonObj[i].owner_contact,
            owner_address: jsonObj[i].owner_address,
            custom_fields: custom_fields,
            created_by: jsonObj[i].created_by,
            updated_by: jsonObj[i].created_by
        });

    return Vehicle.create(vehicle).then((result) => {})
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
}