var Tax = require('../../models/tax');
const Log           = require('../../helpers/log.js');
const global        = require('../../config/constant.js');

let self = module.exports = {
    
    add: (req, h) => {
        if(req.payload){
            if(req.payload.agency_id && req.payload.agency_id != 0 ){
                return Tax.findOne({'tax_name':req.payload.tax_name, 'agency':req.payload.agency_id, 'status':{$ne:0}}).exec().then((exists) => {
                    if(exists){
                        return {
                            status: 101,
                            msg: req.payload.tax_name + " - already exists in database."
                        };
                    }else{

                        var category = new Tax({
                            agency: req.payload.agency_id,
                            tax_name: req.payload.tax_name,
                            description: req.payload.description,
                            value: req.payload.value,
                            type: req.payload.type,
                            created_by: req.payload.created_by,
                            updated_by: req.payload.created_by
                        });
                        return Tax.create(category).then((addedcategory) => {               
                            if (addedcategory) {
                                
                                // Make json for log
                                var log = {
                                    'operation':'Added new tax category - '+addedcategory.tax_name,  
                                    'agency': addedcategory.agency_id,
                                    'tax':addedcategory._id,
                                    'updated_by':addedcategory.created_by,
                                    'old_payload':null,
                                    'new_payload':addedcategory                                       
                                }                           
                                return Log.addLog(log, 'log_tax').then((addedcategorylog) => {        
                                    return {
                                        status: 100,
                                        msg: 'Tax Category is successfully added.'
                                    }   
                                 }).catch((err2) => { 
                                    return {
                                        status: 101,
                                        msg: "Something went wrong while saving log."
                                    };
                                });

                            } else {
                                return {
                                    status: 101,
                                    msg: 'Opps! Tax Category is not added. Please try again.'
                                }
                            }
                        }).catch((err2) => {   
                            console.log('Error-->>', err2)
                            return {
                                status: 101,
                                msg: err2.message
                            };
                        });
                    }               
                })
            }else{
                return {'status':101, 'msg': "Please choose agency to add tax category."}
            } 
        }else{
            return {'status':101, 'msg': "Please try again."}
        }
    },
  
    update: (request, h) => {
      
        if(!request.payload){
           return { 'status':101, 'msg': 'Please send the data to update.'}; 
        }else{
            if(!request.payload.updated_by){
               return { 'status':101, 'msg': 'Please add the user who modifies the category.'};              
            }else{              
                
                // Check whether there is any other module which having same name.
                return Tax.findOne({ '_id': { $ne: request.params._id}, 'tax_name':request.payload.tax_name, 'agency':request.payload.agency_id }).exec().then((result) => {
                   
                    if(result){                                                  
                        return { 'status':100, 'msg': 'Tax name already exists', 'data':result }
                    }else{

                        // Update Query
                        return Tax.findOneAndUpdate({_id:request.params._id },{ $set: request.payload },{ returnOriginal: false }).exec().then((result) => {
                            if(result){
                                
                                // Make json for log
                                var log = {
                                    'operation':'Updated category - '+result.tax_name, 
                                    'agency': result.agency,
                                    'created_by':result.created_by,     
                                    'updated_by':result.updated_by, 
                                    'tax':result._id,
                                    'old_payload':result,
                                    'new_payload':request.payload,
                                }                           
                                return Log.addLog(log, 'log_tax').then((taxlog) => {         
                                    return { 'status':100, 'msg': 'Successfully updated tax category.', 'data':result };    
                                 }).catch((err) => { 
                                    return {
                                        status: 101,
                                        msg: err.message
                                    };
                                }); 
                              
                            }else{
                                return { 'status':101, 'msg': "Can't find the tax category.", 'data':'' }; 
                            }                          
                        }).catch((err) => {
                            console.log(err);
                            return {'status':101, 'msg':err.message}
                        });
                    }              
                }).catch((err) => {
                    return {'status':101, 'msg':err.messagess}
                });
            }         
        }        
    },
    
    // Delete tax category 
    delete: (request, h) => {
        if (!request.params._id) {
            return {status:101, msg: 'Tax Category id is required' };
        }
        return Tax.findByIdAndUpdate(request.params._id, {status:0}).exec().then((result) => {            
            if(result){
                
                 // Make json for log   
                var log = {
                    'operation':'Deleted the tax category - '+result.tax_name,
                    'agency': result.agency,
                    'created_by':result.created_by,     
                    'updated_by':result.updated_by, 
                    'tax':result._id,
                    'old_payload':result,
                    'new_payload': {status:0}       
                }
                return Log.addLog(log, 'log_tax').then((addedvehiclelog) => {      
                    return {'status':100, 'msg': 'Tax category is deleted successfully' }
                }).catch((err2) => { 
                    return {
                        status: 101,
                        msg: err2.message
                    };
                });
                return { status:100, msg: 'Tax category is deleted successfully.' }
            }else{
                return { status:101, msg: "Tax category doesn't not found." }
            }
        }).catch((err) => {
            return { 'status': 101, 'msg': err.message };
        });
    },

    // Get categories list 
    fetchList: (request, h) => {
        if (request.payload) {
           
            const promise  = new Promise((resolve, reject) => {
                let pdata  = request.payload
                let search_value = ''
                let search_regex = ''
                let draw   = pdata.draw
                let start  = pdata.start
                let length = pdata.length
                let order  = ''
                if (pdata.order) {
                    order  = pdata.order
                }

                let columns = pdata.columns
                let column_search = []
                let columns_valid = []
                let i
                let fetch_columns = {};
                if (columns) {
                    for (i = 0; i < columns.length; i++) {
                        let key = columns[i].name;
                        if (pdata.search.value) {                            
                            if (key) {
                                let c_sr = {
                                    [key]: { $regex: '.*' + pdata.search.value + '.*', $options: "xis" }
                                }
                                column_search.push(c_sr)
                            }
                        }
                        columns_valid.push(key);
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

                agency_id = pdata.agency_id;
                let total_records = 0
                let get_total_records = self.taxCount(agency_id, order, dir, column_search, search_value, search_regex);
                get_total_records.then((res) => {
                    total_records = res.data
                    let records = 0
                    let dataget_records = 0
                    get_records = self.getTaxes(agency_id, start, length, order, dir, column_search, search_value, search_regex, fetch_columns);
                    get_records.then((res) => {
                        output = {
                            "status":100,
                            "msg":"Success",
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
    },

    // Get tax categories total count
    taxCount: function (agency_id, order, dir, column_search, search_value, search_regex) {
        const promise = new Promise((resolve, reject) => {
            let agency = {}
            if (agency_id) {
                agency = agency_id;
            }
            if (column_search.length) {
                Tax.aggregate([
                    {
                        $match: { $or: column_search }
                    },
                    { $count: "categories" },
                    { $unwind: "$categories" }
                ]).exec().then((res) => {
                    if (res.length) {
                        resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].categories });
                    } else {
                        resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
                    }
                }).catch((err) => {
                    reject({ 'status': 101, 'msg': err, 'data': '' });
                });
            } else {
                var conditions = {'status':{$ne:0}}
                if(agency_id && agency_id != 0){
                    conditions = {'status':{$ne:0}, 'agency':agency_id}
                }
                Tax.countDocuments(conditions).exec().then((categories) => {
                    
                    resolve({ 'status': 100, 'msg': 'Success', 'data': categories });
                }).catch((err) => {
                    reject({ 'status': 101, 'msg': err.message, 'data': '' });
                });
            }
        });
        return promise
    },

    // Get taxes list 
    getTaxes: function(agency_id, start, length, order, dir = 'asc', column_search, search_value, search_regex, fetch_columns) {
        
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
                Tax.aggregate([
                    { $match: { $or: column_search } }, 
                    { $sort: sort },
                    { $skip: Number(start) }, { $limit: Number(length) },
                    { $project: fetch_columns }
                ]).exec().then((categories) => {
                    Tax.populate(categories, {path: 'agency',select: 'agency_name'}, function(err, populatedresult) {
                        
                        resolve({ 'status': 100, 'msg': 'Success', 'data': populatedresult });
                    });
                }).catch((err) => {
                    reject({ 'status': 101, 'msg': err.message, 'data': '' });
                });
                
            } else {
                var conditions = {'status':{$ne:0}}
                if(agency_id && agency_id != 0){
                    conditions = {'status':{$ne:0}, 'agency':agency_id}
                }
                Tax.find(conditions,fetch_columns).populate('agency',{'agency_name':1, _id:0}).sort(sort).skip(Number(start)).limit(Number(length)).exec().then((categories) =>{
                    resolve({ 'status': 100, 'msg': 'Success', 'data': categories });
                }).catch((err) => {
                    reject({ 'status': 101, 'msg': err.message, 'data': '' });
                });                      
            }    
        });
        return promise
    }, 

    getDetailByID: function(request, h){
      
        if(request.params._id && request.params._id != 0){
            return Tax.findById( request.params._id ).exec().then((category) => {           
                if (category) {       
                    return { status:100, msg: 'Success', data:category }
                }else{
                    return ({'status':101, 'msg':'No tax category detail found.', 'data':''});
                }
            }).catch((err) => {                
                return ({'status':101, 'msg':err.message, 'data':''});
            });
        }else{
            return ({'status':101, 'msg':'Please send the tax catgeory ID.', 'data':''});
        }      
    },

    // Change status of the tax category to active from inactive and vice versa.
    changeStatus: function(request, h){
        if(request.params._id){           
            if(request.payload){                
                if('status' in request.payload && request.payload.status){
                    return Tax.findByIdAndUpdate({_id:request.params._id},{status:request.payload.status}, {new:true}).exec().then((res) => {                                                                              
                        return { 'status':100, 'msg':'Success','data':res }                             
                    }).catch((err) => {
                        return { 'status': 101, 'msg': err.message, 'data': '' }
                    });                              
                    
                }else{
                    return { 'status': 101, 'msg': 'Please send the status to change.' };
                }               
            }else{
                return { 'status': 101, 'msg': 'Please send the request parameters in the api.' };
            }           
        }else{
            return { 'status': 101, 'msg': 'Please send the tax category id to change the status.' };
        } 
    }
}


