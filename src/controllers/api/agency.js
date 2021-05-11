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

function file_uplode(request, folder, imgname, fileobject) {
    const data = request.payload;
    console.log(data);
    const newpath = path.join(__dirname, '../user_data/' + folder + '/');
    //  const name = data.vehicle_image.hapi.filename;
    const path1 = newpath + imgname;
    const file = fs.createWriteStream(path1);

    file.on('error', (err) => console.error(err));

    fileobject.pipe(file);

    fileobject.on('end', (err) => {
        const ret = {
            filename: fileobject.filename,
            headers: fileobject.headers
        }
        return JSON.stringify(ret);
    })

}




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


exports.update_agency = function(req, h) {
    tokenVarification(req.payload.token);
    if (tokenverified == true) {
        return Agency.findOne({
            'user_id': req.payload.user_id,
        }).exec().then((agency) => {
            if (!agency) {
                return {
                    status: false,
                    message: ' agency not found  !'
                };
            }
            if (agency) {
                //  base64_decode(req.payload.driver_image, 'copy.jpg');         
                return Agency.findByIdAndUpdate(agency._id, req.payload).exec().then((updatedagency) => {
                    if (updatedagency) {
                        return Users.findOne({
                            'user_id': req.payload.user_id,
                        }).exec().then((user) => {
                            if (user) {
                                return Users.findByIdAndUpdate(user._id, req.payload).exec().then((updateduser) => {
                                    if (updateduser && updatedagency) {
                                        return {
                                            status: true,
                                            message: "Agency updated !!!",
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

};



exports.allAgencies = function(req, h) {
    tokenVarification(req.payload.token);
    if (tokenverified == true) {
        return Agency.aggregate([{
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: 'user_id',
                as: 'Agencydetails'
            }
        }]).exec().then((Agencydetails) => {
            return {
                status: true,
                message: "Agencies found",
                Agencydetails: Agencydetails
            }
        }).catch((err) => {
            console.log(err)
            return { err: err };

        });
    }
};


exports.getDriversOfOwnAgency = (req, h) => {
    var pageNo = parseInt(req.query.pageNo)
    var size = parseInt(req.query.size)
    var query = {}
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response)
    }
    query.skip = size * (pageNo - 1)
    query.limit = size
    tokenVarification(req.payload.token);
    if (tokenverified == true) {
        return Users.findOne({
            'user_email': decode.payload.data.email
        }).exec().then((user) => {
            console.log(user)
            if (user) {
                return Driver.find({ agency_id: user.user_id }, {}, query).exec().then((drivers) => {
                    console.log('drivers', drivers)
                    if (!drivers) return { status: false, message: 'drivers not found' };

                    return {
                        status: true,
                        message: 'drivers found !',
                        drivers: drivers,
                        totalPage: 5

                    };

                }).catch((err) => {
                    console.log(err)
                    return { err: err };

                });
            } else {
                return {
                    err: err
                }
            }
        }).catch((err) => {
            console.log(err)
            return { err: err };

        });

    }

}


exports.getVehiclesOfOwnAgency = (req, h) => {
    var pageNo = parseInt(req.query.pageNo)
    var size = parseInt(req.query.size)
    var query = {}
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response)
    }
    query.skip = size * (pageNo - 1)
    query.limit = size
    tokenVarification(req.payload.token);
    //console.log(decode.payload.data.email)
    if (tokenverified == true) {
        return Users.findOne({
            'user_email': decode.payload.data.email
        }).exec().then((user) => {
            //console.log(user)
            if (user) {
                return Vehicle.find({ agency_id: user.user_id }, {}, query).exec().then((vehicle) => {
                    console.log('vehicles', vehicle)
                    if (!vehicle) return {
                        status: false,
                        message: 'Vehicle not found'
                    };
                    if (vehicle.length == 0) {
                        return {
                            status: false,
                            message: 'Vehicle not found !',
                        }
                    }
                    return {
                        status: true,
                        message: 'Vehicle found !',
                        vehicles: vehicle
                    };

                }).catch((err) => {
                    console.log(err)
                    return { err: err };

                });
            } else {
                return {
                    err: err
                }
            }
        }).catch((err) => {
            console.log(err)
            return { err: err };

        });

    }

}


exports.getAgencyDetails = (req, h) => {
    tokenVarification(req.payload.token);
    if (tokenverified == true) {
        return Users.findOne({
            'user_email': decode.payload.data.email
        }).exec().then((user) => {
            console.log(user)
            if (user) {
                return Agency.find({ user_id: user.user_id }).exec().then((agency) => {
                    console.log('agency', agency)
                    if (!agency) return {
                        status: false,
                        message: 'agency not found'
                    };

                    return {

                        status: true,
                        message: 'agency found !',
                        user: user,
                        agency: agency,
                        totalPage: 3
                    };

                }).catch((err) => {
                    console.log(err)
                    return { err: err };

                });
            } else {
                return {
                    err: err
                }
            }
        }).catch((err) => {
            console.log(err)
            return { err: err };

        });

    }

}