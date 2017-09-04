//
//  NewtonPlugin.swift
//  Newton Cordova Demo
//
//  Created by Mirco Cipriani on 25/05/2017.
//
//

import Foundation
import Newton
import UIKit

let TAG = "NewtonPlugin"

func DDIlog(_ message: String) {
    NSLog("[%@] - %@", TAG, message)
}


@objc(NewtonPlugin) class NewtonPlugin : CDVPlugin {
    
    var callbackId:String?
    
    // app status passed by appdelegate implemented in objc
    open var notificationMessage:[String: Any] = [:]
    open var isInline:Bool = false
    open var coldstart:Bool = false
    
    fileprivate var isAlreadyInitialized:Bool = false
    
    //public var localNotificationMessage:UILocalNotification
    
    enum PluginError: Error {
        case invalidParameter(parameterName: String)
        case internalError(reason: String)
        
        var description: String {
            switch self {
            case .invalidParameter(let parameterName): return "invalid parameter: "+parameterName
            case .internalError(let reason): return "internal error: "+reason
            
            }
        }
    }
    
    enum LoginOptions: String {
        case customData
        case externalId
        case type
        case customId
    }
    
    enum LoginFlowType: String {
        case custom
        case external
        case _unknown
    }
    
    func getNewtonSecret() throws -> String {
        var keyForSecret = "NEWTON_SECRET"
        if DEBUG_BUILD.boolValue {
            keyForSecret = "NEWTON_SECRET_DEV"
        }
        if let secret = Bundle.main.infoDictionary?[keyForSecret] as? String {
            DDIlog("using secret: \(secret) got from \(keyForSecret)")
            return secret;
        }
        
        throw PluginError.internalError(reason: "Error while getting Newton secret from pList NEWTON_SECRET")
    }
    
    override func pluginInitialize() {
        DDIlog("pluginInitialize()")
        notificationMessage = [String: Any]()
        //localNotificationMessage = UILocalNotification()
    }
    
    override open func onAppTerminate() {
        //
    }
    
    func initialize(_ command: CDVInvokedUrlCommand) {
        DDIlog("action: initialize")
        
        
        var initOk: Bool = true
        var initResult = [String:Any]()
        var initError:String = "no error"
        
        
        do {
            if (isAlreadyInitialized) {
                initResult["initialized"] = true
            } else {
                let newtonSecret:String = try self.getNewtonSecret();
                
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
            
                let customData = NWSimpleObject(fromDictionary: customDataDict)
                try customData?.setBool(key: "hybrid", value: true)
                
                
                let newtonInstance = try Newton.getSharedInstanceWithConfig(conf: newtonSecret, customData: customData)
                try newtonInstance.getPushManager().registerDevice();
                
                // save JS callback to call it when a push arrive
                callbackId = command.callbackId
                
                try newtonInstance.getPushManager().setPushCallback(callback: { push in
                    NSLog("OOOOOOOOOOOOKKKKKK - A Push Notification has been handled")
                    //DDIlog("A Push Notification has been handled. \(push.description)")
                    //self.sendPushToJs(push)
                })
                
                // if there are any notification saved process them
                if isNotificationMessageAvailable() {
                    let launchOptions = getNotificationMessage()
                    
                    try newtonInstance.getPushManager().setNotifyLaunchOptions(launchOptions:launchOptions)
                    DDIlog("LaunchOptions sent to Newton: \(launchOptions as AnyObject)")
                }
                clearNotificationMessage()
                
                isAlreadyInitialized = true
                initResult["initialized"] = true
                DDIlog("initialization done! Newton Version: \(Newton.versionString) Build: \(Newton.buildNumber) Environment: \(newtonInstance.environmentString)")

            }
        }
        catch let err as PluginError {
            initOk = false
            initError = err.description
        }
        catch {
            initOk = false
            initError = String(describing: error)
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
    
    func setApplicationIconBadgeNumber(_ command: CDVInvokedUrlCommand) {
        
        var errorDesc:String = "Unknown error"
        
        do {
            
            // create a dictionary for command options
            var optionsDict: Dictionary<String, Any> = Dictionary()
            
            // if sent a valid custom data from JS use that
            if command.argument(at: 0) != nil {
                if let optionsArg = command.argument(at: 0) as? NSDictionary {
                    if let optionsDictArg = optionsArg as? Dictionary<String, Any> {
                        optionsDict = optionsDictArg
                    }
                }
            }
            if optionsDict["badge"] != nil {
                throw PluginError.invalidParameter(parameterName: "badge")
            }
            
            guard Int(optionsDict["badge"] as! String) != nil else {
                throw PluginError.invalidParameter(parameterName: "value for badge")
            }
            
            let app = UIApplication.shared
            app.applicationIconBadgeNumber = optionsDict["badge"] as! Int
            
            commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK),
                callbackId: command.callbackId
            )
            return
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = String(describing: error)
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    func clearAllNotifications(_ command: CDVInvokedUrlCommand) {
        
        let app = UIApplication.shared
        app.applicationIconBadgeNumber = 0
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_OK),
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
            return
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = String(describing: error)
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    func startLoginFlowWithParams(_ command: CDVInvokedUrlCommand) {
        
        // FIXME: TO COMPLETE! see Android implementation
        
        var errorDesc:String = "Unknown error"
        let loginCallbackId = command.callbackId
        var loginFlowType = LoginFlowType._unknown
        
        do {
            
            var eventParams:[String: Any] = [String: Any]()
            
            let eventParamsArg = command.argument(at: 0)
            
            guard eventParamsArg != nil else {
                throw PluginError.invalidParameter(parameterName: "options")
            }
            
            eventParams = eventParamsArg as! [String: Any]
            
            

            
            /**
             * 1#
             *
             * initialize the loginBuilder and set completion callbacks
             * to call javascript when done
             *
             */
            let loginBuilder = try Newton.getSharedInstance().getLoginBuilder()
            
            _ = loginBuilder.setOnFlowCompleteCallback(callback: { error in
                
                DispatchQueue.main.async { () -> Void in
                    
                    // on Android I'm saving the callback with keepCallback, but I think that the callback is not needed anymore after FlowCompleteCallback
                    
                    if let error = error {
                        self.commandDelegate!.send(
                            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: String(describing: error)),
                            callbackId: loginCallbackId
                        )
                        
                    } else {
                        self.commandDelegate!.send(
                            CDVPluginResult(status: CDVCommandStatus_OK),
                            callbackId: loginCallbackId
                        )
                    }
                }
            })
            
            /**
             * 2#
             *
             * iterate over parameters to initialize the login builder
             *
             */
            for (optionName, optionValue) in eventParams {
                
                let loginOptionName = LoginOptions(rawValue: optionName)
                
                guard (loginOptionName != nil) else {
                    //throw PluginError.invalidParameter(parameterName: optionName)
                    DDIlog("startLoginFlowWithParams() unknow param name: "+optionName)
                    continue
                }
                
                
                
                
                switch loginOptionName! {
                case .customData:
                    
                    guard let optionValue = optionValue as? [String: Any] else {
                        throw PluginError.invalidParameter(parameterName: "value of "+optionName)
                    }
                    let customData = NWSimpleObject(fromDictionary: optionValue)
                    guard let customDataSO = customData else {
                        throw PluginError.invalidParameter(parameterName: "value of customData")
                    }
                    
                    // ignore the result
                    _ = loginBuilder.setCustomData(cData: customDataSO)
                    
                    
                case .externalId:
                    guard let optionValue = optionValue as? String else {
                        throw PluginError.invalidParameter(parameterName: "value of "+optionName)
                    }
                    
                    // ignore the result
                    _ = loginBuilder.setExternalID(externalId: optionValue)
                    
                    
                case .type:
                    guard let optionValue = optionValue as? String else {
                        throw PluginError.invalidParameter(parameterName: "value of "+optionName)
                    }
                    guard LoginFlowType(rawValue: optionValue) != nil else {
                        throw PluginError.invalidParameter(parameterName: "value of type")
                    }
                    
                    loginFlowType = LoginFlowType(rawValue: optionValue)!
                    
                    
                    
                case .customId:
                    
                    guard let optionValue = optionValue as? String else {
                        throw PluginError.invalidParameter(parameterName: "value of "+optionName)
                    }
                    
                    // ignore the result
                    _ = loginBuilder.setCustomID(customId: optionValue)
                    
                    
                } // end switch loginOptionName
                
            } // end for (optionName, optionValue) in eventParams
            
            
            /**
             * 3#
             *
             * then start the login flow
             *
             */
            switch loginFlowType {
            case .external:
                let flow = try loginBuilder.getExternalLoginFlow()
                flow.startLoginFlow()
            case .custom:
                let flow = try loginBuilder.getCustomLoginFlow()
                flow.startLoginFlow()
            case ._unknown:
                throw PluginError.invalidParameter(parameterName: "missing type parameter")
            }
            
            let result:CDVPluginResult = CDVPluginResult(status: CDVCommandStatus_NO_RESULT)
            // save the callback for using it later
            result.setKeepCallbackAs(true)
            
            commandDelegate!.send(result, callbackId: command.callbackId )
            return
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = String(describing: error)
        }
        
        DDIlog("startLoginFlowWithParams() exception: "+errorDesc)
        
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
            return
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = String(describing: error)
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
            return
        }
        catch {
            errorDesc = String(describing: error)
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
            return
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = String(describing: error)
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
            return
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = String(describing: error)
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
            return
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = String(describing: error)
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
            return
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = String(describing: error)
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
            return
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = String(describing: error)
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
            return
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = String(describing: error)
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
            return
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = String(describing: error)
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
            return
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = String(describing: error)
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
            return
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = String(describing: error)
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
            return
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = String(describing: error)
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
            return
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = String(describing: error)
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
            return
        }
        catch let err as PluginError {
            errorDesc = err.description
        }
        catch {
            errorDesc = String(describing: error)
        }
        
        commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDesc),
            callbackId: command.callbackId
        )
    }
    
    /*
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
    */
    
    open func saveNotificationMessage(_ message:[String: Any]) {
        notificationMessage = message
    }
    
    fileprivate func getNotificationMessage() -> [UIApplicationLaunchOptionsKey:Any] {
        
        var notificationOptions = [UIApplicationLaunchOptionsKey:Any]()
        for (kind, value) in notificationMessage {
            notificationOptions[UIApplicationLaunchOptionsKey(kind)] = value
        }
        return notificationOptions
        //let launchOptions = [UIApplicationLaunchOptionsKey.remoteNotification:notificationOptions]
        //return launchOptions
    }
    
    fileprivate func getNotifyLaunchOptions() -> [UIApplicationLaunchOptionsKey:Any] {
        
        var notificationOptions = [UIApplicationLaunchOptionsKey:Any]()
        for (kind, value) in notificationMessage {
            notificationOptions[UIApplicationLaunchOptionsKey(kind)] = value
        }
        return notificationOptions
    }
    
    fileprivate func isNotificationMessageAvailable() -> Bool {
        return notificationMessage.count > 0
    }
    
    fileprivate func clearNotificationMessage() {
        coldstart = false
        notificationMessage.removeAll()
        
        let app = UIApplication.shared
        app.applicationIconBadgeNumber = 0
    }
    
    /*
     * Send push data to Newton if the plugin has been initialized
     * otherwise the push data will be sent on plugin initialization
    */
    func onNotifyLaunchOptions() {
        DDIlog("onNotifyLaunchOptions() start")
        
        // if plugin has been initialized and there is a push saved then proceed
        if (self.callbackId != nil && isNotificationMessageAvailable()) {
            
            var errorDesc:String = "Unknown error"
            
            do {
                let newtonInstance = try Newton.getSharedInstance()
                
                let launchOptions = getNotifyLaunchOptions()
                
                try newtonInstance.getPushManager().setNotifyLaunchOptions(launchOptions:launchOptions)
                
                clearNotificationMessage()
                
                DDIlog("onNotifyLaunchOptions() Push data sent to Newton: \(launchOptions as AnyObject)")
                dump(launchOptions)
                
                return
            }
            catch let err as PluginError {
                errorDesc = err.description
            }
            catch {
                errorDesc = String(describing: error)
            }
            
            DDIlog("onNotifyLaunchOptions error: "+errorDesc)
        }
    }
    
    func onRegisterForRemoteNotificationsOk(_ token:Data) {
        // if plugin has been initialized then proceed
        if (self.callbackId != nil) {
            
            var errorDesc:String = "Unknown error"
            
            do {
                let newtonInstance = try Newton.getSharedInstance()
                
                try newtonInstance.getPushManager().setDeviceToken(token: token)
                
                DDIlog("Token sent to Newton")

                return
            }
            catch let err as PluginError {
                errorDesc = err.description
            }
            catch {
                errorDesc = String(describing: error)
            }
            
            DDIlog("onRegisterForRemoteNotificationsOk error: "+errorDesc)
        }
    }
    
    
    func onRegisterForRemoteNotificationsKo(_ error:Error) {
        // if plugin has been initialized then proceed
        if (self.callbackId != nil) {
            
            var errorDesc:String = "Unknown error"
            
            do {
                let newtonInstance = try Newton.getSharedInstance()
                
                try newtonInstance.getPushManager().setRegistrationError(error: error)
                
                DDIlog("Registration error sent to Newton")
                
                return
            }
            catch let err as PluginError {
                errorDesc = err.description
            }
            catch {
                errorDesc = String(describing: error)
            }
            
            DDIlog("onRegisterForRemoteNotificationsKo error sending error to newton: "+errorDesc)
        }
    }
    
    /*
     * Send push data to Newton if the plugin has been initialized
     * otherwise the push data will be sent on plugin initialization
     */
    func onReceiveRemoteNotification() {
        DDIlog("onReceiveRemoteNotification() start")
        
        // if plugin has been initialized and there is a push saved then proceed
        if (self.callbackId != nil && isNotificationMessageAvailable()) {
            
            var errorDesc:String = "Unknown error"
            
            do {
                let newtonInstance = try Newton.getSharedInstance()
                
                let userInfo = getNotificationMessage()
                
                try newtonInstance.getPushManager().processRemoteNotification(userInfo:userInfo)
                
                clearNotificationMessage()
                
                DDIlog("onReceiveRemoteNotification() Push data sent to Newton: \(userInfo as AnyObject)")
                dump(userInfo)
                
                return
            }
            catch let err as PluginError {
                errorDesc = err.description
            }
            catch {
                errorDesc = String(describing: error)
            }
            
            DDIlog("onReceiveRemoteNotification error: "+errorDesc)
        }
    }
    
    /*
    func onReceiveLocalNotification() {
        
        // if plugin has been initialized and there is a push saved then proceed
        if (self.callbackId != nil) {
            
            var errorDesc:String = "Unknown error"
            
            do {
                let newtonInstance = try Newton.getSharedInstance()
                
                // FIXME: check type validity
                // public func processLocalNotification(notification: UILocalNotification)
                try newtonInstance.getPushManager().processLocalNotification(notification:localNotificationMessage)
                
                DDIlog("Push data sent to Newton")
                
                return
            }
            catch let err as PluginError {
                errorDesc = err.description
            }
            catch {
                errorDesc = String(describing: error)
            }
            
            DDIlog("onReceiveRemoteNotification error: "+errorDesc)
        }
    }
    */
    
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
