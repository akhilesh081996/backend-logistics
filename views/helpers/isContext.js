// Verify the given with desired context
// You need to pass data including the 'context' to the view
var _ = require('lodash')
var isContext

isContext = function(option, viewdata) {
    var currentContext = viewdata.data.root.context;

    if (!_.isString(currentContext)) {
        return viewdata.inverse(this);
    }

    if (_.isEqual(currentContext, option)) {
        return viewdata.fn(this);
    }

    return viewdata.inverse(this);
};

module.exports = isContext;