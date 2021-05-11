const Namespace = require('./namespace');
const namespaces = {};

function createNamespace(name) {
    if (namespaces[name]) { throw new Error(`A namespace for ${name} is already exists`); }

    const namespace = new Namespace();
    namespaces[name] = namespace;
    createHooks(namespace); // wait for explanation below
    return namespace;
}

function getNamespace(name) {
    return namespaces[name];
}

function createHooks(namespace) {
    function init(asyncId, type, triggerId, resource) {
        // Check if trigger has context
        // Or in other words, check if tigger is part of any request
        if (namespace.context[triggerId]) {
            // Here we keep passing the context from 
            // the triggerId to the new asyncId
            namespace.context[asyncId] = namespace.context[triggerId];
 
       }
    }

    function destroy(asyncId) {
        delete namespace.context[asyncId];
    }

    const asyncHook = asyncHooks.createHook({ init, destroy });

    asyncHook.enable();
}