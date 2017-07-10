//
//  AppDelegate+notification.m
//  pushtest
//
//  Created by Robert Easterday on 10/26/12.
//  Modified by Mirco Cipriani on 06/20/17.
//

#import "AppDelegate+notification.h"
#import <objc/runtime.h>
// $(PRODUCT_MODULE_NAME)
#import "Newton_Cordova_Demo-Swift.h"

//#import <Newton/Newton-Swift.h>


/**
 * plugin name for Newton as defined in plugin.xml feature for platform iOS
 */
static NSString *const NewtonPluginName = @"Newton";

static char launchNotificationKey;
static char coldstartKey;

@implementation AppDelegate (notification)


 
// its dangerous to override a method from within a category.
// Instead we will use method swizzling. we set this up in the load call.
+ (void)load
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        Class class = [self class];
        
        SEL originalSelector = @selector(init);
        SEL swizzledSelector = @selector(pushPluginSwizzledInit);
        
        Method original = class_getInstanceMethod(class, originalSelector);
        Method swizzled = class_getInstanceMethod(class, swizzledSelector);
        
        BOOL didAddMethod =
        class_addMethod(class,
                        originalSelector,
                        method_getImplementation(swizzled),
                        method_getTypeEncoding(swizzled));
        
        if (didAddMethod) {
            class_replaceMethod(class,
                                swizzledSelector,
                                method_getImplementation(original),
                                method_getTypeEncoding(original));
        } else {
            method_exchangeImplementations(original, swizzled);
        }
    });
}

- (AppDelegate *)pushPluginSwizzledInit
{
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(createNotificationChecker:)
                                                 name:UIApplicationDidFinishLaunchingNotification
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter]addObserver:self
                                            selector:@selector(pushPluginOnApplicationDidBecomeActive:)
                                                name:UIApplicationDidBecomeActiveNotification
                                              object:nil];
    
    // This actually calls the original init method over in AppDelegate. Equivilent to calling super
    // on an overrided method, this is not recursive, although it appears that way. neat huh?
    return [self pushPluginSwizzledInit];
}




- (id) getCommandInstance:(NSString*)className
{
    return [self.viewController getCommandInstance:className];
}

// This code will be called immediately after application:didFinishLaunchingWithOptions:. We need
// to process notifications in cold-start situations
- (void)createNotificationChecker:(NSNotification *)notification
{
    NSLog(@"[NewtonPlugin:objc] - on ApplicationDidFinishLaunching hook");
    if (notification)
    {
        NSDictionary *launchOptions = [notification userInfo];
        if (launchOptions) {
            NSLog(@"[NewtonPlugin:objc] - coldstart");
            self.launchNotification = [launchOptions objectForKey: @"UIApplicationLaunchOptionsRemoteNotificationKey"];
            self.coldstart = [NSNumber numberWithBool:YES];
            
        } else {
            NSLog(@"[NewtonPlugin:objc] - not coldstart");
            self.coldstart = [NSNumber numberWithBool:NO];
        }
    }
}

- (void)pushPluginOnApplicationDidBecomeActive:(NSNotification *)notification {
    
    NSLog(@"[NewtonPlugin:objc] - on ApplicationDidBecomeActive hook");
    
    UIApplication *application = notification.object;
    
    // name is featurename in config.xml
    NewtonPlugin *newtonPlugin = [self getCommandInstance:NewtonPluginName];
    
    //if (newtonPlugin.clearBadge) {
    //    NSLog(@"PushPlugin clearing badge");
    //    //zero badge
    //    application.applicationIconBadgeNumber = 0;
    //} else {
    //    NSLog(@"PushPlugin skip clear badge");
    //}
    
    
    if (self.launchNotification) {
        // send data to NewtonPlugin
        // FIXME: verify that this copy the dict
        newtonPlugin.notificationMessage = self.launchNotification;
        newtonPlugin.isInline = NO;
        newtonPlugin.coldstart = [self.coldstart boolValue];
        
        // reset bufferized data
        self.launchNotification = nil;
        self.coldstart = [NSNumber numberWithBool:NO];
        
        // FIXME check that it's working
        // invoke action on data sent
        [newtonPlugin performSelectorOnMainThread:@selector(onNotifyLaunchOptions) withObject:newtonPlugin waitUntilDone:NO];
    }
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    NSLog(@"[NewtonPlugin:objc] - on ApplicationDidRegisterForRemoteNotifications hook");
    NewtonPlugin *newtonPlugin = [self getCommandInstance:NewtonPluginName];
    [newtonPlugin onRegisterForRemoteNotificationsOk:deviceToken];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
    NSLog(@"[NewtonPlugin:objc] - on ApplicationDidFailToRegisterForRemoteNotifications hook");
    NewtonPlugin *newtonPlugin = [self getCommandInstance:NewtonPluginName];
    [newtonPlugin onRegisterForRemoteNotificationsKo:error];
}

- (void) application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
    NSLog(@"[NewtonPlugin:objc] - on ApplicationDidReceiveRemoteNotification hook");
    NewtonPlugin *newtonPlugin = [self getCommandInstance:NewtonPluginName];
    
    newtonPlugin.notificationMessage = userInfo;
    newtonPlugin.isInline = NO;
    [newtonPlugin onReceiveRemoteNotification];
}

//- (void) application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
//    NSLog(@"[NewtonPlugin:objc] - on ApplicationDidReceiveLocalNotification hook");
//    NewtonPlugin *newtonPlugin = [self getCommandInstance:NewtonPluginName];
//
//    // FIXME
//    //newtonPlugin.localNotificationMessage = notification;
//    //newtonPlugin.isInline = NO;
//    //[newtonPlugin onReceiveLocalNotification];
//}



- (BOOL)userHasRemoteNotificationsEnabled {
    UIApplication *application = [UIApplication sharedApplication];
    if ([[UIApplication sharedApplication] respondsToSelector:@selector(registerUserNotificationSettings:)]) {
        return application.currentUserNotificationSettings.types != UIUserNotificationTypeNone;
    } else {
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wdeprecated-declarations"
        return application.enabledRemoteNotificationTypes != UIRemoteNotificationTypeNone;
#pragma GCC diagnostic pop
    }
}


/*




- (void)application:(UIApplication *) application handleActionWithIdentifier: (NSString *) identifier
forRemoteNotification: (NSDictionary *) notification completionHandler: (void (^)()) completionHandler {
    
    NSLog(@"Push Plugin handleActionWithIdentifier %@", identifier);
    NSMutableDictionary *userInfo = [notification mutableCopy];
    [userInfo setObject:identifier forKey:@"actionCallback"];
    NSLog(@"Push Plugin userInfo %@", userInfo);
    
    if (application.applicationState == UIApplicationStateActive) {
        
        // FIXME
        //PushPlugin *pushHandler = [self getCommandInstance:@"PushNotification"];
        //pushHandler.notificationMessage = userInfo;
        //pushHandler.isInline = NO;
        //[pushHandler notificationReceived];
    } else {
        void (^safeHandler)() = ^(void){
            dispatch_async(dispatch_get_main_queue(), ^{
                completionHandler();
            });
        };
        
        // FIXME
        //PushPlugin *pushHandler = [self getCommandInstance:@"PushNotification"];
        
        //if (pushHandler.handlerObj == nil) {
        //    pushHandler.handlerObj = [NSMutableDictionary dictionaryWithCapacity:2];
        //}
        
        //id notId = [userInfo objectForKey:@"notId"];
        //if (notId != nil) {
        //    NSLog(@"Push Plugin notId %@", notId);
        //    [pushHandler.handlerObj setObject:safeHandler forKey:notId];
        //} else {
        //    NSLog(@"Push Plugin notId handler");
        //    [pushHandler.handlerObj setObject:safeHandler forKey:@"handler"];
        //}
        
        //pushHandler.notificationMessage = userInfo;
        //pushHandler.isInline = NO;
        
        //[pushHandler performSelectorOnMainThread:@selector(notificationReceived) withObject:pushHandler waitUntilDone:NO];
    }
}
*/

// The accessors use an Associative Reference since you can't define a iVar in a category
// http://developer.apple.com/library/ios/#documentation/cocoa/conceptual/objectivec/Chapters/ocAssociativeReferences.html
- (NSMutableArray *)launchNotification
{
    return objc_getAssociatedObject(self, &launchNotificationKey);
}

- (void)setLaunchNotification:(NSDictionary *)aDictionary
{
    objc_setAssociatedObject(self, &launchNotificationKey, aDictionary, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (NSNumber *)coldstart
{
    return objc_getAssociatedObject(self, &coldstartKey);
}

- (void)setColdstart:(NSNumber *)aNumber
{
    objc_setAssociatedObject(self, &coldstartKey, aNumber, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (void)dealloc
{
    self.launchNotification = nil; // clear the association and release the object
    self.coldstart = nil;
}



@end
