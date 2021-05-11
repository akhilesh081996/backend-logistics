const weblogin          = require('../../controllers/web/login')
const register          = require('../../controllers/web/register')
const webgettotal       = require('../../controllers/web/gettotal')
const webagency         = require('../../controllers/web/agency')
const webrole           = require('../../controllers/web/hr/role')
const crm               = require('../../controllers/web/crm')
const invoiceList       = require('../../controllers/web/payrole/invoice')
const userList          = require('../../controllers/web/hr/users')
const files             = require('../../controllers/web/files')
const vehicle           = require('../../controllers/web/vehicle')
const attendance        = require('../../controllers/web/hr/attendance')
const order             = require('../../controllers/web/order')
const dashboard         = require('../../controllers/web/dashboard')
const logs              = require('../../controllers/web/logs')
const modules           = require('../../controllers/web/modules')
const customfields      = require('../../controllers/web/settings/custom_fields')
const vehicleCategory   = require('../../controllers/web/vehicle_category')
const equipmentCategory = require('../../controllers/web/equipment_category')
const tax               = require('../../controllers/web/tax')
//16 Apr Changes
const trailer           = require('../../controllers/web/trailer')
const driver            = require('../../controllers/web/driver')
const hooks             = require('../../config/hooks')
const assign_role_to_user = require('../../controllers/web/assign_role')
const package            = require('../../controllers/web/packageCtrl')
const purchasepackage   =  require('../../controllers/web/purchasepackageCtrl')
const subModule         =  require('../../controllers/web/sub_moduleCtrl')

module.exports = {
    'weblogin': weblogin,
    'webregister': register,
    'webgettotal': webgettotal,
    'webagency': webagency,
    'webrole': webrole,
    'webcrm': crm,
    'webinvoicelist': invoiceList,
    'webuserList': userList,
    'webFiles': files,
    'webVehicle': vehicle,
    'webAttendance': attendance,
    'webOrder' : order,
    'webDashboard' : dashboard,
    'webLog' : logs,
	'webCustomFields':customfields,
	'webModule': modules,
    'webVehicleCategory': vehicleCategory,
    'webEquipmentCategory': equipmentCategory,
    'webTax': tax,
    'webtrailer':trailer,
    'webdriver':driver,
	'webHook' : hooks,
    'webassign_module_to_user':assign_role_to_user,
    'webpackage':package,
    'webpurchasepackage':purchasepackage,
    'websubModule' :subModule
};