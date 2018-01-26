package com.buongiorno.newton.cordova;

import android.app.Activity;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;

import com.android.vending.billing.IInAppBillingService;
import com.buongiorno.newton.Newton;
import com.buongiorno.newton.PaymentManager;
import com.buongiorno.newton.SimpleObject;
import com.buongiorno.newton.exceptions.NewtonException;
import com.buongiorno.newton.exceptions.NewtonNotInitializedException;
import com.buongiorno.newton.exceptions.PushRegistrationException;
import com.buongiorno.newton.push.StandardPushObject;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import me.leolin.shortcutbadger.ShortcutBadger;


public class NewtonPlugin extends CordovaPlugin {
    private Newton newtonEngine = null;
    public static final String LOG_TAG = "NewtonPlugin";
    private static final String META_SECRET = "newton_secret";

    public static final int REQUEST_CODE = 1001;
    public static final int REQUEST_CODE_SERIALIZE = 1002;

    public enum PaymentResponseCodes {
        BILLING_RESPONSE_RESULT_OK,
        BILLING_RESPONSE_RESULT_USER_CANCELED,
        BILLING_RESPONSE_RESULT_SERVICE_UNAVAILABLE,
        BILLING_RESPONSE_RESULT_BILLING_UNAVAILABLE,
        BILLING_RESPONSE_RESULT_ITEM_UNAVAILABLE,
        BILLING_RESPONSE_RESULT_DEVELOPER_ERROR,
        BILLING_RESPONSE_RESULT_ERROR,
        BILLING_RESPONSE_RESULT_ITEM_ALREADY_OWNED,
        BILLING_RESPONSE_RESULT_ITEM_NOT_OWNED
    }

    private IInAppBillingService mService;
    private ServiceConnection mServiceConn;
    private static CallbackContext pushContext;
    private static CallbackContext paymentCallbackContenxt;
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
        initializeServiceConnection(getApplicationContext());
    }

    @Override
    public boolean execute(final String action, final JSONArray data, final CallbackContext callbackContext) {
        Log.v(LOG_TAG, "execute: action=" + action);
        Log.v(LOG_TAG, "execute: data=" + data.toString());
        gWebView = this.webView;
        
        if("registerDevice".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    registerDevice(data, callbackContext);
                }
            });
        } else if("attachMasterSession".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    attachMasterSession(data, callbackContext);
                }
            });
        } else if("setPushCallback".equals(action)) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        registerPushCallback(callbackContext);
                    }
                });
        } else if("buy".equals(action)) {
            Log.v(LOG_TAG, "buy");
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    runPayment(data, callbackContext);
                }
            });
        } else if ("unregister".equals(action)) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    pushContext = null;
                    callbackContext.success();
                }
            });
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
        } else {
            Log.e(LOG_TAG, "Invalid action : " + action);
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
            return false;
        }

        return true;
    }

    private void attachMasterSession(JSONArray data, CallbackContext callbackContext) {
        try {
            Log.v(LOG_TAG, "sessionId: data=" + data.toString());
            String sessionId = data.getString(0);
            String newtonToken = data.getString(1);
            SimpleObject extraData;
            JSONObject jo = data.optJSONObject(2);

            newtonEngine = Newton.getSharedInstance();
            if(jo != null) {
                extraData = SimpleObject.fromJSONObject(jo);
                newtonEngine.attachMasterSession(sessionId, newtonToken, extraData);
            } else {
                newtonEngine.attachMasterSession(sessionId, newtonToken);
            }
            callbackContext.success();
        } catch(Exception e) {
            callbackContext.error("" + e.getMessage());
        }
    }

    private void registerPushCallback(CallbackContext callbackContext) {
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

    private void runPayment(JSONArray data, CallbackContext callbackContext) {
        try {
            /**
             * Save context for activity result response
             * **/
            paymentCallbackContenxt = callbackContext;

            PluginResult r = new PluginResult(PluginResult.Status.NO_RESULT);
            r.setKeepCallback(true);
            callbackContext.sendPluginResult(r);

            String offerId = data.getString(0);
            String nativeItemId = data.getString(1);
            Log.v(LOG_TAG, "offerId:" + offerId + " nativeItemId:" + nativeItemId);

            Bundle buyIntentBundle = mService.getBuyIntent(3, getApplicationContext().getPackageName(),
                    nativeItemId, "subs", offerId);

            PendingIntent pendingIntent = buyIntentBundle.getParcelable("BUY_INTENT");
            this.cordova.setActivityResultCallback(this);

            getActivity().startIntentSenderForResult(pendingIntent.getIntentSender(),
                    REQUEST_CODE, new Intent(), Integer.valueOf(0), Integer.valueOf(0),
                    Integer.valueOf(0));
        } catch(Exception e) {
            Log.v(LOG_TAG, e.getMessage());
            callbackContext.error(e.getMessage());
        }
    }

    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        Log.v(LOG_TAG, "onActivityResult");

        if(requestCode == REQUEST_CODE) {
            String purchaseData;
            String dataSignature;
            int RESPONSE_CODE;
            JSONObject activityResponseJSON = new JSONObject();

            RESPONSE_CODE = intent.getIntExtra("RESPONSE_CODE", PaymentResponseCodes.BILLING_RESPONSE_RESULT_ERROR.ordinal());
            purchaseData = intent.getStringExtra("INAPP_PURCHASE_DATA");
            dataSignature = intent.getStringExtra("INAPP_DATA_SIGNATURE");

            PaymentResponseCodes code = PaymentResponseCodes.values()[RESPONSE_CODE];
            
            switch (code) {
                case BILLING_RESPONSE_RESULT_OK:
                    activityResponseJSON = makeSuccessResponse(purchaseData, dataSignature, code.toString(), RESPONSE_CODE);
                    paymentCallbackContenxt.success(activityResponseJSON);
                case BILLING_RESPONSE_RESULT_ITEM_ALREADY_OWNED:
                case BILLING_RESPONSE_RESULT_USER_CANCELED:
                case BILLING_RESPONSE_RESULT_ERROR:
                case BILLING_RESPONSE_RESULT_SERVICE_UNAVAILABLE:
                case BILLING_RESPONSE_RESULT_ITEM_NOT_OWNED:
                case BILLING_RESPONSE_RESULT_BILLING_UNAVAILABLE:
                case BILLING_RESPONSE_RESULT_ITEM_UNAVAILABLE:
                case BILLING_RESPONSE_RESULT_DEVELOPER_ERROR:
                default:
                    try {
                        activityResponseJSON.put("purchaseData", JSONObject.NULL);
                        activityResponseJSON.put("dataSignature", JSONObject.NULL);
                        activityResponseJSON.put("responseCode", RESPONSE_CODE);
                        activityResponseJSON.put("responseMessage", code.toString());
                        paymentCallbackContenxt.error(activityResponseJSON);
                    } catch(Exception e) {
                        paymentCallbackContenxt.error(activityResponseJSON);
                        e.printStackTrace();
                    }
                    break;
            }
        }
        super.onActivityResult(requestCode, resultCode, intent);
    }

    private JSONObject makeSuccessResponse(String purchaseData, String dataSignature, String responseMessage, int responseCode) {

        JSONObject response = new JSONObject();

        try {
            JSONObject purchaseDataJSON = new JSONObject(purchaseData);
            response.put("purchaseData", purchaseDataJSON);
            response.put("dataSignature", dataSignature);
            response.put("responseCode", responseCode);
            response.put("responseMessage", responseMessage);

            PaymentManager paymentManager = Newton.getSharedInstance().getPaymentManager();
            String serializedPayment = paymentManager.serializePayment(purchaseDataJSON.getString("developerPayload"), purchaseDataJSON.toString());
            response.put("serializedPayment", serializedPayment);
        } catch(JSONException e) {
            e.printStackTrace();
        } catch (NewtonNotInitializedException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return response;
    }

    private void registerDevice(JSONArray data, CallbackContext callbackContext) {
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

    /*
     * Sends the pushbundle extras to the client application.
     * If the client application isn't currently active, it is cached for later processing.
     */
    public static void sendPushToJs(StandardPushObject push) {
        if (push != null) {
            if (gWebView != null && pushContext != null) {
                Log.v(LOG_TAG, "sendPushToJs: send push now!");
                PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, pushToJson(push));
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
    private static JSONObject pushToJson(StandardPushObject push) {
        Log.d(LOG_TAG, "convert push to json");
        try {
            JSONObject json = new JSONObject();

            json.put("id", push.getPushId());
            json.put("body", push.getBody());
            json.put("title", push.getTitle());

            SimpleObject customFields;
            if(push.hasCustomFields()) {
                JSONObject customs = new JSONObject(push.getCustomFields().toJSONString());
                json.put("customs", customs);
            } else {
                json.put("customs", JSONObject.NULL);
            }
            
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

    private void initializeServiceConnection(Context ctx) {
        if(mServiceConn == null) {
            mServiceConn = new ServiceConnection() {
                @Override
                public void onServiceDisconnected(ComponentName name) {
                    mService = null;
                }

                @Override
                public void onServiceConnected(ComponentName name,
                                               IBinder service) {
                    mService = IInAppBillingService.Stub.asInterface(service);
                }
            };

            Intent serviceIntent = new Intent("com.android.vending.billing.InAppBillingService.BIND");
            serviceIntent.setPackage("com.android.vending");
            ctx.bindService(serviceIntent, mServiceConn, Context.BIND_AUTO_CREATE);
        }
    }

    @Override
    public void onPause(boolean multitasking) {
        super.onPause(multitasking);
        gForeground = false;
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
        if (mService != null) {
            getApplicationContext().unbindService(mServiceConn);
        }
    }

    public static boolean isActive() {
        return gWebView != null;
    }
}
