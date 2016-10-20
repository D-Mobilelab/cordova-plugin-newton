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
import org.json.JSONArray;
import com.buongiorno.newton.Newton;
import com.buongiorno.newton.SimpleObject;
import com.buongiorno.newton.exceptions.NewtonException;
import com.buongiorno.newton.exceptions.NewtonNotInitializedException;
import com.buongiorno.newton.interfaces.IPushCallback;
import com.buongiorno.newton.push.PushObject;


/**
 * Created by mirco.cipriani on 20/10/16.
 */
public class NewtonPlugin extends CordovaPlugin {
    private Newton newtonEngine = null;
    public static final String LOG_TAG = "NewtonPlugin";

    private static final String META_SECRET = "NEWTON_SECRET";
    private static final String META_SENDER_ID = "NEWTON_SENDER_ID";

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

        SimpleObject customData = new SimpleObject();
        customData.setBool("hybrid", true);

        String newtonSecret = "";
        String newtonSenderId = "";
        boolean newtonKeyFound = false;

        // load newton conf from manifest meta data
        try {
            ApplicationInfo ai = this.getApplicationContext().getPackageManager().
                    getApplicationInfo(
                            this.getApplicationContext().getPackageName(),
                            PackageManager.GET_META_DATA);
            Bundle bundle = ai.metaData;
            newtonSecret = bundle.getString(META_SECRET);
            newtonSenderId = bundle.getString(META_SENDER_ID);
            newtonKeyFound = true;
        } catch (PackageManager.NameNotFoundException e) {
            Log.e(LOG_TAG, "Failed to load meta-data, NameNotFound: " + e.getMessage(), e);
        } catch (NullPointerException e) {
            Log.e(LOG_TAG, "Failed to load meta-data, NullPointer: " + e.getMessage(), e);
        }

        if (newtonKeyFound) {
            try {
                newtonEngine = Newton.getSharedInstanceWithConfig(this.getApplicationContext(), newtonSecret, customData);

                newtonEngine.getPushManager().setPushNotificationCallback(new IPushCallback() {
                    @Override
                    public void onSuccess(PushObject push) {
                        //your code in order to manage push notification
                        //TODO
                    }
                });

                this.getActivity().getApplication().registerActivityLifecycleCallbacks(new Application.ActivityLifecycleCallbacks() {
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

            } catch (NewtonException e) {
                Log.e(LOG_TAG, "Newton initialization error:"+e.getMessage(), e);
            }
        }
    }

    @Override
    public boolean execute(final String action, final JSONArray data, final CallbackContext callbackContext) {
        return true;
    }

}
