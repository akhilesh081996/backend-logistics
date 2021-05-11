const api = require('./include');
const path = require('path')
const BaseUrl = 'http://apilogistics.com'
module.exports = [  
 	{ 
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            // payload: {
            //     output: 'stream',
            //     parse: true,
            //     allow: 'Content-Type": "text/plain'
            // }
        },
        method: 'POST', path: '/api/signup', handler: api.auth.signup	
    },
	{ config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },method: 'POST', path:  '/api/login', handler: api.auth.login },
    { config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },method: 'POST', path: '/api/forgetpassword', handler: api.auth.forgetpassword	},
    { config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },method: 'POST', path:'/api/otpVarifyAndResetPassword', handler: api.auth.otpVarifyAndResetPassword },
    
    
    // { config: {
    //     cors: {
    //         origin: ['*'],
    //         additionalHeaders: ['cache-control', 'x-requested-with'],
    //     },
    //     // payload: {
    //     //     output: 'stream',
    //     //     parse: true,
    //     //     allow: 'multipart/form-data; application/json'
    //     // }
    // }
    // ,method: 'POST', path: '/api/add_vehicle', handler: api.vehicle.add_vehicle },



    { config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    } ,method: 'POST', path: '/api/getDriversOfOwnAgency', handler: api.agency.getDriversOfOwnAgency }, 
  
  
    { config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },method: 'POST', path: '/api/getVehiclesOfOwnAgency', handler: api.agency.getVehiclesOfOwnAgency }, 
  
  
    { config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },method: 'POST', path: '/api/getAgencyDetails', handler: api.agency.getAgencyDetails }, 
    //  { config: {
    //     cors: {
    //         origin: ['*'],
    //         additionalHeaders: ['cache-control', 'x-requested-with']
    //     }
    // },method: 'POST', path: '/api/getDriverDetails', handler: api.driver.getDriverDetails }, 
    // { config: {
    //     cors: {
    //         origin: ['*'],
    //         additionalHeaders: ['cache-control', 'x-requested-with']
    //     }
    // },method: 'POST', path: '/api/assignvehicle', handler: api.driver.assignvehicle }, 
    // { config: {
    //     cors: {
    //         origin: ['*'],
    //         additionalHeaders: ['cache-control', 'x-requested-with']
    //     }
    // },method: 'POST', path: '/api/getBackVehicle', handler: api.driver.getBackVehicle }, 
    // { config: {
    //     cors: {
    //         origin: ['*'],
    //         additionalHeaders: ['cache-control', 'x-requested-with']
    //     }
    // },method: 'POST', path: '/api/allDrivers', handler: api.driver.allDrivers }, 

    { config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },method: 'POST', path: '/api/allAgencies', handler: api.agency.allAgencies }, 
    { config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },method: 'POST', path: '/api/allCustomers', handler: api.auth.allCustomers }, 
    // { config: {
    //     cors: {
    //         origin: ['*'],
    //         additionalHeaders: ['cache-control', 'x-requested-with']
    //     }
    // },method: 'POST', path: '/api/allVehicles', handler: api.vehicle.allVehicles }, 
    // { config: {
    //     cors: {
    //         origin: ['*'],
    //         additionalHeaders: ['cache-control', 'x-requested-with']
    //     },
    //     // payload: {
    //     //     output: 'stream',
    //     //     parse: true,
    //     //     allow: 'multipart/form-data'
    //     // }
    // },method: 'POST', path: '/api/update_driver', handler: api.driver.update_driver }, 

    /*{ config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },method: 'POST', path: '/api/update_customer', handler: api.auth.update_customer }, */

    { config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },method: 'POST', path: '/api/update_agency', handler: api.agency.update_agency },

    // { config: {
    //     cors: {
    //         origin: ['*'],
    //         additionalHeaders: ['cache-control', 'x-requested-with']
    //     },
    
    // },method: 'POST', path: '/api/update_vehicle', handler: api.vehicle.update_vehicle },

    { config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },method: 'POST', path: '/api/totalcountofagencydata', handler: api.auth.totalcountofagencydata },
    
    // { config: {
    //     cors: {
    //         origin: ['*'],
    //         additionalHeaders: ['cache-control', 'x-requested-with']
    //     }
    // },method: 'POST', path: '/api/getVehicleDetails', handler: api.vehicle.getVehicleDetails },
    
    // { config: {
    //     cors: {
    //         origin: ['*'],
    //         additionalHeaders: ['cache-control', 'x-requested-with']
    //     }
    // },method: 'POST', path: '/api/vechicle_booking_request', handler: api.auth.vechicle_booking_request },
    
     
    // { config: {
    //     cors: {
    //         origin: ['*'],
    //         additionalHeaders: ['cache-control', 'x-requested-with']
    //     },
    //     payload: {
    //         output: 'stream',
    //         parse: true,
    //         allow: 'multipart/form-data'
    //     }
    // },method: 'POST', path: '/api/fileUplode', handler: api.auth.fileUplode },

    { config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        },
 
    },method: 'GET', path: '/src/user_data/{multi*5}' , handler: (req ,h )=>{
        console.log('sadsa')
      completePath = path.join(__dirname,'../../../' + req.url.pathname) 
      console.log(completePath)
        return h.file(completePath);
    }
    
 },
//  { config: {
//     cors: {
//         origin: ['*'],
//         additionalHeaders: ['cache-control', 'x-requested-with']
//     },

// },method: 'GET', path: '/src/user_data/{multi*5}' , handler: (req ,h )=>{
//     console.log('sadsa')
//   completePath = path.join(__dirname,'../../../' + req.url.pathname) 
//   console.log(completePath)
//     return h.file(completePath);
// }

// },

     { config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        },
    
    },method: 'POST', path: '/api/add_load', handler: api.load.add_load },
    
    { config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        },
    
    },method: 'POST', path: '/api/getloadlist', handler: api.load.getloadlist },

    { config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        },
    
    },method: 'DELETE', path: '/api/deleteload', handler: api.load.deleteload },

    { config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        },
    
    },method: 'POST', path: '/api/add_goodstype', handler: api.goods.add_goodstype },

    { config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        },
    
    },method: 'POST', path: '/api/getGoodsTypeList', handler: api.goods.getGoodsTypeList },

    { config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        },
    
    },method: 'DELETE', path: '/api/deleteGoodsType', handler: api.goods.deleteGoodsType },
];