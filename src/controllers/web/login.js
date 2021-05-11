//var exports = module.exports = {};
var Users = require('../../models/user');
var Agency = require('../../models/agency');
var valid = require('../../config/validation');
var jwt = require('jsonwebtoken');
//var jwt = require('hapi-auth-jwt');
const storage = require('node-sessionstorage')
var nodemailer = require('nodemailer');
var Otp = require('../../models/otptable');


function emailSender(email, otp) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'puneet.prajapati@contriverz.com',
            pass: '@Contrive27#'
        }
    });

    var emailform = 'puneet.prajapati@contriverz.com';
    var subject = 'OTP Email from Logistics'
    var text = '<h4> Your OTP :- ' + otp + '</h4>'

    var mailOptions = {
        from: emailform,
        to: email,
        subject: subject,
        text: text
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            // console.log(error);
        } else {

            // console.log("=>>>>else")
            return res.json({
                status: true,
                message: 'Email sent succesfully',

            });

        }

    });
}

function createOTP(otp) {
    var otp = Math.floor(1000 + Math.random() * 9000);
    return otp
}



exports.verifylogin = async(req, h) => {
    var loginurl = req.info.referrer.split("/");
    if (!valid.email(req.payload.email)) {
        return {
            status: false,
            message: 'Invalid Email'
        }
    }
    if (!valid.emailLength(req.payload.email)) {
        return {
            status: false,
            message: 'Invalid Email Length'
        }
    }
    if (!valid.passwordLength(req.payload.password)) {
        return {
            status: false,
            message: 'Invalid password Length'
        }
    } else {
        var Token = jwt.sign({
            data: {
                email: req.payload.email,
                password: req.payload.password
				// admin:req.payload.admin,
				// slug:req.payload.slug
            }
        }, 'secret', {algorithm: 'HS256', expiresIn: '24hr' });
        var agency = await Agency.findOne({ 'email': req.payload.email })
        if(agency) {

            if (!agency.validPassword(req.payload.password)) {
                	 			return {'status':101, 'msg':'Password does not match.'}
                			}
                            else{
                                return {'status':100, 'msg':'Login successfully', 'data': agency, 'token':Token}
                            }       
        }
        else{
            var user = await Users.findOne({ 'email': req.payload.email})
            if(user) {
                if (!user.validPassword(req.payload.password)) {
                    return {'status':101, 'msg':'Password does not match.'}
               }
               else{
                return {'status':100, 'msg':'Login successfully', 'data': user, 'token':Token}
               } 
               
            }
            else{
               return {'status':101, 'msg':'Not found'} 
            }         
        }      
}
}



// exports.verifylogin = function(req, h) {
//     var loginurl = req.info.referrer.split("/");
//     if (!valid.email(req.payload.email)) {
//         return {
//             status: false,
//             message: 'Invalid Email'
//         }
//     }
//     if (!valid.emailLength(req.payload.email)) {
//         return {
//             status: false,
//             message: 'Invalid Email Length'
//         }
//     }
//     if (!valid.passwordLength(req.payload.password)) {
//         return {
//             status: false,
//             message: 'Invalid password Length'
//         }
//     } else {
//         var Token = jwt.sign({
//             data: {
//                 email: req.payload.email,
//                 password: req.payload.password
// 				// admin:req.payload.admin,
// 				// slug:req.payload.slug
//             }
//         }, 'secret', {algorithm: 'HS256', expiresIn: '24hr' });

//         // if (req.payload.slug) {
           
//         //     return Agency.findOne({ 'email': req.payload.email, 'slug': req.payload.slug }).exec().then((user) => {
//         //         if (!user){
// 		// 			return {'status':101, 'msg':'Wrong email address.'}
// 		// 		} 
// 		// 		if (!user.validPassword(req.payload.password)) {
// 		// 			return {'status':101, 'msg':'Password does not match.'}
// 		// 		}
// 		// 		return {'status':100, 'msg':'Login successfully', 'data': user, 'token':Token}
//         //     }).catch((err) => {
//         //             return {'status':101, 'msg':err}
//         //     });
//         // } else {
//         //     if(req.payload.admin == 1){
//         //         return Users.findOne({ 'email': req.payload.email, 'isAdmin':1 }).exec().then((user) => {  
//         //             if (!user){
//         //                 return {'status':101, 'msg':'Wrong email address.'}
//         //             } 
//         //             if (!user.validPassword(req.payload.password)) {
//         //                 return {'status':101, 'msg':'Password does not match.'}
//         //             }
//         //             //user.password = undefined;
//         //             return {'status':100, 'msg':'Login successfully', 'data': user, 'token':Token}
//         //         }).catch((err) => {
//         //             return {'status':101, 'msg':err}
//         //         });
//         //     }else{
//         //         return Users.findOne({ 'email': req.payload.email, 'isAdmin':0 }).exec().then((user) => {
//         //             if (!user){
//         //                 return {'status':101, 'msg':'Wrong email address.'}
//         //             } 
//         //             if (!user.validPassword(req.payload.password)) {
//         //                 return {'status':101, 'msg':'Password does not match.'}
//         //             }
//         //             user.password = undefined;
//         //             return {'status':100, 'msg':'Login successfully', 'data': user, 'token':Token}
//         //         }).catch((err) => {
//         //             return {'status':101, 'msg':err.errmsg}
//         //         });
//         //     }           
//         // }
//     };
// }



exports.logout = function(req, h) {
    storage.removeItem('isLogin');
    return h.redirect('/login')
}

exports.sendforgetOtp = function(req, h) {
    if (!valid.email(req.payload.email)) {
        return {
            status: false,
            message: 'Invalid Email'
        }
    }
    if (!valid.emailLength(req.payload.email)) {
        return {
            status: false,
            message: 'Invalid Email Length'
        }
    } else {
        return Users.findOne({ 'email': req.payload.email }).exec().then((user) => {
            if (!user) return h.redirect('forgot_password', {
                status: false,
                message: 'User not Found!'
            });
            if (user) {
                var otp = createOTP(otp)
                emailSender(req.payload.email, otp)
                var data = {
                    otp: otp,
                    user_id: user.user_id,
                    generatedAt: new Date()
                }
                return Otp.create(data).then((otp) => {
                    if (otp) {
                        // setTimeout(function () {
                        //     return Otp.deleteOne({ _id: otp._id }).then((deleted) => {
                        //         console.log('===========++++++>','otp,',deleted)
                        //     }).catch((err) => {

                        //         return { err: err };
                        //     });
                        // }, 300000);
                        return h.redirect('reset_password', {
                            status: true,
                            message: "Otp send on Your Email !",
                        })
                    }

                }).catch((err) => {
                    //return { err: err };
                    return h.redirect('forgot_password', { status: false, err: err });
                });
            }
        }).catch((err) => {
            //return { err: err };
            return h.redirect('forgot_password', { status: false, err: err });
        });
    }

}
exports.verifyAndReset = function(req, h) {
    var otpnumber = parseInt(req.payload.otp)
    return Otp.find({ otp: otpnumber }).exec().then((varified) => {
        if (varified) {
            return Users.findOne({ 'user_id': varified[0].user_id }).exec().then((userintable) => {
                if (userintable) {
                    userdata = new Users({
                        password: req.payload.password,
                    });
                    userdata.password = userdata.generateHash(userdata.password);
                    return Users.findByIdAndUpdate(userintable._id, { 'password': userdata.password }).exec().then((result) => {
                        if (result) {
                            return h.redirect('login', {
                                status: true,
                                message: "Password Succesfully Changed !",
                            })
                        }
                    }).catch((err) => {
                        return h.redirect('reset_password', {
                            status: false,
                            message: "Otp Not Matched !",
                        });
                    });
                }
            }).catch((err) => {                  
                console.log(err)
                return h.redirect('reset_password', {
                    status: false,
                    message: "Otp Not Matched !",
                });
            });
        }
    }).catch((err) => {
        console.log(err)
        return h.redirect('reset_password', {
            status: false,
            message: "Otp Not Matched !",
        });
    });
}

exports.dashboard = function(req, h) {
    //console.log('login dash =====+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=>',req);
    return {
        status: true,
        message: "Dashboard Login successfully",
        data: req
    };
}