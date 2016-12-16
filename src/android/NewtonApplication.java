package com.buongiorno.newton.cordova;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

import com.buongiorno.newton.Newton;
import com.buongiorno.newton.exceptions.NewtonException;
import com.buongiorno.newton.exceptions.NewtonNotInitializedException;
import com.buongiorno.newton.exceptions.PushRegistrationException;
import com.buongiorno.newton.interfaces.IPushCallback;
import com.buongiorno.newton.push.PushObject;
import com.google.android.gms.common.GooglePlayServicesUtil;

import org.json.JSONException;

/**
 * Created by mirco.cipriani on 24/11/16.
 */

public class NewtonApplication extends Application {
    private static final String META_SECRET = "newton_secret";

    public static final String LOG_TAG = "NewtonApplication";

    private Newton newtonEngine = null;

    protected String getNewtonSecret() throws Exception {

        try {
            ApplicationInfo ai = getApplicationContext().getPackageManager().
                    getApplicationInfo(
                            getApplicationContext().getPackageName(),
                            PackageManager.GET_META_DATA);
            Bundle bundle = ai.metaData;
            return bundle.getString(META_SECRET);

        } catch (PackageManager.NameNotFoundException e) {
            Log.e(LOG_TAG, "Failed to load meta-data, NameNotFound: " + e.getMessage(), e);
            throw new Exception("Failed to load meta-data, NameNotFound: "+e.getMessage());

        } catch (NullPointerException e) {
            Log.e(LOG_TAG, "Failed to load meta-data, NullPointer: " + e.getMessage(), e);
            throw new Exception("Failed to load meta-data, NullPointer: "+e.getMessage());

        } catch (Exception e) {
            Log.e(LOG_TAG, "Failed to load meta-data, Exception: " + e.getMessage(), e);
            throw new Exception("Failed to load meta-data, Exception: "+e.getMessage());

        }
    }

    @Override
    public void onCreate() {
        super.onCreate();

        String newtonSecret = "";

        // load newton conf from manifest meta data
        try {
            newtonSecret = getNewtonSecret();

        } catch (Exception e) {
            Log.e(LOG_TAG, "Failed initialize Newton, cannot load secret from manifest metadata");
            return;
        }

        try {
            newtonEngine = Newton.getSharedInstanceWithConfig(getApplicationContext(), newtonSecret);

            newtonEngine.getPushManager().setPushNotificationCallback(new IPushCallback() {
                @Override
                public void onSuccess(PushObject push) {

                    Log.i(LOG_TAG, "Got push notification: " + push.toString());

                    boolean isPushPluginActive = NewtonPlugin.isActive();

                    NewtonPlugin.sendPushToJs(push);

                    // FIXME, verify if it works when not in foreground
                    if (!isPushPluginActive) {
                        Log.d(LOG_TAG, "forceMainActivityReload");
                        forceMainActivityReload();
                    }
                }

                /**
                 * Forces the main activity to re-launch if it's unloaded.
                 */
                private void forceMainActivityReload() {
                    Context context = getApplicationContext();
                    PackageManager pm = context.getPackageManager();
                    Intent launchIntent = pm.getLaunchIntentForPackage(context.getPackageName());
                    context.startActivity(launchIntent);
                }
            });

            this.registerActivityLifecycleCallbacks(new Application.ActivityLifecycleCallbacks() {
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

            Log.i(LOG_TAG, "Newton initialization from Application Modul OK");


        } catch (NewtonException e) {
            Log.e(LOG_TAG, "NewtonException - Newton initialization error:" + e.getMessage(), e);

        }
    }
}
