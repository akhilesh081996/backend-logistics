//const async_hooks = require('async_hooks');
//const fs = require('fs');
//
//// START Hooks
//async_hooks.createHook({
//   init(asyncId, type, triggerAsyncId, resource) {
//	   //if(type == "PROMISE"){
//		   //console.log("RESOURCE===>>>>",resource)
//		   fs.writeSync(1, `Init ${type} resource: asyncId: ${asyncId} trigger: ${triggerAsyncId}\n`);
//	   //}
//   },
//   destroy(asyncId) {
//      //const eid = async_hooks.executionAsyncId();
//      //fs.writeSync(1, `Destroy resource: execution: ${eid} asyncId: ${asyncId}\n`);
//  }
//}).enable();
//const eid = async_hooks.executionAsyncId();
//fs.writeSync(1, `Calling setTimeout: execution: ${eid}\n`);
//setTimeout(() => {
//   const eid = async_hooks.executionAsyncId();
//   fs.writeSync(1, `Inside setTimeout: execution: ${eid}\n`);
//}, 0);
// END Hooks

// server.ext({
//        type: 'onRequest',
//        method: function (request, h) {
//
//            // Change all requests to '/test'
//
//            request.setUrl('/test');
//            return h.continue;
//        }
//    });