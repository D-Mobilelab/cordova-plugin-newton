package com.buongiorno.newton.cordova;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.buongiorno.newton.Newton;
import com.buongiorno.newton.SimpleObject;
import com.buongiorno.newton.exceptions.NewtonException;
import com.buongiorno.newton.exceptions.NewtonNotInitializedException;
import com.buongiorno.newton.interfaces.IPushCallback;
import com.buongiorno.newton.push.PushObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;


/**
 * Created by mirco.cipriani on 20/10/16.
 */
public class NewtonPlugin extends CordovaPlugin {
    private Newton newtonEngine = null;
    public static final String LOG_TAG = "NewtonPlugin";

    private static final String META_SECRET = "NEWTON_SECRET";

    private static CallbackContext pushContext;
    private static CordovaWebView gWebView;
    private static boolean gForeground = false;
    private static List<PushObject> gCachedPushes = Collections.synchronizedList(new ArrayList<PushObject>());

    private static final String INITIALIZE = "initialize";
    //public static final String INITIALIZE = "initialize";
    //public static final String INITIALIZE = "initialize";

    /**
     * Gets the application context from cordova's main activity.
     * @return the application context
     */
    private Context getApplicationContext() {
        return this.getActivity().getApplicationContext();
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

        if (INITIALIZE.equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    pushContext = callbackContext;

                    JSONObject jo = null;

                    Log.v(LOG_TAG, "execute: data=" + data.toString());

                    SimpleObject customData = new SimpleObject();
                    customData.setBool("hybrid", true);

                    String newtonSecret = "";
                    boolean newtonKeyFound = false;

                    // load newton conf from manifest meta data
                    try {
                        ApplicationInfo ai = getApplicationContext().getPackageManager().
                                getApplicationInfo(
                                        getApplicationContext().getPackageName(),
                                        PackageManager.GET_META_DATA);
                        Bundle bundle = ai.metaData;
                        newtonSecret = bundle.getString(META_SECRET);
                        newtonKeyFound = true;
                    } catch (PackageManager.NameNotFoundException e) {
                        Log.e(LOG_TAG, "Failed to load meta-data, NameNotFound: " + e.getMessage(), e);
                        callbackContext.error(e.getMessage());
                        return;
                    } catch (NullPointerException e) {
                        Log.e(LOG_TAG, "Failed to load meta-data, NullPointer: " + e.getMessage(), e);
                        callbackContext.error(e.getMessage());
                        return;
                    }

                    if (!newtonKeyFound) {
                        callbackContext.error("Failed to load meta-data, newtonKeyFound false!");
                        return;
                    }

                    try {
                        newtonEngine = Newton.getSharedInstanceWithConfig(getApplicationContext(), newtonSecret, customData);

                        newtonEngine.getPushManager().setPushNotificationCallback(new IPushCallback() {
                            @Override
                            public void onSuccess(PushObject push) {
                                //your code in order to manage push notification
                                //TODO
                                Log.i(LOG_TAG, "Got push notification: " + push.toString());
                            }
                        });

                        getActivity().getApplication().registerActivityLifecycleCallbacks(new Application.ActivityLifecycleCallbacks() {
                            @Override
                            public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
                            }

                            @Override
                            public void onActivityStarted(Activity activity) {
                            }

                            @Override
                            public void onActivityResumed(Activity activity) {
                                try {
                                    Newton.getSharedInstance().setToForeground();
                                } catch (NewtonNotInitializedException e) {
                                    Log.e(LOG_TAG, "NewtonNotInitializedException: " + e.getMessage(), e);
                                }
                            }

                            @Override
                            public void onActivityPaused(Activity activity) {
                            }

                            @Override
                            public void onActivityStopped(Activity activity) {
                            }

                            @Override
                            public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
                            }

                            @Override
                            public void onActivityDestroyed(Activity activity) {
                            }
                        });

                        if (!gCachedPushes.isEmpty()) {
                            Log.v(LOG_TAG, "sending cached extras");
                            synchronized(gCachedPushes) {
                                Iterator<PushObject> gCachedPushesIterator = gCachedPushes.iterator();
                                while (gCachedPushesIterator.hasNext()) {
                                    sendPushToJs(gCachedPushesIterator.next());
                                }
                            }
                            gCachedPushes.clear();
                        }

                    } catch (NewtonException e) {
                        Log.e(LOG_TAG, "Newton initialization error:" + e.getMessage(), e);

                        // FIXME return error to js
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

    public static void sendEventToJs(JSONObject _json) {
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, _json);
        pluginResult.setKeepCallback(true);
        if (pushContext != null) {
            pushContext.sendPluginResult(pluginResult);
        }
    }

    public static void sendErrorToJs(String message) {
        PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR, message);
        pluginResult.setKeepCallback(true);
        if (pushContext != null) {
            pushContext.sendPluginResult(pluginResult);
        }
    }

    /*
     * Sends the pushbundle extras to the client application.
     * If the client application isn't currently active, it is cached for later processing.
     */
    public static void sendPushToJs(PushObject push) {
        if (push != null) {
            if (gWebView != null) {
                sendEventToJs(convertPushToJson(push));
            } else {
                Log.v(LOG_TAG, "sendPushToJs: caching push to send at a later time.");
                gCachedPushes.add(push);
            }
        }
    }

    /*
     * serializes a bundle to JSON.
     */
    private static JSONObject convertPushToJson(PushObject push) {
        Log.d(LOG_TAG, "convert push to json");
        try {
            JSONObject json = new JSONObject();
            JSONObject customs = new JSONObject();

            json.put("isRemote", push.isRemote());
            json.put("isRich", push.isRich());
            json.put("isSilent", push.isSilent());
            json.put("isShown", push.isShown());
            json.put("id", push.getPushId());
            json.put("body", push.getBody());
            json.put("title", push.getTitle());


            HashMap<String, Object> customFields = push.getCustomFields();

            Iterator<String> it = customFields.keySet().iterator();

            while (it.hasNext()) {
                String key = it.next();
                Object value = customFields.get(key);

                customs.put(key, value);

                Log.d(LOG_TAG, "key = " + key);
                Log.d(LOG_TAG, "value = " + value.toString());
            }

            json.put("customs", customs);

            Log.v(LOG_TAG, "convertPushToJson: " + json.toString());

            return json;
        }
        catch( JSONException e) {
            Log.e(LOG_TAG, "extrasToJSON: JSON exception");
        }
        return null;
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

    //private void clearAllNotifications() {
    //    final NotificationManager notificationManager = (NotificationManager) cordova.getActivity().getSystemService(Context.NOTIFICATION_SERVICE);
    //    notificationManager.cancelAll();
    //}

}
