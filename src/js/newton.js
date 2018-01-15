var exec = cordova.require('cordova/exec');

function EventBus() {	
    this.events = {};
}
/**
 * on function
 * @param {String} eventType - if not exists it defines a new one
 * @param {Function} func - the function to call when the event is triggered
 * @param {Object} [context=null] - the 'this' applied to the function. default null
 */
EventBus.prototype.on = function(eventType, func) {
    var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    if (!this.events[eventType]) {
        this.events[eventType] = [];
    }
    this.events[eventType].push({ func: func, context: context });
}

/**
 * trigger function
 * @param {String} eventType - the eventType to trigger. if not exists nothing happens
 */
EventBus.prototype.trigger = function(eventType) {
    if (!this.events[eventType] || this.events[eventType].length === 0) {
        return;
    }
    var args = [].slice.call(arguments, 1);
    this.events[eventType].map(function (obj) {
        obj.func.apply(obj.context, args);
    });
}

/**
 * emit function alias for trigger
 * @param {String} eventType - the eventType to trigger. if not exists nothing happens
 */
EventBus.prototype.emit = EventBus.prototype.trigger;

/**
 * off function
 * @param {String} eventType - the eventType
 * @param {Function} func - the reference of the function to remove from the list of function
 */
EventBus.prototype.off = function(eventType, func) {
    if (!this.events[eventType]) {
        return;
    }

    var newState = this.events[eventType].reduceRight(function (prev, current, index) {
        if (current.func !== func) {
            prev.push(current);
        }
        return prev;
    }, []);

    this.events[eventType] = newState;
}

/**
 * clear all the functions associated at the specific eventType
 * if the event not exists nothing happens
 * @param {String} eventType - the event type to clear
 * @returns {void}
 */
EventBus.prototype.clear = function(eventType) {
    if (!this.events[eventType]) {
        return;
    }
    this.events[eventType] = [];
}

/**
 * clear all the functions of all eventType
 * @returns {void}
 */
EventBus.prototype.clearAll = function() {
    this.events = {};
}

var EventEmitter = new EventBus();

function typeCheck(args, types) {
    if(args.length === types.length) {
        return types
        .map(function(type, i) { return (args[i]).constructor === type; })
        .every(function(check) { return check; });
    }
    return false;
}

function warn() {
    return console.warn.apply(console, arguments)
}

function log() {
    return console.log.apply(console, arguments)
}

function NativeNewton(className) {
    var that = this;
    this.nativeClassName = className;
}

/**
 * Call registerDevice on native side
 * @param {Function} onSuccess - onSuccess callback. required
 * @param {Function} onError - onError callback. required
 */
NativeNewton.prototype.registerDevice = function(callbackSuccess, callbackError) {
    return exec(callbackSuccess, callbackError, this.nativeClassName, 'registerDevice', []);
}

/**
 * Call attachMasterSession on native side
 * @param {String} session_id - the newton session id getSessionId()
 * @param {String} newton_token - the newton token gave by getUserToken()
 * @param {Object} [extra] - an extra custom data object to send
 * @param {Function} onSuccess - onSuccess callback. required
 * @param {Function} onError - onError callback. required
 */
NativeNewton.prototype.attachMasterSession = function attachMasterSession(session_id, newton_token) {
    var args = [].slice.call(arguments);
    onError = args.splice(args.length -1, 1)[0];
    onSuccess = args.splice(args.length -1, 1)[0];
    return exec(onSuccess, onError, this.nativeClassName, 'attachMasterSession', args);
}

/**
 * Set the push callback
 * @param {Function} pushCallback - the function to register
 */
NativeNewton.prototype.setPushCallback = function(pushCallback) {
    return exec(pushCallback, function(e) {
        console.warn('setPushCallback error', e);
    }, this.nativeClassName, 'setPushCallback', []);
}

var NativeNewtonInstance = new NativeNewton('Newton');
module.exports = Object.freeze(NativeNewtonInstance);

/*
NativeNewton.registerDevice();
NativeNewton.attachMasterSession();
NativeNewton.setPushCallback(fn);
*/