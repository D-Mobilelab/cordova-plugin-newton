import Foundation
import Newton
import UIKit

let TAG = "NewtonPlugin"

func DDIlog(_ message: String) {
    NSLog("[%@] - %@", TAG, message)
}


@objc(NewtonPlugin) class NewtonPlugin : CDVPlugin {
    
    var callbackId:String?
    var pushes:[NWPushBase] = [NWPushBase]()
 
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
    
    class func getNewtonSecret() throws -> String {
        #if DEBUG
            /* 
            * Check Swift compiler custom flags -> Other Swift flags -DDEBUG flag 
            * otherwise it will go always in production!
            */
            print("debug")
            let keyForSecret = "NEWTON_SECRET_DEV"
        #else
            print("release")
            let keyForSecret = "NEWTON_SECRET"
        #endif
        
        if let secret = Bundle.main.infoDictionary?[keyForSecret] as? String {
            DDIlog("using secret: \(secret) got from \(keyForSecret)")
            return secret;
        }
        throw PluginError.internalError(reason: "Error while getting Newton secret from pList NEWTON_SECRET")
    }
    
    override public func pluginInitialize() {
        DDIlog("pluginInitialize()")
    }
    
    @objc public func setPushCallback(_ command: CDVInvokedUrlCommand) {
        if (self.callbackId == nil) {
            DDIlog("push callback registered")
            // Save JS callback context. Note: only one callback
            self.callbackId = command.callbackId
        }
        sendPushToJs()
    }
    
    @objc func serializePush(pushObject:NWPushBase) -> [String:Any] {
        /*
         * TODO: Newton should serialize it
         */
        var pushData = [String:Any]()
        if let realPush = pushObject as? NWStandardPush {
            pushData["isShown"] = realPush.shown
            pushData["isRemote"] = !realPush.isLocal
            pushData["customs"] = realPush.customFields?.getDictionary() ?? NSNull()
        }
        return pushData;
    }
    
    @objc func sendPushToJs(){
        if self.callbackId != nil && !self.callbackId!.isEmpty {
            for push in self.pushes {
                let pushSerialized = serializePush(pushObject:push)
                let result: CDVPluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: pushSerialized)
                result.setKeepCallbackAs(true)
                commandDelegate!.send(result, callbackId: self.callbackId)
            }
            //remove the push from array?
            pushes.removeAll()
        }
    }
    
    @objc func pushHandler(pushObject:NWPushBase) {
        // Save it and send it if a callback is already registered
        pushes.append(pushObject)
        sendPushToJs()
    }
    
    @objc public func initializeNewton(_ launchOptions:[UIApplicationLaunchOptionsKey: Any]?) {
        
        do {
            let newtonInstance = try Newton.getSharedInstanceWithConfig(conf: NewtonPlugin.getNewtonSecret())
            try newtonInstance.getPushManager()
                .setPushCallback(callback: self.pushHandler)
                .setNotifyLaunchOptions(launchOptions: launchOptions)
        } catch {
            DDIlog("Error Newton Plugin initiliaze \(String(describing: error))")
        }
    }
    
    override public func onAppTerminate() {
        // is it useless?
        self.callbackId = nil
    }

    @objc func attachMasterSession(_ command: CDVInvokedUrlCommand) {
        let sessionId = command.arguments[0] as? String ?? "Unknown"
        let masterUserId = command.arguments[1] as? String ?? "Unknown"
        
        do {
            try Newton.getSharedInstance().attachMasterSession(masterSessionId: sessionId, masterUserId: masterUserId)
            self.commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK),
                callbackId: command.callbackId
            )
        } catch {
            self.commandDelegate!.send(CDVPluginResult(
                status: CDVCommandStatus_ERROR
            ), callbackId: command.callbackId)
            DDIlog("Error Newton AttachMasterSession \(String(describing: error))")
            return
        }
        
        self.commandDelegate!.send(
            CDVPluginResult(status: CDVCommandStatus_OK),
            callbackId: command.callbackId
        )
    }

    @objc public func registerDevice(_ command: CDVInvokedUrlCommand) {
        do {
            try Newton.getSharedInstance().getPushManager().registerDevice()
            self.commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK),
                callbackId: command.callbackId
            )
        } catch {
            self.commandDelegate!.send(CDVPluginResult(
                status: CDVCommandStatus_ERROR
            ), callbackId: command.callbackId)
            DDIlog("Error Newton registerDevice \(String(describing: error))")
            return
        }
        
    }

    @objc public func buy(_ command: CDVInvokedUrlCommand) {
        DDIlog("Buy command! \(command.argument(at: 0)) \(command.argument(at: 1))")
    }

    @objc public func onRegisterForRemoteNotificationsWithToken(_ token:Data) {
        do {
            let newtonInstance = try Newton.getSharedInstance()
            try newtonInstance.getPushManager().setDeviceToken(token: token)
            DDIlog("Token sent to Newton")
        } catch {
            DDIlog("onRegisterForRemoteNotifications error: \(String(describing: error))")
        }
    }
    
    
    @objc public func onRegisterForRemoteNotificationsWithError(_ error: Error) {
        // if plugin has been initialized then proceed
        if (self.callbackId != nil && !self.callbackId!.isEmpty) {
            
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
    
    @objc public func onReceiveRemoteNotificationWithUserInfo(_ userInfo: [String:Any]) {
        DDIlog("onReceiveRemoteNotification() start")
        do {
            try Newton.getSharedInstance()
                .getPushManager()
                .processRemoteNotification(userInfo:userInfo)
        } catch {
            DDIlog("onReceiveRemoteNotification() error \(String(describing:error))")
        }
    }
}
