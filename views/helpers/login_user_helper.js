var storage = require('node-sessionstorage')
module.exports = function () {
  console.log('run =================> function')
  var user = storage.getItem('user')
  return  user

};