const CustomField                       = require('../../../models/custom_fields')
const CustomFieldRole                   = require('../../../models/custom_fields_role')
const CustomFieldCRM                    = require('../../../models/custom_fields_crm')
const CustomFieldVehicle                = require('../../../models/custom_fields_vehicle')
const CustomFieldService                = require('../../../models/custom_fields_service')
const CustomFieldUser                   = require('../../../models/custom_fields_user')
const CustomFieldOrder                  = require('../../../models/custom_fields_order')
const CustomFieldVehicleCategory        = require('../../../models/custom_fields_vehicle_category')
const CustomFieldEquipmentCategory      = require('../../../models/custom_fields_equipment_category')
var CustomFieldRoleOptions              = require('../../../models/custom_fields_role_options')
var CustomFieldCRMOptions               = require('../../../models/custom_fields_crm_options')
var CustomFieldVehicleOptions           = require('../../../models/custom_fields_vehicle_options')
var CustomFieldServiceOptions           = require('../../../models/custom_fields_service_options')
var CustomFieldUserOptions              = require('../../../models/custom_fields_user_options')
var CustomFieldOrderOptions             = require('../../../models/custom_fields_order_options')
var CustomFieldVehicleCategoryOptions   = require('../../../models/custom_fields_vehicle_category_options')
var CustomFieldEquipmentCategoryOptions = require('../../../models/custom_fields_equipment_category_options')
var LogCustomField                      = require('../../../models/log_custom_fields')
var Module                              = require('../../../models/module')
const Log                               = require('../../../helpers/log.js')
var mongoose                            = require('mongoose')

let self = module.exports = {
	
    /* Add custom fields */
    add: (request, h) => {    
        if(request.payload){
			if(request.payload.agency_id){
				if(request.payload.module){
				    if(request.payload.fields.length){
						var i
						var fields = request.payload.fields
						var fields_data  = []
						var options_data = []
		                              
						// Get the module name
		                let get_module_name = self.getModuleName(request.payload.module);
		                
		                return get_module_name.then((res) => {
		                	
		                	if(res.status == 100){
		                		if(res.data){
		                			let module = res.data;

									// Save the fields of role module
								    if(module == "role"){
										
										for(i=0; i<fields.length; i++){
											fields_data.push(new CustomFieldRole({
												agency:request.payload.agency_id,
												module: request.payload.module,
												form: request.payload.form,
												field_type: fields[i].field_type,
												field_name: fields[i].field_name,
												description: fields[i].description,
												placeholder:fields[i].placeholder,
												required:fields[i].required,
												name:fields[i].name,
												title:fields[i].title,
												created_by: request.payload.created_by,
												updated_by: request.payload.created_by,
												status: 1
											}));
										}
									   	return CustomFieldRole.insertMany(fields_data).then((result) => {
											
											if(result){
												var log = []
												for(i=0; i<result.length; i++){

													// Add options of select, checkbox and radio box options
													if(fields[i].options){
														for(j=0; j<fields[i].options.length; j++){
															options_data.push(new CustomFieldRoleOptions({
																agency:result[i].agency,
																module: request.payload.module,
																custom_field_id: result[i]._id, 								
																option_name: fields[i].options[j],
																created_by: request.payload.created_by,
																updated_by: request.payload.created_by,
																status: 1
															}));
														}
													}

													// Make json for log
													log.push(new LogCustomField({
														'operation':'Added a custom field ('+result[i].field_name+') in - '+result[i].form+' of '+request.payload.module_name+' module',	
														'custom_field_id':result[i]._id,
														'created_by':result[i].created_by,		
														'updated_by':result[i].updated_by,		
														'agency':result[i].agency,
														'module':result[i].module
													}))
												}
											}

											// Add the options 
											if(options_data.length > 0){
											
												return CustomFieldRoleOptions.insertMany(options_data).then((result) => {
													return { 'status': 100,  'msg': "Custom fields options added successfully", 'data': result }
												}).catch((err2) => { 										
													return {
														status: 101,
														msg: "Something went wrong while adding log."
													};
												}); 
											}

											//Add the logs
											return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
												return { 'status': 100,  'msg': "Custom fields added successfully", 'data': result }
											}).catch((err2) => { 
												return {
													status: 101,
													msg: "Something went wrong while adding log."
												};
											}); 
										}).catch((err) => {
											console.log(err);
											return {'status':101, 'msg':err.message}
										});
									}
								    else if(module == "crm"){
										for(i=0; i<fields.length; i++){
											fields_data.push(new CustomFieldCRM({
												agency:request.payload.agency_id,
												module: request.payload.module,
												form: request.payload.form,
												field_type: fields[i].field_type,
												field_name: fields[i].field_name,
												description: fields[i].description,
												//options: fields[i].options,
												placeholder:fields[i].placeholder,
												required:fields[i].required,
												name:fields[i].name,
												title:fields[i].title,
												created_by: request.payload.created_by,
												updated_by: request.payload.created_by,
												status: 1
											}));
										}							
										
									   	return CustomFieldCRM.insertMany(fields_data).then((result) => {
											if(result){
												var log = []
												for(i=0; i<result.length; i++){

													// Add options of select, checkbox and radio box options
													if(fields[i].options){
														for(j=0; j<fields[i].options.length; j++){
															options_data.push(new CustomFieldCRMOptions({
																agency:result[i].agency,
																module: request.payload.module,
																custom_field_id: result[i]._id, 								
																option_name: fields[i].options[j],
																created_by: request.payload.created_by,
																updated_by: request.payload.created_by,
																status: 1
															}));
														}
													}

													// Make json for log
													log.push(new LogCustomField({
														'operation':'Added a custom field ('+result[i].field_name+') in - '+result[i].form+' of '+request.payload.module_name+' module',	
														'custom_field_id':result[i]._id,
														'created_by':result[i].created_by,		
														'updated_by':result[i].updated_by,		
														'agency':result[i].agency,
														'module':result[i].module
													}))
												}
											}

											// Add the options 
											if(options_data.length > 0){
											
												return CustomFieldCRMOptions.insertMany(options_data).then((result) => {
													return { 'status': 100,  'msg': "Custom fields options added successfully", 'data': result }
												}).catch((err2) => { 										
													return {
														status: 101,
														msg: "Something went wrong while adding log."
													};
												}); 
											}

											return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
												 return { 'status': 100,  'msg': "Custom fields added successfully", 'data': result }
											 }).catch((err2) => { 
												return {
													status: 101,
													msg: "Something went wrong while adding log."
												};
											}); 
										}).catch((err) => {
											console.log(err);
											return {'status':101, 'msg':err.message}
										});
									}
								    else if(module == "vehicle"){
										for(i=0; i<fields.length; i++){
											fields_data.push(new CustomFieldVehicle({
												agency:request.payload.agency_id,
												module: request.payload.module,
												form: request.payload.form,
												field_type: fields[i].field_type,
												field_name: fields[i].field_name,
												description: fields[i].description,
												options: fields[i].options,
												placeholder:fields[i].placeholder,
												required:fields[i].required,
												name:fields[i].name,
												title:fields[i].title,
												created_by: request.payload.created_by,
												updated_by: request.payload.created_by,
												status: 1
											}));
										}							
										
									   	return CustomFieldVehicle.insertMany(fields_data).then((result) => {
											if(result){
												var log = []
												for(i=0; i<result.length; i++){

													// Add options of select, checkbox and radio box options
													if(fields[i].options){
														for(j=0; j<fields[i].options.length; j++){
															options_data.push(new CustomFieldVehicleOptions({
																agency:result[i].agency,
																module: request.payload.module,
																custom_field_id: result[i]._id, 								
																option_name: fields[i].options[j],
																created_by: request.payload.created_by,
																updated_by: request.payload.created_by,
																status: 1
															}));
														}
													}

													// Make json for log
													log.push(new LogCustomField({
														'operation':'Added a custom field ('+result[i].field_name+') in - '+result[i].form+' of '+request.payload.module_name+' module',	
														'custom_field_id':result[i]._id,
														'created_by':result[i].created_by,		
														'updated_by':result[i].updated_by,		
														'agency':result[i].agency,
														'module':result[i].module
													}))
												}
											}

											// Add the options 
											if(options_data.length > 0){
											
												return CustomFieldVehicleOptions.insertMany(options_data).then((result) => {
													return { 'status': 100,  'msg': "Custom fields options added successfully", 'data': result }
												}).catch((err2) => { 										
													return {
														status: 101,
														msg: "Something went wrong while adding log."
													};
												}); 
											}

											// Make json for log
											return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
												 return { 'status': 100,  'msg': "Custom fields added successfully", 'data': result }
											}).catch((err2) => { 
												return {
													status: 101,
													msg: "Something went wrong while adding log."
												};
											}); 
										}).catch((err) => {
											console.log(err);
											return {'status':101, 'msg':err}
										});
									} 
								    else if(module == "service"){
										for(i=0; i<fields.length; i++){
											fields_data.push(new CustomFieldService({
												agency:request.payload.agency_id,
												module: request.payload.module,
												form: request.payload.form,
												field_type: fields[i].field_type,
												field_name: fields[i].field_name,
												description: fields[i].description,
												options: fields[i].options,
												placeholder:fields[i].placeholder,
												required:fields[i].required,
												name:fields[i].name,
												title:fields[i].title,
												created_by: request.payload.created_by,
												updated_by: request.payload.created_by,
												status: 1
											}));
										}							
										
									   	return CustomFieldService.insertMany(fields_data).then((result) => {
											if(result){
												var log = []
												for(i=0; i<result.length; i++){

													// Add options of select, checkbox and radio box options
													if(fields[i].options){
														for(j=0; j<fields[i].options.length; j++){
															options_data.push(new CustomFieldServiceOptions({
																agency:result[i].agency,
																module: request.payload.module,
																custom_field_id: result[i]._id, 								
																option_name: fields[i].options[j],
																created_by: request.payload.created_by,
																updated_by: request.payload.created_by,
																status: 1
															}));
														}
													}										

													// Make json for log
													log.push(new LogCustomField({
														'operation':'Added a custom field ('+result[i].field_name+') in - '+result[i].form+' of '+request.payload.module_name+' module',	
														'custom_field_id':result[i]._id,
														'created_by':result[i].created_by,		
														'updated_by':result[i].updated_by,		
														'agency':result[i].agency,
														'module':result[i].module
													}))
												}
											}

											// Add the options 
											if(options_data.length > 0){
											
												return CustomFieldServiceOptions.insertMany(options_data).then((result) => {
													return { 'status': 100,  'msg': "Custom fields options added successfully", 'data': result }
												}).catch((err2) => { 										
													return {
														status: 101,
														msg: "Something went wrong while adding log."
													};
												}); 
											}

											return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
												 return { 'status': 100,  'msg': "Custom fields added successfully", 'data': result }
											 }).catch((err2) => { 
												return {
													status: 101,
													msg: "Something went wrong while adding log."
												};
											}); 
										}).catch((err) => {
											console.log(err);
											return {'status':101, 'msg':err}
										});
									}
								    else if(module == "user"){
										for(i=0; i<fields.length; i++){
											fields_data.push(new CustomFieldUser({
												agency:request.payload.agency_id,
												module: request.payload.module,
												form: request.payload.form,
												field_type: fields[i].field_type,
												field_name: fields[i].field_name,
												description: fields[i].description,
												options: fields[i].options,
												placeholder:fields[i].placeholder,
												required:fields[i].required,
												name:fields[i].name,
												title:fields[i].title,
												created_by: request.payload.created_by,
												updated_by: request.payload.created_by,
												status: 1
											}));
										}							
										
									   	return CustomFieldUser.insertMany(fields_data).then((result) => {
											if(result){
												var log = []
												for(i=0; i<result.length; i++){

													// Add options of select, checkbox and radio box options
													if(fields[i].options){
														for(j=0; j<fields[i].options.length; j++){
															options_data.push(new CustomFieldUserOptions({
																agency:result[i].agency,
																module: request.payload.module,
																custom_field_id: result[i]._id, 					
																option_name: fields[i].options[j],
																created_by: request.payload.created_by,
																updated_by: request.payload.created_by,
																status: 1
															}));
														}
													}	

													// Make json for log

													log.push(new LogCustomField({
														'operation':'Added a custom field ('+result[i].field_name+') in - '+result[i].form+' of '+request.payload.module_name+' module',	
														'custom_field_id':result[i]._id,
														'created_by':result[i].created_by,		
														'updated_by':result[i].updated_by,		
														'agency':result[i].agency,
														'module':result[i].module
													}))
												}
											}

											// Add the options 

											if(options_data.length > 0){								
												return CustomFieldUserOptions.insertMany(options_data).then((result) => {
													return { 'status': 100,  'msg': "Custom fields options added successfully", 'data': result }
												}).catch((err2) => { 										
													return {
														status: 101,
														msg: "Something went wrong while adding log."
													};
												}); 
											}

											return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
												 return { 'status': 100,  'msg': "Custom fields added successfully", 'data': result }
											 }).catch((err2) => { 
												return {
													status: 101,
													msg: "Something went wrong while adding log."
												};
											}); 
										}).catch((err) => {
											console.log(err);
											return {'status':101, 'msg':err}
										});
									}
								    else if(module == "order"){
										for(i=0; i<fields.length; i++){
											fields_data.push(new CustomFieldOrder({
												agency:request.payload.agency_id,
												module: request.payload.module,
												form: request.payload.form,
												field_type: fields[i].field_type,
												field_name: fields[i].field_name,
												description: fields[i].description,
												options: fields[i].options,
												placeholder:fields[i].placeholder,
												required:fields[i].required,
												name:fields[i].name,
												title:fields[i].title,
												created_by: request.payload.created_by,
												updated_by: request.payload.created_by,
												status: 1
											}));
										}							
										
									   	return CustomFieldOrder.insertMany(fields_data).then((result) => {
											if(result){
												var log = []
												for(i=0; i<result.length; i++){

													// Add options of select, checkbox and radio box options
													if(fields[i].options){
														for(j=0; j<fields[i].options.length; j++){
															options_data.push(new CustomFieldOrderOptions({
																agency:result[i].agency,
																module: request.payload.module,
																custom_field_id: result[i]._id,				
																option_name: fields[i].options[j],
																created_by: request.payload.created_by,
																updated_by: request.payload.created_by,
																status: 1
															}));
														}
													}	

													// Make json for log
													log.push(new LogCustomField({
														'operation':'Added a custom field ('+result[i].field_name+') in - '+result[i].form+' of '+request.payload.module_name+' module',	
														'custom_field_id':result[i]._id,
														'created_by':result[i].created_by,		
														'updated_by':result[i].updated_by,		
														'agency':result[i].agency,
														'module':result[i].module
													}))
												}
											}

											// Add the options 
											if(options_data.length > 0){								
												return CustomFieldOrderOptions.insertMany(options_data).then((result) => {
													return { 'status': 100,  'msg': "Custom fields options added successfully", 'data': result }
												}).catch((err2) => { 										
													return {
														status: 101,
														msg: "Something went wrong while adding log."
													};
												}); 
											}


											return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
												 return { 'status': 100,  'msg': "Custom fields added successfully", 'data': result }
											 }).catch((err2) => { 
												return {
													status: 101,
													msg: "Something went wrong while adding log."
												};
											}); 
										}).catch((err) => {
											console.log(err);
											return {'status':101, 'msg':err}
										});
									}
									else if(module == "vehicle_category"){
										for(i=0; i<fields.length; i++){
											fields_data.push(new CustomFieldVehicleCategory({
												agency:request.payload.agency_id,
												module: request.payload.module,
												form: request.payload.form,
												field_type: fields[i].field_type,
												field_name: fields[i].field_name,
												description: fields[i].description,
												options: fields[i].options,
												placeholder:fields[i].placeholder,
												required:fields[i].required,
												name:fields[i].name,
												title:fields[i].title,
												created_by: request.payload.created_by,
												updated_by: request.payload.created_by,
												status: 1
											}));
										}							
										
									   	return CustomFieldVehicleCategory.insertMany(fields_data).then((result) => {
											if(result){
												var log = []
												for(i=0; i<result.length; i++){

													// Add options of select, checkbox and radio box options
													if(fields[i].options){
														for(j=0; j<fields[i].options.length; j++){
															options_data.push(new CustomFieldVehicleCategoryOptions({
																agency:result[i].agency,
																module: request.payload.module,
																custom_field_id: result[i]._id,				
																option_name: fields[i].options[j],
																created_by: request.payload.created_by,
																updated_by: request.payload.created_by,
																status: 1
															}));
														}
													}	

													// Make json for log
													log.push(new LogCustomField({
														'operation':'Added a custom field ('+result[i].field_name+') in - '+result[i].form+' of '+request.payload.module_name+' module',	
														'custom_field_id':result[i]._id,
														'created_by':result[i].created_by,		
														'updated_by':result[i].updated_by,		
														'agency':result[i].agency,
														'module':result[i].module
													}))
												}
											}

											// Add the options 
											if(options_data.length > 0){								
												return CustomFieldVehicleCategoryOptions.insertMany(options_data).then((result) => {
													return { 'status': 100,  'msg': "Custom fields options added successfully", 'data': result }
												}).catch((err2) => { 										
													return {
														status: 101,
														msg: "Something went wrong while adding log."
													};
												}); 
											}


											return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
												 return { 'status': 100,  'msg': "Custom fields added successfully", 'data': result }
											 }).catch((err2) => { 
												return {
													status: 101,
													msg: "Something went wrong while adding log."
												};
											}); 
										}).catch((err) => {
											console.log(err);
											return {'status':101, 'msg':err}
										});
									}
								    else{
										return {
											status: 101,
											msg: "Module not found of this name."
										}
									}	
								}
							}
						}).catch((err) => {						
							return {
								status: 101,
								msg: err.message
							}
						})					
					
					}else{
						return {
							status: 101,
							msg: "Please add custom fields data in the api request parameter."
						}
					}
				}else{
					return {
						status: 101,
						msg: "Please add module parameter in the api request parameter."
					}
				}				
			}else{
				return {
					status: 101,
					msg: "Please add agency in the api request parameter."
				}
			}			
		}       
    },

    
	/* Fetch the custom fields as per the modules */
	getCustomFieldsOfModule: (req, h)=>{
		if (req.payload) {
			if(req.payload.agency_id && req.payload.agency_id != 0){
				var check_module = req.payload.module;
				if(check_module){
					if(req.payload.form){
						var match = {
										'agency':mongoose.Types.ObjectId(req.payload.agency_id),	
										'status': 1,
										"$or":[
									        {'form': req.payload.form},
									        {'form':'both'}
									    ]
									   						    
									};
						if(check_module == "role"){	
							return CustomFieldRole.aggregate([
		                      	{ $match: match},
		                     	{$project: { agency: 1, module: 1, form: 1, field_type: 1, field_name: 1, placeholder:1, required:1 }},
								{	$lookup:
								    {
								       from: 'custom_fields_role_options',								  
								       localField: '_id',
								       foreignField: 'custom_field_id',
								       as: 'options'
								    }
								}
		                    ]).exec().then((res) => {							
								return { 'status':100, 'msg':'Success','data':res }								
							}).catch((err) => {
							 	return { 'status': 101, 'msg': err, 'data': '' }
							});

						}else if(check_module == "order"){							 
							return CustomFieldOrder.aggregate([
		                      	{ $match: match},
		                     	{$project: { agency: 1, module: 1, form: 1, field_type: 1, field_name: 1, placeholder:1, required:1 }},
								{	$lookup:
								    {
								       from: 'custom_fields_order_options',								  
								       localField: '_id',
								       foreignField: 'custom_field_id',
								       as: 'options'
								    }
								}
		                    ]).exec().then((res) => {			                    						
								return { 'status':100, 'msg':'Success','data':res }								
							}).catch((err) => {
							 	return { 'status': 101, 'msg': err, 'data': '' }
							});	 	 

						}else if(check_module == "vehicle"){				
							return CustomFieldVehicle.aggregate([
		                      	{ $match: match},
		                     	{$project: { agency: 1, module: 1, form: 1, field_type: 1, field_name: 1, placeholder:1, required:1 }},
								{	$lookup:
								    {
								       from: 'custom_fields_vehicle_options',								  
								       localField: '_id',
								       foreignField: 'custom_field_id',
								       as: 'options'
								    }
								}
		                    ]).exec().then((res) => {		                   						
								return { 'status':100, 'msg':'Success','data':res }								
							}).catch((err) => {
							 	return { 'status': 101, 'msg': err, 'data': '' }
							});	 	 	 

						}else if(check_module == "service"){							
							return CustomFieldService.aggregate([
		                      	{ $match: match},
		                     	{$project: { agency: 1, module: 1, form: 1, field_type: 1, field_name: 1, placeholder:1, required:1 }},
								{	$lookup:
								    {
								       from: 'custom_fields_service_options',								  
								       localField: '_id',
								       foreignField: 'custom_field_id',
								       as: 'options'
								    }
								}
		                    ]).exec().then((res) => {			                    						
								return { 'status':100, 'msg':'Success','data':res }								
							}).catch((err) => {
							 	return { 'status': 101, 'msg': err, 'data': '' }
							});	 

						}else if(check_module == "user"){							
							return CustomFieldUser.aggregate([
		                      	{ $match: match},
		                     	{$project: { agency: 1, module: 1, form: 1, field_type: 1, field_name: 1, placeholder:1, required:1 }},
								{	$lookup:
								    {
								       from: 'custom_fields_user_options',								  
								       localField: '_id',
								       foreignField: 'custom_field_id',
								       as: 'options'
								    }
								}
		                    ]).exec().then((res) => {			                    						
								return { 'status':100, 'msg':'Success','data':res }								
							}).catch((err) => {
							 	return { 'status': 101, 'msg': err, 'data': '' }
							});	

						}else if(check_module == "crm"){
							return CustomFieldCRM.aggregate([
		                      	{ $match: match},
		                     	{$project: { agency: 1, module: 1, form: 1, field_type: 1, field_name: 1, placeholder:1, required:1 }},
								{	$lookup:
								    {
								       from: 'custom_fields_crm_options',								  
								       localField: '_id',
								       foreignField: 'custom_field_id',
								       as: 'options'
								    }
								}
		                    ]).exec().then((res) => {			                    						
								return { 'status':100, 'msg':'Success','data':res }								
							}).catch((err) => {
							 	return { 'status': 101, 'msg': err, 'data': '' }
							});

						}else if(check_module == "vehicle_category"){
							return CustomFieldVehicleCategory.aggregate([
		                      	{ $match: match},
		                     	{$project: { agency: 1, module: 1, form: 1, field_type: 1, field_name: 1, placeholder:1, required:1 }},
								{	$lookup:
								    {
								       from: 'custom_fields_vehicle_category_options',								  
								       localField: '_id',
								       foreignField: 'custom_field_id',
								       as: 'options'
								    }
								}
		                    ]).exec().then((res) => {			                    						
								return { 'status':100, 'msg':'Success','data':res }								
							}).catch((err) => {
							 	return { 'status': 101, 'msg': err, 'data': '' }
							});

						}
						else if(check_module == "equipment_category"){
							
							return CustomFieldEquipmentCategory.aggregate([
		                      	{ $match: match},
		                     	{$project: { agency: 1, module: 1, form: 1, field_type: 1, field_name: 1, placeholder:1, required:1 }},
								{	$lookup:
								    {
								       from: 'custom_fields_equipment_category_options',								  
								       localField: '_id',
								       foreignField: 'custom_field_id',
								       as: 'options'
								    }
								}
		                    ]).exec().then((res) => {			                    						
								return { 'status':100, 'msg':'Success','data':res }								
							}).catch((err) => {
							 	return { 'status': 101, 'msg': err, 'data': '' }
							});

						}
						else{
							/*return CustomField.find({'agency':req.payload.agency_id,$or: [ {form: req.payload.form}, {form:'both'}]}).exec().then((res) => {
								if(res){
									return {
										'status':100, 'msg':'Success','data':res
									}
								}
							}).catch((err) => {
								return { 'status': 101, 'msg': err, 'data': '' }
							});*/
							return { 'status': 101, 'msg': 'Module not found of this name for fetching custom fields.', 'data': '' }
						}
						 
					}else{
						return {
							status: 101,
							msg: "Please add form parameter in the api request parameter.",
							data:''
						}
					}
				}else{
					return {
						status: 101,
						msg: "Please add module parameter in the api request parameter.",
						data:''
					}
				}
			}else{
				return {
					status: 101,
					msg: "Please choose agency to fetch the custom fields of this form.",
					data:''
				}
			}			
		}
	},
	
	/* Fetch the custom fields as per the modules */
	getModulesAndInfo: (req, h)=>{
        var res = {
			 // 'modules': 
			 // [
				// "role", "order", "customer", "vehicle", "service", "user"
			 // ],
			 'forms':[
				 "add", "edit", "both"
			  ],
			 'types':[
				{
					type: "text",
					value: "Text"
				},
				{
					type: "checkbox",
					value: "Check Box"
				},
				{
					type: "date",
					value: "Date"
				},
				{
					type: "email",
					value: "Email"
				},
				{
					type: "select",
					value: "Select Dropdown"
				},
				/*{
					type: "file",
					value: "File"
				},*/
				{
					type: "image",
					value: "Image"
				},
				{
					type: "number",
					value: "Number"
				},
				{
					type: "password",
					value: "Password"
				},
				{
					type: "radio",
					value: "Radio Box"
				},
				{
					type: "checkbox",
					value: "Check Box"
				},
				{
					type: "url",
					value: "Url"
				},
				{
					type: "textarea",
					value: "Textarea"
				}
			]
			
		 }
		 return {
			 'status':100, 'msg':'Success','data':res
		 }
	},
	
    /* Get fields list */
    getFieldList: (request, h) => {
        if (request.payload) {
            const promise = new Promise((resolve, reject) => {
                let pdata = request.payload
                let search_value = ''
                let search_regex = ''
                let draw = pdata.draw
                let start = pdata.start
                let length = pdata.length
                let order = ''
                let module = ''
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
                                let c_sr = {
                                    [key]: { $regex: '.*' + pdata.search.value + '.*', $options: "s" }
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
                    "_id",
                    "field_type",
                    "field_name",
                    "placeholder",
                    "required",
                    "created_at"
                ]

                if (columns_valid[col]) {
                    order = columns_valid[col];
                } else {
                    order = null;
                }   
               	
                var form      = '';
				var agency_id = '';
				if("agency_id" in pdata){
					agency_id  = pdata.agency_id;
				}
				if("form" in pdata){
				   form   = pdata.form;
				}

                // Get the module name
                let get_module_name = self.getModuleName(pdata.module);
                
                return get_module_name.then((res) => {
                	
                	if(res.status == 100){
                		if(res.data){
                			let module = res.data;

			                let get_total_records = self.fieldsCount(agency_id, module, form, order, dir, column_search, search_value, search_regex);
			                get_total_records.then((res) => {
			                	if(res.status == 100){	

				                    let records = res.data			             
				                    let get_records = 0
				                    get_records = self.getFields(agency_id, module, form, start, length, order, dir, column_search, search_value, search_regex, fetch_columns);
				                    get_records.then((res) => {
				                        if(res.status == 100){
				                        	output = {
												"status":100,
												"msg": "Success",
					                            "recordsTotal": records,
					                            "recordsFiltered": records,
					                            "data": res.data
					                        }
					                        resolve(output)
				                        }else{
				                        	resolve(res)
				                        }
				                        
				                    }).catch((err) => {
				                    	console.log("error--->>", err);
										output = {
											"status":101,
											"msg": "Error! Please try again.",
				                            "recordsTotal": 0,
				                            "recordsFiltered": 0,
				                            "data": ''
				                        }
										resolve(output)
				                    })
			                	}else{
			                		resolve(res);
			                	}		                  

			                }).catch((err) => {			                	
			                    output = {
									"status":101,
									"msg": "Error! Please try again.",
									"recordsTotal": 0,
									"recordsFiltered": 0,
									"data": ''
								}
								resolve(output)
			                })
			            }else{
			            	resolve({ 'status': 101, 'msg': "Module does not find" , 'data': '' });
			            }
                	}else{
                		resolve({ 'status': 101, 'msg': err.message, 'data': '' });
                	}
                }).catch((err) => {
                	resolve({ 'status': 101, 'msg': err.message, 'data': '' });
                })                
            });
            return promise;
        }
    },

    // Get fields total count
    fieldsCount: function (agency_id, module, form, order, dir, column_search, search_value, search_regex) {
        const promise = new Promise((resolve, reject) => {
            let agency = {}
            if (agency_id) {
                agency = agency_id;
            }
			
            if (column_search.length) {
				if(module == "role"){
					//  Crmcustomer.aggregate([{
					//    $match: { $or: column_search }
					//  },
					//                { $count: "customers" },
					//                { $unwind: "$customers" }
					//                ]).exec().then((res) => {
					//                    if (res.length) {
					//                        resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].customers });
					//                    } else {
					//                        resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
					//                    }
					//                }).catch((err) => {
					//                    reject({ 'status': 101, 'msg': err, 'data': '' });
					//                });
				}
				else if(module == "order"){
					
				}
				else if(module == "user"){
					
				}
				else if(module == "crm"){
					
				}
				else if(module == "vehicle"){
					
				}
				else if(module == "service"){
					
				}
            } else {
            
				if(module == "role"){

					var condition = "";
					if(form){
						condition = { 'agency': agency_id, 'form':form }
					}else{
						condition = { 'agency': agency_id }
					}	
					CustomFieldRole.countDocuments(condition).exec().then((fields) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': fields });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});
				}
				else if(module == "order"){
					var condition = "";
					if(form){
						condition = { 'agency': agency_id, 'form':form }
					}else{
						condition = { 'agency': agency_id }
					}
					
					CustomFieldOrder.countDocuments(condition).exec().then((fields) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': fields });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});	 
				}
				else if(module == "user"){
					var condition = "";
					if(form){
						condition = { 'agency': agency_id, 'form':form }
					}else{
						condition = { 'agency': agency_id }
					}
					
					CustomFieldUser.countDocuments(condition).exec().then((fields) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': fields });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});	 			
				}
				else if(module == "crm"){
					var condition = "";
					if(form){
						condition = { 'agency': agency_id, 'form':form }
					}else{
						condition = { 'agency': agency_id }
					}
					
					CustomFieldCRM.countDocuments(condition).exec().then((fields) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': fields });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});
				}
				else if(module == "vehicle"){
					var condition = "";
					if(form){
						condition = { 'agency': agency_id, 'form':form }
					}else{
						condition = { 'agency': agency_id }
					}
					
					CustomFieldVehicle.countDocuments(condition).exec().then((fields) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': fields });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});
				}
				else if(module == "service"){
					var condition = "";
					if(form){
						condition = { 'agency': agency_id, 'form':form }
					}else{
						condition = { 'agency': agency_id }
					}
					
					CustomFieldService.countDocuments(condition).exec().then((fields) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': fields });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});				 
				}else if(module == "vehicle_category"){
					var condition = "";
					if(form){
						condition = { 'agency': agency_id, 'form':form }
					}else{
						condition = { 'agency': agency_id }
					}
					
					CustomFieldVehicleCategory.countDocuments(condition).exec().then((fields) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': fields });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});				 
				}else{
					resolve({ 'status': 101, 'msg': 'Module not found.', 'data': '' });
				}
            }
        });
        return promise;
    },

    // Get fields list
    getFields: function(agency_id, module, form, start, length, order, dir = 'asc', column_search, search_value, search_regex, fetch_columns) {
       
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
				if(module == "role"){
					CustomFieldRole.aggregate([
						//{ $addFields: { idStr: { $toString: '$_id' } } },
						//{ $addFields: { user_contactStr: { $toString: '$user_conatct' } } },
						{ $match: { $or: column_search } }, { $sort: sort },
						{ $skip: Number(start) }, { $limit: Number(length) },
						{ $project: fetch_columns }
					]).exec().then((roles) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': roles });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});
				}
				else if(module == "order"){
					
				}
				else if(module == "user"){
					
				}
				else if(module == "crm"){
					
				}
				else if(module == "vehicle"){
					
				}
				else if(module == "service"){
					
				}               
            } else {

             	var condition = '';
				if(agency_id){
				   if(form){
					   condition  = { "agency": agency_id, "form":form, "status":{"$ne":0} }
					}else{
						condition = { "agency": agency_id,"status":{"$ne":0} }
					}
				}else{
					if(form){
					   condition  = { "form":form, "status":{"$ne":0}  }
					}else{
						condition = { "status":{"$ne":0}  }
					}						 
				}

				if(module == "role"){
					CustomFieldRole.find(condition).sort(sort).skip(Number(start)).limit(Number(length)).exec().then((fields) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': fields });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});
				}
				else if(module == "order"){
					CustomFieldOrder.find(condition).sort(sort).skip(Number(start)).limit(Number(length)).exec().then((fields) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': fields });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});	
				}
				else if(module == "user"){				
					CustomFieldUser.find(condition).sort(sort).skip(Number(start)).limit(Number(length)).exec().then((fields) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': fields });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});						
				}
				else if(module == "crm"){									
					CustomFieldCRM.find(condition).sort(sort).skip(Number(start)).limit(Number(length)).exec().then((fields) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': fields });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});
				}
				else if(module == "vehicle"){
					CustomFieldVehicle.find(condition).sort(sort).skip(Number(start)).limit(Number(length)).exec().then((fields) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': fields });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});					
				}
				else if(module == "service"){
					CustomFieldService.find(condition).sort(sort).skip(Number(start)).limit(Number(length)).exec().then((fields) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': fields });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});
				}else if(module == "vehicle_category"){
					CustomFieldVehicleCategory.find(condition).sort(sort).skip(Number(start)).limit(Number(length)).exec().then((fields) => {
						resolve({ 'status': 100, 'msg': 'Success', 'data': fields });
					}).catch((err) => {
						reject({ 'status': 101, 'msg': err, 'data': '' });
					});
				} else{
					resolve({ 'status': 101, 'msg': 'Module not found.', 'data': '' });
				}
            }     

        });
        return promise
    },

    /* Delete custom field */
    delete: (request, h) => {
        if (!request.params._id) {
            return { status:101, msg: 'Custom field id is required' }
        }
        else{
			if(!request.params.module_id){
			   return { status:101, msg: 'Module id is required' }
			}else{
				//let module = request.params.module
				let get_module_name = self.getModuleName(request.params.module_id);
                
	            return get_module_name.then((res) => {
	            	if(res.status == 100){
	            		if(res.data){
	            			let module = res.data;
							if(module == "role"){
								return CustomFieldRole.findByIdAndUpdate(request.params._id,{status:0}).then((result) => {
									if(result){

										// Make json for log
										var log = {
											'operation':'Deleted the custom field - '+result.field_name+', of type '+result.field_type,	
											'created_by':result.created_by,		
											'updated_by':result.updated_by,		
											'agency_id':result.agency_id,
											'module':result.module,
											'custom_field_id':result._id
										}										
										return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
											return { 'status': 100,  'msg': "Custom field deleted successfully", 'data': result }
										 }).catch((err2) => { 
											return {
												status: 101,
												msg: "Something went wrong while adding log."
											};
										}); 
										
									}else{
										return { status:101, msg: 'Custom field is not found' }
									}
									//}
								}).catch((err) => {
									return { 'status': 100, 'msg': err.errmsg };
								});
							}
							else if(module == "vehicle"){
								return CustomFieldVehicle.findByIdAndUpdate(request.params._id,{status:0}).then((result) => {
									if(result){

										// Make json for log
										var log = {
											'operation':'Deleted the custom field - '+result.field_name+', of type '+result.field_type,	
											'created_by':result.created_by,		
											'updated_by':result.updated_by,		
											'agency_id':result.agency_id,
											'module':result.module,
											'custom_field_id':result._id
										}										
										return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
											 return { 'status': 100,  'msg': "Custom field deleted successfully", 'data': result }
										 }).catch((err2) => { 
											return {
												status: 101,
												msg: "Something went wrong while adding log."
											};
										}); 
										
									}else{
										return { status:101, msg: 'Custom field is not found' }
									}
								}).catch((err) => {
									return { 'status': 100, 'msg': err.errmsg };
								});
							}
							else if(module == "order"){
								return CustomFieldOrder.findByIdAndUpdate(request.params._id,{status:0}).then((result) => {
									if(result){

										// Make json for log
										var log = {
											'operation':'Deleted the custom field - '+result.field_name+', of type '+result.field_type,	
											'created_by':result.created_by,		
											'updated_by':result.updated_by,		
											'agency_id':result.agency_id,
											'module':result.module,
											'custom_field_id':result._id
										}										
										return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
											 return { 'status': 100,  'msg': "Custom field deleted successfully", 'data': result }
										 }).catch((err2) => { 
											return {
												status: 101,
												msg: "Something went wrong while adding log."
											};
										}); 
										
									}else{
										return { status:101, msg: 'Custom field is not found' }
									}
								}).catch((err) => {
									return { 'status': 100, 'msg': err.errmsg };
								});
							}
							else if(module == "service"){
								return CustomFieldService.findByIdAndUpdate(request.params._id,{status:0}).then((result) => {
									if(result){

										// Make json for log
										var log = {
											'operation':'Deleted the custom field - '+result.field_name+', of type '+result.field_type,	
											'created_by':result.created_by,		
											'updated_by':result.updated_by,		
											'agency_id':result.agency_id,
											'module':result.module,
											'custom_field_id':result._id
										}										
										return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
											 return { 'status': 100,  'msg': "Custom field deleted successfully", 'data': result }
										 }).catch((err2) => { 
											return {
												status: 101,
												msg: "Something went wrong while adding log."
											};
										}); 
										
									}else{
										return { status:101, msg: 'Custom field is not found' }
									}
								}).catch((err) => {
									return { 'status': 100, 'msg': err.errmsg };
								});
							}
							else if(module == "customer"){
								return CustomFieldCRM.findByIdAndUpdate(request.params._id,{status:0}).then((result) => {
									if(result){

										// Make json for log
										var log = {
											'operation':'Deleted the custom field - '+result.field_name+', of type '+result.field_type,	
											'created_by':result.created_by,		
											'updated_by':result.updated_by,		
											'agency_id':result.agency_id,
											'module':result.module,
											'custom_field_id':result._id
										}										
										return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
											 return { 'status': 100,  'msg': "Custom field deleted successfully", 'data': result }
										 }).catch((err2) => { 
											return {
												status: 101,
												msg: "Something went wrong while adding log."
											};
										}); 
										
									}else{
										return { status:101, msg: 'Custom field is not found' }
									}
								}).catch((err) => {
									return { 'status': 100, 'msg': err.errmsg };
								});
							}
							else if(module == "user"){
								return CustomFieldUser.findByIdAndUpdate(request.params._id,{status:0}).then((result) => {
									if(result){

										// Make json for log
										var log = {
											'operation':'Deleted the custom field - '+result.field_name+', of type '+result.field_type,	
											'created_by':result.created_by,		
											'updated_by':result.updated_by,		
											'agency_id':result.agency_id,
											'module':result.module,
											'custom_field_id':result._id
										}										
										return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
											 return { 'status': 100,  'msg': "Custom field deleted successfully", 'data': result }
										 }).catch((err2) => { 
											return {
												status: 101,
												msg: "Something went wrong while adding log."
											};
										}); 
										return { status:100, msg: 'Custom field deleted Successfully.' }
									}else{
										return { status:101, msg: 'Custom field is not found' }
									}
								}).catch((err) => {
									return { 'status': 100, 'msg': err.errmsg };
								});
							}	
							else{
								return { 'status': 101, 'msg': "Module does not exist" }
							}
						}
					}
				});
			}
		}		
    },
	
	edit:(request, h) => {
		if (!request.params._id) {
            return { status:101, msg: 'Custom field id is required' }
        }
        else{
			if(!request.payload.module){
			   return { status:101, msg: 'Module name is required' }
			}else{
				
				if(request.payload.fields.length > 0){
					let get_module_name = self.getModuleName(request.payload.module);
		            return get_module_name.then((res) => {
		            	if(res.status == 100){
		            		if(res.data){
		            			let module = res.data;		            			
		            			var field_data = request.payload.fields[0];

								if(module == "role"){
									return CustomFieldRole.findOneAndUpdate({ _id:request.params._id },{ $set: field_data },{ returnOriginal: false }).then((result) => {
										if(result){
											
											// Make json for log
											var log = {
												'operation':'Updated the custom field - '+result.field_name+', of type '+result.field_type,	
												'created_by':result.created_by,		
												'updated_by':result.updated_by,		
												'agency_id':result.agency_id,
												'module':result.module,
												'custom_field_id':result._id
											}										
											return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
												 return { 'status': 100,  'msg': "Custom field updated successfully", 'data': result }
											 }).catch((err2) => { 
												return {
													status: 101,
													msg: "Something went wrong while adding log."
												};
											}); 
											
										}else{
											return { status:101, msg: 'Custom field is not found' }
										}
										
									}).catch((err) => {
										return { 'status': 100, 'msg': err.errmsg };
									});
								}
								else if(module == "vehicle"){
									return CustomFieldVehicle.findOneAndUpdate({ _id:request.params._id },{ $set: field_data },{ returnOriginal: false }).then((result) => {
										if(result){

											// Make json for log
											var log = {
												'operation':'Updated the custom field - '+result.field_name+', of type '+result.field_type,	
												'created_by':result.created_by,		
												'updated_by':result.updated_by,		
												'agency_id':result.agency_id,
												'module':result.module,
												'custom_field_id':result._id
											}										
											return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
												 return { 'status': 100,  'msg': "Custom field updated successfully", 'data': result }
											 }).catch((err2) => { 
												return {
													status: 101,
													msg: "Something went wrong while adding log."
												};
											}); 
											
										}else{
											return { status:101, msg: 'Custom field is not found' }
										}
									}).catch((err) => {
										return { 'status': 100, 'msg': err.errmsg };
									});
								}
								else if(module == "order"){
									return CustomFieldOrder.findOneAndUpdate({ _id:request.params._id },{ $set:field_data},{ returnOriginal: false }).then((result) => {
										if(result){

											// Make json for log
											var log = {
												'operation':'Updated the custom field - '+result.field_name+', of type '+result.field_type,	
												'created_by':result.created_by,		
												'updated_by':result.updated_by,		
												'agency_id':result.agency_id,
												'module':result.module,
												'custom_field_id':result._id
											}										
											return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
												 return { 'status': 100,  'msg': "Custom field updated successfully", 'data': result }
											 }).catch((err2) => { 
												return {
													status: 101,
													msg: "Something went wrong while adding log."
												};
											}); 
											
										}else{
											return { status:101, msg: 'Custom field is not found' }
										}
									}).catch((err) => {
										return { 'status': 100, 'msg': err.errmsg };
									});
								}
								else if(module == "service"){
									return CustomFieldService.findOneAndUpdate({ _id:request.params._id },{ $set: field_data },{ returnOriginal: false }).then((result) => {
										if(result){

											// Make json for log
											var log = {
												'operation':'Updated the custom field - '+result.field_name+', of type '+result.field_type,	
												'created_by':result.created_by,		
												'updated_by':result.updated_by,		
												'agency_id':result.agency_id,
												'module':result.module,
												'custom_field_id':result._id
											}										
											return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
												 return { 'status': 100,  'msg': "Custom field updated successfully", 'data': result }
											 }).catch((err2) => { 
												return {
													status: 101,
													msg: "Something went wrong while adding log."
												};
											}); 
											
										}else{
											return { status:101, msg: 'Custom field is not found' }
										}
									}).catch((err) => {
										return { 'status': 100, 'msg': err.errmsg };
									});
								}
								else if(module == "custom_fields_crm_options"){
									return CustomFieldCRM.findOneAndUpdate({ _id:request.params._id },{ $set: field_data },{ returnOriginal: false }).then((result) => {
										if(result){

											// Make json for log
											var log = {
												'operation':'Updated the custom field - '+result.field_name+', of type '+result.field_type,	
												'created_by':result.created_by,		
												'updated_by':result.updated_by,		
												'agency_id':result.agency_id,
												'module':result.module,
												'custom_field_id':result._id
											}										
											return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
												 return { 'status': 100,  'msg': "Custom field updated successfully", 'data': result }
											 }).catch((err2) => { 
												return {
													status: 101,
													msg: "Something went wrong while adding log."
												};
											}); 
											
										}else{
											return { status:101, msg: 'Custom field is not found' }
										}
									}).catch((err) => {
										return { 'status': 100, 'msg': err.errmsg };
									});
								}
								else if(module == "user"){
									return CustomFieldUser.findOneAndUpdate({ _id:request.params._id },{ $set:field_data},{ returnOriginal: false }).then((result) => {
										if(result){

											// Make json for log
											var log = {
												'operation':'Updated the custom field - '+result.field_name+', of type '+result.field_type,	
												'created_by':result.created_by,		
												'updated_by':result.updated_by,		
												'agency_id':result.agency_id,
												'module':result.module,
												'custom_field_id':result._id
											}										
											return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
												 return { 'status': 100,  'msg': "Custom field updated successfully", 'data': result }
											 }).catch((err2) => { 
												return {
													status: 101,
													msg: "Something went wrong while adding log."
												};
											}); 
											
										}else{
											return { status:101, msg: 'Custom field is not found' }
										}
									}).catch((err) => {
										return { 'status': 101, 'msg': err.errmsg };
									});
								}
								else if(module == "vehicle_category"){
									return CustomFieldVehicleCategory.findOneAndUpdate({ _id:request.params._id },{ $set:field_data},{ returnOriginal: false }).then((result) => {
										if(result){

											// Make json for log
											var log = {
												'operation':'Updated the custom field - '+result.field_name+', of type '+result.field_type,	
												'created_by':result.created_by,		
												'updated_by':result.updated_by,		
												'agency_id':result.agency_id,
												'module':result.module,
												'custom_field_id':result._id
											}										
											return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
												 return { 'status': 100,  'msg': "Custom field updated successfully", 'data': result }
											 }).catch((err2) => { 
												return {
													status: 101,
													msg: "Something went wrong while adding log."
												};
											}); 
											
										}else{
											return { status:101, msg: 'Custom field is not found' }
										}
									}).catch((err) => {
										return { 'status': 101, 'msg': err.errmsg };
									});
								}
								else{
									return { 'status': 101, 'msg': "Module does not exist" }
								}
		            		}
		            	}
		            }).catch((err) => {
		            	return { 'status': 101, 'msg': err.message }
		            });
				}else{
					return {'status':101, 'msg':'Please send the field data.'}
				}				
			}
		}	
	},
	
	// Get the module name from module ID
	getModuleName : function ( module) {
		if(module){
			return Module.findById(module, {'slug':1, '_id':0}).then((name) => {  
				return { 'status': 100, 'msg': "Success", 'data':name.slug};
			}).catch((err) => {
				return { 'status': 101, 'msg': err.message };
			});
		}
	},

	getField: function (request, h){
		
		if(request.params.field_id){

			// Get the module name
			if(request.params.module_id){
				let get_module_name = self.getModuleName(request.params.module_id);
                
	            return get_module_name.then((res) => {
	            	if(res.status == 100){
	            		if(res.data){
	            			module = res.data;
	            			var match = { '_id': mongoose.Types.ObjectId(request.params.field_id) }
	            			if(module == "role"){

	            				return CustomFieldRole.aggregate([
			                        { $match: match },		    	
									{ $lookup:
									    { 
									        from: 'custom_fields_role_options',								  
									        localField: '_id',
									        foreignField: 'custom_field_id',									    
									        as: 'options'
									    }
									},
									{
									    "$project": {
									       "field_name": 1, "required" :1, "field_type": 1, "agency": 1, "module": 1, "form": 1, "description":1, "placeholder":1,
									        "options": {
										        "$filter": {
										          "input": "$options",
										          "as": "options",
										          "cond": { "$eq": ["$$options.status", 1] }
										        }
									        }
									    }
									}
																			           
			                    ]).exec().then((res) => {			           								
									return { 'status':100, 'msg':'Success','data':res }								
								}).catch((err) => {
								 	return { 'status': 101, 'msg': err.message, 'data': '' }
								});
	            				
	            			}else if(module == "vehicle"){
	            				return CustomFieldVehicle.aggregate([
			                      	{ $match: match},			                     	
									{ $lookup:
									    {
									       from: 'custom_fields_vehicle_options',								  
									       localField: '_id',
									       foreignField: 'custom_field_id',
									       as: 'options'
									    }
									},
									{
									    "$project": {
									       "field_name": 1, "required" :1, "field_type": 1, "agency": 1, "module": 1, "form": 1, "description":1, "placeholder":1,
									        "options": {
										        "$filter": {
										          "input": "$options",
										          "as": "options",
										          "cond": { "$eq": ["$$options.status", 1] }
										        }
									        }
									    }
									}
			                    ]).exec().then((res) => {			                    								
									return { 'status':100, 'msg':'Success','data':res }								
								}).catch((err) => {
								 	return { 'status': 101, 'msg': err.message, 'data': '' }
								});

	            			}
	            			else if(module == "order"){
	            				return CustomFieldOrder.aggregate([
			                      	{ $match: match},			                     	
									{ $lookup:
									    {
									       from: 'custom_fields_order_options',								  
									       localField: '_id',
									       foreignField: 'custom_field_id',
									       as: 'options'
									    }
									},
									{
									    "$project": {
									       "field_name": 1, "required" :1, "field_type": 1, "agency": 1, "module": 1, "form": 1, "description":1, "placeholder":1,
									        "options": {
										        "$filter": {
										          "input": "$options",
										          "as": "options",
										          "cond": { "$eq": ["$$options.status", 1] }
										        }
									        }
									    }
									}
			                    ]).exec().then((res) => {			                    								
									return { 'status':100, 'msg':'Success','data':res }								
								}).catch((err) => {
								 	return { 'status': 101, 'msg': err.message, 'data': '' }
								});
	            			}
	            			else if(module == "crm"){
	            				return CustomFieldCRMOptions.aggregate([
			                      	{ $match: match},			                     	
									{ $lookup:
									    {
									       from: 'custom_fields_crm_options',								  
									       localField: '_id',
									       foreignField: 'custom_field_id',
									       as: 'options'
									    }
									},
									{
									    "$project": {
									       "field_name": 1, "required" :1, "field_type": 1, "agency": 1, "module": 1, "form": 1, "description":1, "placeholder":1,
									        "options": {
										        "$filter": {
										          "input": "$options",
										          "as": "options",
										          "cond": { "$eq": ["$$options.status", 1] }
										        }
									        }
									    }
									}
			                    ]).exec().then((res) => {			                    								
									return { 'status':100, 'msg':'Success','data':res }								
								}).catch((err) => {
								 	return { 'status': 101, 'msg': err.message, 'data': '' }
								});
	            			}
				           
				        }else{
				            return { 'status': 101,  'msg': 'Agency ID is missing.' }
				        }   
				    }else{
				    	return { 'status': 101, 'msg': "Option not found." };
				    }
				}).catch((err) => {
					return { 'status': 101, 'msg': err.msg };
				})
			} else{
				return { 'status': 101, 'msg': 'Please send the module to which the field belongs.' };
			}           
        } else{
			return { 'status': 101, 'msg': 'Please send the custom field id to get its detail.' };
		} 
	},

	// Change status of the custom field to active from inactive and vice versa.
	changeFieldStatus: function(request, h){
		if(request.params.field_id){

			// Get the module name
			if(request.payload){
				if(request.payload.module_id){
					if('status' in request.payload && request.payload.status){
						let get_module_name = self.getModuleName(request.payload.module_id);
	                
			            return get_module_name.then((res) => {
			            	if(res.status == 100){
			            		if(res.data){
			            			module = res.data;
			            			
			            			if(module == "role"){			            				
			            				return CustomFieldRole.findByIdAndUpdate({_id:request.params.field_id},{status:request.payload.status}, {new:true}).exec().then((res) => {	
			            					                    								
											return { 'status':100, 'msg':'Success','data':res }								
										}).catch((err) => {
										 	return { 'status': 101, 'msg': err, 'data': '' }
										});
									}
								}
							}
						});
					}else{
						return { 'status': 101, 'msg': 'Please send the status to change.' };
					}						
				}else{
					return { 'status': 101, 'msg': 'Please send the module to which the field belongs.' };
				}
			}else{
				return { 'status': 101, 'msg': 'Please send the request parameters.' };
			}			
		}else{
			return { 'status': 101, 'msg': 'Please send the custom field id to change the status.' };
		} 
	},

	//Add option in the existing custom field
	addOption: (request, h) => {
		if(!request.params.id){
			return { 'status': 101, 'msg': 'Please add the custom field id to which add the option.' }
		}
		if(!request.params.module){
			return { 'status': 101, 'msg': 'Please add the module id to which add the option.' }
		}
		let get_module_name = self.getModuleName(request.params.module);
                
        return get_module_name.then((res) => {
        	if(res.status == 100){
        		if(res.data){
        			let module = res.data;
        			
					if(module == "role"){
						var add_data = new CustomFieldRoleOptions(request.payload);
						return CustomFieldRoleOptions.create(add_data).then((result) => {
							
							// Make json for log
							var log = {
								'operation':'Added the new custom field option- '+result.option_name+', having id '+result._id,	
								'created_by':result.created_by,		
								'updated_by':result.updated_by,		
								'agency':result.agency,
								'module':request.params.module,
								'custom_field_id':result.custom_field_id
							}										
							return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
								return { 'status': 100,  'msg': "Custom field option added successfully", 'data': result }
							 }).catch((err2) => { 
								return {
									status: 101,
									msg: "Something went wrong while adding log."
								};
							}); 										
						})
					}else if(module == "vehicle"){
						var add_data = new CustomFieldVehicleOptions(request.payload);
						return CustomFieldVehicleOptions.create(add_data).then((result) => {
							
							// Make json for log
							var log = {
								'operation':'Added the new custom field option- '+result.option_name+', having id '+result._id,	
								'created_by':result.created_by,		
								'updated_by':result.updated_by,		
								'agency':result.agency,
								'module':request.params.module,
								'custom_field_id':result.custom_field_id
							}										
							return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
								return { 'status': 100,  'msg': "Custom field option added successfully", 'data': result }
							 }).catch((err2) => { 
								return {
									status: 101,
									msg: "Something went wrong while adding log."
								};
							}); 										
						})
					}else if(module == "order"){
						var add_data = new CustomFieldOrderOptions(request.payload);
						return CustomFieldOrderOptions.create(add_data).then((result) => {
							
							// Make json for log
							var log = {
								'operation':'Added the new custom field option- '+result.option_name+', having id '+result._id,	
								'created_by':result.created_by,		
								'updated_by':result.updated_by,		
								'agency':result.agency,
								'module':request.params.module,
								'custom_field_id':result.custom_field_id
							}										
							return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
								return { 'status': 100,  'msg': "Custom field option added successfully", 'data': result }
							 }).catch((err2) => { 
								return {
									status: 101,
									msg: "Something went wrong while adding log."
								};
							}); 										
						})
					}else if(module == "service"){
						var add_data = new CustomFieldServiceOptions(request.payload);
						return CustomFieldServiceOptions.create(add_data).then((result) => {
							
							// Make json for log
							var log = {
								'operation':'Added the new custom field option- '+result.option_name+', having id '+result._id,	
								'created_by':result.created_by,		
								'updated_by':result.updated_by,		
								'agency':result.agency,
								'module':request.params.module,
								'custom_field_id':result.custom_field_id
							}										
							return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
								return { 'status': 100,  'msg': "Custom field option added successfully", 'data': result }
							 }).catch((err2) => { 
								return {
									status: 101,
									msg: "Something went wrong while adding log."
								};
							}); 										
						})
					}else if(module == "crm"){
						var add_data = new CustomFieldCRMOptions(request.payload);
						return CustomFieldCRMOptions.create(add_data).then((result) => {
							
							// Make json for log
							var log = {
								'operation':'Added the new custom field option- '+result.option_name+', having id '+result._id,	
								'created_by':result.created_by,		
								'updated_by':result.updated_by,		
								'agency':result.agency,
								'module':request.params.module,
								'custom_field_id':result.custom_field_id
							}										
							return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
								return { 'status': 100,  'msg': "Custom field option added successfully", 'data': result }
							 }).catch((err2) => { 
								return {
									status: 101,
									msg: "Something went wrong while adding log."
								};
							}); 										
						})
					}else if(module == "user"){
						var add_data = new CustomFieldUserOptions(request.payload);
						return CustomFieldUserOptions.create(add_data).then((result) => {
							
							// Make json for log
							var log = {
								'operation':'Added the new custom field option- '+result.option_name+', having id '+result._id,	
								'created_by':result.created_by,		
								'updated_by':result.updated_by,		
								'agency':result.agency,
								'module':request.params.module,
								'custom_field_id':result.custom_field_id
							}										
							return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
								return { 'status': 100,  'msg': "Custom field option added successfully", 'data': result }
							 }).catch((err2) => { 
								return {
									status: 101,
									msg: "Something went wrong while adding log."
								};
							}); 										
						})
					}else if(module == "vehicle_category"){
						var add_data = new CustomFieldVehicleCategoryOptions(request.payload);
						return CustomFieldVehicleCategoryOptions.create(add_data).then((result) => {
							
							// Make json for log
							var log = {
								'operation':'Added the new custom field option- '+result.option_name+', having id '+result._id,	
								'created_by':result.created_by,		
								'updated_by':result.updated_by,		
								'agency':result.agency,
								'module':request.params.module,
								'custom_field_id':result.custom_field_id
							}										
							return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
								return { 'status': 100,  'msg': "Custom field option added successfully", 'data': result }
							 }).catch((err2) => { 
								return {
									status: 101,
									msg: "Something went wrong while adding log."
								};
							}); 										
						})
					}
				}
			}
		}).catch((err) => {
			 return { status:101, msg: err.message }
		});
	},

	// Delete custom selectional field option 
    deleteOption: (request, h) => {
        if (!request.params._id || request.params._id == 'undefined') {
            return { status:101, msg: 'Option id is required.' }
        }
        else{
			if(!request.params.module_id){
			   return { status:101, msg: 'Module id is required' }
			}else{				
				let get_module_name = self.getModuleName(request.params.module_id);                
	            return get_module_name.then((res) => {
	            	if(res.status == 100){
	            		if(res.data){
	            			let module = res.data;
							if(module == "role"){
								return CustomFieldRoleOptions.findByIdAndUpdate(request.params._id,{status:0}).then((result) => {
									if(result){

										// Make json for log
										var log = {
											'operation':'Deleted the custom field option- '+result.option_name+', having id '+result._id,	
											'created_by':result.created_by,		
											'updated_by':result.updated_by,		
											'agency':result.agency,
											'module':request.params.module_id,
											'custom_field_id':result.custom_field_id
										}										
										return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
											return { 'status': 100,  'msg': "Custom field option deleted successfully", 'data': result }
										 }).catch((err2) => { 
											return {
												status: 101,
												msg: "Something went wrong while adding log."
											};
										}); 
										
									}else{
										return { status:101, msg: 'Custom field option is not found' }
									}
									
								}).catch((err) => {
									return { 'status': 101, 'msg': err.message };
								});
							}
							else if(module == "vehicle"){
								return CustomFieldVehicleOptions.findByIdAndUpdate(request.params._id,{status:0}).then((result) => {
									if(result){

										// Make json for log
										var log = {
											'operation':'Deleted the custom field option- '+result.option_name+', having id '+result._id,	
											'created_by':result.created_by,		
											'updated_by':result.updated_by,		
											'agency':result.agency,
											'module':request.params.module_id,
											'custom_field_id':result.custom_field_id
										}										
										return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
											 return { 'status': 100,  'msg': "Custom field option deleted successfully", 'data': result }
										 }).catch((err2) => { 
											return {
												status: 101,
												msg: "Something went wrong while adding log."
											};
										}); 
										
									}else{
										return { status:101, msg: 'Custom field option is not found' }
									}
								}).catch((err) => {
									return { 'status': 100, 'msg': err.errmsg };
								});
							}
							else if(module == "order"){
								return CustomFieldOrderOptions.findByIdAndUpdate(request.params._id,{status:0}).then((result) => {
									if(result){

										// Make json for log
										var log = {
											'operation':'Deleted the custom field option- '+result.option_name+', having id '+result._id,	
											'created_by':result.created_by,		
											'updated_by':result.updated_by,		
											'agency':result.agency,
											'module':request.params.module_id,
											'custom_field_id':result.custom_field_id
										}										
										return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
											 return { 'status': 100,  'msg': "Custom field option deleted successfully", 'data': result }
										 }).catch((err2) => { 
											return {
												status: 101,
												msg: "Something went wrong while adding log."
											};
										}); 
										
									}else{
										return { status:101, msg: 'Custom field option is not found' }
									}
								}).catch((err) => {
									return { 'status': 100, 'msg': err.errmsg };
								});
							}
							else if(module == "service"){
								return CustomFieldServiceOptions.findByIdAndUpdate(request.params._id,{status:0}).then((result) => {
									if(result){

										// Make json for log
										var log = {
											'operation':'Deleted the custom field option- '+result.option_name+', having id '+result._id,	
											'created_by':result.created_by,		
											'updated_by':result.updated_by,		
											'agency':result.agency,
											'module':request.params.module_id,
											'custom_field_id':result.custom_field_id
										}										
										return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
											 return { 'status': 100,  'msg': "Custom field option deleted successfully", 'data': result }
										 }).catch((err2) => { 
											return {
												status: 101,
												msg: "Something went wrong while adding log."
											};
										}); 
										
									}else{
										return { status:101, msg: 'Custom field option is not found' }
									}
								}).catch((err) => {
									return { 'status': 100, 'msg': err.errmsg };
								});
							}
							else if(module == "crm"){
								return CustomFieldCRMOptions.findByIdAndUpdate(request.params._id,{status:0}).then((result) => {
									if(result){

										// Make json for log
										var log = {
											'operation':'Deleted the custom field option- '+result.option_name+', having id '+result._id,	
											'created_by':result.created_by,		
											'updated_by':result.updated_by,		
											'agency':result.agency,
											'module':request.params.module_id,
											'custom_field_id':result.custom_field_id
										}										
										return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
											 return { 'status': 100,  'msg': "Custom field option deleted successfully", 'data': result }
										 }).catch((err2) => { 
											return {
												status: 101,
												msg: "Something went wrong while adding log."
											};
										}); 
										
									}else{
										return { status:101, msg: 'Custom field option is not found' }
									}
								}).catch((err) => {
									return { 'status': 100, 'msg': err.errmsg };
								});
							}
							else if(module == "user"){
								return CustomFieldUserOptions.findByIdAndUpdate(request.params._id,{status:0}).then((result) => {
									if(result){

										// Make json for log
										var log = {
											'operation':'Deleted the custom field option- '+result.option_name+', having id '+result._id,	
											'created_by':result.created_by,		
											'updated_by':result.updated_by,		
											'agency':result.agency,
											'module':request.params.module_id,
											'custom_field_id':result.custom_field_id
										}										
										return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
											 return { 'status': 100,  'msg': "Custom field option deleted successfully", 'data': result }
										 }).catch((err2) => { 
											return {
												status: 101,
												msg: "Something went wrong while adding log."
											};
										}); 
										return { status:100, msg: 'Custom field option deleted Successfully.' }
									}else{
										return { status:101, msg: 'Custom field option is not found' }
									}
								}).catch((err) => {
									return { 'status': 100, 'msg': err.errmsg };
								});
							}
							else if(module == "vehicle_category"){
								return CustomFieldVehicleCategoryOptions.findByIdAndUpdate(request.params._id,{status:0}).then((result) => {
									if(result){

										// Make json for log
										var log = {
											'operation':'Deleted the custom field option- '+result.option_name+', having id '+result._id,	
											'created_by':result.created_by,		
											'updated_by':result.updated_by,		
											'agency':result.agency,
											'module':request.params.module_id,
											'custom_field_id':result.custom_field_id
										}										
										return Log.addLog(log, 'log_customfields').then((addedfieldslog) => {
											 return { 'status': 100,  'msg': "Custom field option deleted successfully", 'data': result }
										 }).catch((err2) => { 
											return {
												status: 101,
												msg: "Something went wrong while adding log."
											};
										}); 
										return { status:100, msg: 'Custom field option deleted Successfully.' }
									}else{
										return { status:101, msg: 'Custom field option is not found' }
									}
								}).catch((err) => {
									return { 'status': 100, 'msg': err.errmsg };
								});
							}	
							else{
								return { 'status': 101, 'msg': "Module does not exist" }
							}
						}
					}
				});
			}
		}		
    },
}