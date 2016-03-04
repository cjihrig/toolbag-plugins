'use strict';

const Module = require('module');
const Set = require('lodash.set');
const Reach = require('reach');


module.exports = { register };


function register (manager, options, callback) {
  const blacklist = Object.assign({}, options.blacklist);
  const blModules = blacklist.modules;
  const blBindings = blacklist.bindings;

  manager.add('policy-get-blacklist', function getBlacklist (options, cb) {
    cb(null, blacklist);
  });

  if (blModules !== null && typeof blModules === 'object') {
    const load = Module._load;

    Module._load = function (request, parent, isMain) {
      const blEntry = blModules[request];

      // If a module is being blacklisted, take action before it is loaded.
      if (typeof blEntry === 'string') {
        const handler = manager.getErrorHandler(blEntry) || manager.error;

        // Intentionally do not return after calling handler
        handler(new Error(`use of blacklisted module: ${request}`));
      }

      const retValue = load.apply(Module, arguments);

      // If individual methods are being blacklisted, let the module be loaded
      // before taking any action.
      if (blEntry !== null && typeof blEntry === 'object') {
        const keys = Object.keys(blEntry);

        for (let i = 0; i < keys.length; ++i) {
          const method = keys[i];
          const original = Reach(retValue, method);

          if (typeof original !== 'function') {
            continue;
          }

          const handler = manager.getErrorHandler(blEntry[method]) ||
                          manager.error;

          Set(retValue, method, function methodWrapper () {
            handler(new Error(`use of blacklisted method: ${request}.${method}`));
            return original.apply(this, arguments);
          });
        }
      }

      return retValue;
    };
  }

  if (blBindings !== null && typeof blBindings === 'object') {
    const binding = process.binding;

    process.binding = function (request) {
      const blEntry = blBindings[request];

      if (blEntry) {
        const handler = manager.getErrorHandler(blEntry) || manager.error;

        // Intentionally do not return after calling handler
        handler(new Error(`use of blacklisted binding: ${request}`));
      }

      return binding.apply(process, arguments);
    };
  }

  callback();
}
