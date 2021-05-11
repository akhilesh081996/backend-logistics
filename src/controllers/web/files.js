var User = require('../../models/user')
var Driver = require('../../models/driver')
var Friver = require('../../models/file')
const valid = require('../../config/validation')
    //const helper = require('../../views/helpers/custom_view_helper')

const fs = require('fs');
var path = require('path');
var date = new Date();
var uniqid = require('uniqid');

module.exports = {
    add: (req, h) => {

        if (req.payload) {
            const promise = new Promise((resolve, reject) => {
                //console.log("REQUEST FUILE===>", req.payload);
                const data = req.payload;
                //const file = data.files; // accept a field call avatar
                //console.log("FILE====>>>", data);
                // var filedata = new File({
                //     type: data.type,
                //     module: data.module,
                //     file_name: '',
                //     //     path: '',
                //     user_id: data.user_id,
                //     //     created_by: '',
                //     created_at: new Date()
                // });
                // let response = [];
                // for (var i = 0; i < data["file"].length; i++) {
                //     result.push(data["file"][i].hapi);
                //     console.log("FILE NAME ---> ", request.payload["file"][i].hapi.filename);
                //     data["file"][i].pipe(fs.createWriteStream(__dirname + "/public/uploads/" + request.payload["file"][i].hapi.filename))
                // }

                // console.log("FILE====>>>", response);
                // save the file
                //const fileDetails = await uploader(file, fileOptions);

                // save data to database
                //const col = await loadCollection(COLLECTION_NAME, db);
                //const result = col.insert(fileDetails);
                //db.saveDatabase();
                //userdata.password = userdata.generateHash(userdata.password);
                // if (req.payload.role == 3) {
                //     // base64_decode(req.payload.driver_image, 'copy.jpg');         
                //     Driver.create(driverdata), User.create(userdata).then((user) => {
                //         resolve(h.redirect('users'));
                //     }).catch((err) => {
                //         console.log("=======>>", err)
                //             //return { err: err };
                //         reject(err);
                //     });
                // }
            });
            return promise;
        } else {
            //return h.view('add_edit_user')
        }
    },

    // fetch: (request, h) => {
    //     const promise = new Promise((resolve, reject) => {

    //     });
    //     return promise;
    // }
}