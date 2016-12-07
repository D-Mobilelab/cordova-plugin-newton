var exec = cordova.require('cordova/exec');


/**
 * Newton public interface, implement the same interface of Newton JS SDK
 * where there are not callbacks on methods
 */

/**
 * 
 * 
 * Newton constructor.
 *
 * @param {Object} options to initiate Newton.
 * @return {Newton} instance that can be used to send events and receive push notification.
 */
var Newton = function(options) {
    this._handlers = {
        'notification': [],
        'error': [],
        'initialized': []
    };

    // FIXME: keep this updated so clients can request it syncronously
    this._isUserLogged = false;

    // this will be updated after initialization, but before initialized event
    this._enviromentString = "UNKNOWN";

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
            // callback hell!!!
            that._updateUserLogged(
                function() {
                    that._updateEnvString(
                        function() {
                            that.emit('initialized', result);
                        }
                    );
                }
            );

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

Newton.prototype._updateUserLogged = function(cbOnSuccess) {
    var that = this;
    NewtonPlugin.isUserLogged(
        function(logged){
            if (logged) {
                that._isUserLogged = logged.isUserLogged;
            }
            if (cbOnSuccess && (typeof cbOnSuccess === 'function')) {
                cbOnSuccess.apply(null, arguments);
            }
        },
        cordovaCallback.getFailFunc("isUserLogged")
    );
};

Newton.prototype._updateEnvString = function(cbOnSuccess) {
    var that = this;
    NewtonPlugin.getEnvironmentString(
        function(env){
            if (env) {
                that._enviromentString = env["environmentString"];
            }

            if (cbOnSuccess && (typeof cbOnSuccess === 'function')) {
                cbOnSuccess.apply(null, arguments);
            }
        },
        cordovaCallback.getFailFunc("getEnvironmentString")
    );
};

/**
 * Unregister from push notifications
 */

Newton.prototype.unregister = function(options) {
    
    var that = this;
    var cleanHandlersAndPassThrough = function() {
        if (!options) {
            that._handlers = {
                'initialized': [],
                'notification': [],
                'error': []
            };
        }
        cordovaCallback.success("unregister");
    };

    exec(success, cordovaCallback.getSuccessFunc("unregister"), 'Newton', 'unregister', [options]);
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
Newton.prototype.finish = function(id) {
    if (!id) { id = 'handler'; }
    
    NewtonPlugin.finish(
        cordovaCallback.getSuccessFunc("finish"),
        cordovaCallback.getFailFunc("finish"),
        id
    );
};

/**
 * Call this to set the application icon badge
 */
Newton.prototype.setApplicationIconBadgeNumber = function(badge) {
    NewtonPlugin.setApplicationIconBadgeNumber(
        cordovaCallback.getSuccessFunc("setApplicationIconBadgeNumber"),
        cordovaCallback.getFailFunc("setApplicationIconBadgeNumber"),
        badge
    );
};


Newton.prototype.clearAllNotifications = function() {
    NewtonPlugin.clearAllNotifications(
        cordovaCallback.getSuccessFunc("clearAllNotifications"),
        cordovaCallback.getFailFunc("clearAllNotifications")
    );
};

Newton.prototype.sendEvent = function(eventName, eventParams) {
    if (!eventParams) { eventParams = {}; }

    if (!eventName)  {
        console.log('sendEvent failure: missing parameter eventName');
        return;
    }

    if (typeof eventParams !== 'object')  {
        console.log('sendEvent failure: eventParams parameter not an object');
        return;
    }

    NewtonPlugin.sendEvent(
        cordovaCallback.getSuccessFunc("sendEvent"),
        cordovaCallback.getFailFunc("sendEvent"),
        eventName,
        eventParams
    );
};


/*
.getExternalLoginFlow()
.startLoginFlow();
} else {
.getCustomLoginFlow()
.startLoginFlow();  
*/
var NewtonLoginBuilderFlowType = {
    external: "external",
    custom: "custom",
    unknown: "unknown"
};
var NewtonLoginBuilder = function(newtonInstance) {
    this.newtonInstance = newtonInstance;
    this.customData = {};
    this.onFlowCompleteCb = function() {console.log("[NewtonLoginBuilder] flow complete callback not set!")};
    this.externalId = null;
    this.customId = null;
    this.flowType = NewtonLoginBuilderFlowType.unknown;
};
NewtonLoginBuilder.prototype.setCustomData = function(c) {
    this.customData = c;
    return this;
};
NewtonLoginBuilder.prototype.setOnFlowCompleteCallback = function(c) {
    this.onFlowCompleteCb = c;
    return this;    
};
NewtonLoginBuilder.prototype.setExternalID = function(id) {
    this.externalId = id;
    return this;    
};
NewtonLoginBuilder.prototype.setCustomID = function(id) {
    this.customId = id;
    return this;    
};
NewtonLoginBuilder.prototype.getExternalLoginFlow = function() {
    this.flowType = NewtonLoginBuilderFlowType.external;
    return this;
};
NewtonLoginBuilder.prototype.getCustomLoginFlow = function() {
    this.flowType = NewtonLoginBuilderFlowType.custom;
    return this;
};
NewtonLoginBuilder.prototype.startLoginFlow = function(c) {
    var loginParameters = {
        type: this.flowType
    };
    if (this.customData) {
        loginParameters.customData = this.customData;
    }
    switch (this.flowType) {
        case NewtonLoginBuilderFlowType.custom:
            loginParameters.customId = this.customId;
            break;

        case NewtonLoginBuilderFlowType.external:
            loginParameters.externalId = this.externalId;
            break;
    
        default:
            console.error("[NewtonLoginBuilder] flow type unkown!");
            break;
    }

    var that = this;
    NewtonPlugin.startLoginFlowWithParams(
        function() {
            if (that.onFlowCompleteCb && (typeof that.onFlowCompleteCb === 'function')) {
                that.onFlowCompleteCb();
            }
        },
        cordovaCallback.getFailFunc("startLoginFlowWithParams"),
        loginParameters
    );
};

Newton.prototype.getLoginBuilder = function() {
    return new NewtonLoginBuilder(this);
};

Newton.prototype.isUserLogged = function() {
    return this._isUserLogged;
};

Newton.prototype.getEnvironmentString = function() {
    return this._enviromentString;
};


Newton.prototype.userLogout = function() {
    var that = this;
    NewtonPlugin.userLogout(
        cordovaCallback.getSuccessFunc("userLogout", function(){
            that._updateUserLogged();
        }),
        cordovaCallback.getFailFunc("userLogout")
    );
};

// FIXME: callback required here
Newton.prototype.getUserMetaInfo = function(successCallback, errorCallback) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }

    NewtonPlugin.getUserMetaInfo(successCallback, errorCallback);
};

// FIXME: callback required here
Newton.prototype.getUserToken = function(successCallback, errorCallback) {
    NewtonPlugin.getUserToken(successCallback, errorCallback);
};

// FIXME: callback required here
Newton.prototype.getOAuthProviders = function(successCallback, errorCallback) {
    NewtonPlugin.getOAuthProviders(successCallback, errorCallback);
};

/**
 * rankContent
 * @param contentId: int
 * @param scope: CONSUMPTION | SOCIAL | EDITORIAL
 * @param multipler: double
 */
Newton.prototype.rankContent = function(contentId, scope, multipler) {
    if (!multipler) { multipler = 1.0; }
    
    NewtonPlugin.rankContent(
        cordovaCallback.getSuccessFunc("rankContent"),
        cordovaCallback.getFailFunc("rankContent"),
        contentId,
        scope,
        multipler
    );
};

Newton.prototype.timedEventStart = function(name, data) {
    if (!data) { data = {}; }

    if (!name)  {
        console.log('timedEventStart failure: name parameter missing');
        return;
    }

    if (typeof data !== 'object')  {
        console.log('timedEventStart failure: data parameter not an object');
        return;
    }

    NewtonPlugin.timedEventStart(
        cordovaCallback.getSuccessFunc("timedEventStart"),
        cordovaCallback.getFailFunc("timedEventStart"),
        name,
        data
    );
};


Newton.prototype.timedEventStop = function(name, data) {
    if (!data) { data = {}; }

    if (!name)  {
        console.log('timedEventStop failure: name parameter missing');
        return;
    }

    if (typeof data !== 'object')  {
        console.log('timedEventStop failure: data parameter not an object');
        return;
    }

    NewtonPlugin.timedEventStop(
        cordovaCallback.getSuccessFunc("timedEventStop"),
        cordovaCallback.getFailFunc("timedEventStop"),
        name,
        data
    );
};


Newton.prototype.flowBegin = function(flowName, flowParams) {
    if (!flowParams) { flowParams = {}; }

    if (!flowName)  {
        console.log('flowBegin failure: missing parameter flowName');
        return;
    }

    if (typeof flowParams !== 'object')  {
        console.log('flowBegin failure: flowParams parameter not an object');
        return;
    }

    NewtonPlugin.flowBegin(
        cordovaCallback.getSuccessFunc("flowBegin"),
        cordovaCallback.getFailFunc("flowBegin"),
        flowName,
        flowParams
    );
};


Newton.prototype.flowCancel = function(flowName, flowParams) {
    if (!flowParams) { flowParams = {}; }

    if (!flowName)  {
        console.log('flowCancel failure: missing parameter flowName');
        return;
    }

    if (typeof flowParams !== 'object')  {
        console.log('flowCancel failure: flowParams parameter not an object');
        return;
    }

    NewtonPlugin.flowCancel(
        cordovaCallback.getSuccessFunc("flowCancel"),
        cordovaCallback.getFailFunc("flowCancel"),
        flowName,
        flowParams
    );
};


Newton.prototype.flowFail = function(flowName, flowParams) {
    if (!flowParams) { flowParams = {}; }

    if (!flowName)  {
        console.log('flowFail failure: missing parameter flowName');
        return;
    }

    if (typeof flowParams !== 'object')  {
        console.log('flowFail failure: flowParams parameter not an object');
        return;
    }

    NewtonPlugin.flowFail(
        cordovaCallback.getSuccessFunc("flowFail"),
        cordovaCallback.getFailFunc("flowFail"),
        flowName,
        flowParams
    );
};


Newton.prototype.flowStep = function(flowName, flowParams) {
    if (!flowParams) { flowParams = {}; }

    if (!flowName)  {
        console.log('flowStep failure: missing parameter flowName');
        return;
    }

    if (typeof flowParams !== 'object')  {
        console.log('flowStep failure: flowParams parameter not an object');
        return;
    }

    NewtonPlugin.flowStep(
        cordovaCallback.getSuccessFunc("flowStep"),
        cordovaCallback.getFailFunc("flowStep"),
        flowName,
        flowParams
    );
};


Newton.prototype.flowSucceed = function(flowName, flowParams) {
    if (!flowParams) { flowParams = {}; }

    if (!flowName)  {
        console.log('flowSucceed failure: missing parameter flowName');
        return;
    }

    if (typeof flowParams !== 'object')  {
        console.log('flowSucceed failure: flowParams parameter not an object');
        return;
    }

    NewtonPlugin.flowSucceed(
        cordovaCallback.getSuccessFunc("flowSucceed"),
        cordovaCallback.getFailFunc("flowSucceed"),
        flowName,
        flowParams
    );
};

/****************************/

/**
 * 
 * interface to native platform Newton
 * 
 */
var NewtonPlugin = {

    /**
     * Call this to set the application icon badge
     */
    setApplicationIconBadgeNumber:  function(successCallback, errorCallback, badge) {
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
    },


    /**
     * Get the application icon badge
     */

    clearAllNotifications: function(successCallback, errorCallback) {
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
    },

    /**
     * 
     * Needed for iOS
     * 
     */
    finish: function(successCallback, errorCallback, id) {
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
    },

    sendEvent: function(successCallback, errorCallback, eventName, eventParams) {
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
    },


    startLoginFlowWithParams: function(successCallback, errorCallback, loginParameters) {
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
    },

    isUserLogged: function(successCallback, errorCallback) {
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
    },

    getEnvironmentString: function(successCallback, errorCallback) {
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
    },


    userLogout: function(successCallback, errorCallback) {
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
    },

    getUserMetaInfo: function(successCallback, errorCallback) {
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
    },

    getUserToken: function(successCallback, errorCallback) {
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
    },

    getOAuthProviders: function(successCallback, errorCallback) {
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
    },

    /**
     * rankContent
     * @param successCallback
     * @param errorCallback  
     * @param contentId: int
     * @param scope: CONSUMPTION | SOCIAL | EDITORIAL
     * @param multipler: double
     */
    rankContent: function(successCallback, errorCallback, contentId, scope, multipler) {
        if (!successCallback) { successCallback = function() {}; }
        if (!errorCallback) { errorCallback = function() {}; }

        if (typeof successCallback !== 'function') {
            console.log('rankContent failure: success callback parameter must be a function');
            return;
        }

        if (typeof errorCallback !== 'function')  {
            console.log('rankContent failure: failure parameter not a function');
            return;
        }

        exec(successCallback, errorCallback, 'Newton', 'rankContent', [contentId, scope, multipler]);
    },

    timedEventStart: function(successCallback, errorCallback, name, data) {
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
    },


    timedEventStop: function(successCallback, errorCallback, name, data) {
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
    },


    flowBegin: function(successCallback, errorCallback, flowName, flowParams) {
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
    },


    flowCancel: function(successCallback, errorCallback, flowName, flowParams) {
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
    },


    flowFail: function(successCallback, errorCallback, flowName, flowParams) {
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
    },


    flowStep: function(successCallback, errorCallback, flowName, flowParams) {
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
    },


    flowSucceed: function(successCallback, errorCallback, flowName, flowParams) {
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
    }

};


/*************/

var cordovaCallback = (function(){
    return {
        success: function(funcName, args) {
            var argsStr = "";
            if (args && (args instanceof Array)) {
                for (var i = 0; i < args.length; i++) {
                    argsStr = argsStr + JSON.stringify(args[i]) + "; ";
                }
            }
            console.log("["+funcName+"] Success! " + argsStr);
        },
        getSuccessFunc: function(funcName, cbOnSuccess) {
            return function() {
                cordovaCallback.success(funcName, arguments);
                
                if (cbOnSuccess && (typeof cbOnSuccess === 'function')) {
                    cbOnSuccess.apply(null, arguments);
                }
            }
        },
        fail: function(funcName) {
            var argsStr = "";
            if (args && (args instanceof Array)) {
                for (var i = 0; i < args.length; i++) {
                    argsStr = argsStr + JSON.stringify(args[i]) + "; ";
                }
            }
            console.error("["+funcName+"] Fail! " + argsStr);
        },
        getFailFunc: function(funcName) {
            return function() {
                cordovaCallback.fail(funcName, arguments);
            }
        },
    };
})();

var newtonSingleton = (function() {
    var newtonInstance;
    return {
        /**
         * Return already instantiated Newton or initialize a new one and start the registration process
         *
         * @param {Object} options
         * @return {Newton} instance
         */
        get: function(options) {
            if (!newtonInstance) {
                newtonInstance = new Newton(options);
                return newtonInstance;
            }
            return newtonInstance;
        }
    };
})();

/**
 * Newton Plugin.
 */
module.exports = {
    
    getSharedInstanceWithConfig: function(secretId, customData) {
        var options = {
            customData: customData
        };
        return newtonSingleton.get(options);
    },

    getSharedInstance: function() {
        return newtonSingleton.get();
    },

    hasPermission: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'Newton', 'hasPermission', []);
    },

    SimpleObject: {
        /**
         * return the same object sent in input as the conversion is done on native code
         */
        fromJSONObject: function(jsonObject) {
            return jsonObject;
        }
    },
};
