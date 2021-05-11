const Trailer = require('../../models/trailer')
const Agencies = require('../../models/agency')
const valid = require('../../config/validation')
const Users = require('../../models/user')
let storage = require('node-sessionstorage')
const moment = require('moment')
let tokenverified = false
const fs = require('fs');
let path = require('path');
let date = new Date();
const FileType = require('file-type');
const Log = require('../../helpers/log.js');
const { Console } = require('console')
const csv = require('csvtojson')
const csvFilePath = `${__dirname}/data.csv`



exports.trailerregister = async(request, h) => {
    var userdata = await Trailer.find({ 'registration_no': request.payload.registration_no })
 if(userdata.length > 0){
    alreadyexists.push(jsonObj[i])
 } 
    else{
           trailer = new Trailer({
     agency:request.payload.agency,
    makers_name: request.payload.makers_name,
    trailer_type: request.payload.trailer_type,
    registration_no  :request.payload.registration_no,
    trailer_break_controller : request.payload.trailer_break_controller,
    color: request.payload.color,
    trailer_capacity:request.payload.trailer_capacity ,
    trailer_lights: request.payload.trailer_lights ,
    trailer_wheels: request.payload.trailer_wheels ,
    trailer_materials: request.payload.trailer_materials ,
    trailer_height: request.payload.trailer_height ,
    trailer_width:  request.payload.trailer_width,
    trailer_length: request.payload.trailer_length ,
    trailer_hydrolic : request.payload.trailer_hydrolic,
    maker_name: request.payload.maker_name,
    tax_paid_upto: request.payload.tax_paid_upto,
    insurance_vaild: request.payload.insurance_vaild,
    Registration_vaild: request.payload.Registration_vaild,
    owner_name: request.payload.owner_name,
    owner_contact_number: request.payload.owner_contact_number,
    trailer_category : request.payload.trailer_category,
    permanent_address: request.payload.permanent_address,
    trailer_groundClearance : request.payload.trailer_groundClearance,
    trailer_document : request.payload.trailer_document ,
    trailer_electronic :request.payload.trailer_electronic,
    created_by: request.payload.created_by,
    updated_by: request.payload.created_by
})

return Trailer.create(trailer).then((result) => {
    return {
            status: 100,
            msg: "Successfully"
                                  
        }
}).catch((err) => { 
    console.log(err);           
    return {'status':101, 'msg':'Something went wrong. Please try again.'}
});
           
        }  
  
}


exports.deletetrailer = async(request, h) => { 
    return Trailer.findByIdAndUpdate(request.payload.trailer_id,{'deleted':1}).exec().then((result) => {
        return {'status':100, 'msg': 'Tralier Deleted Successfully' }  
    }).catch((err) => {
        return {'status':101, 'msg': err };
    });
}



exports.getSingleTrailer = async (request, h) => {
    var condition = {'status':0}
    if(  request.payload.trailer_id ){
        condition = { 'status':0 , "_id":request.payload.trailer_id }
    }
 
    return Trailer.find(condition, {}).exec().then((Trailer) => {
        return {
            status: 100,
            msg: "Successfully listed",
            data: Trailer[0]                         
        }
    }).catch((err) => {
        return {
            status: 101,
            msg: err.errmsg                             
        }
    });
}


exports.updateTrailer = async (request,h) => { 

    let trailer = request.payload  


    return Trailer.findById(request.payload._id).exec().then((res_trailer) => {
        if(res_trailer){
            return Trailer.findOneAndUpdate({ _id: res_trailer._id }, { $set: trailer}).exec().then((result) => {         
                if (result) {
                    return {
                        status: 100,
                        msg: "Successfully Updated",
                        //  data : result                    
                    }
                }else{                                      
                    return { 'status': 101,  'msg': "Vehicle is not updated. Please try again." }
                }                
            }).catch((err) => {
                return {'status':101, 'msg':err}
            });
          
        }
        else{
            return { 'status': 101,  'msg': "Trailer not found. Please try again." }
        }
    }).catch((err) => {        
        return { 'status': 101,  'msg': "Trailer not found. Please try again." }
    });
    


}





exports.getAllTrailer = function(request, h) {
    if (request.payload) {
        const promise = new Promise((resolve, reject) => {
            let pdata = request.payload
            let search_value = ''
            let search_regex = ''
            let draw = pdata.draw
            let start = pdata.start
            let length = pdata.length
            let order = ''
            if (pdata.order) {
                order = pdata.order
            }
            let columns = pdata.columns
            let column_search = []
            let columns_valid = []
            let i
            let fetch_columns = {};
            if (columns) {
                for (i = 0; i < columns.length; i++) {
                    let key = columns[i].name
                    if (pdata.search.value) {
                        if (key) {

                            let c_sr = {
                                    [key]: { $regex: '.*' + pdata.search.value + '.*', $options: "si" }
                                }
                            column_search.push(c_sr)
                        }
                    }
                    columns_valid.push(key)
                    fetch_columns[key] = true;
                }
            }

            let col = 0;
            let dir = "";
            let j
            if (order) {
                for (j = 0; j < order.length; j++) {
                    col = order[j].column
                    dir = order[j].dir
                }
            }

            if (dir != "asc" && dir != "desc") {
                dir = "asc";
            }

            if (columns_valid[col]) {
                order = columns_valid[col];
            } else {
                order = null;
            }

            agency_id = "";

            
            let total_records = 0
            let get_total_records = trailerCount(agency_id, order, dir, column_search, search_value, search_regex);

            get_total_records.then((res) => {
                total_records = res.data
                let records = 0
                let dataget_records = 0

                get_records = gettrailer(agency_id, start, length, order, dir, column_search, search_value, search_regex, fetch_columns);
                get_records.then((res) => {
                    output = {
                        "status":100,
                        "msg":"Success",
                        "draw": draw,
                        "recordsTotal": total_records,
                        "recordsFiltered": total_records,
                        "data": res.data
                    }
                    resolve(output)
                }).catch((err) => {
                    console.log("Total record error1- ", err);
                    reject(error)
                })

            }).catch((err) => {
                console.log("Total record error2- ", err);
                reject(error)
            })
        });
        return promise;
    }
}

// Get agencies total count
function trailerCount(agency_id, order, dir, column_search, search_value, search_regex) {
    const promise = new Promise((resolve, reject) => {
        if (column_search.length) {
            Trailer.aggregate([{
                  $match: { $or: column_search, $and: [{'deleted':0}] }
                },
                { $count: "trailers" },
                { $unwind: "$trailers" }
            ]).exec().then((res) => {
                if (res.length) {
                    resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].trailers });
                } else {
                    resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
                }
            }).catch((err) => {
                reject({ 'status': 101, 'msg': err, 'data': '' });
            });
        } else {
            Trailer.countDocuments({}).exec().then((trailers) => {
                resolve({ 'status': 100, 'msg': 'Success', 'data': trailers });
            }).catch((err) => {
                reject({ 'status': 101, 'msg': err, 'data': '' });
            });
        }
    });
    return promise
}

// Get agencies list 
function gettrailer(agency_id, start, length, order, dir = 'asc', column_search, search_value, search_regex, fetch_columns) {
    const promise = new Promise((resolve, reject) => {
        let sort = ''
        if (dir == 'asc') {
            dir = 1
        } else {
            dir = -1
        }
        if (order) {
            sort = {
                [order]: dir
            }
        } else {
            sort = { '_id': -1 }
        }
        if (column_search.length) {
            Trailer.aggregate([
                { $match: { $or: column_search } }, { $sort: sort },
                { $skip: Number(start) }, { $limit: Number(length) },
                { $project: fetch_columns }
            ]).exec().then((trailers) => {
                resolve({ 'status': 100, 'msg': 'Success', 'data': trailers });
            }).catch((err) => {
                reject({ 'status': 101, 'msg': err, 'data': '' });
            });
        } else {
            Trailer.aggregate([
                { $match: {'deleted':0} },
                { $sort: sort },
                { $project: fetch_columns },
                { $skip: Number(start) },
                { $limit: Number(length) }
            ]).exec().then((trailers) => {
                resolve({ 'status': 100, 'msg': 'Success', 'data': trailers });
            }).catch((err) => {
                reject({ 'status': 101, 'msg': err, 'data': '' });
            });
        }
    });
    return promise
}



exports.trailerbulkimport = async(req, h) => {

    // const csvFilePath = `${__dirname}/data.csv`
    
    var newrecord = []
     var alreadyexists = []
     var fieldsarray = ['makers_name','maker_name','agency','created_by']
return csv().fromFile(csvFilePath).then(async(jsonObj)=>{
    for (var i = 0; i < jsonObj.length; i++) {
  if(jsonObj[i].agency == '' || jsonObj[i].agency == null || jsonObj[i].makers_name == null || jsonObj[i].makers_name == ''
    ||  jsonObj[i].maker_name == '' || jsonObj[i].maker_name == null || jsonObj[i].created_by == '' || jsonObj[i].Registration_vaild ) {
     return {'status':101 ,'msg' : 'Mandatory fields to always be required' ,'data':fieldsarray}
  }
  else{
    var userdata = await Trailer.find({ 'registration_no': jsonObj[i].registration_no })
 if(userdata.length > 0){
    alreadyexists.push(jsonObj[i])
 } 
    else{
           trailer = new Trailer({
    agency:jsonObj[i].agency,
    makers_name: jsonObj[i].makers_name,
    trailer_type: jsonObj[i].trailer_type,
    registration_no: jsonObj[i].registration_no,
    trailer_break_controller : jsonObj[i].trailer_break_controller,
    color: jsonObj[i].color,
    trailer_capacity:jsonObj[i].trailer_capacity ,
    trailer_lights: jsonObj[i].trailer_lights ,
    trailer_wheels: jsonObj[i].trailer_wheels ,
    trailer_materials: jsonObj[i].trailer_materials ,
    trailer_height: jsonObj[i].trailer_height ,
    trailer_width:  jsonObj[i].trailer_width,
    trailer_length: jsonObj[i].trailer_length ,
    trailer_hydrolic : jsonObj[i].trailer_hydrolic,
    maker_name: jsonObj[i].maker_name,
    tax_paid_upto: jsonObj[i].tax_paid_upto,
    insurance_vaild: jsonObj[i].insurance_vaild,
    Registration_vaild: jsonObj[i].Registration_vaild,
    owner_name: jsonObj[i].owner_name,
    owner_contact_number: jsonObj[i].owner_contact_number,
    trailer_category : jsonObj[i].trailer_category,
    permanent_address: jsonObj[i].permanent_address,
    trailer_groundClearance : jsonObj[i].trailer_groundClearance,
    trailer_document : jsonObj[i].trailer_document ,
    trailer_electronic :jsonObj[i].trailer_electronic,
    created_by: jsonObj[i].created_by,
    updated_by: jsonObj[i].created_by
})

return Trailer.create(trailer).then((result) => {}).catch((err) => { 
    console.log(err);           
    return {'status':101, 'msg':'Something went wrong. Please try again.'}
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