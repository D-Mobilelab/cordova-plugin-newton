package com.buongiorno.newton.cordova;

import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

import io.cordova.hellocordova.newton.BuildConfig;
import com.buongiorno.newton.Newton;
import com.buongiorno.newton.exceptions.NewtonException;
import com.buongiorno.newton.interfaces.IPushCallback;
import com.buongiorno.newton.push.PushObject;
import com.buongiorno.newton.push.StandardPushObject;

public class NewtonApplication extends Application {
    private static final String META_SECRET = "newton_secret";
    private static final String META_SECRET_DEV = "newton_secret_dev";

    public static final String LOG_TAG = "NewtonApplication";

    private Newton newtonEngine = null;

    protected String getNewtonSecret() throws Exception {

        try {
            ApplicationInfo ai = getApplicationContext().getPackageManager().
                    getApplicationInfo(
                            getApplicationContext().getPackageName(),
                            PackageManager.GET_META_DATA);
            Bundle bundle = ai.metaData;
            if (BuildConfig.DEBUG) {
                return bundle.getString(META_SECRET_DEV);
            }
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
        registerPushCallback();
    }

    private void registerPushCallback() {
        String newtonSecret;

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

                    if (!push.getType().equals(PushObject.PushType.NORMAL)) {
                        Log.i(LOG_TAG, "Got push notification not NORMAL, not processing it.");
                        return;
                    }

                    StandardPushObject standardPush = (StandardPushObject) push;

                    Log.i(LOG_TAG, "Got push notification: " + standardPush.toString());

                    boolean isPushPluginActive = NewtonPlugin.isActive();

                    NewtonPlugin.sendPushToJs(standardPush);

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
            Log.i(LOG_TAG, "Newton initialization from Application Module OK");
        } catch (NewtonException e) {
            Log.e(LOG_TAG, "NewtonException - Newton initialization error:" + e.getMessage(), e);
        }
    }
}
