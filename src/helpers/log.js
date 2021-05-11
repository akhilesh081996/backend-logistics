var Agency               = require('../models/agency');
var Driver               = require('../models/driver');
var Role                 = require('../models/role');
var LogRole              = require('../models/log_roles');
var LogAgency            = require('../models/log_agencies');
var LogUser              = require('../models/log_users');
var LogCrm               = require('../models/log_crm');
var LogOrder             = require('../models/log_orders');
var LogOrderStage        = require('../models/log_order_stages');
var LogVehicle           = require('../models/log_vehicles');
var LogService           = require('../models/log_services');
var LogModule            = require('../models/log_modules');
var LogAgencyModule      = require('../models/log_agency_modules');
var LogCustomField       = require('../models/log_custom_fields');
var LogVehicleCategory   = require('../models/log_vehicle_category');
var LogEquipmentCategory = require('../models/log_equipment_category');
var LogTax               = require('../models/log_tax');

var self = module.exports = {
	addLog: (req, module) => {
       
		if(module == "log_roles"){
			var logrole = new LogRole({
				operation: req.operation,
				role: req.role,
				agency: req.agency,
				created_by: req.created_by,
				updated_by: req.updated_by,
				old_payload:req.old_payload,
				new_payload:req.new_payload
			}); 
			
			return LogRole.create(logrole).then((role) => {
				if (role) {
					return { 'status': 100,  'msg': "Success", 'data': role }
				}
			}).catch((err) => {
				return { 'status': 101,  'msg': err.messagemessage }
			});
		}
		else if(module == "log_agency"){
			var logagency = new LogAgency({
				operation: req.operation,
				agency: req.agency,
				created_by: req.created_by,
				updated_by: req.updated_by,
				old_payload:req.old_payload,
				new_payload:req.new_payload
			}); 
			return LogAgency.create(logagency).then((user) => {
				if (user) {
					return { 'status': 100,  'msg': "Success", 'data': user }
				}
			}).catch((err) => {
				
				return { 'status': 101,  'msg': err.message }
			});
		}
		else if(module == "log_users"){
			var loguser = new LogUser({
				operation: req.operation,
				user: req.user,
				agency: req.agency,
				created_by: req.created_by,
				updated_by: req.updated_by,
				'old_payload':req.old_payload,
				'new_payload':req.new_payload
			}); 
			
			return LogUser.create(loguser).then((user) => {
				if (user) {
					return { 'status': 100,  'msg': "Success", 'data': user }
				}
			}).catch((err) => {				
				return { 'status': 101,  'msg': err.message }
			});
		}		
		else if(module == "log_crm"){
			var logcrm = new LogCrm({
				operation: req.operation,
				customer: req.customer,
				agency: req.agency,
				created_by: req.created_by,
				updated_by: req.updated_by,
				'old_payload':req.old_payload,
				'new_payload':req.new_payload,
			}); 
			return LogCrm.create(logcrm).then((crm) => {
				if (crm) {
					return { 'status': 100,  'msg': "Success", 'data': crm }
				}
			}).catch((err) => {
				return { 'status': 101,  'msg': err.messagemessage }
			});
		}		
		else if(module == "log_orders"){
			var logorder = new LogOrder({
				operation: req.operation,
				order_item: req.orderitem,
				order: req.order,
				agency: req.agency,
				created_by: req.created_by,
				updated_by: req.updated_by,
				'old_payload':req.old_payload,
				'new_payload':req.new_payload,
			}); 
			return LogOrder.create(logorder).then((order) => {
				if (order) {
					return { 'status': 100,  'msg': "Success" }
				}
			}).catch((err) => {
				return { 'status': 101,  'msg': err.message }
			});
		}
		else if(module == "log_order_stages"){
			var logorderstage = new LogOrderStage({
				operation: req.operation,
				order_stage: req.order_stage,
				agency: req.agency,
				created_by: req.created_by,
				updated_by: req.updated_by,
				'old_payload':req.old_payload,
				'new_payload':req.new_payload,
			}); 
			
			return LogOrderStage.create(logorderstage).then((order) => {				
				if (order) {
					return { 'status': 100,  'msg': "Success" }
				}
			}).catch((err) => {				
				return { 'status': 101,  'msg': err.message }
			});
		}
		else if(module == "log_vehicles"){
			var logvehicle = new LogVehicle({
				operation: req.operation,
				registration_no: req.registration_no,
				vehicle: req.vehicle,
				agency: req.agency,
				created_by: req.created_by,
				updated_by: req.updated_by,
				old_payload:req.old_payload,
				new_payload:req.new_payload,
			}); 
			return LogVehicle.create(logvehicle).then((vehicle) => {
				if (vehicle) {
					return { 'status': 100,  'msg': "Success" }
				}
			}).catch((err) => {
				return { 'status': 101,  'msg': err.message }
			});
		}
		else if(module == "log_vehicle_category"){
			var logvehiclecat = new LogVehicleCategory({
				operation: req.operation,
				category_name: req.category_name,				
				agency: req.agency,
				vehicle_category: req.category_id,
				created_by: req.created_by,
				updated_by: req.updated_by,
				old_payload:req.old_payload,
				new_payload:req.new_payload,
			}); 
			return LogVehicleCategory.create(logvehiclecat).then((vehicle) => {
				if (vehicle) {
					return { 'status': 100,  'msg': "Success" }
				}
			}).catch((err) => {
				return { 'status': 101,  'msg': err.message }
			});
		}
		else if(module == "log_equipment_category"){
			var logequipmentcat = new LogEquipmentCategory({
				operation: req.operation,
				category_name: req.category_name,				
				agency: req.agency,
				equipment_category: req.category_id,
				created_by: req.created_by,
				updated_by: req.updated_by,
				old_payload:req.old_payload,
				new_payload:req.new_payload,
			}); 
			
			return LogEquipmentCategory.create(logequipmentcat).then((equipment_category) => {				
				if (equipment_category) {
					return { 'status': 100,  'msg': "Success" }
				}
			}).catch((err) => {
				return { 'status': 101,  'msg': err.message }
			});
		}
		else if(module == "log_customfields"){			
			return LogCustomField.insertMany(req).then((fields) => {				
				if (fields) {
					return { 'status': 100,  'msg': "Success" }
				}
			}).catch((err) => {				
				return { 'status': 101,  'msg': err.message }
			});
		}
		else if(module == "log_modules"){
			var logmodule = new LogModule({
				operation: req.operation,
				module_id: req.module_id,
				created_by: req.created_by,
				updated_by: req.updated_by
			}); 
			return LogModule.create(logmodule).then((module) => {
				if (module) {
					return { 'status': 100,  'msg': "Success" }
				}
			}).catch((err) => {
				return { 'status': 101,  'msg': err.message }
			});
		}
		else if(module == "log_agency_modules"){
			var logagencymodule = new LogAgencyModule({
				operation: req.operation,
				agency_module_id: req.agency_module_id,
				created_by: req.created_by,
				updated_by: req.updated_by
			}); 
			return LogAgencyModule.create(logagencymodule).then((module) => {
				
				if (module) {
					return { 'status': 100,  'msg': "Success" }
				}
			}).catch((err) => {
				
				return { 'status': 101,  'msg': "Error" }
			});
		}
		else if(module == "log_services"){
			
			var logservicemodule = new LogService({
				operation: req.operation,
				service: req.service,
				vehicle: req.vehicle,
				agency: req.agency,
				created_by: req.created_by,
				updated_by: req.updated_by,
				old_payload:req.old_payload,
				new_payload:req.new_payload,
			}); 
			return LogService.create(logservicemodule).then((service) => {
				if (service) {
					return { 'status': 100,  'msg': "Success" }
				}
			}).catch((err) => {
				return { 'status': 101,  'msg': "Error" }
			});
		}
		else if(module == "log_tax"){
			
			var logtax = new LogTax({
				operation: req.operation,
				tax: req.tax,				
				agency: req.agency,
				created_by: req.created_by,
				updated_by: req.updated_by,
				old_payload:req.old_payload,
				new_payload:req.new_payload,
			}); 
			return LogTax.create(logtax).then((tax) => {
				if (tax) {
					return { 'status': 100,  'msg': "Success" }
				}
			}).catch((err) => {
				return { 'status': 101,  'msg': "Error" }
			});
		}
    },
}

