var Users = require('../../models/user');
var Agency = require('../../models/agency');
var Driver = require('../../models/driver');
// var Customer = require('../../models/customer');
var Vehicle = require('../../models/vehicle');
var Role = require('../../models/role');
var Booking = require('../../models/booking')
var valid = require('../../config/validation')
const bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const Otp = require('../../models/otptable')
var uniqid = require('uniqid');
var decode;
var tokenverified = false
var jwterr;
const fs = require('fs');
var path = require('path');
var date = new Date()
var imagename;

function decode_base64(data, folder, imgflder, imagename) {
    // var base64 = Buffer.from(data).toString('base64');
    var buf = Buffer.from(data, 'base64');
    fs.writeFile(path.join(__dirname, '../user_data/agencies/' + folder + '/driverimages/', imgflder + '/' + imagename), buf, function(error) {
        if (error) {
            throw error;
        } else {
            //  console.log('File created from base64 string!');
            // return true;
        }
    });
}


// function file_uplode(req,folder,imgname,fileobject){
//   //file_uplode(req,user.user_id, req.payload.driver_image.hapi.filename ,req.payload.driver_image);
//   //console.log(req.payload.drivers_images.hapi.filename)
//  // const fileobject = req.payload.drivers_images ;
// //  const imgname = req.payload.drivers_images.hapi.filename
// console.log(fileobject)
//    const newpath = path.join(__dirname, '../user_data/' + folder +'/');
//   //  const newpath = __dirname;
//       const path1 = newpath  + imgname;
//       const file = fs.createWriteStream(path1);
//       file.on('error', (err) => console.error(err));
//       fileobject.pipe(file);
//       fileobject.on('end', (err) => { 
//           const ret = {
//               filename: fileobject.filename,
//               headers: fileobject.headers
//           }
//           return JSON.stringify(ret);
//       }) 

// }

function tokenVarification(token) {
    decode = jwt.decode(token, { complete: true });
    //console.log(decode);
    jwt.verify(token, 'secret', function(err, decoded) {
        if (err) {
            //    console.log('======err====>',err)
            jwterr = err.message
        } else {
            //  console.log('======decoded2====>',decoded)
            tokenverified = true
        }
    })

}

// node mailer api **************** node mailer api ******************** nade mailer api

function emailSender(user_email, user_password) {
    //console.log('eanter in node mailer with ' ,user_email);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'puneet.prajapati@contriverz.com',
            pass: '@Contrive27#'
        }
    });

    var emailform = 'puneet.prajapati@contriverz.com';
    var subject = 'Varification Email from Logistics'
    var text = 'welcome to the logistics. your login email is :' + user_email + 'password :' + user_password

    var mailOptions = {
        from: emailform,
        to: user_email,
        subject: subject,
        text: text
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            // console.log(error);
        } else {

            // console.log("=>>>>else")
            //console.log('Email sent: ' + info.response);
            return res.json({
                status: true,
                message: 'Email sent succesfully',

            });

        }

    });
}


function sendOtp(user_email, otp) {
    // console.log('eanter in node mailer with ' ,user_email);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'puneet.prajapati@contriverz.com',
            pass: '@Contrive27#'
        }
    });

    var emailform = 'puneet.prajapati@contriverz.com';
    var subject = 'Otp from Logistics';
    var text = 'welcome to the logistics. your one time password is :' + otp;

    var mailOptions = {
        from: emailform,
        to: user_email,
        subject: subject,
        text: text
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            //console.log(error);
        } else {

            //  console.log("=>>>>else")
            //console.log('Email sent: ' + info.response);
            return res.json({
                status: true,
                message: 'Email sent succesfully',

            });

        }

    });
}

exports.signup = function(req, h) {
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
            message: 'Invalid user_password Length'
        }
    } else {
        var User_id = uniqid();
        var agencydata;
        var driverdata;
        var customerdata;
        var userEmail = req.payload.email;
        var userPassword = req.payload.password;


        const userdata = new Users({
            user_id: User_id,
            role: req.payload.role,
            username: req.payload.username,
            email: req.payload.email,
            contact: req.payload.contact,
            password: req.payload.password,
            status:req.payload.status,
            deleted:0,
            created_at: new Date().toISOString()
        });

        if (req.payload.role == 2) {
            agencydata = new Agency({
                user_id: User_id,
                agency_name: req.payload.agency_name,
                llc_or_registration_no: req.payload.llc_or_registration_no,
                address: req.payload.address,
                city: req.payload.city,
                country: req.payload.country,
                postal_code: req.payload.postal_code,
                status: req.payload.status,
                // default_limits : {
                //     soft_limit : req.payload.soft_limit,
                //     hard_limit : req.payload.hard_limit,
                // }

            });
        }

        if (req.payload.user_role == 3) {
            var imagename = 'profile-image' + date.getTime() + '.jpg'

            var npath = path.join(__dirname, '../user_data/agencies/' + req.payload.agency_id + '/driverimages/' + req.payload.social_sec_number)
            fs.mkdir(npath, { recursive: true }, (err) => {
                if (err) throw err;
                console.log(err)
            });
            console.log('req.payload.driver_image=================+>', req.payload.driver_image)
            var srt = req.payload.driver_image.split(",", 2);
            console.log(srt)
            decode_base64(srt[1], req.payload.agency_id, req.payload.social_sec_number, imagename);
            driverdata = new Driver({
                user_id: User_id,
                first_name: req.payload.first_name,
                last_name: req.payload.last_name,
                agency_name: req.payload.agency_name,
                agency_id: req.payload.agency_id,
                driver_image: '/src/user_data/agencies/' + req.payload.agency_id + '/driverimages/' + req.payload.social_sec_number + '/' + imagename,
                social_sec_number: req.payload.social_sec_number,
                address: req.payload.address,
                city: req.payload.city,
                country: req.payload.country,
                postal_code: req.payload.postal_code,
                status: req.payload.status,
                //     emergency_contact : 
                //      {
                //       comp_name : req.payload.emergency_contact.comp_name,
                //       anumber : req.payload.emergency_contact.anumber,
                //       pnumber : req.payload.emergency_contact.pnumber,
                //       releted_address : req.payload.emergency_contact.releted_address,
                //       relation :req.payload.emergency_contact.relation

                //     },
                //     documents :{
                //        lic_img : req.payload.documents.lic_img,
                //        doc_img : req.payload.documents.doc_img   
                // }
            });
        }

        if (req.payload.user_role == 4) {

            customerdata = new Customer({
                user_id: User_id,
                first_name: req.payload.first_name,
                last_name: req.payload.last_name,
                confirm_password: req.payload.confirm_password,
                // status:req.payload.status,
                //customer_image : req.payload.customer_image,
            });

        }

        const userRole = new Role({

            user_id: User_id,
            //user_role:  req.payload.user_role,
            //user_role_type : req.payload.user_role_type,

        })

        userdata.password = userdata.generateHash(userdata.password);
        if (req.payload.user_role == 1) {
            return Role.create(userRole), Users.create(userdata).then((user) => {
                var newpath = path.join(__dirname, '../user_data/' + user.user_id);

                fs.mkdir(newpath, { recursive: true }, (err) => {
                    if (err) throw err;
                });
                emailSender(userEmail, userPassword);
                return {
                    status: true,
                    message: "user register successfully",
                    data: user
                };


            }).catch((err) => {

                return { err: err };

            })

        }
        if (req.payload.role == 2) {
            return Agency.create(agencydata), Role.create(userRole), Users.create(userdata).then((user) => {
                emailSender(userEmail, userPassword);
                var newpath = path.join(__dirname, '../user_data/agencies/' + user.user_id);
                fs.mkdir(newpath, { recursive: true }, (err) => {
                    if (err) throw err;
                    console.log(err)
                });
                var newpath1 = path.join(__dirname, '../user_data/agencies/' + user.user_id + '/driverimages')
                var newpath2 = path.join(__dirname, '../user_data/agencies/' + user.user_id + '/vehiclesimages')
                fs.mkdir(newpath1, { recursive: true }, (err) => {
                    if (err) throw err;
                    console.log(err)
                });
                fs.mkdir(newpath2, { recursive: true }, (err) => {
                    if (err) throw err;
                    console.log(err)
                });

                return {
                    status: true,
                    message: "user register successfully",
                    data: user
                };

            }).catch((err) => {
                console.log(err)
                return { err: err };

            });
        }

        if (req.payload.user_role == 3) {
            // base64_decode(req.payload.driver_image, 'copy.jpg');         
            return Driver.create(driverdata), Role.create(userRole), Users.create(userdata).then((user) => {
                emailSender(userEmail, userPassword);
                // var newpath = path.join(__dirname, '../user_data/'+ user.user_id); 
                // fs.mkdir(newpath, { recursive: true }, (err) => {
                //    if (err) throw err;
                //  });
                //    file_uplode(req, user.user_id , driverdata.driver_image, req.payload.driver_image);
                return {
                    status: true,
                    message: "user register successfully",
                    data: user
                };

            }).catch((err) => {
                console.log(err)
                return { err: err };

            });

        }

        if (req.payload.user_role == 4) {
            return Customer.create(customerdata), Role.create(userRole), Users.create(userdata).then((user) => {
                emailSender(userEmail, userPassword);
                var newpath = path.join(__dirname, '../user_data/' + user.user_id);
                fs.mkdir(newpath, { recursive: true }, (err) => {
                    if (err) throw err;
                });
                return {
                    status: true,
                    message: "user register successfully",
                    data: user
                };

            }).catch((err) => {
                console.log(err)
                return { err: err };

            });


        }

    }
}


exports.login = function(req, h) {
    console.log(req.payload,'=====>>>>>')
    // console.log(req)
    if (!valid.user_email(req.payload.user_email)) {
        return {
            status: false,
            message: 'Invalid Email'
        }
    }
    if (!valid.emailLength(req.payload.user_email)) {
        return {
            status: false,
            message: 'Invalid Email Length'
        }
    }
    if (!valid.passwordLength(req.payload.user_password)) {
        return {
            status: false,
            message: 'Invalid user_password Length'
        }
    } else {
        var Token = jwt.sign({
            data: {
                email: req.payload.user_email,
                password: req.payload.user_password
            }
        }, 'secret', { expiresIn: '24h' });


        return Users.findOne({
            'user_email': req.payload.user_email
        }).exec().then((user) => {
            if (!user) return {
                status: false,
                message: 'Wrong email address or Password!'
            };
            if (!user.validPassword(req.payload.user_password)) return {
                status: false,
                message: 'Wrong email address or Password!'
            };

            user.user_password = undefined;
            return {

                token: Token,
                status: true,
                message: "user Login successfully",
                data: user
            };
        }).catch((err) => {
            console.log(err)
            return { err: err };

        });
    };
}



//// forget password ******************** forget Password **************************** forget Password ****

exports.forgetpassword = function(req, h) {

    //console.log('forege password block exist')
    if (!valid.user_email(req.payload.user_email)) {
        return {
            status: false,
            message: 'Invalid Email dsf'
        }
    }
    if (!valid.emailLength(req.payload.user_email)) {
        return {
            status: false,
            message: 'Invalid Email Length'
        }
    } else {
        console.log(req.payload)
        return Users.findOne({
            'user_email': req.payload.user_email
        }).exec().then((user) => {
            if (!user) {
                return {
                    status: false,
                    message: ' oops! User does not Exist in database '
                };
            } else {
                var digits = '0123456789';
                let OTP = '';
                for (let i = 0; i < 4; i++) {
                    OTP += digits[Math.floor(Math.random() * 10)];
                };
                console.log(OTP)
                var otpdetails = new Otp({
                    user_id: user.user_id,
                    user_email: user.user_email,
                    otp: OTP,
                    dateAndTime: new Date()
                });

                otpdetails.save()

                sendOtp(req.payload.user_email, OTP);
                return {
                    status: true,
                    message: "otp send in your Email !!",
                };
            }


        }).catch((err) => {
            console.log(err)
            return { err: err };

        });

    };
}


// varify otp   *******************  varify otp ********************  varify otp *********************///

exports.otpVarifyAndResetPassword = function(req, h) {
    console.log('verify otp block exist')
    if (!valid.user_email(req.payload.user_email)) {
        return {
            status: false,
            message: 'Invalid Email'
        }
    }
    if (!valid.emailLength(req.payload.user_email)) {
        return {
            status: false,
            message: 'Invalid Email Length'
        }
    } else {
        // console.log("=>>>else")
        return Otp.findOne({
            'user_email': req.payload.user_email,
            'otp': req.payload.otp
        }).exec().then((otp) => {
            // console.log("=>>>otp",otp)
            if (!otp) {
                return {
                    status: false,
                    message: ' oops! otp not matched !'
                };
            }
            if (otp) {
                //  console.log(otp)
                return Users.findOne({
                    'user_email': otp.user_email
                }).exec().then((user) => {
                    //    console.log("find one", user)
                    req.payload.user_password = user.generateHash(req.payload.user_password);
                    console.log(req.payload.user_password)
                        //   console.log('req.payload.user_password',req.payload.user_password)
                    return Users.findByIdAndUpdate({ _id: user._id }, { $set: { user_password: req.payload.user_password } }).exec().then((d) => {
                        console.log(d)

                        return {
                            status: true,
                            message: "password changed succesfully",
                        };
                    }).catch(err => {
                        console.log(err)

                        return {
                            error: 'err',
                            status: false,
                            message: " oops !! somthiong  wrong ",
                        }
                    });

                }).catch(err => {
                    console.log(err)
                    return {
                        status: false,
                        message: " oops !! somthiong went wrong ",
                    }
                });
            }
        }).catch((err) => {
            console.log(err)
            return { err: err };

        });

    };

};

// add vehicle **************** add vehical ******************** add vehical*********************

// exports.add_vehicle =   function (req, h) {
//    tokenVarification(req.payload.token);
//   if(tokenverified == true){
//     console.log(req.payload.vehicle_image)
//     var vehicle = new Vehicle({
//       vehicle_id:req.payload.vehicle_id,
//       Reg_number:req.payload.Reg_number,
//       vehicle_image:req.payload.vehicle_image,
//       company_name: req.payload.company_name,
//       agency_name:req.payload.agency_name,
//       agency_id:req.payload.agency_id,
//       dimension: req.payload.dimension,
//       discription: req.payload.discription,
//       gross_weight: req.payload.gross_weight,
//       model: req.payload.model,
//       payload: req.payload.payload,
//       tyre: req.payload.tyre

//     });
//     return Vehicle.create(vehicle).then((vehic) => {
//       if(vehic){
//         file_uplode(req, req.payload.agency_id, req.payload.vehicle_image.hapi.filename,req.payload.vehicle_image);
//         return {
//           status :true,
//           message: " vehicle added successfully",
//           data: vehic 
//          }
//       } 
//    }).catch((err) => {
//     console.log(err)
//      return { err: err };
//    })
//   }else{
//     return {
//       message:jwterr
//     }
//   }
// }

///   ******************** getDriversOfOwnAgency *******************************

// exports.getDriversOfOwnAgency = (req, h) => {
//   tokenVarification(req.payload.token);

//   if(tokenverified == true){ 
//     return  Users.findOne({
//         'user_email':decode.payload.data.email
//       }).exec().then((user) =>{
//         console.log(user)
//          if(user){
//           return Driver.find({agency_id:user.user_id}).exec().then((drivers) => {
//               console.log('drivers',drivers)
//             if(!drivers) return {status:false, message: 'drivers not found' };

//             return { 
//               status : true,
//               message:'drivers found !',
//               drivers:drivers

//             };

//           }).catch((err) => {
//             console.log(err)
//             return { err: err };

//           });
//          }else{
//            return {
//              err:err
//            }
//          }
//       }).catch((err) => {
//           console.log(err)
//       return { err: err };

//     });

//   }

// }

// exports.getVehiclesOfOwnAgency = (req, h) => {
//   tokenVarification(req.payload.token);

//     console.log(decode.payload.data.email)
//   if(tokenverified == true){ 
//     return  Users.findOne({
//         'user_email':decode.payload.data.email
//       }).exec().then((user) =>{
//         console.log(user)
//          if(user){
//           return Vehicle.find({agency_id:user.user_id}).exec().then((vehicle) => {
//               console.log('vehicles',vehicle)
//             if(!vehicle) return { 
//               status:false,
//               message: 'Vehicle not found' 
//             };
//             if(vehicle.length == 0){
//              return{
//               status : false,
//               message:'Vehicle not found !',
//              } 
//             } 
//             return { 
//               status : true,
//               message:'Vehicle found !',
//               vehicles:vehicle
//             };

//           }).catch((err) => {
//             console.log(err)
//             return { err: err };

//           });
//          }else{
//            return {
//              err:err
//            }
//          }
//       }).catch((err) => {
//           console.log(err)
//       return { err: err };

//     });

//   }

// }

// exports.getAgencyDetails = (req, h) => {
//   tokenVarification(req.payload.token);

//     console.log(decode.payload.data.email)
//   if(tokenverified == true){ 
//     return  Users.findOne({
//         'user_email':decode.payload.data.email
//       }).exec().then((user) =>{
//         console.log(user)
//          if(user){
//           return Agency.find({user_id:user.user_id}).exec().then((agency) => {
//               console.log('agency',agency)
//             if(!agency) return { 
//               status:false,
//               message: 'agency not found' };

//             return { 

//               status : true,
//               message:'agency found !',
//               user:user,
//               agency:agency
//             };

//           }).catch((err) => {
//             console.log(err)
//             return { err: err };

//           });
//          }else{
//            return {
//              err:err
//            }
//          }
//       }).catch((err) => {
//           console.log(err)
//       return { err: err };

//     });

//   }

// }

// exports.getDriverDetails = (req, h) => {
//   tokenVarification(req.payload.token);
//   if(tokenverified == true){ 
//     return  Users.findOne({
//         'user_id':req.payload.user_id
//       }).exec().then((user) =>{
//         console.log(user)
//          if(user){
//           return Driver.find({user_id:user.user_id}).exec().then((driver) => {
//               console.log('driver',driver)
//             if(!driver) return { 
//               status:false,
//               message: 'driver not found' };

//             return { 

//               status : true,
//               message:'driver found !',
//               driver:driver,user
//             };

//           }).catch((err) => {
//             console.log(err)
//             return { err: err };

//           });
//          }else{
//            return {
//              err:err
//            }
//          }
//       }).catch((err) => {
//           console.log(err)
//       return { err: err };

//     });

//   }

// }

// exports.getVehicleDetails = (req, h) => {
//   tokenVarification(req.payload.token);
//   if(tokenverified == true){ 
//     return  Vehicle.findOne({
//         '_id':req.payload._id
//       }).exec().then((vehicle) =>{
//         console.log(vehicle)
//          if(vehicle){
//            return{
//              status:true,
//              message:"vehicle found !",
//              vehicle_detail:vehicle
//            }

//          }
//       }).catch((err) => {
//           console.log(err)
//       return { err: err };

//     });

//   }

// }

// exports.assignvehicle = function (req, h) {
//   tokenVarification(req.payload.token);
//     if(tokenverified == true){ 
//   return Vehicle.findOne({
//     'Reg_number': req.payload.Reg_number,
// }).exec().then((vehicle) => {
//  console.log("=>>>vehicle",vehicle)
//     if(!vehicle){
//       return {
//         status:false,
//         message: ' vehicle nort found  !' 
//       };
//     }if(vehicle){
//     console.log(vehicle)
//           return Driver.findOne({
//              'user_id': req.payload.user_id
//            }).exec().then((driver)=>{
//            console.log("driver found", driver)
//           return Driver.findByIdAndUpdate(driver._id, {assigned_vehicle:vehicle}).exec().then((updatedDriver)=>{
//             if(updatedDriver){
//               return { 
//                 status:true,
//                 message:" vehicle assigned to " + driver.first_name,
//               };
//             }

//           }).catch(err =>{
//             console.log(err)

//             return {
//                     error: 'err',
//                     status:false,
//                     message:" oops !! somthiong went wrong ",
//                    }
//           });

//         }).catch(err =>{
//           console.log(err)
//           return {
//                   status:false,
//                   message:" oops !! somthiong went wrong ",
//                  }
//         });
//     }
//   }).catch((err) => {
//     console.log(err)
//     return { err: err };

//   });


// };

// };

// exports.getBackVehicle = function (req, h) {
//   tokenVarification(req.payload.token);
//     if(tokenverified == true){ 
//   return Vehicle.findOne({
//     'Reg_number': req.payload.Reg_number,
// }).exec().then((vehicle) => {
//  console.log("=>>>vehicle",vehicle)
//     if(!vehicle){
//       return {
//         status:false,
//         message: ' vehicle nort found  !' 
//       };
//     }if(vehicle){
//     console.log(vehicle)
//           return Driver.findOne({
//              'user_id': req.payload.user_id
//            }).exec().then((driver)=>{
//            console.log("driver found", driver)
//            vehicle = null


//           return Driver.findByIdAndUpdate(driver._id, {assigned_vehicle:vehicle}).exec().then((updatedDriver)=>{
//             if(updatedDriver){
//               return { 
//                 status:true,
//                 message:" get back vehicle to " + driver.first_name,
//               };
//             }

//           }).catch(err =>{
//             console.log(err)

//             return {
//                     error: 'err',
//                     status:false,
//                     message:" oops !! somthiong went wrong ",
//                    }
//           });

//         }).catch(err =>{
//           console.log(err)
//           return {
//                   status:false,
//                   message:" oops !! somthiong went wrong ",
//                  }
//         });
//     }
//   }).catch((err) => {
//     console.log(err)
//     return { err: err };

//   });


// };

// };

// exports.update_driver  = function (req, h) {

//   tokenVarification(req.payload.token);
//     if(tokenverified == true){ 
//   return Driver.findOne({
//     'user_id': req.payload.user_id,
// }).exec().then((driver) => {
//     if(!driver){
//       return {
//         status:false,
//         message: ' driver not found  !' 
//       };
//     }if(driver){
//           return Driver.findByIdAndUpdate(driver._id  ,req.payload).exec().then((updatedDriver)=>{
//             if(updatedDriver){
//               return Users.findOne({
//                 'user_id': req.payload.user_id,
//               }).exec().then((user) => {
//                 if(user){

//                   return  Users.findByIdAndUpdate(user._id  ,req.payload) .exec().then((updateduser)=>{
//                     console.log(updateduser)
//                     if(req.payload.driver_image.hapi.filename){
//                       file_uplode(req, req.payload.agency_id, req.payload.driver_image.hapi.filename,req.payload.driver_image);
//                     }
//                       {
//                       if(updateduser && updatedDriver){
//                     return{
//                       status:true,
//                       message:"Driver updated !!!",
//                     }   

//                       }
//                     }
//                   }).catch(err =>{
//                 console.log(err)

//                 return {
//                         error: 'err',
//                         status:false,
//                         message:" oops !! somthiong went wrong ",
//                        }
//               });
//                 }
//               }).catch(err =>{
//                 console.log(err)

//                 return {
//                         error: 'err',
//                         status:false,
//                         message:" oops !! somthiong went wrong ",
//                        }
//               });


//             }

//           }).catch(err =>{
//             console.log(err)

//             return {
//                     error: 'err',
//                     status:false,
//                     message:" oops !! somthiong went wrong ",
//                    }
//           });

//     }
//   }).catch((err) => {
//     console.log(err)
//     return { err: err };

//   });


// };

// };

/*exports.update_customer = function(req, h) {
    tokenVarification(req.payload.token);
    if (tokenverified == true) {
        return Customer.findOne({
            'user_id': req.payload.user_id,
        }).exec().then((customer) => {
            if (!customer) {
                return {
                    status: false,
                    message: ' customer not found  !'
                };
            }
            if (customer) {
                return Customer.findByIdAndUpdate(customer._id, req.payload).exec().then((updatedCustomer) => {
                    if (updatedCustomer) {
                        return Users.findOne({
                            'user_id': req.payload.user_id,
                        }).exec().then((user) => {
                            if (user) {
                                return Users.findByIdAndUpdate(user._id, req.payload).exec().then((updateduser) => {
                                    //  / console.log(updateduser) 
                                    {
                                        if (updateduser && updatedCustomer) {
                                            return {
                                                status: true,
                                                message: "Customer updated !!!",
                                            }
                                        }
                                    }
                                }).catch(err => {
                                    console.log(err)

                                    return {
                                        error: 'err',
                                        status: false,
                                        message: " oops !! somthiong went wrong ",
                                    }
                                });
                            }
                        }).catch(err => {
                            console.log(err)

                            return {
                                error: 'err',
                                status: false,
                                message: " oops !! somthiong went wrong ",
                            }
                        });


                    }

                }).catch(err => {
                    console.log(err)

                    return {
                        error: 'err',
                        status: false,
                        message: " oops !! somthiong went wrong ",
                    }
                });

            }
        }).catch((err) => {
            console.log(err)
            return { err: err };

        });


    };

};*/





// exports.update_agency  = function (req, h) {
//   tokenVarification(req.payload.token);
//     if(tokenverified == true){ 
//   return Agency.findOne({
//     'user_id': req.payload.user_id,
// }).exec().then((agency) => {
//     if(!agency){
//       return {
//         status:false,
//         message: ' agency not found  !' 
//       };
//     }if(agency){
//     //  base64_decode(req.payload.driver_image, 'copy.jpg');         
//           return Agency.findByIdAndUpdate(agency._id  ,req.payload).exec().then((updatedagency)=>{
//             if(updatedagency){
//               return Users.findOne({
//                 'user_id': req.payload.user_id,
//               }).exec().then((user) => {
//                 if(user){
//                   return  Users.findByIdAndUpdate(user._id  ,req.payload) .exec().then((updateduser)=>{
//                     console.log(updateduser)
//                       {
//                       if(updateduser && updatedagency){
//                     return{
//                       status:true,
//                       message:"Agency updated !!!",
//                     }   
//                       }
//                     }
//                   }).catch(err =>{
//                 console.log(err)

//                 return {
//                         error: 'err',
//                         status:false,
//                         message:" oops !! somthiong went wrong ",
//                        }
//               });
//                 }
//               }).catch(err =>{
//                 console.log(err)

//                 return {
//                         error: 'err',
//                         status:false,
//                         message:" oops !! somthiong went wrong ",
//                        }
//               });


//             }

//           }).catch(err =>{
//             console.log(err)

//             return {
//                     error: 'err',
//                     status:false,
//                     message:" oops !! somthiong went wrong ",
//                    }
//           });    
//     }
//   }).catch((err) => {
//     console.log(err)
//     return { err: err };
//   });
// };

// };

//  exports.allDrivers = function (req, h) {
//    tokenVarification(req.payload.token);
//     if(tokenverified == true){ 
//      return Driver.aggregate([
//   { $lookup:
//      {
//        from: 'users',
//        localField: 'user_id',
//        foreignField: 'user_id',
//        as: 'driverdetails'
//      }
//    }
//   ]).exec().then((driverdetails) => {
//       return{
//         status:true,
//        message:"Drivers found",
//         driverdetails:driverdetails  
//       }
//   }).catch((err) => {
//         console.log(err)
//        return { err: err };

//         }) ;
//     }
//   };


// exports.allAgencies = function (req, h) {
//   tokenVarification(req.payload.token);
//    if(tokenverified == true){ 
//     return Agency.aggregate([
//  { $lookup:
//     {
//       from: 'users',
//       localField: 'user_id',
//       foreignField: 'user_id',
//       as: 'Agencydetails'
//     }
//   }
//  ]).exec().then((Agencydetails) => {
//      return{
//        status:true,
//        message:"Agencies found",
//        Agencydetails:Agencydetails  
//      }
//  }).catch((err) => {
//        console.log(err)
//       return { err: err };

//        }) ;
//    }
//  };


exports.allCustomers = function(req, h) {
    tokenVarification(req.payload.token);
    if (tokenverified == true) {
        return Customer.aggregate([{
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: 'user_id',
                as: 'customerdetails'
            }
        }]).exec().then((customerdetails) => {
            return {
                status: true,
                message: "customers found",
                customerdetails: customerdetails
            }
        }).catch((err) => {
            console.log(err)
            return { err: err };

        });
    }
};

// exports.allVehicles = function (req, h) {
//   tokenVarification(req.payload.token);
//     if(tokenverified == true){ 
//   return Vehicle.find({}).exec().then((Vehiclelist) => {
//   if(Vehiclelist){
//   return {
//     status:true,
//     message:"all vehicles",
//     data: Vehiclelist
//   }

//   }
// }).catch((err) => {
//   console.log(err)
//   return { err: err };

// });
// }
// }

// exports.update_vehicle  = function (req, h) {
//   tokenVarification(req.payload.token);
//     if(tokenverified == true){ 
//   return Vehicle.findOne({
//     '_id': req.payload._id,
// }).exec().then((vehicle) => {
//     if(!vehicle){
//       return {
//         status:false,
//         message: ' vehicle not found  !' 
//       };
//     }if(vehicle){
//      // base64_decode(req.payload.driver_image, 'copy.jpg');         
//           return Vehicle.findByIdAndUpdate(vehicle._id  ,req.payload).exec().then((updatedVehicle)=>{
//             // if(req.payload.vehicle_image.hapi.filename){
//             //  // file_uplode(req, req.payload.agency_id, req.payload.vehicle_image.hapi.filename,req.payload.vehicle_image);
//             // }
//            if(!updatedVehicle){
//              return{
//                status:false,
//                message:"vehicle not found !!"
//              }
//            }
//            if(updatedVehicle){
//             return{
//               status:true,
//               message:"vehicle update!!"
//             }
//           }         


//           }).catch(err =>{
//             console.log(err)

//             return {
//                     error: 'err',
//                     status:false,
//                     message:" oops !! somthiong went wrong ",
//                }
//           });
//     }
//   }).catch((err) => {
//     console.log(err)
//     return { err: err };
//   });
// };
// };

exports.totalcountofagencydata = function(req, h) {
    tokenVarification(req.payload.token);
    if (tokenverified == true) {
        return Vehicle.find({ agency_id: req.payload.agency_id }).exec().then((vehicles) => {
            if (vehicles) {
                return Driver.find({ agency_id: req.payload.agency_id }).exec().then((drivers) => {
                    if (drivers) {
                        return Customer.find({ agency_id: req.payload.agency_id }).exec().then((customers) => {
                            if (customers) {
                                return {
                                    status: true,
                                    total_count: {
                                        total_driver: drivers.length,
                                        total_vehicle: vehicles.length,
                                        total_customers: customers.length
                                    }
                                }
                            }
                        }).catch((err) => {
                            console.log(err)
                            return { err: err };
                        });
                    }
                }).catch((err) => {
                    console.log(err)
                    return { err: err };
                });
            }
        }).catch((err) => {
            console.log(err)
            return { err: err };
        });
    };
};

exports.vechicle_booking_request = function(req, h) {
    var bookingdata = new Booking({
        user_id: req.payload.user_id,
        booking_id: req.payload.booking_id,
        pickup_location: req.payload.pickup_location,
        drop_off_location: req.payload.drop_off_location,
        load_dimentions: req.payload.load_dimentions,
        prefered_vechicle_type: req.payload.prefered_vechicle_type,
        bookig_amount: req.payload.bookig_amount,
        load_image: req.payload.load_image,
        payment_method: req.payload.payment_method,
        booking_creation: req.payload.booking_creation,
    })

    tokenVarification(req.payload.token);
    if (tokenverified == true) {
        return Booking.create(userRole).then((Booking) => {
            if (Booking) {
                return {
                    status: true,
                    message: "request send to agencyies !"
                }
            }
            if (!Booking) {
                return {
                    status: false,
                    message: "request not accepted !"
                }
            }
        }).catch((err) => {
            return {
                err: err
            }
        })
    };
};



exports.fileUplode = function(req) {

    //console.log(req.payload.drivers_images)
    decode_base64(req.payload.drivers_images)
}