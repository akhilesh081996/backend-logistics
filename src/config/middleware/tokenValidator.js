const HAPI_AUTH_JWT = require("hapi-auth-jwt2");
const jwt = require('jsonwebtoken');

/* Validate super admin token */
const ValidateAdminJWT = async (decoded, request, h) => {  
	// Verification for agency admin or superadmin
	// if(decoded.data.admin == 1){
	// 	return { isValid: true };
	// }else{
	// 	return { isValid: false};
	// }        
//16 Apr
if(decoded.data.email){
   
          return { isValid: true };
    
    }else{
    return { isValid: false};
    }
//end

};

/* Validate agency admin token */
const ValidateAgencyJWT = async (decoded, request, h) => {

  //   console.log('decoded.data.slug',decoded.data.email)
  // console.log('request',decoded.data.email)
    
	// Verification for agency admin or superadmin
	// if(decoded.data.slug){
	// 	if(decoded.data.admin == 1){
 //        	return { isValid: true };
	// 	}else{
	// 		return { isValid: false};
	// 	}
 //    }else{
	// 	return { isValid: false};
 //    }    

//16 APR

      if(decoded.data.email){
   
          return { isValid: true };
    
    }else{
    return { isValid: false};
    } 

    // end of 16 Apr
};

const tokenError = context => {
    if (context.errorType == "TokenExpiredError" && context.attributes) {
        let authToken = SignJWT(
          { _id: context.attributes._id, key: "ref", deviceId: context.attributes.deviceId },
          context.attributes.sub,
          "60000"
        ); //sign a new JWT
        context.errorType = 440;
        context.message = context.message;
        context.refToken = authToken;
    }else{
        context.errorType = 101;
        context.message = context.message
          ? context.message
          : "Your session has expired, please login again to continue accessing your account.";
        // context.message = 'Your session has expired, please login again to continue accessing your account.';
    }
    return context;
};
const AdminJWT = {
    key: "secret",
    validate: ValidateAdminJWT,
    verifyOptions: { algorithms: ["HS256"] },
    errorFunc: context => {
        return context;
        //return tokenError(context);
     }
};

const AgencyJWT = {
    key: "secret",
    validate: ValidateAgencyJWT,
    verifyOptions: { algorithms: ["HS256"] },
    errorFunc: context => {
        return context;
        // return tokenError(context);
     }
};

module.exports = { HAPI_AUTH_JWT, AdminJWT, AgencyJWT };