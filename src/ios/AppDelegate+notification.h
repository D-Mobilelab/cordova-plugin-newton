#import "AppDelegate.h"

@interface AppDelegate (notification)
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken;
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error;
- (void)didReceiveRemoteNotification:(NSDictionary *)userInfo;
//- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:( void (^)(UIBackgroundFetchResult))completionHandler;
//- (void)application:(UIApplication *)application handleActionWithIdentifier:(NSString *)identifier forRemoteNotification:(NSDictionary *)userInfo completionHandler:(void(^)())completionHandler;
- (id) getCommandInstance:(NSString*)className;

@end
