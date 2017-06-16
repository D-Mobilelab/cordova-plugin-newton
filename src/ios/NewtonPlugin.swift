//
//  NewtonPlugin.swift
//  Newton Cordova Demo
//
//  Created by Mirco Cipriani on 25/05/2017.
//
//

import Foundation
import Newton

let TAG = "NewtonPlugin"

func DDIlog(_ message: String) {
    NSLog("%@ - %@", TAG, message)
}


@objc(NewtonPlugin) class NewtonPlugin : CDVPlugin {
    
    var callbackId:String?
    
    enum PluginError: Error {
        case invalidParameter(parameterName: String)
        
        var description: String {
            switch self {
            case .invalidParameter(let parameterName): return "invalid parameter: "+parameterName
            }
        }
    }
    
    override init() {
        DDIlog("NewtonPlugin init")
        super.init()
    }
    
    func getNewtonSecret() -> String {
        if let url = Bundle.main.url(forResource:"Config", withExtension: "plist") {
            do {
                let data = try Data(contentsOf:url)
                let configDict = try PropertyListSerialization.propertyList(from: data, options: [], format: nil) as! [String:Any]
                
                // FIXME: check what happen if key is not available in pList
                return (configDict["NEWTON_SECRET"] as? String)!
                
            } catch {
                DDIlog("Error while getting Newton secret from pList NEWTON_SECRET")
            }
        }
        
        return ""
    }
    
    override func pluginInitialize () {
        
        let nc = NotificationCenter.default
        nc.addObserver(forName:Notification.Name.CDVLocal,
                       object:nil, queue:nil,
                       using:didReceiveLocalNotification)
        
    }
    
    func initialize(_ command: CDVInvokedUrlCommand) {
        DDIlog("Plugin initialization")
        
        let newtonSecret:String = self.getNewtonSecret();
        
        // create a dictionary for Newton Custom Data
        var customDataDict: Dictionary<String, Any> = Dictionary()
        
        // if sent a valid custom data from JS use that
        if command.argument(at: 0) != nil {
            if let customDataArg = command.argument(at: 0) as? NSDictionary {
                if let customDataDictArg = customDataArg as? Dictionary<String, Any> {
                    customDataDict = customDataDictArg
                }
            }
        }
        
        var initOk: Bool = true
        var initResult = [String:Any]()
        var initError:String = "no error"
        
        let customData = NWSimpleObject(fromDictionary: customDataDict)
        do {
            try customData?.setBool(key: "hybrid", value: true)
        }
        catch {
            DDIlog("Error setting initial SimpleObject with CustomData")
        }
        
        do {
            let newtonInstance = try Newton.getSharedInstanceWithConfig(conf: newtonSecret, customData: customData)
            try newtonInstance.getPushManager().registerDevice();
            
            // save JS callback to call it when a push arrive
            callbackId = command.callbackId
            
            try newtonInstance.getPushManager().setPushCallback(callback: { push in
                DDIlog("A Push Notification has been handled. \(push.description)")
                self.sendPushToJs(push)
            })
            
            initResult["initialized"] = true
        }
        catch let err as PluginError {
            initOk = false
            initError = err.description
        }
        catch {
            initOk = false
            initError = error as! String
        }
        
        
        let result: CDVPluginResult
        
        if initOk {
            result = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: initResult)
        } else {
            result = CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: initError)
        }
        
        // save the callback for using it when a push arrive
        result.setKeepCallbackAs(true)
        
        commandDelegate!.send(result, callbackId: command.callbackId)
    }
    
    func xxxxxx(_ command: CDVInvokedUrlCommand) {
        
        var errorDesc:String = "Unknown error"
        
        do {
            let logged = try Newton.getSharedInstance().isUserLogged()
            
            var result = [String:Any]()
            result["isUserLogged"] = logged
            
            commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK, messageAs: result),
                callbackId: command.callbackId
            )
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = error as! String
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    func xxxxxxx(_ command: CDVInvokedUrlCommand) {
        
        var errorDesc:String = "Unknown error"
        
        do {
            let logged = try Newton.getSharedInstance().isUserLogged()
            
            var result = [String:Any]()
            result["isUserLogged"] = logged
            
            commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK, messageAs: result),
                callbackId: command.callbackId
            )
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = error as! String
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    func sendEvent(_ command: CDVInvokedUrlCommand) {
        
        var errorDesc:String = "Unknown error"
        
        do {
            var name:String = ""
            var customData = NWSimpleObject(fromJSONString: "{}")
            
            if command.argument(at: 0) != nil {
                if let nameArg = command.argument(at: 0) as? String {
                    name = nameArg
                }
            }
            if command.argument(at: 1) != nil {
                if let customDataArg = command.argument(at: 1) as? String {
                    customData = NWSimpleObject(fromJSONString: customDataArg)
                }
            }
            if name == "" {
                throw PluginError.invalidParameter(parameterName: "name")
            }
            
            try Newton.getSharedInstance().sendEvent(name: name, customData: customData)
            
            commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK),
                callbackId: command.callbackId
            )
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = error as! String
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    func startLoginFlowWithParams(_ command: CDVInvokedUrlCommand) {
        
        // FIXME: TO COMPLETE! see Android implementation
        
        var errorDesc:String = "Unknown error"
        
        do {
            
            /**
             * 1#
             *
             * initialize the loginBuilder and set completion callbacks
             * to call javascript when done
             *
             */
            let loginBuilder = try Newton.getSharedInstance().getLoginBuilder()
            loginBuilder.setOnFlowCompleteCallback(callback: { (err:NWError?) in
                
                let result:CDVPluginResult = CDVPluginResult(status: CDVCommandStatus_NO_RESULT)
                // save the callback for using it later
                result.setKeepCallbackAs(true)
                
                
            })
            /**
             * 2#
             *
             * iterate over parameters to initialize the login builder
             *
             */
            
            /**
             * 3#
             *
             * then start the login flow
             *
             */
            
            let result:CDVPluginResult = CDVPluginResult(status: CDVCommandStatus_NO_RESULT)
            // save the callback for using it later
            result.setKeepCallbackAs(true)
            
            commandDelegate!.send(result, callbackId: command.callbackId )
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = error as! String
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    func isUserLogged(_ command: CDVInvokedUrlCommand) {
        
        var errorDesc:String = "Unknown error"
        
        do {
            let logged = try Newton.getSharedInstance().isUserLogged()
            
            var result = [String:Any]()
            result["isUserLogged"] = logged
            
            commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK, messageAs: result),
                callbackId: command.callbackId
            )
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = error as! String
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    func getEnvironmentString(_ command: CDVInvokedUrlCommand) {
        
        var errorDesc:String = "Unknown error"
        
        do {
            let environmentString = try Newton.getSharedInstance().environmentString
            
            var result = [String:Any]()
            result["environmentString"] = environmentString
            
            commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK, messageAs: result),
                callbackId: command.callbackId
            )
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = error as! String
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    func userLogout(_ command: CDVInvokedUrlCommand) {
        
        var errorDesc:String = "Unknown error"
        
        do {
            try Newton.getSharedInstance().userLogout()
            
            commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK),
                callbackId: command.callbackId
            )
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = error as! String
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    func getUserMetaInfo(_ command: CDVInvokedUrlCommand) {
        
        // FIXME: Check implementation
        
        var errorDesc:String = "Unknown error"
        
        do {
            try Newton.getSharedInstance().getUserMetaInfo(callback: { (userMetaInfoErr : NWError?, userMetaInfo : [String : Any]?) in
                
                if ((userMetaInfoErr) != nil) {
                    
                    self.commandDelegate!.send(
                        CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: userMetaInfoErr.debugDescription),
                        callbackId: command.callbackId
                    )
                } else {
                    
                    self.commandDelegate!.send(
                        CDVPluginResult(status: CDVCommandStatus_OK, messageAs: userMetaInfo),
                        callbackId: command.callbackId
                    )
                }
            })
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = error as! String
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    func getUserToken(_ command: CDVInvokedUrlCommand) {
        
        var errorDesc:String = "Unknown error"
        
        do {
            let logged = try Newton.getSharedInstance().getUserToken()
            
            var result = [String:Any]()
            result["userToken"] = logged
            
            commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK, messageAs: result),
                callbackId: command.callbackId
            )
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = error as! String
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    
    func getOAuthProviders(_ command: CDVInvokedUrlCommand) {
        
        var errorDesc:String = "Unknown error"
        
        do {
            let providers:[String] = try Newton.getSharedInstance().getOAuthProviders()
            
            var result = [String:Any]()
            result["oAuthProviders"] = providers
            
            commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK, messageAs: result),
                callbackId: command.callbackId
            )
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = error as! String
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    
    func rankContent(_ command: CDVInvokedUrlCommand) {
        
        // FIXME: check if parameter recognition is working, expecially the enum from string of scope arg
        
        var errorDesc:String = "Unknown error"
        
        do {
            var contentId:String = ""
            
            /// - consumption: consumption
            /// - social:      social
            /// - editorial:   editorial
            /// - unknown:     used internally
            var scope = RankingScope(scope: .unknown)
            
            var multipler:Float = 1.0
            
            if command.argument(at: 0) != nil {
                if let contentIdArg = command.argument(at: 0) as? String {
                    contentId = contentIdArg
                }
            }
            if command.argument(at: 1) != nil {
                if let scopeArg = command.argument(at: 1) as? String {
                    if let scopeEnumArg = RankingScope._RankingScope(rawValue: scopeArg.lowercased()) {
                        scope = RankingScope(scope: scopeEnumArg)
                    }
                }
            }
            if command.argument(at: 2) != nil {
                if let multiplerArgString = command.argument(at: 2) as? String {
                    if let multiplerArg = Float(multiplerArgString) {
                        multipler = multiplerArg
                    }
                }
            }
            
            if contentId == "" {
                throw PluginError.invalidParameter(parameterName: "contentId")
            }
            
            try Newton.getSharedInstance().rankContent(contentId: contentId, scope: scope, multiplier: multipler)
            
            commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK),
                callbackId: command.callbackId
            )
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = error as! String
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    
    func timedEventStart(_ command: CDVInvokedUrlCommand) {
        
        var errorDesc:String = "Unknown error"
        
        do {
            var name:String = ""
            var customData = NWSimpleObject(fromJSONString: "{}")
            
            if command.argument(at: 0) != nil {
                if let nameArg = command.argument(at: 0) as? String {
                    name = nameArg
                }
            }
            if command.argument(at: 1) != nil {
                if let customDataArg = command.argument(at: 1) as? String {
                    customData = NWSimpleObject(fromJSONString: customDataArg)
                }
            }
            if name == "" {
                throw PluginError.invalidParameter(parameterName: "name")
            }
            
            try Newton.getSharedInstance().timedEventStart(name: name, customData: customData)
            
            commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK),
                callbackId: command.callbackId
            )
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = error as! String
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    func timedEventStop(_ command: CDVInvokedUrlCommand) {
        
        var errorDesc:String = "Unknown error"
        
        do {
            var name:String = ""
            var customData = NWSimpleObject(fromJSONString: "{}")
            
            if command.argument(at: 0) != nil {
                if let nameArg = command.argument(at: 0) as? String {
                    name = nameArg
                }
            }
            if command.argument(at: 1) != nil {
                if let customDataArg = command.argument(at: 1) as? String {
                    customData = NWSimpleObject(fromJSONString: customDataArg)
                }
            }
            if name == "" {
                throw PluginError.invalidParameter(parameterName: "name")
            }
            
            try Newton.getSharedInstance().timedEventStop(name: name, customData: customData)
            
            commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK),
                callbackId: command.callbackId
            )
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = error as! String
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    func flowBegin(_ command: CDVInvokedUrlCommand) {
        
        var errorDesc:String = "Unknown error"
        
        do {
            var name:String = ""
            var customData = NWSimpleObject(fromJSONString: "{}")
            
            if command.argument(at: 0) != nil {
                if let nameArg = command.argument(at: 0) as? String {
                    name = nameArg
                }
            }
            if command.argument(at: 1) != nil {
                if let customDataArg = command.argument(at: 1) as? String {
                    customData = NWSimpleObject(fromJSONString: customDataArg)
                }
            }
            if name == "" {
                throw PluginError.invalidParameter(parameterName: "name")
            }
            
            try Newton.getSharedInstance().flowBegin(name: name, customData: customData)
            
            commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK),
                callbackId: command.callbackId
            )
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = error as! String
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    func flowCancel(_ command: CDVInvokedUrlCommand) {
        
        var errorDesc:String = "Unknown error"
        
        do {
            var name:String = ""
            var customData = NWSimpleObject(fromJSONString: "{}")
            
            if command.argument(at: 0) != nil {
                if let nameArg = command.argument(at: 0) as? String {
                    name = nameArg
                }
            }
            if command.argument(at: 1) != nil {
                if let customDataArg = command.argument(at: 1) as? String {
                    customData = NWSimpleObject(fromJSONString: customDataArg)
                }
            }
            if name == "" {
                throw PluginError.invalidParameter(parameterName: "name")
            }
            
            try Newton.getSharedInstance().flowCancel(reason: name, customData: customData)
            
            commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK),
                callbackId: command.callbackId
            )
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = error as! String
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    func flowFail(_ command: CDVInvokedUrlCommand) {
        
        var errorDesc:String = "Unknown error"
        
        do {
            var name:String = ""
            var customData = NWSimpleObject(fromJSONString: "{}")
            
            if command.argument(at: 0) != nil {
                if let nameArg = command.argument(at: 0) as? String {
                    name = nameArg
                }
            }
            if command.argument(at: 1) != nil {
                if let customDataArg = command.argument(at: 1) as? String {
                    customData = NWSimpleObject(fromJSONString: customDataArg)
                }
            }
            if name == "" {
                throw PluginError.invalidParameter(parameterName: "name")
            }
            
            try Newton.getSharedInstance().flowFail(reason: name, customData: customData)
            
            commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK),
                callbackId: command.callbackId
            )
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = error as! String
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    func flowStep(_ command: CDVInvokedUrlCommand) {
        
        var errorDesc:String = "Unknown error"
        
        do {
            var name:String = ""
            var customData = NWSimpleObject(fromJSONString: "{}")
            
            if command.argument(at: 0) != nil {
                if let nameArg = command.argument(at: 0) as? String {
                    name = nameArg
                }
            }
            if command.argument(at: 1) != nil {
                if let customDataArg = command.argument(at: 1) as? String {
                    customData = NWSimpleObject(fromJSONString: customDataArg)
                }
            }
            if name == "" {
                throw PluginError.invalidParameter(parameterName: "name")
            }
            
            try Newton.getSharedInstance().flowStep(name: name, customData: customData)
            
            commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK),
                callbackId: command.callbackId
            )
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = error as! String
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    func flowSucceed(_ command: CDVInvokedUrlCommand) {
        
        var errorDesc:String = "Unknown error"
        
        do {
            var name:String = ""
            var customData = NWSimpleObject(fromJSONString: "{}")
            
            if command.argument(at: 0) != nil {
                if let nameArg = command.argument(at: 0) as? String {
                    name = nameArg
                }
            }
            if command.argument(at: 1) != nil {
                if let customDataArg = command.argument(at: 1) as? String {
                    customData = NWSimpleObject(fromJSONString: customDataArg)
                }
            }
            if name == "" {
                throw PluginError.invalidParameter(parameterName: "name")
            }
            
            try Newton.getSharedInstance().flowSucceed(reason: name, customData: customData)
            
            commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK),
                callbackId: command.callbackId
            )
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = error as! String
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    
    func didReceiveLocalNotification (notification: Notification) {
        DDIlog("didReceiveLocalNotification")
        if UIApplication.shared.applicationState != .active {
            // FIXME!!
            var data = "undefined"
            if let uiNotification = notification.object as? UILocalNotification {
                if let notificationData = uiNotification.userInfo?["geofence.notification.data"] as? String {
                    data = notificationData
                }
                let js = "setTimeout('geofence.onNotificationClicked(" + data + ")',0)"
                
                //evaluateJs(js)
            }
        }
    }
    
    func convertCustomFieldToJson(_ customFieldSO: NWSimpleObject?) -> [String:Any] {
        
        var customFieldJsonDict = [String:Any]()
        
        if let customFieldSOok = customFieldSO {
            customFieldJsonDict = customFieldSOok.getDictionary()
        }
        
        return customFieldJsonDict
    }
    
    func sendPushToJs(_ push:AnyObject) {
        //
        if (self.callbackId != nil) {
            
            var pushData = [String:Any]()
            pushData["isRemote"] = false
            pushData["isRich"] = false
            pushData["isSilent"] = false
            pushData["isShown"] = false
            pushData["id"] = false
            pushData["body"] = false
            pushData["title"] = false
            pushData["url"] = false
            pushData["customs"] = []
            
            if let realPush = push as? NWStandardPush {
                pushData["body"] = realPush.body
                pushData["isShown"] = realPush.shown
                pushData["isRemote"] = !realPush.isLocal
                pushData["customs"] = self.convertCustomFieldToJson(realPush.customFields)
                
            } else if let realPush = push as? NWBackgroundPush {
                pushData["isRemote"] = !realPush.isLocal
                pushData["customs"] = self.convertCustomFieldToJson(realPush.customFields)
                
            } else if let realPush = push as? NWUrlPush {
                pushData["body"] = realPush.body;
                pushData["isShown"] = realPush.shown
                pushData["isRemote"] = !realPush.isLocal
                pushData["customs"] = self.convertCustomFieldToJson(realPush.customFields)
                pushData["url"] = realPush.url
                
            }
            
            
            let result: CDVPluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: pushData)
            result.setKeepCallbackAs(true)
            commandDelegate!.send(result, callbackId: self.callbackId)
        }
    }
    
}
