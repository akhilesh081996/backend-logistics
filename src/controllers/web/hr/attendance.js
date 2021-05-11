const User = require('../../../models/user')
const Attendance = require('../../../models/attendance') 
const moment = require('moment') 

var self = module.exports = {
    get: (request, h) => {
        return h.view('attendance');
    },

    /* Get customers list */
    fetch_ajax: (request, h) => {},
    //     if (request.payload) {
    //         const promise = new Promise((resolve, reject) => {
    //             let pdata = request.payload
    //             let search_value = ''
    //             let search_regex = ''
    //             let draw = pdata.draw
    //             let start = pdata.start
    //             let length = pdata.length
    //             let order = ''
    //             if (pdata.order) {
    //                 order = pdata.order
    //             }

    //             let columns = pdata.columns
    //             let column_search = []
    //             let i
    //             let fetch_columns = {};
    //             if (columns) {
    //                 for (i = 0; i < columns.length; i++) {
    //                     let key = columns[i].name;
    //                     if (pdata.search.value) {                            
    //                         if (key) {
    //                             let c_sr = {
    //                                 [key]: { $regex: '.*' + pdata.search.value + '.*', $options: "s" }
    //                             }
    //                             // Don't remove the below comments. it might be useful for later use
    //                             // c_sr.value = pdata.search.value
    //                             // c_sr.name = key
    //                             column_search.push(c_sr)
    //                         }
    //                     }
    //                     fetch_columns[key] = true;
    //                 }
    //             }

    //             let col = 0;
    //             let dir = "";
    //             let j              
    //             if (order) {
    //                 for (j = 0; j < order.length; j++) {
    //                     col = order[j].column
    //                     dir = order[j].dir
    //                 }
    //             }

    //             if (dir != "asc" && dir != "desc") {
    //                 dir = "asc";
    //             }

    //             let columns_valid = [
    //                 "_id",
    //                 "first_name",
    //                 "last_name",
    //                 "email",
    //                 "contact_no",
    //                 "address"
    //             ]

    //             if (columns_valid[col]) {
    //                 order = columns_valid[col];
    //             } else {
    //                 order = null;
    //             }

    //             agency_id = "";
    //             //agency_id = 'dna0twb35k6kf9biz';
    //             // Will use the aganecy id here from session , so don't remove the comments
    //             /*if( $this->session->userdata('type') == ROLE_EMPLOYEE){     
    //                 $current_employee_id = $current_user_id;        
    //             }  */
    //             llet total_records = 0
    //             let get_total_records = self.usersCount(agency_id, order, dir, column_search, search_value, search_regex);
    //             get_total_records.then((res) => {
    //                 total_records = res.data
    //                 let records = 0
    //                 let get_records = 0
    //                  get_records = self.getUsers(agency_id, start, length, order, dir, column_search, search_value, search_regex);
    //                 get_records.then((res) => {
    //                     records = res.data
    //                     let data = []
    //                     let k

    //                     if (total_records > 0) {
    //                         for (k = 0; k < records.length; k++) {
    //                             // let action_btns = "";
    //                             // action_btns = '<div class="manage-attendance"><a title="Add the entry" href="javascript:void(0)" onclick="openSideSection(this, &quot;' + records[k]['user_id'] + '&quot; )"><i class="icofont icofont-gear set-rotate"></i></a> </div>';
    //                             // view_button = '<div class="manage-attendance"> <a title="View mode" href="javascript:void(0)" onclick="openSideSection(this, &quot;' + records[k]['user_id'] + '&quot; )"><i class="ti-view-list"></i></a> </div>';
    //                             new_data = [
    //                                 '',
    //                                 records[k]['username'],
    //                                 records[k]['email'],
    //                                 records[k]['contact'],
    //                                 records[k]['roledetail'].role_name,
    //                                 records[k]['agencydetail'].agency_name,
    //                                 action_btns,
    //                                 view_button
    //                             ]
    //                             data.push(new_data)
    //                         }
    //                     }
    //                     output = {
    //                         "draw": draw,
    //                         "recordsTotal": total_records,
    //                         "recordsFiltered": total_records,
    //                         "data": data
    //                     }
    //                     resolve(output)
    //                 }).catch((err) => {
    //                     console.log("Total record error1- ", err);
    //                     reject(error)
    //                 })

    //             }).catch((err) => {
    //                 console.log("Total record error2- ", err);
    //                 reject(error)
    //             })
    //             //     get_records = self.getCrmUsers(agency_id, start, length, order, dir, column_search, search_value, search_regex, fetch_columns);
    //             //     get_records.then((res) => {
    //             //         output = {
    //             //             "recordsTotal": total_records,
    //             //             "recordsFiltered": total_records,
    //             //             "data": res.data
    //             //         }
                      
    //             //         resolve(output)
    //             //     }).catch((err) => {
    //             //         console.log("Total record error1- ", err);
    //             //         reject(error)
    //             //     })

    //             // }).catch((err) => {
    //             //     console.log("Total record error2- ", err);
    //             //     reject(error)
    //             // })
    //         });
    //         return promise;
    //     }
    // },

    // // Get CRM user total count
    // crmCount: function (agency_id, order, dir, column_search, search_value, search_regex) {
    //     const promise = new Promise((resolve, reject) => {
    //         let agency = {}
    //         if (agency_id) {

    //             //agency = { agency_id: 'dna0tw6kok5wgh4ec' }
    //             agency = agency_id;

    //             //agency =  agency_id ;

    //         }
    //         if (column_search.length) {
    //             Crmcustomer.aggregate([{
    //                 $match: { $or: column_search }
    //             },
    //             { $count: "customers" },
    //             { $unwind: "$customers" }
    //             ]).exec().then((res) => {
    //                 if (res.length) {
    //                     resolve({ 'status': 100, 'msg': 'Success', 'data': res[0].customers });
    //                 } else {
    //                     resolve({ 'status': 100, 'msg': 'Success', 'data': 0 });
    //                 }
    //             }).catch((err) => {
    //                 reject({ 'status': 101, 'msg': err, 'data': '' });
    //             });
    //         } else {
    //             Crmcustomer.countDocuments({ 'agency_id': agency_id }).exec().then((customers) => {
    //                 resolve({ 'status': 100, 'msg': 'Success', 'data': customers });
    //             }).catch((err) => {
    //                 reject({ 'status': 101, 'msg': err, 'data': '' });
    //             });
    //         }
    //     });
    //     return promise
    // },

    // // Get CRM user list 

    // //getCrmUsers: function (agency_id, start, length, order, dir = 'asc', column_search, search_value, search_regex) {

    // getCrmUsers: function(agency_id, start, length, order, dir = 'asc', column_search, search_value, search_regex, fetch_columns) {
        
    //     const promise = new Promise((resolve, reject) => {
    //         let sort = ''
    //         if (dir == 'asc') {
    //             dir = 1
    //         } else {
    //             dir = -1
    //         }

    //         if (order) {
    //             sort = {
    //                 [order]: dir
    //             }
    //         } else {
    //             sort = { '_id': -1 }
    //         }

    //         if (column_search.length) {
    //             Crmcustomer.aggregate([
    //                 //{ $addFields: { idStr: { $toString: '$_id' } } },
    //                 //{ $addFields: { user_contactStr: { $toString: '$user_conatct' } } },
    //                 { $match: { $or: column_search } }, { $sort: sort },
    //                 { $skip: Number(start) }, { $limit: Number(length) },
    //                 { $project: fetch_columns }
    //             ]).exec().then((customers) => {
    //                 resolve({ 'status': 100, 'msg': 'Success', 'data': customers });
    //             }).catch((err) => {
    //                 reject({ 'status': 101, 'msg': err, 'data': '' });
    //             });
    //         } else {
    //             if(!agency_id){
    //                 Crmcustomer.aggregate([
    //                     // {$match: { "agencies_id": agency_id }},
    //                     { $sort: sort },
    //                     { $skip: Number(start) },
    //                     { $limit: Number(length) },
    //                     { $project: fetch_columns }
    //                 ]).exec().then((customers) => {
    //                     resolve({ 'status': 100, 'msg': 'Success', 'data': customers });
    //                 }).catch((err) => {
    //                     reject({ 'status': 101, 'msg': err, 'data': '' });
    //                 });   
    //             }else{
    //                 Crmcustomer.aggregate([
    //                     {$match: { "agency_id": agency_id }},
    //                     { $sort: sort },
    //                     { $skip: Number(start) },
    //                     { $limit: Number(length) },
    //                     { $project: fetch_columns }
    //                 ]).exec().then((customers) => {
    //                     resolve({ 'status': 100, 'msg': 'Success', 'data': customers });
    //                 }).catch((err) => {
    //                     reject({ 'status': 101, 'msg': err, 'data': '' });
    //                 });
    //             }       
    //         }     

    //     });  
    //     return promise
    // },



    addAttendance: (request, h) => {
        var value = {};
        if (request.payload) {
            const promise = new Promise((resolve, reject) => {
                var t1 = moment(request.payload.check_in, ["h:mm A"]);
                var t2 = moment(request.payload.check_out, ["h:mm A"]);
                var duration = moment.duration(t2.diff(t1));
                var attendance = new Attendance({
                    user_id: request.payload.user_id,
                    check_in: moment(request.payload.check_in, ["h:mm A"]).format('HH:mm'),
                    check_out: moment(request.payload.check_out, ["h:mm A"]).format('HH:mm'),
                    time_diff: (duration.asHours()).toFixed(2),
                    notes: request.payload.notes
                });
                Attendance.create(attendance).then((res) => {
                    if (res) {
                        resolve({ status: 100, message: "Successfully addedd !", data: res })
                    } else {
                        resolve({
                            status: 101,
                            message: 'Opps!! Entry not added. Please Add Again.',
                            data: ''
                        })
                    }
                }).catch((err2) => {
                    console.log(err2)
                    reject({
                        status: 101,
                        code: err2
                    })
                });

            })
            return promise;
        }
    },

    editAttendance: (request, h) => {
        var value = {};

        if (request.payload) {
            const promise = new Promise((resolve, reject) => {
                var t1 = moment(request.payload.check_in, ["h:mm A"]);
                var t2 = moment(request.payload.check_out, ["h:mm A"]);
                var duration = moment.duration(t2.diff(t1));
                let attendance = {
                    user_id: request.payload.user_id,
                    check_in: moment(request.payload.check_in, ["h:mm A"]).format('HH:mm'),
                    check_out: moment(request.payload.check_out, ["h:mm A"]).format('HH:mm'),
                    time_diff: (duration.asHours()).toFixed(2),
                    notes: request.payload.notes
                }

                Attendance.find({"_id":request.params.id}).update(attendance).exec().then(res =>{
                   if(res){
                      resolve({"status":100,"msg":"Updated Successfully"})
                   }else{
                    reject({"status":101,"msg":"Entry Not Update"})
                   }  
                }).catch((err) => {
                  return { 'status': 101,  'msg': "Opps!! Entry not updated. Please Add Again." }
                });
            })
            return promise;
        }
    },

    // Delete the attendance
    deleteAttendance : (req, h) => {
        const promise = new Promise((resolve, reject) => {
            Attendance.find({"_id":req.params.id}).remove().exec().then(res =>{
                if(res){
                    resolve({"status":100,"msg":"Successfully deleted."})
                }else{
                    reject({"status":101,"msg":"Please try again."})
                }
            }).catch((err) => {
                return { 'status': 101,  'msg': "Oops! Entry is not deleted. Please try again." }
            })
        })
        return promise;
    },

    // Get Attendance of a particular user
    getUserAttendance: (request, h) => {
        var value = {};
        if (request.payload) {
            const promise = new Promise((resolve, reject) => {
                if (!request.payload.date) {
                    request.payload.date = moment().format('YYYY-MM-DD')
                }
                Attendance.find({ 'user_id': request.payload.user_id, 'date': request.payload.date }).exec().then((res) => {
                    let data = {}
                    if (res.length > 0) {
                        //Make HTML
                        let attendance_rows = ''
                        let total_hours = 0
                        var i
                        for (i = 0; i < res.length; i++) {
                            attendance_rows += "<tr><td>" + moment(res[i].check_in, ["HH:mm"]).format("h:mm a") + "</td><td>" + moment(res[i].check_out, ["HH:mm"]).format("h:mm a") + "</td><td>" + res[i].notes + "</td></tr>";
                            total_hours = total_hours + res[i].time_diff;
                        }
                        //data._id = res[0]._id;
                        //data.user_id = res[0].user_id;
                        //data.notes = res[0].notes;  
                        //data.attendance = attendance_rows;
                        //data.first_checkin = moment(res[0].check_in, ["HH:mm"]).format("h:mm a");
                        //data.last_checkout = moment(res[i - 1].check_out, ["HH:mm"]).format("h:mm a");
                        res.total_hours = total_hours.toFixed(2) + ' hrs'
                        resolve({ 'status': 100, 'msg': 'Success', 'data': res });
                    } else {
                        data.attendance = "<tr><td colspan='3' class='not_found'>No Check-in and Check-out entry Found</td></tr>";
                        data.first_checkin = "-";
                        data.last_checkout = "-";
                        data.total_hours = '00:00 hrs'
                        resolve({ 'status': 101, 'msg': "Empty result", 'data': data });
                    }
                }).catch((err) => {
                    let data = {}
                    data.attendance = "<tr><td colspan='3' class='not_found'>No Check-in and Check-out entry Found</td></tr>";
                    data.first_checkin = "-";
                    data.last_checkout = "-";
                    data.total_hours = '00:00 hrs'
                    reject({ 'status': 101, 'msg': err, 'data': data });
                });
            })
            return promise;
        }
    },

    // Get Attendance of a particular user
    getUserAttendanceBetweenDates: (request, h) => {
        if (request.payload) {
            const promise = new Promise((resolve, reject) => {
                if (!request.payload.from) {
                    request.payload.from = moment().format('YYYY-MM-DD')
                }if (!request.payload.to) {
                    request.payload.to = moment().format('YYYY-MM-DD')
                }
                Attendance.find({ 
                    'user_id': request.payload.user_id, 
                    "date" : { "$gte" : request.payload.from, "$lte" :  request.payload.to}                    
                }).exec().then((res) => {
                    //let data = {}
                    if (res.length > 0) {
                        //Make HTML
                        // let attendance_rows = array()
                        //let total_hours = 0
                        //var i
                        // for (i = 0; i < res.length; i++) {
                        //     attendance_rows[i]['checkin']  = res[i].checkin;
                        //     attendance_rows[i]['checkout'] = res[i].checkout;
                        //     attendance_rows[i]['notes']    = res[i].notes;
                        //     attendance_rows[i]['date']     = res[i].date
                        //     total_hours = total_hours + res[i].time_diff;

                        // }
                        // console.log(attendance_rows);
                        // // data._id = res[0]._id;
                        // data.user_id = res[0].user_id;
                        // data.attendance = attendance_rows;                        
                        // data.first_checkin = moment(res[0].check_in, ["HH:mm"]).format("h:mm a");
                        // data.last_checkout = moment(res[i - 1].check_out, ["HH:mm"]).format("h:mm a");
                        // data.total_hours = total_hours.toFixed(2) + ' hrs'
                        resolve({ 'status': 100, 'msg': 'Success', 'data': res });
                    } else {
                        data.attendance = "No Check-in and Check-out entry Found";
                        data.first_checkin = "-";
                        data.last_checkout = "-";
                        data.total_hours = '00:00 hrs'
                        resolve({ 'status': 101, 'msg': "Empty result", 'data': '' });
                    }
                }).catch((err) => {
                    let data = {}
                    data.attendance = "No Check-in and Check-out entry Found";
                    data.first_checkin = "-";
                    data.last_checkout = "-";
                    data.total_hours = '00:00 hrs'
                    reject({ 'status': 101, 'msg': err, 'data': '' });
                });
            })
            return promise;
        }else{
            return { 'status': 101, 'msg': "Please send the request parameters", 'data': "" };
        }
    }
}