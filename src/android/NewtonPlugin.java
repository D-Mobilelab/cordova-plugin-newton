package com.eatsjobs.cordova.newton;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.apache.cordova.LOG;

import android.app.Activity;
import android.content.Context;

import com.buongiorno.newton.Newton;

public class NewtonPlugin extends CordovaPlugin {

    private Newton newtonInstance;
    private String TAG = "[NEWTON]";

    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();
        this.newtonInstance = Newton.getSharedInstanceWithConfig(this.cordova.getActivity(), "test_pasquale");
    }

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext cbCtx){
    	if(action.equals("start")){
            LOG.d(TAG, "Start called");
            cbCtx.success("Start called");
    	}
		return false;
    }
}