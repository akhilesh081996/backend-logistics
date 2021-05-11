const auth   =  require('../../controllers/api/auth');
// const driver = require('../../controllers/driver');
// const vehicle = require('../../controllers/vehicle');
const agency = require('../../controllers/api/agency');
const load = require('../../controllers/api/load');
const goods = require('../../controllers/api/goods');





//const web_login =  require('../../controllers/web/login');


//module.exports = [].concat(auth, web_login);
module.exports =  {
                    'auth':auth ,
                    // 'driver':driver,
                    // 'vehicle':vehicle,
                    'agency':agency,
                    'goods':goods,
                    'load':load
                } ;



