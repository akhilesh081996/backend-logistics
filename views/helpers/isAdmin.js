// isAdmin Helper
// Usage: `{{#isAdmin}}`
// Checks whether the user has admin or owner role
const _ = require('lodash')

function isAdmin(context) {
    //console.log("USEcontextR =--->", context);
    if (_.isEmpty(context)) {
        return context.inverse(this)
    }

    const user = context.data.root.user
        //console.log("USER =--->", user);
    if (_.includes([user.role], 'owner', 'admin')) {
        return context.fn(this)
    }

    return context.inverse(this)
}

module.exports = isAdmin