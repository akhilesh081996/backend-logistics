var EquipmentCategory = require('../../models/equipment_category');
const Log           = require('../../helpers/log.js');
const global        = require('../../config/constant.js');

let self = module.exports = {
    
    add: (req, h) => {
        if(req.payload){
            if(req.payload.agency_id && req.payload.agency_id != 0 ){
                return EquipmentCategory.findOne({'category_name':req.payload.category_name, 'agency':req.payload.agency_id, 'status':{$ne:0}}).exec().then((exists) => {
                    if(exists){
                        return {
                            status: 101,
                            msg: req.payload.category_name + " equipment category already exists in database."
                        };
                    }else{

                        let custom_fields = {}
                        if("custom_fields" in req.payload){
                            custom_fields = req.payload.custom_fields
                            if(custom_fields && custom_fields.length > 0){               
                                custom_fields.forEach((current, index)=> {                    
                                    if(current.type == "image"){
                                        if('val' in current && current.val){
                                            var get_file = current.val;
                                            var newpath = path.join(__dirname + `/../../../public/uploads/${req.payload.agency_id}/equipment/`)
                                          
                                            fs.mkdirSync(newpath, { recursive: true })
                                            var buf = Buffer.from(get_file.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');
                                            var imagename ='';
                                            var mime  = get_file.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
                                            var value = '';                    
                                            if (mime && mime.length) {
                                                result = mime[1].split("/");
                                                value  = result[1];
                                            }

                                            if(value){
                                                imagename = Date.now() + '.'+value;
                                            }else{                           
                                                imagename = Date.now() + '.jpg';                            
                                            }
                                            if (!fs.existsSync(newpath)) {
                                                self.decode_buffer(buf, req.payload.agency_id+'/equipment', imagename);
                                                current.val = 'public/uploads/'+req.payload.agency_id+'/equipment/'+imagename;

                                            }else{ 
                                                self.decode_buffer(buf, req.payload.agency_id+'/equipment', imagename);
                                                current.val = 'public/uploads/'+req.payload.agency_id+'/equipment/'+imagename;                           
                                            }
                                        }else{
                                            current.val = '';
                                        }                        
                                    }
                                })
                            }
                        }

                        var category = new EquipmentCategory({
                            agency: req.payload.agency_id,
                            category_name: req.payload.category_name,
                            description: req.payload.description,
                            custom_fields: custom_fields,
                            created_by: req.payload.created_by,
                            updated_by: req.payload.created_by
                        });
                        return EquipmentCategory.create(category).then((addedcategory) => {               
                            if (addedcategory) {
                                
                                // Make json for log
                                var log = {
                                    'operation':'Added new equipment category - '+addedcategory.category_name,  
                                    'agency': addedcategory.agency,
                                    'created_by':addedcategory.created_by,        
                                    'updated_by':addedcategory.created_by,    
                                    'category_id':addedcategory._id,
                                    'old_payload': null,
                                    'new_payload': addedcategory
                                }                           
                                return Log.addLog(log, 'log_equipment_category').then((addedcategorylog) => {        
                                    return {
                                        status: 100,
                                        msg: 'Equipment Category is successfully added.'
                                    }   
                                 }).catch((err2) => { 
                                    return {
                                        status: 101,
                                        msg: err2.message
                                    };
                                });

                            } else {
                                return {
                                    status: 101,
                                    msg: 'Opps! Equipment Category is not added. Please try again.'
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
                return {'status':101, 'msg': "Please choose agency to add equipment category."}
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
                return EquipmentCategory.findOne({ '_id': { $ne: request.params._id}, 'category_name':request.payload.category_name, 'agency':request.payload.agency_id }).exec().then((result) => {
                   
                    if(result){                                                  
                        return { 'status':101, 'msg': 'Category name already exists', 'data':result }
                    }else{

                        // Update Query
                        return EquipmentCategory.findOneAndUpdate({_id:request.params._id },{ $set: request.payload },{ returnOriginal: false }).exec().then((result) => {
                            if(result){
                                
                                // Make json for log
                                var log = {
                                    'operation':'Updated category - '+result.category_name, 
                                    'agency': result.agency,  
                                    'created_by':result.created_by,     
                                    'updated_by':result.updated_by, 
                                    'category_id':result._id,
                                    'old_payload':result,
                                    'new_payload':request.payload,
                                }                           
                                return Log.addLog(log, 'log_equipment_category').then((modulelog) => {         
                                    return { 'status':100, 'msg': 'Successfully updated equipment category.', 'data':result };    
                                 }).catch((err2) => { 
                                    return {
                                        status: 101,
                                        msg: "Something went wrong while saving log."
                                    };
                                }); 
                              
                            }else{
                                return { 'status':101, 'msg': "Can't find the equipment category.", 'data':'' }; 
                            }                          
                        }).catch((err) => {
                            console.log(err);
                            return {'status':101, 'msg':err}
                        });
                    }              
                }).catch((err) => {
                    return {'status':101, 'msg':err}
                });
            }         
        }        
    },
    
    // Delete equipment category 
    delete: (request, h) => {
        if (!request.params._id) {
            return {status:101, msg: 'Equipment Category id is required' };
        }
        return EquipmentCategory.findByIdAndUpdate(request.params._id, {status:0}).exec().then((result) => {            
            if(result){
                
                 // Make json for log   
                var log = {
                    'operation':'Deleted the equipment category - '+result.category_name,
                    'created_by':result.created_by,  
                    'agency': result.agency,  
                    'updated_by':result.updated_by, 
                    'category_id':result._id,
                    'old_payload':result,
                    'new_payload': {status:0}       
                }
                return Log.addLog(log, 'log_equipment_category').then((addedequipmentcatlog) => {      
                    return {'status':100, 'msg': 'Equipment category is successfully deleted.' }
                 }).catch((err2) => { 
                    return {
                        status: 101,
                        msg: "Something went wrong while saving log."
                    };
                });
                return { status:100, msg: 'Equipment category is deleted successfully.' }
            }else{
                return { status:101, msg: "Equipment category doesn't not found." }
            }
        }).catch((err) => {
            return { 'status': 101, 'msg': err.errmsg };
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
                let get_total_records = self.categoryCount(agency_id, order, dir, column_search, search_value, search_regex);
                get_total_records.then((res) => {
                    total_records = res.data
                    let records = 0
                    let dataget_records = 0
                    get_records = self.getCategories(agency_id, start, length, order, dir, column_search, search_value, search_regex, fetch_columns);
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

    // Get CRM user total count
    categoryCount: function (agency_id, order, dir, column_search, search_value, search_regex) {
        const promise = new Promise((resolve, reject) => {
            let agency = {}
            if (agency_id) {
                agency = agency_id;
            }
            if (column_search.length) {
                EquipmentCategory.aggregate([{
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
                if(agency_id){
                    conditions = {'status':{$ne:0}, 'agency':agency_id}
                }
                EquipmentCategory.countDocuments(conditions).exec().then((categories) => {
                    
                    resolve({ 'status': 100, 'msg': 'Success', 'data': categories });
                }).catch((err) => {
                    reject({ 'status': 101, 'msg': err, 'data': '' });
                });
            }
        });
        return promise
    },

    // Get CRM user list 
    getCategories: function(agency_id, start, length, order, dir = 'asc', column_search, search_value, search_regex, fetch_columns) {
        
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
                EquipmentCategory.aggregate([
                    { $match: { $or: column_search } }, 
                    { $sort: sort },
                    { $skip: Number(start) }, { $limit: Number(length) },
                    { $project: fetch_columns }
                ]).exec().then((categories) => {
                    EquipmentCategory.populate(categories, {path: 'agency',select: 'agency_name'}, function(err, populatedresult) {
                        
                        resolve({ 'status': 100, 'msg': 'Success', 'data': populatedresult });
                    });
                }).catch((err) => {
                    reject({ 'status': 101, 'msg': err, 'data': '' });
                });
                
            } else {
                var conditions = {'status':{$ne:0}}
                if(agency_id){
                    conditions = {'status':{$ne:0}, 'agency':agency_id}
                }
                EquipmentCategory.find(conditions,fetch_columns).populate('agency',{'agency_name':1, _id:0}).sort(sort).skip(Number(start)).limit(Number(length)).exec().then((categories) =>{
                    resolve({ 'status': 100, 'msg': 'Success', 'data': categories });
                }).catch((err) => {
                    reject({ 'status': 101, 'msg': err, 'data': '' });
                });                      
            }    
        });
        return promise
    }, 

    getDetailByID: function(request, h){
      
        if(request.params._id && request.params._id != 0){
            return EquipmentCategory.findById( request.params._id ).exec().then((category) => {           
                if (category) {                    
                    if(typeof category.custom_fields != 'undefined'){
                        if(category.custom_fields.length > 0){
                            category.custom_fields.forEach((current, index)=> {
                                if(current.type == "image"){
                                    current.val = "http://"+request.headers.host+"/"+current.val;
                                }
                            })                            
                            return {'status':100, 'msg':'Success', 'data':category}
                        }else{
                            return {'status':100, 'msg':'Success', 'data':category}
                        }
                    }else{
                        return { status:100, msg: 'Success', data:category }
                    }
                }else{
                    return ({'status':101, 'msg':'No equipment category detail found.', 'data':''});
                }
            }).catch((err1) => {
                
                return ({'status':101, 'msg':'Error! Please try again.', 'data':''});
            });
        }else{
            return ({'status':101, 'msg':'Please send the category ID.', 'data':''});
        }      
    },

    // Add the files into the folder
     decode_buffer(buf, folder, filename='' ) { 
        return fs.writeFile(path.join(__dirname, '../../../public/uploads/' + folder + '/', filename), buf, function(error) {
            if (error) {
            } 
            else {
            }
        });
    }
}


