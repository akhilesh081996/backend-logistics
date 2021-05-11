var Role            = require('../models/role');
var Module          = require('../models/module')
/*var Agency          = require('../models/agency');
var Driver          = require('../models/driver');
var LogRole         = require('../models/log_roles');
var LogAgency       = require('../models/log_agencies');
var LogUser         = require('../models/log_users');
var LogCrm          = require('../models/log_crm');
var LogOrder        = require('../models/log_orders');
var LogOrderStage   = require('../models/log_order_stages');
var LogVehicle      = require('../models/log_vehicles');
var LogService      = require('../models/log_services');
var LogModule       = require('../models/log_modules');
var LogAgencyModule = require('../models/log_agency_modules');
var LogCustomField  = require('../models/log_custom_fields');*/


var self = module.exports = {
	
	// Get the module name from module ID
	getModuleName : function ( module) {
		if(module){
			return Module.findById(module, {'module_name':1, '_id':0}).then((name) => {  
				return { 'status': 100, 'msg': "Success", 'data':name.module_name};
			}).catch((err) => {
				return { 'status': 101, 'msg': err.message };
			});;
		}
	},

	// Get the role name from role ID
	getRoleName : function ( module) {
		if(module){
			return Role.findById(module, {'role_name':1, '_id':0}).then((role) => {  
				if(role){
					var trim_string = role.role_name.trim();
					rolename = trim_string.replace(" ", "_").toLowerCase();
					return { 'status': 100, 'msg': "Success", 'data':rolename};
				}else{
					return { 'status': 101, 'msg': err.message };
				}				
			}).catch((err) => {
				return { 'status': 101, 'msg': err.message };
			});;
		}
	},
}

