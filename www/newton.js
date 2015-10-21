'use strict';

var exec = require('cordova/exec'),
newton = {};

newton.start = function(json, settings, onSuccess, onFail){
	exec(onSuccess, onFail, 'Newton', 'start', [json, settings]);
}
module.exports = newton;