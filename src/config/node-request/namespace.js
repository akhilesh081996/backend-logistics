const asyncHooks = require('async_hooks');

class Namespace {

   constructor() {
      this.context = {};
   }

   run(fn) {
      const eid = asyncHooks.executionAsyncId();
      this.context[eid] = {};
      fn();
   }
}

module.exports = Namespace;