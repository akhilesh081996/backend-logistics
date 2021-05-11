//var exports = module.exports = {};
var Users      = require('../../models/user');
var Agency     = require('../../models/agency');
var valid      = require('../../config/validation');
var Role       = require('../../models/role');
var jwt        = require('jsonwebtoken');
const storage  = require('node-sessionstorage')
var nodemailer = require('nodemailer');
var Otp        = require('../../models/otptable');
var OrderStage = require('../../models/order_stages');
var uniqid     = require('uniqid');
const csv = require('csvtojson')
const csvFilePath = `${__dirname}/data.csv`

function emailSender(email, otp) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: 'puneet.prajapati@contriverz.com', pass: '@Contrive27#' }
    });

    var emailform = 'puneet.prajapati@contriverz.com';
    var subject = 'OTP Email from Logistics'
    var text = '<h4> Your OTP :- ' + otp + '</h4>'

    var mailOptions = { from: emailform, to: email, subject: subject, text: text };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            // console.log(error);
        } else {
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

exports.verifylogin = function(req, h) {
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
                password: req.payload.password,
				admin:req.payload.admin,
				slug:req.payload.slug
            }
        }, 'secret', {algorithm: 'HS256', expiresIn: '24hr' });
        //if (loginurl[3] + '/' + loginurl[4] == loginurl[3] + '/admin') {
        if (req.payload.slug) {
           
            return Agency.findOne({ 'email': req.payload.email, 'slug': loginurl[3] }).exec().then((user) => {
                if (!user) return h.redirect('login', {
                    status: false,
                    message: 'Wrong email address or Password!'
                });
                if (!user.validPassword(req.payload.password)) return h.redirect('login', {
                    status: false,
                    message: 'Wrong email address or Password!'
                })
                user.password = undefined;
                storage.setItem('isLogin', '1');
                storage.setItem('user', user)
                
                    // if(loginurl[3]+'/'+loginurl[4] == 'trading_set/admin'){
                return h.redirect(user.slug + '/admin/dashboard', {
                    token: Token,
                    status: true,
                    message: "user Login successfully",
                    data: user
                });
                // }
                // return h.redirect('dashboard', {
                //     token: Token,
                //     status: true,
                //     message: "user Login successfully",
                //     data: user
                // });
            }).catch((err) => {
                console.log(err)
                    //return { err: err };
                return h.redirect('login', { status: false, err: err });
            });

        } else {
            if(req.payload.admin == 1){
                return Users.findOne({ 'email': req.payload.email, 'isAdmin':1 }).exec().then((user) => {  
                    if (!user){
                        return {'status':101, 'msg':'Wrong email address.'}
                    } 
                    if (!user.validPassword(req.payload.password)) {
                        return {'status':101, 'msg':'Password does not match.'}
                    }
                    //user.password = undefined;
                    return {'status':100, 'msg':'Login successfully', 'data': user, 'token':Token}
                }).catch((err) => {
                    return {'status':101, 'msg':err}
                });
            }else{
                return Users.findOne({ 'email': req.payload.email, 'isAdmin':0 }).exec().then((user) => {
                    if (!user){
                        return {'status':101, 'msg':'Wrong email address.'}
                    } 
                    if (!user.validPassword(req.payload.password)) {
                        return {'status':101, 'msg':'Password does not match.'}
                    }
                    user.password = undefined;
                    return {'status':100, 'msg':'Login successfully', 'data': user, 'token':Token}
                }).catch((err) => {
                    return {'status':101, 'msg':err.errmsg}
                });
            }           
        }
    };
}

exports.agencyRegister = function (req, h) {
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
     }
     else {
		
		return Agency.findOne({ 'email': req.payload.email }).exec().then((user) => {			
			if(user){
				return {
					status: 101,
					msg: "Email address already exists",
				} 
			}
			else {
                return Agency.findOne({ 'agency_name': req.payload.agency_name }).exec().then((user) => {            
                    if(user){
                        return {
                            status: 101,
                            msg: "Agency name already exists",
                        } 
                    }else{

                        return Agency.findOne({ 'slug': req.payload.slug }).exec().then((user) => {            
                            if(user){
                                return {
                                    status: 101,
                                    msg: "Slug already exists",
                                } 
                            }else{
                                var Agency_id = uniqid();
                                var agencydata;
                                var userEmail = req.payload.email;
                                var userPassword = req.payload.password;
                                agencydata = new Agency({
                                    agency_id: Agency_id,
                                    username: '',
                                    slug: req.payload.slug,
                                    email: req.payload.email,
                                    contact: req.payload.contact,
                                    password: req.payload.password,
                                    status: 0,
                                    deleted: 0,
                                    created_at: new Date().toISOString(),
                                    agency_name: req.payload.agency_name,
                                    llc_or_registration_no: req.payload.llc_or_registration_no,
                                    address: req.payload.address,
                                    city: req.payload.city,
                                    country: req.payload.country,
                                    postal_code: req.payload.postal_code,
                                    created_by: null,
                                    updated_by: null,
                                });
                                    agencydata.password = agencydata.generateHash(agencydata.password)
                                return Agency.create(agencydata).then((agency) => {
                                        addRoleDriver(agencydata._id, agencydata.agency_name, agencydata.created_by)
                                        addOrderStages(agencydata._id, agencydata.created_by )
                                        emailSender(userEmail, userPassword)
                                        /*if(req.payload.imageFile){
                                            var newpath = path.join(__dirname, '../../../../public/uploads/' + Agency_id)
                                            fs.mkdir(newpath, { recursive: true }, (err) => {
                                                if (err) {
                                                    return {'status':101, 'msg': "File is not uploaded." }
                                                }
                                                else {
                                                    decode_base64(req.payload.imageFile,Agency_id, 'logo', agency._id);
                                                    return {'status':100, 'msg': 'File Successfully added.' }
                                                }
                                            });
                                        }*/
                                        return {'status':100, 'msg': 'Agency successfully registered.', 'data':agency }
                                }).catch((err) => {
                                    console.log(err)
                                    return {'status':101, 'msg': err.errmsg };
                                });
                            }
                        }).catch((err)=>{
                            return {status: 101, msg: err.message}
                        });
                    }
                }).catch((err)=>{
                    return {status: 101, msg: err.message}
                });
			}		 
		 
		}).catch((err) => {
            console.log(err)
			return { 'status': 101, 'msg': err.message } 
        });
	}

    // Add role by default when adding agency
    addRoleDriver = function(agency_id, name, created_by) {
    
        var role = new Role({
            role_name: 'Driver',
            role_type: 1,
            description: 'Driver of ' + ' ' + name,
            permissions: [],
            agency: agency_id,
            created_by: created_by,
            updated_by: created_by,
        });
               
        return Role.create(role).then((addedrole) => {
            if (addedrole) {                
                return { 'status': 100, 'msg': '' }
            } else {
                return { 'status': 101, 'msg': 'Opps!! Role Not Added Please Add Again'
                }
            }
        }).catch((err) => {
            console.log(err)
            return { 'status': 101, msg: err.message };
        });              
    }

    // Add order stages by default when adding agency
    addOrderStages = function(agency_id, created_by) {    
        if(!agency_id){
           return {status: 101, msg: "Please select agency in which you added order stage."}
        }           
        let orderstages = [
              { stage_name: 'Pending', description: '', sort_order: 1, agency: agency_id, status: 1, created_by: created_by, updated_by: created_by },
              { stage_name: 'Active', description: '', sort_order: 2, agency: agency_id, status: 1, created_by: created_by, updated_by: created_by },
              { stage_name: 'Completed', description: '', sort_order: 3, agency: agency_id, status: 1, created_by: created_by, updated_by: created_by }
           ]

        return OrderStage.insertMany(orderstages).then((addedstage) => {
            console.log("Added Stage---->>>>",addedstage);
            if (addedstage.length > 0) {
                
                // Make json for log                                    
                var i 
                let logs = []
                for(i=0;i<addedstage.length;i++){
                    logs.push({
                        'operation':'Added the default order stages - '+addedstage[i].stage_name,   'created_by':addedstage[i].created_by,      
                        'updated_by':addedstage[i].updated_by,      
                        'agency':addedstage[i].agency,
                        'order_stage':addedstage[i]._id,
                        'new_payload': addedstage[i],
                        'old_payload': addedstage[i]
                    })  
                }
                                
                return Log.addLog(logs, 'log_order_stages').then((orderstagelog) => {
                     return {status : 100, msg:"Order stage is successfully added"} 
                 }).catch((err2) => { 
                    return {
                        status: 101,
                        msg: "Something went wrong while adding log."
                    };
                })
            }
        })       
    }
}




exports.userbulkimport = async(req, h) => {

    // const csvFilePath = `${__dirname}/data.csv`
    
    var newrecord = []
     var alreadyexists = []
     var fieldsarray = ['role','role_type','first_name','agency','password','contact','created_by']
return csv().fromFile(csvFilePath).then(async(jsonObj)=>{
    for (var i = 0; i < jsonObj.length; i++) {
  if(jsonObj[i].role == '' || jsonObj[i].role == null || jsonObj[i].role_type == '' ||
   jsonObj[i].email == '' ||   jsonObj[i].email == null || jsonObj[i].password == '' || jsonObj[i].password == null
    || jsonObj[i].agency == '' || jsonObj[i].agency == null || jsonObj[i].contact == null || jsonObj[i].contact == ''
    ||  jsonObj[i].first_name == '' || jsonObj[i].first_name == null || jsonObj[i].created_by == '' ) {
     return {'status':101 ,'msg' : 'Mandatory fields to always be required' ,'data':fieldsarray}
  }
  else{
    var userdata = await Users.find({ 'email': jsonObj[i].email })
 if(userdata.length > 0){
    alreadyexists.push(jsonObj[i])
 } 
    else{
   var User_id = uniqid();
            userdata = new Users({
                user_id: User_id,
                agency: jsonObj[i].agency_id,
                role_type: jsonObj[i].role_type,
                role:jsonObj[i].role_id,
                first_name: jsonObj[i].first_name,
                last_name: jsonObj[i].last_name,
                email: jsonObj[i].email,
                dob: jsonObj[i].dob,
                contact: jsonObj[i].contact_no,
                password: jsonObj[i].password,
                isAdmin: 0,
                status: 1,
                created_by: jsonObj[i].created_by,
                updated_by: jsonObj[i].created_by
            });

            userdata.password = userdata.generateHash(userdata.password); 
            return  Users.create(userdata).then((user) => {
                // return {
                //              'status':100, 
                //              'msg':'User created successfully', 'data':user
                //          }

            }).catch((err) => {
                    return {'status':101, 'msg': err.message };
                });
                   newrecord.push(jsonObj[i])
 }  
  }
    }

    return {'status':100, 'msg':'Successfully', 'newrecord': newrecord ,'alreadyexists':alreadyexists }
})
.catch((err) => { 
    console.log(err);           
    return {'status':101, 'msg':'Something went wrong. Please try again.'}
});
 }