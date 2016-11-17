var exec = cordova.require('cordova/exec');

/**
 * Newton constructor.
 *
 * @param {Object} options to initiate Push Notifications.
 * @return {Newton} instance that can be monitored and cancelled.
 */

var Newton = function(options) {
    this._handlers = {
        'notification': [],
        'error': [],
        'initialized': []
    };

    // require options parameter
    if (typeof options === 'undefined') {
        throw new Error('The options argument is required.');
    }

    // store the options to this object instance
    this.options = options;

    // triggered on registration and notification
    var that = this;
    var success = function(result) {
        if (result && typeof result.initialized !== 'undefined') {
            that.emit('initialized', result);
        } else if (result && result.additionalData && typeof result.additionalData.actionCallback !== 'undefined') {
            var executeFunctionByName = function(functionName, context /*, args */) {
                var args = Array.prototype.slice.call(arguments, 2);
                var namespaces = functionName.split('.');
                var func = namespaces.pop();
                for (var i = 0; i < namespaces.length; i++) {
                    context = context[namespaces[i]];
                }
                return context[func].apply(context, args);
            };

            executeFunctionByName(result.additionalData.actionCallback, window, result);
        } else if (result) {
            that.emit('notification', result);
        }
    };

    // triggered on error
    var fail = function(msg) {
        var e = (typeof msg === 'string') ? new Error(msg) : msg;
        that.emit('error', e);
    };

    // wait at least one process tick to allow event subscriptions
    setTimeout(function() {
        exec(success, fail, 'Newton', 'init', [options]);
    }, 10);
};


/**
 * Unregister from push notifications
 */

Newton.prototype.unregister = function(successCallback, errorCallback, options) {
    if (!errorCallback) { errorCallback = function() {}; }

    if (typeof errorCallback !== 'function')  {
        console.log('PushNotification.unregister failure: failure parameter not a function');
        return;
    }

    if (typeof successCallback !== 'function') {
        console.log('PushNotification.unregister failure: success callback parameter must be a function');
        return;
    }

    var that = this;
    var cleanHandlersAndPassThrough = function() {
        if (!options) {
            that._handlers = {
                'initialized': [],
                'notification': [],
                'error': []
            };
        }
        successCallback();
    };

    exec(cleanHandlersAndPassThrough, errorCallback, 'Newton', 'unregister', [options]);
};


/**
 * Call this to set the application icon badge
 */

Newton.prototype.setApplicationIconBadgeNumber = function(successCallback, errorCallback, badge) {
    if (!errorCallback) { errorCallback = function() {}; }

    if (typeof errorCallback !== 'function')  {
        console.log('Newton.setApplicationIconBadgeNumber failure: failure parameter not a function');
        return;
    }

    if (typeof successCallback !== 'function') {
        console.log('Newton.setApplicationIconBadgeNumber failure: success callback parameter must be a function');
        return;
    }

    exec(successCallback, errorCallback, 'Newton', 'setApplicationIconBadgeNumber', [{badge: badge}]);
};


/**
 * Get the application icon badge
 */

Newton.prototype.clearAllNotifications = function(successCallback, errorCallback) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }

    if (typeof errorCallback !== 'function')  {
        console.log('Newton.clearAllNotifications failure: failure parameter not a function');
        return;
    }

    if (typeof successCallback !== 'function') {
        console.log('Newton.clearAllNotifications failure: success callback parameter must be a function');
        return;
    }

    exec(successCallback, errorCallback, 'Newton', 'clearAllNotifications', []);
};

/**
 * Listen for an event.
 *
 * The following events are supported:
 *
 *   - initialized
 *   - notification
 *   - error
 *
 * @param {String} eventName to subscribe to.
 * @param {Function} callback triggered on the event.
 */

Newton.prototype.on = function(eventName, callback) {
    if (this._handlers.hasOwnProperty(eventName)) {
        this._handlers[eventName].push(callback);
    }
};

/**
 * Remove event listener.
 *
 * @param {String} eventName to match subscription.
 * @param {Function} handle function associated with event.
 */

Newton.prototype.off = function (eventName, handle) {
    if (this._handlers.hasOwnProperty(eventName)) {
        var handleIndex = this._handlers[eventName].indexOf(handle);
        if (handleIndex >= 0) {
            this._handlers[eventName].splice(handleIndex, 1);
        }
    }
};

/**
 * Emit an event.
 *
 * This is intended for internal use only.
 *
 * @param {String} eventName is the event to trigger.
 * @param {*} all arguments are passed to the event listeners.
 *
 * @return {Boolean} is true when the event is triggered otherwise false.
 */

Newton.prototype.emit = function() {
    var args = Array.prototype.slice.call(arguments);
    var eventName = args.shift();

    if (!this._handlers.hasOwnProperty(eventName)) {
        return false;
    }

    for (var i = 0, length = this._handlers[eventName].length; i < length; i++) {
        var callback = this._handlers[eventName][i];
        if (typeof callback === 'function') {
            callback.apply(undefined,args);
        } else {
            console.log('event handler: ' + eventName + ' must be a function');
        }
    }

    return true;
};

/**
 * 
 * Needed for iOS
 * 
 */
Newton.prototype.finish = function(successCallback, errorCallback, id) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }
    if (!id) { id = 'handler'; }

    if (typeof successCallback !== 'function') {
        console.log('finish failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function')  {
        console.log('finish failure: failure parameter not a function');
        return;
    }

    exec(successCallback, errorCallback, 'Newton', 'finish', [id]);
};

Newton.prototype.sendEvent = function(successCallback, errorCallback, eventName, eventParams) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }
    if (!eventParams) { eventParams = {}; }

    if (typeof successCallback !== 'function') {
        console.log('sendEvent failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function')  {
        console.log('sendEvent failure: failure parameter not a function');
        return;
    }

    if (!eventName)  {
        console.log('sendEvent failure: missing parameter eventName');
        return;
    }

    if (typeof eventParams !== 'object')  {
        console.log('sendEvent failure: eventParams parameter not an object');
        return;
    }

    exec(successCallback, errorCallback, 'Newton', 'sendEvent', [eventName, eventParams]);
};


Newton.prototype.startLoginFlowWithParams = function(successCallback, errorCallback, loginParameters) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }
    if (!loginParameters) { loginParameters = {}; }

    if (typeof successCallback !== 'function') {
        console.log('event failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function')  {
        console.log('event failure: failure parameter not a function');
        return;
    }

    if (typeof loginParameters !== 'object')  {
        console.log('event failure: eventParams parameter not an object');
        return;
    }

    // FIXME: add check on loginParameters value, if the required ones are available

    exec(successCallback, errorCallback, 'Newton', 'startLoginFlowWithParams', [loginParameters]);
};

Newton.prototype.isUserLogged = function(successCallback, errorCallback) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }

    if (typeof successCallback !== 'function') {
        console.log('isUserLogged failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function')  {
        console.log('isUserLogged failure: failure parameter not a function');
        return;
    }

    exec(successCallback, errorCallback, 'Newton', 'isUserLogged', []);
};


Newton.prototype.getEnvironmentString = function(successCallback, errorCallback) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }

    if (typeof successCallback !== 'function') {
        console.log('getEnvironmentString failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function')  {
        console.log('getEnvironmentString failure: failure parameter not a function');
        return;
    }

    exec(successCallback, errorCallback, 'Newton', 'getEnvironmentString', []);
};


Newton.prototype.userLogout = function(successCallback, errorCallback) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }

    if (typeof successCallback !== 'function') {
        console.log('userLogout failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function')  {
        console.log('userLogout failure: failure parameter not a function');
        return;
    }

    exec(successCallback, errorCallback, 'Newton', 'userLogout', []);
};

Newton.prototype.getUserMetaInfo = function(successCallback, errorCallback) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }

    if (typeof successCallback !== 'function') {
        console.log('getUserMetaInfo failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function')  {
        console.log('getUserMetaInfo failure: failure parameter not a function');
        return;
    }

    exec(successCallback, errorCallback, 'Newton', 'getUserMetaInfo', []);
};

Newton.prototype.getUserToken = function(successCallback, errorCallback) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }

    if (typeof successCallback !== 'function') {
        console.log('getUserToken failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function')  {
        console.log('getUserToken failure: failure parameter not a function');
        return;
    }

    exec(successCallback, errorCallback, 'Newton', 'getUserToken', []);
};

Newton.prototype.getOAuthProviders = function(successCallback, errorCallback) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }

    if (typeof successCallback !== 'function') {
        console.log('getOAuthProviders failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function')  {
        console.log('getOAuthProviders failure: failure parameter not a function');
        return;
    }

    exec(successCallback, errorCallback, 'Newton', 'getOAuthProviders', []);
};

/**
 * rankContent
 * @param successCallback
 * @param errorCallback  
 * @param contentId: int
 * @param scope: CONSUMPTION | SOCIAL | EDITORIAL
 * @param multipler: double
 */
Newton.prototype.rankContent = function(successCallback, errorCallback, contentId, scope, multipler) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }
    if (!multipler) { multipler = 1.0; }

    if (typeof successCallback !== 'function') {
        console.log('rankContent failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function')  {
        console.log('rankContent failure: failure parameter not a function');
        return;
    }

    exec(successCallback, errorCallback, 'Newton', 'rankContent', [contentId, scope, multipler]);
};

Newton.prototype.timedEventStart = function(successCallback, errorCallback, name, data) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }
    if (!data) { data = {}; }

    if (typeof successCallback !== 'function') {
        console.log('timedEventStart failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function')  {
        console.log('timedEventStart failure: failure parameter not a function');
        return;
    }

    if (!name)  {
        console.log('timedEventStart failure: name parameter missing');
        return;
    }

    if (typeof data !== 'object')  {
        console.log('timedEventStart failure: data parameter not an object');
        return;
    }

    exec(successCallback, errorCallback, 'Newton', 'timedEventStart', [name, data]);
};


Newton.prototype.timedEventStop = function(successCallback, errorCallback, name, data) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }
    if (!data) { data = {}; }

    if (typeof successCallback !== 'function') {
        console.log('timedEventStop failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function')  {
        console.log('timedEventStop failure: failure parameter not a function');
        return;
    }

    if (!name)  {
        console.log('timedEventStop failure: name parameter missing');
        return;
    }

    if (typeof data !== 'object')  {
        console.log('timedEventStop failure: data parameter not an object');
        return;
    }

    exec(successCallback, errorCallback, 'Newton', 'timedEventStop', [name, data]);
};


Newton.prototype.flowBegin = function(successCallback, errorCallback, flowName, flowParams) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }
    if (!flowParams) { flowParams = {}; }

    if (typeof successCallback !== 'function') {
        console.log('flowBegin failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function')  {
        console.log('flowBegin failure: failure parameter not a function');
        return;
    }

    if (!flowName)  {
        console.log('flowBegin failure: missing parameter flowName');
        return;
    }

    if (typeof flowParams !== 'object')  {
        console.log('flowBegin failure: flowParams parameter not an object');
        return;
    }

    exec(successCallback, errorCallback, 'Newton', 'flowBegin', [flowName, flowParams]);
};


Newton.prototype.flowCancel = function(successCallback, errorCallback, flowName, flowParams) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }
    if (!flowParams) { flowParams = {}; }

    if (typeof successCallback !== 'function') {
        console.log('flowCancel failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function')  {
        console.log('flowCancel failure: failure parameter not a function');
        return;
    }

    if (!flowName)  {
        console.log('flowCancel failure: missing parameter flowName');
        return;
    }

    if (typeof flowParams !== 'object')  {
        console.log('flowCancel failure: flowParams parameter not an object');
        return;
    }

    exec(successCallback, errorCallback, 'Newton', 'flowCancel', [flowName, flowParams]);
};


Newton.prototype.flowFail = function(successCallback, errorCallback, flowName, flowParams) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }
    if (!flowParams) { flowParams = {}; }

    if (typeof successCallback !== 'function') {
        console.log('flowFail failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function')  {
        console.log('flowFail failure: failure parameter not a function');
        return;
    }

    if (!flowName)  {
        console.log('flowFail failure: missing parameter flowName');
        return;
    }

    if (typeof flowParams !== 'object')  {
        console.log('flowFail failure: flowParams parameter not an object');
        return;
    }

    exec(successCallback, errorCallback, 'Newton', 'flowFail', [flowName, flowParams]);
};


Newton.prototype.flowStep = function(successCallback, errorCallback, flowName, flowParams) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }
    if (!flowParams) { flowParams = {}; }

    if (typeof successCallback !== 'function') {
        console.log('flowStep failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function')  {
        console.log('flowStep failure: failure parameter not a function');
        return;
    }

    if (!flowName)  {
        console.log('flowStep failure: missing parameter flowName');
        return;
    }

    if (typeof flowParams !== 'object')  {
        console.log('flowStep failure: flowParams parameter not an object');
        return;
    }

    exec(successCallback, errorCallback, 'Newton', 'flowStep', [flowName, flowParams]);
};


Newton.prototype.flowSucceed = function(successCallback, errorCallback, flowName, flowParams) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }
    if (!flowParams) { flowParams = {}; }

    if (typeof successCallback !== 'function') {
        console.log('flowSucceed failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function')  {
        console.log('flowSucceed failure: failure parameter not a function');
        return;
    }

    if (!flowName)  {
        console.log('flowSucceed failure: missing parameter flowName');
        return;
    }

    if (typeof flowParams !== 'object')  {
        console.log('flowSucceed failure: flowParams parameter not an object');
        return;
    }

    exec(successCallback, errorCallback, 'Newton', 'flowSucceed', [flowName, flowParams]);
};

/*!
 * Newton Plugin.
 */

module.exports = {
    /**
     * Register for Push Notifications.
     *
     * This method will instantiate a new copy of the Newton object
     * and start the registration process.
     *
     * @param {Object} options
     * @return {Newton} instance
     */

    init: function(options) {
        return new Newton(options);
    },

    hasPermission: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'Newton', 'hasPermission', []);
    },
};
