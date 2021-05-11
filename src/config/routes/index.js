const auth     =  require('../../controllers/api/auth');
module.exports = [].concat(auth);
var frontend   = require('./frontend');
//console.log(auth);
var backend    = require('./backend');
module.exports = [].concat(frontend, backend);
//module.exports = auth;