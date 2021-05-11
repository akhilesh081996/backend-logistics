const weblogin = require('./include_web');
const storage = require('node-sessionstorage');  
var login
var jwt = require('jsonwebtoken');
//var headerValidator = require('../middleware/headerValidator.js');
const auth = require('../middleware/tokenValidator.js');

const requireLogin = function(request, reply ) {
    if (storage.getItem('isLogin')) {
        return login = true
    } else {
        return login = false
    }
}

// FORMAT OF TOKEN
// Bearer <token>
module.exports = [{
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/',
        handler: function(req, h) {
            return h.view('comingsoon', {
                title: 'Using handlebars in Hapi',
                message: 'Tutorial'
            }, { layout: 'another_layout' });
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        method: 'POST',
        path: '/login',
        handler: function(req, h) {
            return weblogin.weblogin.verifylogin(req, h)
        }
    },
	{
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
			}
        },
        method: 'POST',
        path: '/register',
        handler: (request, h) => {
            return weblogin.webregister.agencyRegister(request, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/logout',
        handler: function(req, h) {
            return weblogin.weblogin.logout(req, h)
        }
    },
				  
	// Agency apis
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/add_agency',
        handler: (request, h) => {
            return weblogin.webagency.registeragency(request, h);
        }
    },
    {
        config:{
            cors:{
                origin:['*'],
                additionalHeaders:['cache-control','x-requested-with']              
            },
            auth:"AdminJWT",
        },
        method:'PATCH',
        path:'/change_agency_status/{_id}',
        handler:(request,h) =>{
            return weblogin.webagency.changeStatus(request,h);
        }
    },
    /* Validation routes for agency */
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/validate_agency',
        handler: (request, h) => {
            return weblogin.webagency.validateAgency(request, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
        },
        method: 'POST',
        path: '/validate_agency_name',
        handler: (request, h) => {
            return weblogin.webagency.validateAgencyname(request, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/validate_agency_email',
        handler: (request, h) => {
            return weblogin.webagency.validateAgencyemail(request, h);

        }
    },
    /* End */
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/all_agencies',
        handler: function(request, h) {
            return weblogin.webagency.getAllAgencies(request, h)
        }
    },


    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
          
        },
        method: 'POST',
        path: '/agencies',
        handler: function(request, h) {
            return weblogin.webagency.fetch_ajax(request, h)
        }
    },

    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/get_agency_detail/{_id}',
        handler: weblogin.webagency.getAgencydetail
    },

    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
			 auth:"AdminJWT",
        },
        method: 'PUT',
        path: '/update_agency/{id}',
        handler: weblogin.webagency.updateAgency
    },

    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/delete_agency/{_id}',
        handler: weblogin.webagency.deleteAgency
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
        },
        method: 'GET',
        path: '/{slug}',
        handler: weblogin.webagency.findSlag
    },
    
    // Add the new role
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/add_role',
        handler: weblogin.webrole.addRole
    },
    
    // Get role detail by id
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
        },
        method: 'GET',
        path: '/get_role_detail/{id}',
        handler: weblogin.webrole.getRoleDetail
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/roles',
        handler: (request, h) => {
            return weblogin.webrole.fetch_ajax(request, h);
        }
    },

    // Update role
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'PUT',
        path: '/update_role/{_id}',
        handler: (request, h) => {
            return weblogin.webrole.update(request, h);
        }
    },

    // Delete role
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'DELETE',
        path: '/delete_role/{_id}',
        handler: (request, h) => {
            return weblogin.webrole.deleteRole(request, h);
        }
    },

    // Get roles by agency
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/agency_roles/{agency_id}',
        handler: weblogin.webrole.getAgencyRoles
    },

    // Customer APIS
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
        },
        method: 'POST',
        path: '/add_customer',
        handler: (request, h) => {
            return weblogin.webcrm.add(request, h);
        }
    },

    //Edit the customer
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'PUT',
        path: '/update_customer/{_id}',
        handler: (request, h) => {
            return weblogin.webcrm.update(request, h);
        }
    },

    //Validation for customer
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/validate_customer',
        handler: (request, h) => {
            return weblogin.webcrm.validateCRM(request, h);
        }
    },

    // Get the customers list
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/customers',
        handler: (request, h) => {
            return weblogin.webcrm.fetch_ajax(request, h);
        }
    },
       {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/all_customers',
        handler: function(request, h) {
            return weblogin.webcrm.getAllCustomers(request, h)
        }
    },
   
    // Delete cutomer
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'DELETE',
        path: '/delete_customer/{_id}',
        handler: (request, h) => {
            return weblogin.webcrm.delete(request, h);
        }
    },

    //Get customer detail by ID
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/get_customer_detail/{_id}',
        handler: function(req, h) {
            return weblogin.webcrm.getCustomerDetail(req, h);
        }
    },

    // Get recent customers list    
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/recent_customers/{agency_id?}',
        handler: (request, h) => {
            return weblogin.webcrm.getRecentCustomers(request, h);
        }
    },

    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/invoice_list',
        handler: (request, h) => {
            return weblogin.webinvoicelist.fetch(request, h);
        }
    },
    
    // Get users
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/users',
        handler: (request, h) => {
            return weblogin.webuserList.fetch(request, h);
        }
    },

    // Get users for the attendance module
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/all_attendance_users',
        handler: (request, h) => {
            return weblogin.webuserList.fetchAttendanceUsers(request, h);
        }
    },

    // Get users for the attendance module
    {
        method: 'POST',
        path: '/user_attendance_between_dates',        
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },  
        handler: (request, h) => {
            return weblogin.webAttendance.getUserAttendanceBetweenDates(request, h);
        }    
    },

    //Get Recent 5 users
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/recent_users/{agency_id?}',
        handler: (request, h) => {
            return weblogin.webuserList.getRecentUsers(request, h);
        }
    },
    // Add user 
    {
        method: 'POST',
        path: '/add_user/{id?}',
        config: {
          /*  payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                //objectMode: true
            },*/
			 cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT"
		},
		handler: (request, h) => {
			return weblogin.webuserList.add(request, h);
		}
    },
    // validation  
    {
        method: 'POST',
        path: '/validate_user',
        handler: (request, h) => {
            return weblogin.webuserList.validateUser(request, h);
        }
    },
    /* End */
    {
        method: 'GET',
        path: '/roles/{id}',
        handler: (request, h) => {
            return weblogin.webuserList.getRoles(request, h);
        }
    },

    /* Add user profile picture route */
    {
        method: 'POST',
        path: '/add_file',
        config: {
            payload: {
                output: "stream",
                parse: true,
                allow: "multipart/form-data",
            },
            auth:"AdminJWT",
        },
        handler: (request, h) => {
            return weblogin.webFiles.add(request, h);
        }

    },
				  
	// Vehicle Apis
    {
        method: 'POST',
        path: '/vehicles',
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        handler: (request, h) => {
            return weblogin.webVehicle.fetch_ajax(request, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/add_vehicle',
        handler: (request, h) => {
            return weblogin.webVehicle.add(request, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/validate_vehicle',
        handler: (request, h) => {
            return weblogin.webVehicle.validateVehicle(request, h);
        }
    },

    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/get-vehicle_category',
        handler: (request, h) => {    
         return weblogin.webVehicle.getVehicleCategory(request, h);

        }
    },
    {
		 config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/all_vehicles',
        handler: (request, h) => {    
         return weblogin.webVehicle.getAllVehicle(request, h);

        }
    },
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/get_vehicle_detail/{_id}',
        handler: (request, h) => {
            return weblogin.webVehicle.fetchById(request, h);
        }
    },
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'PUT',
        path: '/update_vehicle/{_id}',
        handler: (request, h) => {
            return weblogin.webVehicle.update(request, h);
        }
    },
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'DELETE',
        path: '/delete_vehicle/{_id}',
        handler: (request, h) => {
            return weblogin.webVehicle.delete(request, h);
        }
    },
    /* vehicle validation routes */
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/validate_registration_no',
        handler: (request, h) => {
            return weblogin.webVehicle.validateRegistration(request, h);
        }
    },
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/validate_chassis_no',
        handler: (request, h) => {
            return weblogin.webVehicle.validateChassis(request, h);
        }
    },
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/validate_engine_no',
        handler: (request, h) => {
            return weblogin.webVehicle.validateEngine(request, h);
        }
    },
     {
		 config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/all_drivers',
        handler: (request, h) => {    
         return weblogin.webuserList.getAllDriver(request, h);

        }
    },

    // Attendance routes
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/attendance',
        handler: (request, h) => {
            return weblogin.webAttendance.get(request, h);
        }
    },
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/attendance',
        handler: (request, h) => {
            return weblogin.webAttendance.fetch_ajax(request, h);
        }
    },

    // Forgot password routes
    {
        method: 'POST',
        path: '/forgot_password',
        handler: (request, h) => {
            return weblogin.weblogin.sendforgetOtp(request, h);
        }
    },
    {
        method: 'POST',
        path: '/reset_password',
        handler: (request, h) => {
            return weblogin.weblogin.verifyAndReset(request, h);
        }
    },
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        }, 
        method: 'GET',
        path: '/get_user_detail/{_id}',
        handler: (request, h) => {
            return weblogin.webuserList.getUserByID(request, h);
        }
    },
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'PUT',
        path: '/update_user/{id}',
        handler: (request, h) => {
            return weblogin.webuserList.update(request, h);
        }
    },
	{
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'DELETE',
        path: '/delete_user/{id}',
        handler: (request, h) => {
            return weblogin.webuserList.delete(request, h);
        }
    },
    // {
    //     method: 'GET',
    //     path: '/profile',
    //     handler: (request, h) => {
    //         return weblogin.weblogin.verifyAndReset(request, h);
    //     }
    // },
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/save_attendance',
        handler: (request, h) => {
            return weblogin.webAttendance.addAttendance(request, h);
        }
    },
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/update_attendance/{id}',
        handler: (request, h) => {
            return weblogin.webAttendance.editAttendance(request, h);
        }
    },
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/delete_attendance/{id}',
        handler: (request, h) => {
            return weblogin.webAttendance.deleteAttendance(request, h);
        }
    },
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/get_user_attendance',
        handler: (request, h) => {
            return weblogin.webAttendance.getUserAttendance(request, h);
        }
    },
				  
	//Service logs 			  
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/add_service/{_id}',
        handler: function(req, h) {
            return weblogin.webVehicle.addNewService(req, h);
        }
    },
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/service_log',
        handler: function(req, h) {
            return weblogin.webVehicle.fetchAjaxService(req, h);
        }
    },
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/service/{_id}',
        handler: function(req, h) {
            return weblogin.webVehicle.getServiceByID(req, h);
        }
    },
	{
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/maintenance/{vehicle_id}',
        handler: function(req, h) {
            return weblogin.webVehicle.getServiceByVehicleID(req, h);
        }
    },
	{
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'PUT',
        path: '/update_service/{_id}',
        handler: function(req, h) {
            return weblogin.webVehicle.updateService(req, h);
        }
    },
	{
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/add_vehicle_category',
        handler: function(req, h) {
            return weblogin.webVehicleCategory.add(req, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/vehicle_categories',
        handler: function(req, h) {
            return weblogin.webVehicleCategory.fetchList(req, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/get_vehicle_category/{_id}',
        handler: function(req, h) {
            return weblogin.webVehicleCategory.getDetailByID(req, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'PUT',
        path: '/edit_vehicle_category/{_id}',
        handler: function(req, h) {
            return weblogin.webVehicleCategory.update(req, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'DELETE',
        path: '/delete_vehicle_category/{_id}',
        handler: function(req, h) {
            return weblogin.webVehicleCategory.delete(req, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/add_equipment_category',
        handler: function(req, h) {
            return weblogin.webEquipmentCategory.add(req, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'PUT',
        path: '/edit_equipment_category/{_id}',
        handler: function(req, h) {
            return weblogin.webEquipmentCategory.update(req, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/get_equipment_category/{_id}',
        handler: function(req, h) {
            return weblogin.webEquipmentCategory.getDetailByID(req, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'DELETE',
        path: '/delete_equipment_category/{_id}',
        handler: function(req, h) {
            return weblogin.webEquipmentCategory.delete(req, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/equipment_categories',
        handler: function(req, h) {
            return weblogin.webEquipmentCategory.fetchList(req, h);
        }
    },
     {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/add_tax',
        handler: function(req, h) {
            return weblogin.webTax.add(req, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'PUT',
        path: '/edit_tax/{_id}',
        handler: function(req, h) {
            return weblogin.webTax.update(req, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/get_tax/{_id}',
        handler: function(req, h) {
            return weblogin.webTax.getDetailByID(req, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'DELETE',
        path: '/delete_tax/{_id}',
        handler: function(req, h) {
            return weblogin.webTax.delete(req, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/taxes',
        handler: function(req, h) {
            return weblogin.webTax.fetchList(req, h);
        }
    },
    {
        config:{
            cors:{
                origin:['*'],
                additionalHeaders:['cache-control','x-requested-with']              
            },
            auth:"AdminJWT",
        },
        method:'PATCH',
        path:'/change_tax_status/{_id}',
        handler:(request,h) =>{
            return weblogin.webTax.changeStatus(request,h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'DELETE',
        path: '/delete_service/{_id}',
        handler: function(req, h) {
            return weblogin.webVehicle.deleteService(req, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/get_vehicle_categories/{id}',
        handler: function(req, h) {
            return weblogin.webVehicle.getCategories(req, h);
        }
    },
         
    // Orders
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/get_order_detail/{id}',
        handler: (request, h) => {
            return weblogin.webOrder.getOrderDetail(request, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",                        
        },
        method: 'POST',
        path: '/save_order/{order_id}',
        handler: function(req, h) {
            return weblogin.webOrder.saveOrder(req, h);
        }                                      
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",                        
        },
        method: 'POST',
        path: '/add_order_item',
        handler: function(req, h) {
            return weblogin.webOrder.addOrderItem(req, h);
        }                                      
    },
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']
				
			},
            auth:"AdminJWT",
		},
		method:'POST',
		path:'/add_orderstage',
		handler:(request,h) =>{
			return weblogin.webOrder.addOrderStage(request,h);
		}
	},
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']
				
			},
            auth:"AdminJWT",
		},
		method:'PUT',
		path:'/edit_orderstage/{_id}',
		handler:(request,h) =>{
			return weblogin.webOrder.editOrderStage(request,h);
		}
	},	
	{
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/orderstage/{id}',
        handler: (request, h) => {
            return weblogin.webOrder.getOrderStageDetailByID(request, h);
        }
    },
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']
				
			},
            auth:"AdminJWT",
		},
		method:'DELETE',
		path:'/delete_orderstage/{_id}',
		handler:(request,h) =>{
			return weblogin.webOrder.deleteOrderStage(request,h);
		}
	},	
	{
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/orderstages',
        handler: (request, h) => {
            return weblogin.webOrder.fetch_stages_ajax(request, h);
        }
    },
	{
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/agency_orderstages',
        handler: (request, h) => {
            return weblogin.webOrder.agencyOrderStages(request, h);
        }
    },
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/total_orders',
        handler: function(req, h) {
            return weblogin.webOrder.getTotalOrders(req, h);
        }
    },
    {
		config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/add_order',
        handler: function(req, h) {
            return weblogin.webOrder.addOrder(req, h);
        }
    },
    {
		 config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/get_order_item_id',
        handler: function(req, h) {
            return weblogin.webOrder.getOrderItemId(req, h);
        }
    },
    {
         config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/get_order_items/{id}',
        handler: function(req, h) {
            return weblogin.webOrder.getOrderItemsOfCustomerInOrder(req, h);
        }
    },
    {
		 config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'GET',
        path: '/get_order_item/{_id}',
        handler: function(req, h) {
            return weblogin.webOrder.getOrderItemByagency(req, h);
        }
    },

     {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/orders',
        handler: (request, h) => {
            return weblogin.webOrder.fetch_ajax(request, h);
        }
    },
      {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'DELETE',
        path: '/delete_order/{_id}',
         handler: (request, h) => {
            return weblogin.webOrder.deleteOrder(request, h);
        }
    },
     {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'DELETE',
        path: '/delete_order_item/{_id}',
         handler: (request, h) => {
            return weblogin.webOrder.deleteOrderItem(request, h);
        }
    },

   {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/delete_item',
         handler: (request, h) => {
            return weblogin.webOrder.deleteItemsByAgency(request, h);
        }
    },
  
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/update_order/{id}',
       handler: (request, h) => {
            return weblogin.webOrder.updateOrder(request, h);
        }
    },
    // Update order item
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'PUT',
        path: '/update_row/{id}',
        handler: (request, h) => {
            return weblogin.webOrder.updateRow(request, h);
        }
    },
				  
	// Dashboard apis
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']
				
			},
            auth:"AdminJWT",
		},
		method:'POST',
		path:'/total_orders_earnings',
		handler:(request,h) =>{
			return weblogin.webDashboard.getTotalOrdersAndTotalEarning(request,h);
		}
	},
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']
				
			},
            auth:"AdminJWT",
		},
		method:'POST',
		path:'/top_customer',
		handler:(request,h) =>{
			return weblogin.webDashboard.getTopCustomer(request,h);
		}
	},
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'POST',
		path:'/topmost_customers',
		handler:(request,h) =>{
			return weblogin.webDashboard.getTopCustomersAndTheirPayouts(request,h);
		}
	},
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'POST',
		path:'/topmost_drivers_from_orders',
		handler:(request,h) =>{
			return weblogin.webDashboard.getTopDriversGotMostOrders(request,h);
		}
	},
    {
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'POST',
		path:'/top_driver_from_orders',
		handler:(request,h) =>{
			return weblogin.webDashboard.getTopDriverGotMostOrders(request,h);
		}
	},
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'POST',
		path:'/logs',
		handler:(request,h) =>{
			return weblogin.webLog.getLogs(request,h);
		}
	},
	/* Custom fields apis */
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'POST',
		path:'/add_fields',
		handler:(request,h) =>{
			return weblogin.webCustomFields.add(request,h);
		}
	},
    {
        config:{
            cors:{
                origin:['*'],
                additionalHeaders:['cache-control','x-requested-with']              
            },
            auth:"AdminJWT",
        },
        method:'POST',
        path:'/add_field_option/{id}/{module}',
        handler:(request,h) =>{
            return weblogin.webCustomFields.addOption(request,h);
        }
    },
    {
        config:{
            cors:{
                origin:['*'],
                additionalHeaders:['cache-control','x-requested-with']              
            },
            auth:"AdminJWT",
        },
        method:'GET',
        path:'/get_field/{field_id}/{module_id}',
        handler:(request,h) =>{
            return weblogin.webCustomFields.getField(request,h);
        }
    },
    {
        config:{
            cors:{
                origin:['*'],
                additionalHeaders:['cache-control','x-requested-with']              
            },
            auth:"AdminJWT",
        },
        method:'PATCH',
        path:'/change_field_status/{field_id}',
        handler:(request,h) =>{
            return weblogin.webCustomFields.changeFieldStatus(request,h);
        }
    },
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'POST',
		path:'/module_form_fields',
		handler:(request,h) =>{
			return weblogin.webCustomFields.getCustomFieldsOfModule(request,h);
		}
	},
	{
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/all_modules',
        handler: function(request, h) {
            return weblogin.webModule.getAllModules(request, h)
        }
    },
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'GET',
		path:'/modules',
		handler:(request,h) =>{
			return weblogin.webCustomFields.getModulesAndInfo(request,h);
		}
	},
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'POST',
		path:'/get_fields',
		handler:(request,h) =>{
			return weblogin.webCustomFields.getFieldList(request,h);
		}
	},
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'DELETE',
		path:'/delete_field/{module_id}/{_id}',
		handler:(request,h) =>{
			return weblogin.webCustomFields.delete(request,h);
		}
	},
    {
        config:{
            cors:{
                origin:['*'],
                additionalHeaders:['cache-control','x-requested-with']              
            },
            auth:"AdminJWT",
        },
        method:'DELETE',
        path:'/delete_field_option/{_id}/{module_id}',
        handler:(request,h) =>{
            return weblogin.webCustomFields.deleteOption(request,h);
        }
    },
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'PUT',
		path:'/edit_field/{_id}',
		handler:(request,h) =>{
			return weblogin.webCustomFields.edit(request,h);
		}
	},
				  
    // Module apis
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'POST',
		path:'/add_module',
		handler:(request,h) =>{
			return weblogin.webModule.add(request,h);
		}
	},
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'GET',
		path:'/list_modules/{agency_id}',
		handler:(request,h) =>{
			return weblogin.webModule.list(request,h);
		}
	},
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'POST',
		path:'/assign_module',
		handler:(request,h) =>{
			return weblogin.webModule.assignModule(request,h);
		}
	},
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'GET',
		path:'/get_assigned_modules/{agency_id}',
		handler:(request,h) =>{
			return weblogin.webModule.getAgencyModules(request,h);
		}
	},
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'POST',
		path:'/modules',
		handler:(request,h) =>{
			return weblogin.webModule.allModules(request,h);
		}
	},
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'PUT',
		path:'/edit_module/{_id}',
		handler:(request,h) =>{
			return weblogin.webModule.update(request,h);
		}
	},
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'GET',
		path:'/module/{_id}',
		handler:(request,h) =>{
			return weblogin.webModule.getModuleDetail(request,h);
		}
	},
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'DELETE',
		path:'/delete_module/{_id}',
		handler:(request,h) =>{
			return weblogin.webModule.delete(request,h);
		}
	},
	{
		config:{
			cors:{
				origin:['*'],
				additionalHeaders:['cache-control','x-requested-with']				
			},
            auth:"AdminJWT",
		},
		method:'POST',
		path:'/hook/{name}',
		handler:(request,h) =>{
			return weblogin.webModule.customHooks(request,h);
		}
	},
    // trailer api's routes
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
			},
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/addTrailer',
        handler: (request, h) => {
            return weblogin.webtrailer.trailerregister(request, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
			},
            // auth:"AdminJWT",
        },
        method: 'POST',
        path: '/deleteTrailer',
        handler: (request, h) => {
            return weblogin.webtrailer.deletetrailer(request, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
			},
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/getAllTrailer',
        handler: (request, h) => {
            return weblogin.webtrailer.getAllTrailer(request, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
			},
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/getSingleTrailer',
        handler: (request, h) => {
            return weblogin.webtrailer.getSingleTrailer(request, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
			},
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/updateTrailer',
        handler: (request, h) => {
            return weblogin.webtrailer.updateTrailer(request, h);
        }
    },
// end of trailer routes
   // driver api routes
   {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/addDriver',
        handler: (request, h) => {
            return weblogin.webdriver.driverregister(request, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            // auth:"AdminJWT",
        },
        method: 'POST',
        path: '/deleteDriver',
        handler: (request, h) => {
            return weblogin.webdriver.deleteDriver(request, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/getAllDriver',
        handler: (request, h) => {
            return weblogin.webdriver.getAllDriver(request, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            // auth:"AdminJWT",
        },
        method: 'POST',
        path: '/getSingleDriver',
        handler: (request, h) => {
            return weblogin.webdriver.getSingleDriver(request, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/updateDriver',
        handler: (request, h) => {
            return weblogin.webdriver.updateDriver(request, h);
        }
    },
 {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            // auth:"AdminJWT",
        },
        method: 'POST',
        path: '/validatedriveremail',
        handler: (request, h) => {
            return weblogin.webdriver.validatedriveremail(request, h);
        }
    },


    // assign module/ROLE  to user

     {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/assign-role',
        handler: (request, h) => {
            return weblogin.webassign_module_to_user.assign_module_to_user(request, h);
        }
    },
     {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/delete_assign_role',
        handler: (request, h) => {
            return weblogin.webassign_module_to_user.delete_assign_role(request, h);
        }
    },
     {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            auth:"AdminJWT",
        },
        method: 'POST',
        path: '/get_assigned_role',
        handler: (request, h) => {
            return weblogin.webassign_module_to_user.get_assigned_role(request, h);
        }
    },

// add package(subscription) in table

{
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            // auth:"AdminJWT",
        },
        method: 'POST',
        path: '/add_package',
        handler: (request, h) => {
            return weblogin.webpackage.add_package(request, h);
        }
    },

    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            // auth:"AdminJWT",
        },
        method: 'POST',
        path: '/all_package_list',
        handler: (request, h) => {
            return weblogin.webpackage.all_package_list(request, h);
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            // auth:"AdminJWT",
        },
        method: 'POST',
        path: '/update_package_status',
        handler: (request, h) => {
            return weblogin.webpackage.update_package_status(request, h);
        }
    },

//end 


//purchase_package


 {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
             auth:"AdminJWT",
        },
        method: 'POST',
        path: '/buy_purchase_package',
        handler: (request, h) => {
            return weblogin.webpurchasepackage.buy_purchase_package(request, h);
        }
    },

     {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
             auth:"AdminJWT",
        },
        method: 'POST',
        path: '/delete_purchase',
        handler: (request, h) => {
            return weblogin.webpurchasepackage.delete_purchase(request, h);
        }
    },

       {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
             // auth:"AdminJWT",
        },
        method: 'POST',
        path: '/All_purchase_details',
        handler: (request, h) => {
            return weblogin.webpurchasepackage.All_purchase_details(request, h);
        }
    },

{
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
             auth:"AdminJWT",
        },
        method: 'POST',
        path: '/get_single_package_detail',
        handler: (request, h) => {
            return weblogin.webpurchasepackage.get_single_package_detail(request, h);
        }
    },

{
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
             // auth:"AdminJWT",
        },
        method: 'POST',
        path: '/get_single_agency_packages',
        handler: (request, h) => {
            return weblogin.webpurchasepackage.get_single_agency_packages(request, h);
        }
    },

// sub_module api's routes 

   {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
             // auth:"AdminJWT",
        },
        method: 'POST',
        path: '/create_sub_module',
        handler: (request, h) => {
            return weblogin.websubModule.create_sub_module(request, h);
        }
    },
   {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
             auth:"AdminJWT",
        },
        method: 'POST',
        path: '/delete_sub_module',
        handler: (request, h) => {
            return weblogin.websubModule.delete_sub_module(request, h);
        }
    },
//get single agency module and sub module
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
             auth:"AdminJWT",
        },
        method: 'POST',
        path: '/single_agency_module_sub_module',
        handler: (request, h) => {
            return weblogin.websubModule.single_agency_module_sub_module(request, h);
        }
    },


    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
             auth:"AdminJWT",
        },
        method: 'POST',
        path: '/update_sub_module',
        handler: (request, h) => {
            return weblogin.websubModule.update_sub_module(request, h);
        }
    },

      {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
             auth:"AdminJWT",
        },
        method: 'POST',
        path: '/singlemodule_and_sub_module',
        handler: (request, h) => {
            return weblogin.websubModule.singlemodule_and_sub_module(request, h);
        }
    },

    // user csv upload
     {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        method: 'POST',
        path: '/userbulkimport',
        handler: function(req, h) {
            return weblogin.webregister.userbulkimport(req, h)
        }
    },
    // driver csv upload
     {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        method: 'POST',
        path: '/driverbulkimport',
        handler: function(req, h) {
            return weblogin.driver.driverbulkimport(req, h)
        }
    },
   // vehicle csv upload
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        method: 'POST',
        path: '/vehiclebulkimport',
        handler: function(req, h) {
            return weblogin.webVehicle.vehiclebulkimport(req, h)
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        method: 'POST',
        path: '/trailerbulkimport',
        handler: function(req, h) {
            return weblogin.trailer.trailerbulkimport(req, h)
        }
    },
] 



 

    

                                                                                 