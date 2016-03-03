'use strict';


module.exports = { register };


function register (manager, options, callback) {
  require('newrelic');
  callback();
}
