var Users = require('../../models/user');
var Drivers = require('../../models/driver');
var Vehicles = require('../../models/vehicle');
var Agecies = require('../../models/agency');
var Drivers = require('../../models/driver');
var Vehicles = require('../../models/vehicle');
var storage = require('node-sessionstorage')
var valid = require('../../config/validation');
var jwt = require('jsonwebtoken');
var helper = require('../../../views/helpers/login_user_helper')

exports.getTotal = function (req, h) {
  var loginUser = storage.getItem('user');
  if(loginUser.agency_id){
      return Users.find({agency_id:loginUser.agency_id,role:1}).exec().then((Driversdetails) => {
      return Users.find({agency_id:loginUser.agency_id}).exec().then((user) => {
      return Vehicles.find({agency_id:loginUser.agency_id}).exec().then((vehicles) => {
        var time = formatAMPM(new Date)
        return h.view('dashboard', {
          title: 'Using handlebars in Hapi',
          message: '',
          // usersList: user,
          // agenciesList: agencies,
            driversList: Driversdetails,
            usersList: user,
            user:loginUser,
            vehiclesList: vehicles,
            time:time,
          // customersList: customers,
            last4auser:Driversdetails.slice(-4)
          // last4drivers:drivers.slice(-4)
          // last4customers:drivers.slice(-4)
    
        },
          { layout: 'layout' });
      }).catch((err) => {
        console.log(err)
        return { err: err };
      })
    }).catch((err) => {
      console.log(err)
      return { err: err };
    })
  }).catch((err) => {
    console.log(err)
    return { err: err };
  })

  }else{
    return Agecies.find({}).exec().then((agencies) => {
      return Users.find({}).exec().then((user) => {
      return Drivers.find({}).exec().then((Driversdetails) => {
      return Vehicles.find({}).exec().then((vehicles) => {

        var time = formatAMPM(new Date)
        var last4 = user.slice(-4)
        
        for(let i=0; i<last4.length; i++){
          last4[i].created_at = convert(last4[i].created_at)
        }
        return h.view('dashboard', {
          title: 'Using handlebars in Hapi',
          message: '',
          usersList: user,
          agenciesList: agencies,
          driversList: Driversdetails,
          user:loginUser,
          vehiclesList: vehicles,
          time:time,
          // customersList: customers,
         last4auser:last4
          // last4drivers:drivers.slice(-4)
          // last4customers:drivers.slice(-4)
    
        },
          { layout: 'layout' });
      }).catch((err) => {
        console.log(err)
        return { err: err };
      })
    }).catch((err) => {
      console.log(err)
      return { err: err };
    })
    }).catch((err) => {
      console.log(err)
      return { err: err };
    })
    }).catch((err) => {
      console.log(err)
      return { err: err };
    });
  }


}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function convert(str) {
  var date = new Date(str),
      mnth = ("0" + (date.getMonth()+1)).slice(-2),
      day  = ("0" + date.getDate()).slice(-2);
      hours  = ("0" + date.getHours()).slice(-2);
      minutes = ("0" + date.getMinutes()).slice(-2);
  return [ date.getFullYear(), mnth, day].join("-") +" "+  [hours, minutes].join(":");
}

