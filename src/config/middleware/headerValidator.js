// const headerAuthValidator = Joi.object({
//     'authorization': Joi.string().required().description('header authorization').error(new Error('Invalid token enter valid')),
//     'language': Joi.string().required().description('en - English').error(new Error('Language is incorrect')).required()
// }).unknown();//validate the auth token present in the header

//Verify Token
const headerAuthValidator = (request, reply, source, error) => {
    const bearerHeaders = request.headers['authorization'];
    console.log("headers====>>>",bearerHeaders);
    // Check if bearer is undefined
    //var  AuthResult
    if(typeof bearerHeaders != "undefined"){
        const bearer = bearerHeaders.split(" ");
        const bearerToken = bearer[1];
        //console.log('bearerToken=>', bearerToken)
        request.token = bearerToken;
        console.log(bearerToken);
        // If everything checks out, send the payload through
        // to the route handler
        
        //h.continue();
        //h.response(request);
        // invalid token - synchronous
        // try {
        //     var decoded = jwt.verify(bearerToken, 'secret', { algorithms: ['HS256'] }, function (err, payload) {
        //         if(payload){
        //             AuthResult ={'status':100,'msg':"Token is present"};
        //             request.tokenVerify = AuthResult;
        //         }
        //      //   return AuthResult;
        //     });
        // } catch(err) {
        //    return {'err':err};
        // }
        return reply({msg:"token is present"});
        
    }else{
        //AuthResult= {status:101, msg:'Token is missing.'}
        return reply({ message: "Token us damn missing." }).code(403);
        //request.tokenVerify = AuthResult;
    }
    //console.log('AuthResult======>', AuthResult)
    //return AuthResult;
};
