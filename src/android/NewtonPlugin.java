package com.buongiorno.newton.cordova;

import android.app.Activity;
import android.app.NotificationManager;
import android.content.Context;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.buongiorno.newton.MetaInfo;
import com.buongiorno.newton.Newton;
import com.buongiorno.newton.NewtonError;
import com.buongiorno.newton.SimpleObject;
import com.buongiorno.newton.events.RankingEvent;
import com.buongiorno.newton.exceptions.NewtonException;
import com.buongiorno.newton.exceptions.NewtonNotInitializedException;
import com.buongiorno.newton.exceptions.OAuthException;
import com.buongiorno.newton.exceptions.PushRegistrationException;
import com.buongiorno.newton.exceptions.SimpleObjectException;
import com.buongiorno.newton.exceptions.UserAlreadyLoggedException;
import com.buongiorno.newton.exceptions.UserMetaInfoException;
import com.buongiorno.newton.interfaces.IBasicResponse;
import com.buongiorno.newton.interfaces.IMetaInfoCallBack;
import com.buongiorno.newton.oauth.flows.LoginBuilder;
import com.buongiorno.newton.push.StandardPushObject;
import com.google.android.gms.common.GooglePlayServicesUtil;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import me.leolin.shortcutbadger.ShortcutBadger;


/**
 * Created by mirco.cipriani on 20/10/16.
 */
public class NewtonPlugin extends CordovaPlugin {
    private Newton newtonEngine = null;
    public static final String LOG_TAG = "NewtonPlugin";

    private static final String META_SECRET = "newton_secret";

    private static CallbackContext pushContext;
    private static CallbackContext loginContext;
    private static CordovaWebView gWebView;
    private static boolean gForeground = false;
    private static List<StandardPushObject> gCachedPushes = Collections.synchronizedList(new ArrayList<StandardPushObject>());

    /**
     * Gets the application context from cordova's main activity.
     * @return the application context
     */
    private Context getApplicationContext() {
        return this.getActivity().getApplicationContext();
    }

    private enum LoginOptions {
        customData, externalId, type, customId
    }

    private enum LoginFlowType {
        custom, external
    }

    /**
     * Gets the cordova main activity.
     * @return the activity
     */
    private Activity getActivity() {
        return this.cordova.getActivity();
    }

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        gForeground = true;
    }

    @Override
    public boolean execute(final String action, final JSONArray data, final CallbackContext callbackContext) {
        Log.v(LOG_TAG, "execute: action=" + action);
        Log.v(LOG_TAG, "execute: data=" + data.toString());
        gWebView = this.webView;
        
        if ("initialize".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    pushContext = callbackContext;

                    JSONObject jo;
                    JSONObject customDataJo;

                    try {
                        jo = data.getJSONObject(0);
                        customDataJo = jo.optJSONObject("customData");

                    } catch (JSONException e) {
                        Log.e(LOG_TAG, "[action: init] parameters error:" + e.getMessage(), e);
                        callbackContext.error("Invalid parameters: "+e.getMessage());
                        return;
                    }

                    SimpleObject customData = null;
                    if (customDataJo == null) {
                        customData = new SimpleObject();
                    } else {
                        try {
                            customData = SimpleObject.fromJSONObject(customDataJo);
                        } catch (SimpleObjectException e) {
                            Log.e(LOG_TAG, "[action: init] SimpleObject parameters error:" + e.getMessage(), e);
                            callbackContext.error("Invalid parameters, cannot convert to SimpleObject: "+e.getMessage());
                            return;
                        }
                    }

                    // force hybrid true
                    customData.setBool("hybrid", true);

                    try {
                        String newtonSecret = ((NewtonApplication) getApplicationContext()).getNewtonSecret();

                        newtonEngine = Newton.getSharedInstance();
                        newtonEngine.setCustomDataInSessionEvent(customData);

                        newtonEngine.getPushManager().registerDevice();

                        // emit initialization finished
                        JSONObject initFinished = new JSONObject();
                        initFinished.put("initialized", true);

                        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, initFinished);
                        pluginResult.setKeepCallback(true);
                        pushContext.sendPluginResult(pluginResult);

                        // if there are any push saved emit them
                        if (!gCachedPushes.isEmpty()) {
                            Log.v(LOG_TAG, "sending cached extras");
                            synchronized(gCachedPushes) {
                                Iterator<StandardPushObject> gCachedPushesIterator = gCachedPushes.iterator();
                                while (gCachedPushesIterator.hasNext()) {
                                    sendPushToJs(gCachedPushesIterator.next());
                                }
                            }
                            gCachedPushes.clear();
                        }

                    } catch (NewtonException e) {
                        Log.e(LOG_TAG, "NewtonException - Newton initialization error:" + e.getMessage(), e);
                        callbackContext.error("NewtonException - Newton initialization error: "+e.getMessage());

                    } catch (PushRegistrationException e) {
                        // FIXME: this should be optional ?
                        GooglePlayServicesUtil.getErrorDialog(e.getGoooglePlayCode(), null, 1).show();

                        Log.e(LOG_TAG, "PushRegistrationException - Newton initialization error:" + e.getMessage(), e);
                        callbackContext.error("PushRegistrationException - Newton initialization error: "+e.getMessage());

                    } catch (JSONException e) {
                        Log.e(LOG_TAG, "JSONException - JSON with initialization result error:" + e.getMessage(), e);
                        callbackContext.error("JSONException - JSON with initialization result error: "+e.getMessage());

                    } catch (Exception e) {
                        Log.e(LOG_TAG, "Exception - initialization error:" + e.getMessage(), e);
                        callbackContext.error("Exception - initialization error: "+e.getMessage());
                    }
                }
            });
        } else if("registerDevice".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        Log.v(LOG_TAG, "registerDevice: data=" + data.toString());
                        newtonEngine = Newton.getSharedInstance();
                        newtonEngine.getPushManager().registerDevice();
                        callbackContext.success();
                    } catch (PushRegistrationException e) {
                        callbackContext.error("" + e.getMessage());
                    } catch(NewtonNotInitializedException e) {
                        callbackContext.error("" + e.getMessage());
                    } catch(NewtonException e) {
                        callbackContext.error("" + e.getMessage());
                    }
                }
            });
        } else if("attachMasterSession".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        Log.v(LOG_TAG, "sessionId: data=" + data.toString());
                        String sessionId = data.getString(0);
                        String newtonToken = data.getString(1);
                        SimpleObject extraData;
                        JSONObject jo = data.optJSONObject(2);

                        newtonEngine = Newton.getSharedInstance();
                        if(jo != null) {
                            extraData = SimpleObject.fromJSONObject(jo);
                            //newtonEngine.attachMasterSession(sessionId, newtonToken, extraData);
                        } else {
                            //newtonEngine.attachMasterSession(sessionId, newtonToken);
                        }
                        callbackContext.success();
                    } catch(Exception e) {
                        callbackContext.error("" + e.getMessage());
                    }
                }
            });
        } else if("setPushCallback".equals(action)) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            if(pushContext == null) {
                                Log.v(LOG_TAG, "setPushCallback for first time");
                                pushContext = callbackContext;
                            }

                            // if there are any push saved emit them
                            if (!gCachedPushes.isEmpty()) {
                                Log.v(LOG_TAG, "sending cached extras");
                                synchronized(gCachedPushes) {
                                    Iterator<StandardPushObject> gCachedPushesIterator = gCachedPushes.iterator();
                                    while (gCachedPushesIterator.hasNext()) {
                                        sendPushToJs(gCachedPushesIterator.next());
                                    }
                                }
                                gCachedPushes.clear();
                            }
                            
                        } catch(Exception e) {
                            String errorMessage = "setPushCallback: " + e.getMessage();
                            Log.e(LOG_TAG, errorMessage);
                            callbackContext.error(errorMessage);
                        }
                    }
                });
        } else if ("unregister".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {

                    // FIXME: what to do here ? remove reference to pushContext ?
                    pushContext = null;
                    loginContext = null;

                    callbackContext.success();
                }
            });
        } else if ("finish".equals(action)) {
            callbackContext.success();
        } else if ("hasPermission".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    JSONObject jo = new JSONObject();
                    try {
                        jo.put("isEnabled", PermissionUtils.hasPermission(getApplicationContext(), "OP_POST_NOTIFICATION"));
                        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, jo);
                        pluginResult.setKeepCallback(true);
                        callbackContext.sendPluginResult(pluginResult);
                    } catch (UnknownError e) {
                        callbackContext.error(e.getMessage());
                    } catch (JSONException e) {
                        callbackContext.error(e.getMessage());
                    }
                }
            });
        } else if ("setApplicationIconBadgeNumber".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    Log.v(LOG_TAG, "setApplicationIconBadgeNumber: data=" + data.toString());
                    try {
                        setApplicationIconBadgeNumber(getApplicationContext(), data.getJSONObject(0).getInt("badge"));
                    } catch (JSONException e) {
                        callbackContext.error(e.getMessage());
                    }
                    callbackContext.success();
                }
            });
        } else if ("clearAllNotifications".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    Log.v(LOG_TAG, "clearAllNotifications");
                    clearAllNotifications();
                    callbackContext.success();
                }
            });
        } else if ("sendEvent".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    String eventName;
                    JSONObject eventParams;
                    SimpleObject eventParamsSO;

                    try {
                        eventName = data.getString(0);
                        eventParams = data.getJSONObject(1);

                    } catch (JSONException e) {
                        Log.e(LOG_TAG, "[action: sendEvent] JSON parameters error:" + e.getMessage(), e);
                        callbackContext.error("Invalid parameters: "+e.getMessage());
                        return;
                    }

                    try {
                        eventParamsSO = SimpleObject.fromJSONObject(eventParams);
                    } catch (SimpleObjectException e) {
                        Log.e(LOG_TAG, "[action: sendEvent] SimpleObject parameters error:" + e.getMessage(), e);
                        callbackContext.error("Invalid parameters, cannot convert to SimpleObject: "+e.getMessage());
                        return;
                    }

                    try {
                        Newton.getSharedInstance().sendEvent(eventName, eventParamsSO);
                    } catch (NewtonException e) {
                        Log.e(LOG_TAG, "[action: sendEvent] Newton sendEvent error:" + e.getMessage(), e);
                        callbackContext.error("NewtonException: "+e.getMessage());
                        return;
                    }
                    callbackContext.success();
                }
            });
        } else if ("startLoginFlowWithParams".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    loginContext = callbackContext;
                    JSONObject eventParams;

                    try {
                        eventParams = data.getJSONObject(0);


                        /**
                         * 1#
                         *
                         * initialize the loginBuilder and set completion callbacks
                         * to call javascript when done
                         *
                         */
                        LoginBuilder loginBuilder = Newton.getSharedInstance().getLoginBuilder();
                        LoginFlowType loginFlowType = null;

                        // mc 19/06/17: keepcallback removed, it shouldn't be needed 
                        loginBuilder.setOnFlowCompleteCallback(new IBasicResponse() {
                            @Override
                            public void onSuccess() {
                                PluginResult pluginResult = new PluginResult(PluginResult.Status.OK);
                                //pluginResult.setKeepCallback(true);
                                loginContext.sendPluginResult(pluginResult);
                            }

                            @Override
                            public void onFailure(NewtonError newtonError) {
                                Log.e(LOG_TAG, "[action: startLoginFlowWithParams] Flow failure:"+newtonError.getMessage());
                                JSONObject joNewtonError = new JSONObject();
                                try {
                                    joNewtonError.put("error", true);
                                    joNewtonError.put("errorDescription", newtonError.getMessage());

                                } catch (JSONException e) {
                                    Log.e(LOG_TAG, "[action: startLoginFlowWithParams] Flow failure error on reporting:"+e.getMessage());

                                    PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR);
                                    //pluginResult.setKeepCallback(true);
                                    loginContext.sendPluginResult(pluginResult);
                                    return;
                                }

                                PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR, joNewtonError);
                                //pluginResult.setKeepCallback(true);
                                loginContext.sendPluginResult(pluginResult);
                            }
                        });


                        /**
                         * 2#
                         *
                         * iterate over parameters to initialize the login builder
                         *
                         */
                        Iterator<String> it = eventParams.keys();

                        while (it.hasNext()) {
                            String key = it.next();
                            LoginOptions loginOption;

                            try {
                                loginOption = LoginOptions.valueOf(key);
                            }
                            catch (IllegalArgumentException e) {
                                Log.e(LOG_TAG, "[action: startLoginFlowWithParams] JSON parameters error:'"+key+"' error: "+e.getMessage(), e);
                                callbackContext.error("Invalid startLoginFlowWithParams param: '"+key+"' error: "+e.getMessage());
                                return;
                            }

                            switch (loginOption) {
                                case customData:
                                    JSONObject customData = eventParams.getJSONObject(key);
                                    SimpleObject customDataSO = SimpleObject.fromJSONObject(customData);
                                    loginBuilder.setCustomData(customDataSO);
                                    break;

                                case externalId:
                                    loginBuilder.setExternalID(eventParams.getString(key));
                                    break;

                                case customId:
                                    loginBuilder.setCustomID(eventParams.getString(key));
                                    break;

                                case type:
                                    String type = eventParams.getString(key);

                                    try {
                                        loginFlowType = LoginFlowType.valueOf(type);
                                    }
                                    catch (IllegalArgumentException e) {
                                        Log.e(LOG_TAG, "[action: login] JSON parameters error LoginFlowType with unknow value");
                                        callbackContext.error("Invalid login option parameter value for LoginFlowType");
                                        return;
                                    }
                                    break;
                                default:
                                    // verify that all LoginOptions enum are handled in the switch!
                                    Log.w(LOG_TAG, "option key unknown!");
                            }
                        }

                        /**
                         * 3#
                         *
                         * then start the login flow
                         *
                         */
                        switch (loginFlowType) {
                            case external:
                                loginBuilder.getExternalLoginFlow()
                                        .startLoginFlow();
                                break;
                            case custom:
                                loginBuilder.getCustomLoginFlow()
                                        .startLoginFlow();
                                break;
                            default:
                                Log.e(LOG_TAG, "[action: login] JSON parameters error LoginFlowType with unhandled value");
                        }

                        /**
                         * set the plugin result context to be persistent (keep callback)
                         */
                        PluginResult pluginResult = new PluginResult(PluginResult.Status.NO_RESULT);
                        pluginResult.setKeepCallback(true);
                        loginContext.sendPluginResult(pluginResult);

                    } catch (JSONException e) {
                        Log.e(LOG_TAG, "[action: login] JSON parameters error:" + e.getMessage(), e);
                        callbackContext.error("Invalid parameters: "+e.getMessage());
                    } catch (SimpleObjectException e) {
                        Log.e(LOG_TAG, "[action: login] JSON parameters error:" + e.getMessage(), e);
                        callbackContext.error("Invalid parameters: "+e.getMessage());
                    } catch (OAuthException e) {
                        Log.e(LOG_TAG, "[action: login] OAuth error:" + e.getMessage(), e);
                        callbackContext.error("OAuth error: "+e.getMessage());
                    } catch (NewtonException e) {
                        Log.e(LOG_TAG, "[action: login] Newton error:" + e.getMessage(), e);
                        callbackContext.error("Newton error: "+e.getMessage());
                    } catch (UserAlreadyLoggedException e) {
                        Log.e(LOG_TAG, "[action: login] UserAlreadyLogged error:" + e.getMessage(), e);
                        callbackContext.error("UserAlreadyLogged error: "+e.getMessage());
                    }
                }
            });
        }
        else if ("isUserLogged".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {

                    try {
                        boolean logged = Newton.getSharedInstance().isUserLogged();

                        JSONObject jo = new JSONObject();
                        jo.put("isUserLogged", logged);
                        callbackContext.success(jo);

                    } catch (NewtonNotInitializedException e) {
                        Log.e(LOG_TAG, "[action: isUserLogged] NewtonNotInitialized error:" + e.getMessage(), e);
                        callbackContext.error("NewtonNotInitialized: "+e.getMessage());
                    } catch (JSONException e) {
                        Log.e(LOG_TAG, "[action: isUserLogged] JSON Error:"+e.getMessage());
                        callbackContext.error("JSON Error:"+e.getMessage());
                    }
                }
            });
        }
        else if ("getEnvironmentString".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {

                    try {
                        String environmentString = Newton.getSharedInstance().getEnvironmentString();

                        JSONObject jo = new JSONObject();
                        jo.put("environmentString", environmentString);
                        callbackContext.success(jo);

                    } catch (NewtonNotInitializedException e) {
                        Log.e(LOG_TAG, "[action: getEnvironmentString] NewtonNotInitialized error:" + e.getMessage(), e);
                        callbackContext.error("NewtonNotInitialized: "+e.getMessage());
                    } catch (JSONException e) {
                        Log.e(LOG_TAG, "[action: getEnvironmentString] JSON Error:"+e.getMessage());
                        callbackContext.error("JSON Error:"+e.getMessage());
                    }
                }
            });
        }
        else if ("userLogout".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {

                    try {
                        Newton.getSharedInstance().userLogout();
                        callbackContext.success();

                    } catch (NewtonNotInitializedException e) {
                        Log.e(LOG_TAG, "[action: getEnvironmentString] NewtonNotInitialized error:" + e.getMessage(), e);
                        callbackContext.error("NewtonNotInitialized: "+e.getMessage());
                    }
                }
            });
        }
        else if ("getUserMetaInfo".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    if (newtonEngine == null) {
                        Log.e(LOG_TAG, "[action: getUserMetaInfo] Newton not initialized");
                        callbackContext.error("Newton not initialized!");
                        return;
                    }
                    newtonEngine.getUserMetaInfo(new IMetaInfoCallBack() {
                        @Override
                        public void onSuccess(MetaInfo metaInfo) {
                            callbackContext.success(metaInfo.toJson());
                        }

                        @Override
                        public void onFailure(UserMetaInfoException e) {
                            Log.e(LOG_TAG, "[action: getUserMetaInfo] UserMetaInfo error:"+e.getMessage());
                            callbackContext.error(e.toString());
                        }
                    });
                }
            });
        }
        else if ("getUserToken".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {

                    try {
                        String userToken = Newton.getSharedInstance().getUserToken();

                        JSONObject jo = new JSONObject();
                        jo.put("userToken", userToken);
                        callbackContext.success(jo);

                    } catch (NewtonNotInitializedException e) {
                        Log.e(LOG_TAG, "[action: getUserToken] NewtonNotInitialized error:" + e.getMessage(), e);
                        callbackContext.error("NewtonNotInitialized: "+e.getMessage());
                    } catch (JSONException e) {
                        Log.e(LOG_TAG, "[action: getUserToken] JSON Error:"+e.getMessage());
                        callbackContext.error("JSON Error:"+e.getMessage());
                    }
                }
            });
        }
        else if ("getOAuthProviders".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {

                    try {
                        List<String> oAuthProviders = Newton.getSharedInstance().getOAuthProviders();

                        JSONArray jArray = new JSONArray();
                        for (String oAuthProvider : oAuthProviders) {
                            jArray.put(oAuthProvider);
                        }

                        JSONObject jo = new JSONObject();
                        jo.put("oAuthProviders", jArray);
                        callbackContext.success(jo);

                    } catch (NewtonNotInitializedException e) {
                        Log.e(LOG_TAG, "[action: getOAuthProviders] NewtonNotInitialized error:" + e.getMessage(), e);
                        callbackContext.error("NewtonNotInitialized: "+e.getMessage());
                    } catch (JSONException e) {
                        Log.e(LOG_TAG, "[action: getOAuthProviders] JSON Error:"+e.getMessage());
                        callbackContext.error("JSON Error:"+e.getMessage());
                    }
                }
            });
        }
        else if ("rankContent".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {

                    try {
                        String contentId = data.getString(0);
                        RankingEvent.RankingScope scope = RankingEvent.RankingScope.valueOf(data.getString(1).toUpperCase());
                        Double multipler = data.getDouble(2);

                        Newton.getSharedInstance().rankContent(contentId, scope, multipler);
                        callbackContext.success();

                    } catch (NewtonNotInitializedException e) {
                        Log.e(LOG_TAG, "[action: getEnvironmentString] NewtonNotInitialized error:" + e.getMessage(), e);
                        callbackContext.error("NewtonNotInitialized: "+e.getMessage());
                    } catch (JSONException e) {
                        Log.e(LOG_TAG, "[action: getEnvironmentString] JSON error:" + e.getMessage(), e);
                        callbackContext.error("JSON: "+e.getMessage());
                    } catch (NewtonException e) {
                        Log.e(LOG_TAG, "[action: getEnvironmentString] Newton error:" + e.getMessage(), e);
                        callbackContext.error("Newton: "+e.getMessage());
                    } catch (IllegalArgumentException e) {
                        Log.e(LOG_TAG, "[action: getEnvironmentString] IllegalArgument error:" + e.getMessage(), e);
                        callbackContext.error("IllegalArgument: "+e.getMessage());
                    }
                }
            });
        }
        else if ("timedEventStart".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {

                    try {
                        String name = data.getString(0);
                        JSONObject dataJo = data.getJSONObject(1);
                        SimpleObject dataSo = SimpleObject.fromJSONObject(dataJo);

                        Newton.getSharedInstance().timedEventStart(name, dataSo);
                        callbackContext.success();

                    } catch (NewtonNotInitializedException e) {
                        Log.e(LOG_TAG, "[action: timedEventStart] NewtonNotInitialized error:" + e.getMessage(), e);
                        callbackContext.error("NewtonNotInitialized: "+e.getMessage());
                    } catch (JSONException e) {
                        Log.e(LOG_TAG, "[action: timedEventStart] JSON error:" + e.getMessage(), e);
                        callbackContext.error("JSON: "+e.getMessage());
                    } catch (NewtonException e) {
                        Log.e(LOG_TAG, "[action: timedEventStart] Newton error:" + e.getMessage(), e);
                        callbackContext.error("Newton: "+e.getMessage());
                    } catch (SimpleObjectException e) {
                        Log.e(LOG_TAG, "[action: timedEventStart] SimpleObject error:" + e.getMessage(), e);
                        callbackContext.error("SimpleObject: "+e.getMessage());
                    }
                }
            });
        }
        else if ("timedEventStop".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {

                    try {
                        String name = data.getString(0);
                        JSONObject dataJo = data.getJSONObject(1);
                        SimpleObject dataSo = SimpleObject.fromJSONObject(dataJo);

                        Newton.getSharedInstance().timedEventStop(name, dataSo);
                        callbackContext.success();

                    } catch (NewtonNotInitializedException e) {
                        Log.e(LOG_TAG, "[action: timedEventStop] NewtonNotInitialized error:" + e.getMessage(), e);
                        callbackContext.error("NewtonNotInitialized: "+e.getMessage());
                    } catch (JSONException e) {
                        Log.e(LOG_TAG, "[action: timedEventStop] JSON error:" + e.getMessage(), e);
                        callbackContext.error("JSON: "+e.getMessage());
                    } catch (NewtonException e) {
                        Log.e(LOG_TAG, "[action: timedEventStop] Newton error:" + e.getMessage(), e);
                        callbackContext.error("Newton: "+e.getMessage());
                    } catch (SimpleObjectException e) {
                        Log.e(LOG_TAG, "[action: timedEventStop] SimpleObject error:" + e.getMessage(), e);
                        callbackContext.error("SimpleObject: "+e.getMessage());
                    }
                }
            });
        }
        else if ("flowBegin".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {

                    try {
                        String name = data.getString(0);
                        JSONObject dataJo = data.getJSONObject(1);
                        SimpleObject dataSo = SimpleObject.fromJSONObject(dataJo);

                        Newton.getSharedInstance().flowBegin(name, dataSo);
                        callbackContext.success();

                    } catch (NewtonNotInitializedException e) {
                        Log.e(LOG_TAG, "[action: flowBegin] NewtonNotInitialized error:" + e.getMessage(), e);
                        callbackContext.error("NewtonNotInitialized: "+e.getMessage());
                    } catch (JSONException e) {
                        Log.e(LOG_TAG, "[action: flowBegin] JSON error:" + e.getMessage(), e);
                        callbackContext.error("JSON: "+e.getMessage());
                    } catch (NewtonException e) {
                        Log.e(LOG_TAG, "[action: flowBegin] Newton error:" + e.getMessage(), e);
                        callbackContext.error("Newton: "+e.getMessage());
                    } catch (SimpleObjectException e) {
                        Log.e(LOG_TAG, "[action: flowBegin] SimpleObject error:" + e.getMessage(), e);
                        callbackContext.error("SimpleObject: "+e.getMessage());
                    }
                }
            });
        }
        else if ("flowCancel".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {

                    try {
                        String name = data.getString(0);
                        JSONObject dataJo = data.getJSONObject(1);
                        SimpleObject dataSo = SimpleObject.fromJSONObject(dataJo);

                        Newton.getSharedInstance().flowCancel(name, dataSo);
                        callbackContext.success();

                    } catch (NewtonNotInitializedException e) {
                        Log.e(LOG_TAG, "[action: flowCancel] NewtonNotInitialized error:" + e.getMessage(), e);
                        callbackContext.error("NewtonNotInitialized: "+e.getMessage());
                    } catch (JSONException e) {
                        Log.e(LOG_TAG, "[action: flowCancel] JSON error:" + e.getMessage(), e);
                        callbackContext.error("JSON: "+e.getMessage());
                    } catch (NewtonException e) {
                        Log.e(LOG_TAG, "[action: flowCancel] Newton error:" + e.getMessage(), e);
                        callbackContext.error("Newton: "+e.getMessage());
                    } catch (SimpleObjectException e) {
                        Log.e(LOG_TAG, "[action: flowCancel] SimpleObject error:" + e.getMessage(), e);
                        callbackContext.error("SimpleObject: "+e.getMessage());
                    }
                }
            });
        }
        else if ("flowFail".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {

                    try {
                        String name = data.getString(0);
                        JSONObject dataJo = data.getJSONObject(1);
                        SimpleObject dataSo = SimpleObject.fromJSONObject(dataJo);

                        Newton.getSharedInstance().flowFail(name, dataSo);
                        callbackContext.success();

                    } catch (NewtonNotInitializedException e) {
                        Log.e(LOG_TAG, "[action: flowFail] NewtonNotInitialized error:" + e.getMessage(), e);
                        callbackContext.error("NewtonNotInitialized: "+e.getMessage());
                    } catch (JSONException e) {
                        Log.e(LOG_TAG, "[action: flowFail] JSON error:" + e.getMessage(), e);
                        callbackContext.error("JSON: "+e.getMessage());
                    } catch (NewtonException e) {
                        Log.e(LOG_TAG, "[action: flowFail] Newton error:" + e.getMessage(), e);
                        callbackContext.error("Newton: "+e.getMessage());
                    } catch (SimpleObjectException e) {
                        Log.e(LOG_TAG, "[action: flowFail] SimpleObject error:" + e.getMessage(), e);
                        callbackContext.error("SimpleObject: "+e.getMessage());
                    }
                }
            });
        }
        else if ("flowStep".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {

                    try {
                        String name = data.getString(0);
                        JSONObject dataJo = data.getJSONObject(1);
                        SimpleObject dataSo = SimpleObject.fromJSONObject(dataJo);

                        Newton.getSharedInstance().flowStep(name, dataSo);
                        callbackContext.success();

                    } catch (NewtonNotInitializedException e) {
                        Log.e(LOG_TAG, "[action: flowStep] NewtonNotInitialized error:" + e.getMessage(), e);
                        callbackContext.error("NewtonNotInitialized: "+e.getMessage());
                    } catch (JSONException e) {
                        Log.e(LOG_TAG, "[action: flowStep] JSON error:" + e.getMessage(), e);
                        callbackContext.error("JSON: "+e.getMessage());
                    } catch (NewtonException e) {
                        Log.e(LOG_TAG, "[action: flowStep] Newton error:" + e.getMessage(), e);
                        callbackContext.error("Newton: "+e.getMessage());
                    } catch (SimpleObjectException e) {
                        Log.e(LOG_TAG, "[action: flowStep] SimpleObject error:" + e.getMessage(), e);
                        callbackContext.error("SimpleObject: "+e.getMessage());
                    }
                }
            });
        }
        else if ("flowSucceed".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {

                    try {
                        String name = data.getString(0);
                        JSONObject dataJo = data.getJSONObject(1);
                        SimpleObject dataSo = SimpleObject.fromJSONObject(dataJo);

                        Newton.getSharedInstance().flowSucceed(name, dataSo);
                        callbackContext.success();

                    } catch (NewtonNotInitializedException e) {
                        Log.e(LOG_TAG, "[action: flowSucceed] NewtonNotInitialized error:" + e.getMessage(), e);
                        callbackContext.error("NewtonNotInitialized: "+e.getMessage());
                    } catch (JSONException e) {
                        Log.e(LOG_TAG, "[action: flowSucceed] JSON error:" + e.getMessage(), e);
                        callbackContext.error("JSON: "+e.getMessage());
                    } catch (NewtonException e) {
                        Log.e(LOG_TAG, "[action: flowSucceed] Newton error:" + e.getMessage(), e);
                        callbackContext.error("Newton: "+e.getMessage());
                    } catch (SimpleObjectException e) {
                        Log.e(LOG_TAG, "[action: flowSucceed] SimpleObject error:" + e.getMessage(), e);
                        callbackContext.error("SimpleObject: "+e.getMessage());
                    }
                }
            });
        }
        else {
            Log.e(LOG_TAG, "Invalid action : " + action);
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
            return false;
        }

        return true;
    }

    /*
     * Sends the pushbundle extras to the client application.
     * If the client application isn't currently active, it is cached for later processing.
     */
    public static void sendPushToJs(StandardPushObject push) {
        if (push != null) {
            if (gWebView != null && pushContext != null) {
                Log.v(LOG_TAG, "sendPushToJs: send push now!");
                PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, convertPushToJson(push));
                pluginResult.setKeepCallback(true);
                pushContext.sendPluginResult(pluginResult);
            } else {
                Log.v(LOG_TAG, "sendPushToJs: caching push to send at a later time.");
                gCachedPushes.add(push);
            }
        }
    }

    /*
     * serializes a bundle to JSON.
     */
    private static JSONObject convertPushToJson(StandardPushObject push) {
        Log.d(LOG_TAG, "convert push to json");
        try {
            JSONObject json = new JSONObject();

            json.put("id", push.getPushId());
            json.put("body", push.getBody());
            json.put("title", push.getTitle());

            SimpleObject customFields = push.getCustomFields();
            JSONObject customs = new JSONObject(customFields.toJSONString());

            json.put("customs", customs);

            Log.v(LOG_TAG, "convertPushToJson: " + json.toString());

            return json;
        } catch(JSONException e) {
            Log.e(LOG_TAG, "extrasToJSON: JSON exception");
        }
        return null;
    }

    private void clearAllNotifications() {
        final NotificationManager notificationManager = (NotificationManager) cordova.getActivity().getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancelAll();
    }

    public static void setApplicationIconBadgeNumber(Context context, int badgeCount) {
        if (badgeCount > 0) {
            ShortcutBadger.applyCount(context, badgeCount);
        } else {
            ShortcutBadger.removeCount(context);
        }
    }

    @Override
    public void onPause(boolean multitasking) {
        super.onPause(multitasking);
        gForeground = false;

        //SharedPreferences prefs = getApplicationContext().getSharedPreferences(COM_ADOBE_PHONEGAP_PUSH, Context.MODE_PRIVATE);
        //if (prefs.getBoolean(CLEAR_NOTIFICATIONS, true)) {
        //    clearAllNotifications();
        //}
    }

    @Override
    public void onResume(boolean multitasking) {
        super.onResume(multitasking);
        gForeground = true;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        gForeground = false;
        gWebView = null;
    }

    public static boolean isActive() {
        return gWebView != null;
    }

}
