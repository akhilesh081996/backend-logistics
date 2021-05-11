//const Crmcustomer = require('../../models/Crm_customer')
const valid = require('../../../config/validation')
var tokenverified = false
const fs = require('fs');
var path = require('path');
var date = new Date();


module.exports = {
    // add: (request, h) => {
    //     const promise = new Promise((resolve, reject) => {
    //         const contact = new Crmcustomer({
    //             name: request.payload.name,
    //             user_email: request.payload.user_email,
    //             user_contact: request.payload.user_contact,
    //             address: request.payload.address,
    //             //image : req.payload.image,
    //             status: true,
    //         });
    //         contact.save((err, savedContact) => {
    //             if (err) {
    //                 console.log(err);
    //                 reject(err);
    //             }
    //             resolve(h.redirect('add_customer'));
    //         });
    //     });
    //     return promise;
    // },

    fetch: (request, h) => {
        const promise = new Promise((resolve, reject) => {
            // Crmcustomer.find((error, contacts) => {
            //     if (error) {
            //         console.error(error);
            //     }
            //     resolve(h.view('invoice_list', {
            //         contacts
            //     }, { layout: 'layout' }));
            // });


        });
        //return promise;
        return h.view('invoice_list');
    },

    // delete: (request, h) => {
    //     const promise = new Promise((resolve, reject) => {
    //         if (!request.params._id) {
    //             return { message: 'Customer id is required' }.code(400);
    //         }
    //         Crmcustomer.findByIdAndRemove(request.params._id, (err, result) => {
    //             if (err) {
    //                 return { message: 'Customer not found' }.code(500);
    //             }
    //             resolve(h.view('customer_list', { layout: 'layout' }));
    //         })
    //     })
    //     return promise;
    // }
}