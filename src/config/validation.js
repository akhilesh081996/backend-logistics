"use strict"

let valid = {

    contact: function(contact) {
        // var regExForDigitsOnly = /[0-9]{10}/;
        var regExForDigitsOnly = /^[0-9]{10}$/;
        //var regExForDigitsOnly =  /^\d{10}$/;
        //console.log("hellooo-->>>", regExForDigitsOnly.test(contact));
        // return (contact.length > 8 && regExForDigitsOnly.test(contact));
        return (regExForDigitsOnly.test(contact));
        //return (contact.length > 8 && contact.match(regExForDigitsOnly));
    },
    email: function(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    usernameLength: function(username) {
        if (username.length > 3 && username.length < 100) {
            return true;
        } else {
            return false;
        }
    },
    emailLength: function(email) {
        if (email.length > 3 && email.length < 200) {
            return true;
        } else {
            return false;
        }
    },
    passwordLength: function(password) {
        if (password.length > 6 && password.length < 200) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = valid;