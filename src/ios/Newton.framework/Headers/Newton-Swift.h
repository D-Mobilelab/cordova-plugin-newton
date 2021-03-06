// Generated by Apple Swift version 3.1 (swiftlang-802.0.53 clang-802.0.42)
#pragma clang diagnostic push

#if defined(__has_include) && __has_include(<swift/objc-prologue.h>)
# include <swift/objc-prologue.h>
#endif

#pragma clang diagnostic ignored "-Wauto-import"
#include <objc/NSObject.h>
#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

#if !defined(SWIFT_TYPEDEFS)
# define SWIFT_TYPEDEFS 1
# if defined(__has_include) && __has_include(<uchar.h>)
#  include <uchar.h>
# elif !defined(__cplusplus) || __cplusplus < 201103L
typedef uint_least16_t char16_t;
typedef uint_least32_t char32_t;
# endif
typedef float swift_float2  __attribute__((__ext_vector_type__(2)));
typedef float swift_float3  __attribute__((__ext_vector_type__(3)));
typedef float swift_float4  __attribute__((__ext_vector_type__(4)));
typedef double swift_double2  __attribute__((__ext_vector_type__(2)));
typedef double swift_double3  __attribute__((__ext_vector_type__(3)));
typedef double swift_double4  __attribute__((__ext_vector_type__(4)));
typedef int swift_int2  __attribute__((__ext_vector_type__(2)));
typedef int swift_int3  __attribute__((__ext_vector_type__(3)));
typedef int swift_int4  __attribute__((__ext_vector_type__(4)));
typedef unsigned int swift_uint2  __attribute__((__ext_vector_type__(2)));
typedef unsigned int swift_uint3  __attribute__((__ext_vector_type__(3)));
typedef unsigned int swift_uint4  __attribute__((__ext_vector_type__(4)));
#endif

#if !defined(SWIFT_PASTE)
# define SWIFT_PASTE_HELPER(x, y) x##y
# define SWIFT_PASTE(x, y) SWIFT_PASTE_HELPER(x, y)
#endif
#if !defined(SWIFT_METATYPE)
# define SWIFT_METATYPE(X) Class
#endif
#if !defined(SWIFT_CLASS_PROPERTY)
# if __has_feature(objc_class_property)
#  define SWIFT_CLASS_PROPERTY(...) __VA_ARGS__
# else
#  define SWIFT_CLASS_PROPERTY(...)
# endif
#endif

#if defined(__has_attribute) && __has_attribute(objc_runtime_name)
# define SWIFT_RUNTIME_NAME(X) __attribute__((objc_runtime_name(X)))
#else
# define SWIFT_RUNTIME_NAME(X)
#endif
#if defined(__has_attribute) && __has_attribute(swift_name)
# define SWIFT_COMPILE_NAME(X) __attribute__((swift_name(X)))
#else
# define SWIFT_COMPILE_NAME(X)
#endif
#if defined(__has_attribute) && __has_attribute(objc_method_family)
# define SWIFT_METHOD_FAMILY(X) __attribute__((objc_method_family(X)))
#else
# define SWIFT_METHOD_FAMILY(X)
#endif
#if defined(__has_attribute) && __has_attribute(noescape)
# define SWIFT_NOESCAPE __attribute__((noescape))
#else
# define SWIFT_NOESCAPE
#endif
#if defined(__has_attribute) && __has_attribute(warn_unused_result)
# define SWIFT_WARN_UNUSED_RESULT __attribute__((warn_unused_result))
#else
# define SWIFT_WARN_UNUSED_RESULT
#endif
#if !defined(SWIFT_CLASS_EXTRA)
# define SWIFT_CLASS_EXTRA
#endif
#if !defined(SWIFT_PROTOCOL_EXTRA)
# define SWIFT_PROTOCOL_EXTRA
#endif
#if !defined(SWIFT_ENUM_EXTRA)
# define SWIFT_ENUM_EXTRA
#endif
#if !defined(SWIFT_CLASS)
# if defined(__has_attribute) && __has_attribute(objc_subclassing_restricted)
#  define SWIFT_CLASS(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) __attribute__((objc_subclassing_restricted)) SWIFT_CLASS_EXTRA
#  define SWIFT_CLASS_NAMED(SWIFT_NAME) __attribute__((objc_subclassing_restricted)) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
# else
#  define SWIFT_CLASS(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
#  define SWIFT_CLASS_NAMED(SWIFT_NAME) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
# endif
#endif

#if !defined(SWIFT_PROTOCOL)
# define SWIFT_PROTOCOL(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) SWIFT_PROTOCOL_EXTRA
# define SWIFT_PROTOCOL_NAMED(SWIFT_NAME) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_PROTOCOL_EXTRA
#endif

#if !defined(SWIFT_EXTENSION)
# define SWIFT_EXTENSION(M) SWIFT_PASTE(M##_Swift_, __LINE__)
#endif

#if !defined(OBJC_DESIGNATED_INITIALIZER)
# if defined(__has_attribute) && __has_attribute(objc_designated_initializer)
#  define OBJC_DESIGNATED_INITIALIZER __attribute__((objc_designated_initializer))
# else
#  define OBJC_DESIGNATED_INITIALIZER
# endif
#endif
#if !defined(SWIFT_ENUM)
# define SWIFT_ENUM(_type, _name) enum _name : _type _name; enum SWIFT_ENUM_EXTRA _name : _type
# if defined(__has_feature) && __has_feature(generalized_swift_name)
#  define SWIFT_ENUM_NAMED(_type, _name, SWIFT_NAME) enum _name : _type _name SWIFT_COMPILE_NAME(SWIFT_NAME); enum SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_ENUM_EXTRA _name : _type
# else
#  define SWIFT_ENUM_NAMED(_type, _name, SWIFT_NAME) SWIFT_ENUM(_type, _name)
# endif
#endif
#if !defined(SWIFT_UNAVAILABLE)
# define SWIFT_UNAVAILABLE __attribute__((unavailable))
#endif
#if !defined(SWIFT_UNAVAILABLE_MSG)
# define SWIFT_UNAVAILABLE_MSG(msg) __attribute__((unavailable(msg)))
#endif
#if !defined(SWIFT_AVAILABILITY)
# define SWIFT_AVAILABILITY(plat, ...) __attribute__((availability(plat, __VA_ARGS__)))
#endif
#if !defined(SWIFT_DEPRECATED)
# define SWIFT_DEPRECATED __attribute__((deprecated))
#endif
#if !defined(SWIFT_DEPRECATED_MSG)
# define SWIFT_DEPRECATED_MSG(...) __attribute__((deprecated(__VA_ARGS__)))
#endif
#if defined(__has_feature) && __has_feature(modules)
@import ObjectiveC;
@import Foundation;
@import UIKit;
#endif

#pragma clang diagnostic ignored "-Wproperty-attribute-mismatch"
#pragma clang diagnostic ignored "-Wduplicate-method-arg"
@class NSCoder;

/// The object describing the Push received
SWIFT_CLASS("_TtC6Newton10NWPushBase")
@interface NWPushBase : NSObject
/// A flag indicating whether the push was actually seen by the end User or not
@property (nonatomic, readonly) BOOL shown;
/// A flag indicating if the push was received from remote or autogenerated
@property (nonatomic, readonly) BOOL isLocal;
@property (nonatomic, readonly, copy) NSString * _Nonnull description;
- (nullable instancetype)initWithCoder:(NSCoder * _Nonnull)aDecoder OBJC_DESIGNATED_INITIALIZER;
- (void)encodeWithCoder:(NSCoder * _Nonnull)aCoder;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
@end

@class NWSimpleObject;

/// Background (Silent) push notification
/// note:
/// Check specifications at https://developer.apple.com/library/mac/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/TheNotificationPayload.html#//apple_ref/doc/uid/TP40008194-CH107-SW6
SWIFT_CLASS("_TtC6Newton16NWBackgroundPush")
@interface NWBackgroundPush : NWPushBase
/// The custom NWSimpleObject that has been put inside the Push Object
@property (nonatomic, readonly, strong) NWSimpleObject * _Nonnull customFields;
@property (nonatomic, readonly, copy) NSString * _Nonnull description;
- (nullable instancetype)initWithCoder:(NSCoder * _Nonnull)aDecoder OBJC_DESIGNATED_INITIALIZER;
- (void)encodeWithCoder:(NSCoder * _Nonnull)aCoder;
@end



/// A simple aggregate of key:value, not nested, used mainly in Analytic events.
/// important:
/// The value types a simple Object can carry are limited to String, Int, Float, Double, Bool, Null
/// attention:
/// There are limits to the memory that a Simple Object can occupy. Moreover Strings value cannot be more than 512 characters each.
SWIFT_CLASS("_TtC6Newton14NWSimpleObject")
@interface NWSimpleObject : NSObject <NSCoding>
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, readonly) NSInteger MAX_STR_LENGTH;)
+ (NSInteger)MAX_STR_LENGTH SWIFT_WARN_UNUSED_RESULT;
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, readonly) NSInteger MAX_SO_SIZE;)
+ (NSInteger)MAX_SO_SIZE SWIFT_WARN_UNUSED_RESULT;
/// JSON String representing the SimpleObject
@property (nonatomic, readonly, copy) NSString * _Nonnull description;
/// Create a Simple Object from a Dictionary
/// Example of creation:
/// \code
///     var dict: [String: Any] = [
///        "aString": "bar",
///        "aNumber": 10,
///        "aFloat": Float(4.79),
///        "aDouble": 99.171829398254932,
///        "aBool": true,
///        "aNull": NSNull()]
///     let so = NWSimpleObject(fromDictionary: dict)
///
/// \endcodeattention:
/// If a string value is longer than MAX_STR_LENGTH it will be truncated
/// warning:
/// If Simple Object’s size exceed the maximum of MAX_SO_SIZE bytes initialization will fail
/// \param fromDictionary The dictionary
///
- (nullable instancetype)initFromDictionary:(NSDictionary<NSString *, id> * _Nonnull)dict OBJC_DESIGNATED_INITIALIZER;
/// Create a Simple Object from a JSON String
/// Example of creation:
/// \code
///         let json = "{\"aString\": \"bar\", \"aNumber\": 10, \"aFloat\": 4.3, \"aDouble\": 99.171829398254932, \"aBool\": true, \"aNull\": null}"
///         let so = NWSimpleObject(fromJSONString: json)
///
/// \endcodenote:
/// When creating a Simple Object with a Float or a Double value inside pay attention to cast it to the appropriate type.
/// If you’re not sure cast it to Double values.
/// attention:
/// If a string value is longer than MAX_STR_LENGTH it will be truncated
/// warning:
/// If Simple Object’s size exceed the maximum of MAX_SO_SIZE bytes initialization will fail
/// \param fromDictionary The dictionary
///
- (nullable instancetype)initFromJSONString:(NSString * _Nonnull)jsonStr;
/// JSON String representing the SimpleObject
///
/// throws:
/// SimpleObjectSerializationError in case Serialization fails
///
/// returns:
/// the String
- (NSString * _Nullable)toJSONStringAndReturnError:(NSError * _Nullable * _Nullable)error SWIFT_WARN_UNUSED_RESULT;
/// Deserialization initializer
- (nullable instancetype)initWithCoder:(NSCoder * _Nonnull)aDecoder;
/// Serialization of SimpleObject
/// \param aCoder the serializer
///
- (void)encodeWithCoder:(NSCoder * _Nonnull)aCoder;
/// Set a String value inside the Simple Object
/// attention:
/// If the string is longer than MAX_STR_LENGTH it will be truncated
/// warning:
/// If Simple Object’s size exceed the maximum of MAX_SO_SIZE bytes an exception will be thrown
/// \param key the key name
///
/// \param value the String value. Constraint are max 512 char
///
///
/// throws:
/// SimpleObjectCreationError in case the constraints are not met
- (BOOL)setStringWithKey:(NSString * _Nonnull)key value:(NSString * _Nonnull)value error:(NSError * _Nullable * _Nullable)error;
/// Set a Int value inside the Simple Object
/// warning:
/// If Simple Object’s size exceed the maximum of MAX_SO_SIZE bytes an exception will be thrown
/// \param key the key name
///
/// \param value the Int value
///
///
/// throws:
/// SimpleObjectCreationError in case the constraints are not met
- (BOOL)setIntWithKey:(NSString * _Nonnull)key value:(NSInteger)value error:(NSError * _Nullable * _Nullable)error;
/// Set a Float value inside the Simple Object
/// warning:
/// If Simple Object’s size exceed the maximum of MAX_SO_SIZE bytes an exception will be thrown
/// \param key the key name
///
/// \param value the Float value
///
///
/// throws:
/// SimpleObjectCreationError in case the constraints are not met
- (BOOL)setFloatWithKey:(NSString * _Nonnull)key value:(float)value error:(NSError * _Nullable * _Nullable)error;
/// Set a Double value inside the Simple Object
/// warning:
/// If Simple Object’s size exceed the maximum of MAX_SO_SIZE bytes an exception will be thrown
/// \param key the key name
///
/// \param value the Double value
///
///
/// throws:
/// SimpleObjectCreationError in case the constraints are not met
- (BOOL)setDoubleWithKey:(NSString * _Nonnull)key value:(double)value error:(NSError * _Nullable * _Nullable)error;
/// Set a Bool value inside the Simple Object
/// warning:
/// If Simple Object’s size exceed the maximum of MAX_SO_SIZE bytes an exception will be thrown
/// \param key the key name
///
/// \param value the Bool value
///
///
/// throws:
/// SimpleObjectCreationError in case the constraints are not met
- (BOOL)setBoolWithKey:(NSString * _Nonnull)key value:(BOOL)value error:(NSError * _Nullable * _Nullable)error;
/// Set a Null value inside the Simple Object
/// warning:
/// If Simple Object’s size exceed the maximum of MAX_SO_SIZE bytes an exception will be thrown
/// \param key the key name
///
///
/// throws:
/// SimpleObjectCreationError in case the constraints are not met
- (BOOL)setNullWithKey:(NSString * _Nonnull)key error:(NSError * _Nullable * _Nullable)error;
/// Conversion to Swift Dictionary
/// creates a copy af Simple Object internal dictionary
/// warning:
/// If a Simple Object has a Float or a Double value inside, please pay attention to access to its dictionary and cast it to the appropriate type.
/// If you’re not sure cast it to Double values.
///
/// returns:
/// the Swift Dictionary
- (NSDictionary<NSString *, id> * _Nonnull)getDictionary SWIFT_WARN_UNUSED_RESULT;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
@end


/// Standard Push Notification is the common Push sent by the server
SWIFT_CLASS("_TtC6Newton14NWStandardPush")
@interface NWStandardPush : NWPushBase
/// The custom NWSimpleObject that has been put inside the Push Object
@property (nonatomic, readonly, strong) NWSimpleObject * _Nullable customFields;
/// The alert string
@property (nonatomic, readonly, copy) NSString * _Nonnull body;
@property (nonatomic, readonly, copy) NSString * _Nonnull description;
- (nullable instancetype)initWithCoder:(NSCoder * _Nonnull)aDecoder OBJC_DESIGNATED_INITIALIZER;
- (void)encodeWithCoder:(NSCoder * _Nonnull)aCoder;
@end


/// Url push notification is a special kind of push that redirects the user on a URL
SWIFT_CLASS("_TtC6Newton9NWUrlPush")
@interface NWUrlPush : NWStandardPush
/// The URL the user is redirecting to
@property (nonatomic, readonly, copy) NSURL * _Nonnull url;
@property (nonatomic, readonly, copy) NSString * _Nonnull description;
- (nullable instancetype)initWithCoder:(NSCoder * _Nonnull)aDecoder OBJC_DESIGNATED_INITIALIZER;
- (void)encodeWithCoder:(NSCoder * _Nonnull)aCoder;
@end


/// The class representing the User Meta Information
/// Meta information are such as the way the user is logged in, the provider and so on.
/// warning:
/// This information is temporary and should be asked as soon as possible after a login procedure
SWIFT_CLASS("_TtC6Newton14NWUserMetaInfo")
@interface NWUserMetaInfo : NSObject
/// Check if the meta information are expired and must be asked to Newton Backend
///
/// returns:
/// a Bool true if they are expired
- (BOOL)isExpired SWIFT_WARN_UNUSED_RESULT;
/// The String representation of the UserMetaInfo
@property (nonatomic, readonly, copy) NSString * _Nonnull description;
/// Deserialization initializer
- (nullable instancetype)initWithCoder:(NSCoder * _Nonnull)aDecoder;
/// Serialization of User Meta Info
/// \param aCoder the serializer
///
- (void)encodeWithCoder:(NSCoder * _Nonnull)aCoder;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
@end


/// Newton iOS SDK v1.2.0
/// Copyright © 2015 d-MobileLab S.p.A. All rights reserved.
SWIFT_CLASS("_TtC6Newton6Newton")
@interface Newton : NSObject
/// Get the SDK version represented as a String composed of TAG + GIT-SHORT-HASH + DATE of compile
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, readonly, copy) NSString * _Nonnull versionString;)
+ (NSString * _Nonnull)versionString SWIFT_WARN_UNUSED_RESULT;
/// Get the SDK Build number as an Integer
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, readonly) NSInteger buildNumber;)
+ (NSInteger)buildNumber SWIFT_WARN_UNUSED_RESULT;
/// Get the actual enviroment the SDK is running on. Can be PROD-SANBOX or PROD-RELEASE
@property (nonatomic, readonly, copy) NSString * _Nonnull environmentString;
/// Used to initialize Newton for the first time
/// It must be placed soon at the beginning of Application initialization
/// Recommended: place the call to this method in UIApplication’s application(_:didFinishLaunchingWithOptions:) method
/// \param conf a String representing the secret
///
/// \param customData a NWSimpleObject to add custom data in Session Start event
///
///
/// throws:
/// throws NWError.NewtonInitializationError when called two times,
/// NWError.NewtonNotInitialized when there were problems in initialization
///
/// returns:
/// the Newton singleton
+ (Newton * _Nullable)getSharedInstanceWithConfigWithConf:(NSString * _Nonnull)conf customData:(NWSimpleObject * _Nullable)customData error:(NSError * _Nullable * _Nullable)error SWIFT_WARN_UNUSED_RESULT;
/// Subsequent calls to obtain Newton singleton
/// NOTE: Initialize Newton before asking for singleton
///
/// throws:
/// throws NWError.NewtonNotInitialized when the singleton is not initialized. Call getSharedInstanceWithConfig first
///
/// returns:
/// the Newton singleton
+ (Newton * _Nullable)getSharedInstanceAndReturnError:(NSError * _Nullable * _Nullable)error SWIFT_WARN_UNUSED_RESULT;
/// Obtain the list of available OAUTH providers
/// it can be used when building an NWOAuthLoginFlow to pass the correct name of the provider via the setOAuthProvider
/// <ul>
///   <li>
///     login flow interested: OAUTH
///   </li>
/// </ul>
///
/// returns:
/// an array of Strings of the provider supported
- (NSArray<NSString *> * _Nonnull)getOAuthProviders SWIFT_WARN_UNUSED_RESULT;
/// Dummy Method only for Frameworks alignments
- (void)finalizeLoginFlow;
/// Getting the actual User credential
/// It can be one of the following, ordered by priority:
/// <ol>
///   <li>
///     The Newton Token [<em>EXPIRABLE</em>] which is the one obtained after a login flow
///   </li>
///   <li>
///     The Autologin Token [<em>EXPIRABLE</em>] the credential obtained to perform automatic flow internally
///   </li>
///   <li>
///     The Anonymous token [<em>NOT EXPIRABLE</em>] calculated on a device basis, and which is unique for the device and application
///   </li>
/// </ol>
///
/// returns:
/// the String reperesenting the actual User Token possessed
- (NSString * _Nonnull)getUserToken SWIFT_WARN_UNUSED_RESULT;
/// Ask if an User is logged inside Newton
/// warning:
/// This is a “best effort” answer, meaning that the SDK won’t sync with the backend to check if the credential is expired
/// <em>To be sure that the answer is aligned with Newton backend please use syncUserState(callback:)</em>
///
/// returns:
/// a Bool if the user is logged in or not
- (BOOL)isUserLogged SWIFT_WARN_UNUSED_RESULT;
/// Explicit logout of a user
/// These are the steps of logging out:
/// <ol>
///   <li>
///     If user is not logged it does nothing
///   </li>
///   <li>
///     It deletes all the credentials (tokens, meta info) possessed
///   </li>
///   <li>
///     The stateChangeListener callback is invoked to inform the user has log out
///   </li>
///   <li>
///     A Logout Analytic Event is fired
///   </li>
/// </ol>
- (void)userLogout;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
@end

@class RankingScope;

@interface Newton (SWIFT_EXTENSION(Newton))
/// Send a Custom Event
/// important:
/// Custom Event is sent, along with its name and custom data, to communicate an immediate action which is interesting for the application.
/// \param name the identification of the event. Constraint regex <em>^[\w-]{1,32}$</em>
///
/// \param customData a SimpleObject that stores key/value pairs useful to attach more information to the event. Please see SimpleObject for constraints
///
///
/// throws:
/// EventCreationError if constraints are not passed
/// NewtonNotInitialized if Singleton is not correctly initialized
/// Serialization on disk error can be thrown too
- (BOOL)sendEventWithName:(NSString * _Nonnull)name customData:(NWSimpleObject * _Nullable)customData error:(NSError * _Nullable * _Nullable)error;
/// Start a Timed Event
/// important:
/// An event that represent something that has been started in the application and that finishes after some time. For this kind of event the name identifies uniquely the timer name: in fact you cannot start the same timer two times, or try to stop a timer never started.
/// The timers live with the life of the application, so if application is stopped they are descructed too.
/// \param name the name of the timer to be started. Constraint regex <em>^[\w-]{1,32}$</em>
///
/// \param customData a SimpleObject that stores key/value pairs useful to attach more information to the event. Please see SimpleObject for constraints
///
///
/// throws:
/// EventCreationError if constraints are not passed,
/// InvalidEvent if a timer with the same name is already started,
/// NewtonNotInitialized if Singleton is not correctly initialized,
/// Serialization on disk error can be thrown too
- (BOOL)timedEventStartWithName:(NSString * _Nonnull)name customData:(NWSimpleObject * _Nullable)customData error:(NSError * _Nullable * _Nullable)error;
/// Stop a Timed Event
/// important:
/// An event that represent something that has been started in the application and that finishes after some time. For this kind of event the name identifies uniquely the timer name: in fact you cannot start the same timer two times, or try to stop a timer never started.
/// The timers live with the life of the application, so if application is stopped they are descructed too.
/// \param name the name of the timer to be stopped. Constraint regex <em>^[\w-]{1,32}$</em>
///
/// \param customData a SimpleObject that stores key/value pairs useful to attach more information to the event. Please see SimpleObject for constraints
///
///
/// throws:
/// EventCreationError if constraints are not passed,
/// InvalidEvent if the timer doesn’t exist,
/// NewtonNotInitialized if Singleton is not correctly initialized,
/// Serialization on disk error can be thrown too
- (BOOL)timedEventStopWithName:(NSString * _Nonnull)name customData:(NWSimpleObject * _Nullable)customData error:(NSError * _Nullable * _Nullable)error;
/// Begin an Analytic Flow
/// Begin the flow once the action has started. The name can help in understanding the kind of flow
/// important:
/// A flow is an aggregation of events that starts at a certain time, have some evolution steps, and then finish with three types of ending: success, failure or canceled. This event persists among sessions and so there can only be one at a time.
/// warning:
/// Starting again a flow will end with failure the previous one
/// \param name the name of the flow. Constraint regex <em>^[\w-]{1,32}$</em>
///
/// \param customData a SimpleObject that stores key/value pairs useful to attach more information to the event. Please see SimpleObject for constraints
///
///
/// throws:
/// EventCreationError if constraints are not passed,
/// NewtonNotInitialized if Singleton is not correctly initialized,
/// Serialization on disk error can be thrown too
- (BOOL)flowBeginWithName:(NSString * _Nonnull)name customData:(NWSimpleObject * _Nullable)customData error:(NSError * _Nullable * _Nullable)error;
/// Step iteration of an Analytic Flow
/// There can be zero to many step, each one with its name. The name can help in understanding the kind of step
/// important:
/// A flow is an aggregation of events that starts at a certain time, have some evolution steps, and then finish with three types of ending: success, failure or canceled. This event persists among sessions and so there can only be one at a time.
/// \param name the name of the step. Constraint regex <em>^[\w-]{1,32}$</em>
///
/// \param customData a SimpleObject that stores key/value pairs useful to attach more information to the event. Please see SimpleObject for constraints
///
///
/// throws:
/// EventCreationError if constraints are not passed,
/// InvalidEvent if flow is not begun,
/// NewtonNotInitialized if Singleton is not correctly initialized,
/// Serialization on disk error can be thrown too
- (BOOL)flowStepWithName:(NSString * _Nonnull)name customData:(NWSimpleObject * _Nullable)customData error:(NSError * _Nullable * _Nullable)error;
/// Ending with success an Analytic Flow
/// End with success a flow when it has been accomplished succesfully
/// important:
/// A flow is an aggregation of events that starts at a certain time, have some evolution steps, and then finish with three types of ending: success, failure or canceled. This event persists among sessions and so there can only be one at a time.
/// \param name The optional reason of ending (default “ok”). Constraint regex <em>^[\w-]{1,32}$</em>
///
/// \param customData a SimpleObject that stores key/value pairs useful to attach more information to the event. Please see SimpleObject for constraints
///
///
/// throws:
/// EventCreationError if constraints are not passed,
/// InvalidEvent if flow is not begun,
/// NewtonNotInitialized if Singleton is not correctly initialized,
/// Serialization on disk error can be thrown too
- (BOOL)flowSucceedWithReason:(NSString * _Nonnull)reason customData:(NWSimpleObject * _Nullable)customData error:(NSError * _Nullable * _Nullable)error;
/// Ending with success an Analytic Flow
/// End with failure a flow when something went wrong that cannot be recovered
/// important:
/// A flow is an aggregation of events that starts at a certain time, have some evolution steps, and then finish with three types of ending: success, failure or canceled. This event persists among sessions and so there can only be one at a time.
/// \param name The reason of failure. Constraint regex <em>^[\w-]{1,32}$</em>
///
/// \param customData a SimpleObject that stores key/value pairs useful to attach more information to the event. Please see SimpleObject for constraints
///
///
/// throws:
/// EventCreationError if constraints are not passed,
/// InvalidEvent if flow is not begun,
/// NewtonNotInitialized if Singleton is not correctly initialized,
/// Serialization on disk error can be thrown too
- (BOOL)flowFailWithReason:(NSString * _Nonnull)reason customData:(NWSimpleObject * _Nullable)customData error:(NSError * _Nullable * _Nullable)error;
/// End by user cancel of an Analytic Flow
/// End with cancel only when the user explicitly aborts the whole process
/// <ul>
///   <li>
///     imporant: A flow is an aggregation of events that starts at a certain time, have some evolution steps, and then finish with three types of ending: success, failure or canceled. This event persists among sessions and so there can only be one at a time.
///   </li>
/// </ul>
/// \param name The optional reason of abort. Constraint regex <em>^[\w-]{1,32}$</em>
///
/// \param customData a SimpleObject that stores key/value pairs useful to attach more information to the event. Please see SimpleObject for constraints
///
///
/// throws:
/// EventCreationError if constraints are not passed,
/// InvalidEvent if flow is not begun,
/// NewtonNotInitialized if Singleton is not correctly initialized,
/// Serialization on disk error can be thrown too
- (BOOL)flowCancelWithReason:(NSString * _Nonnull)reason customData:(NWSimpleObject * _Nullable)customData error:(NSError * _Nullable * _Nullable)error;
/// Check if a specific timer is currently running
/// \param name the name of the timer
///
///
/// returns:
/// a Bool indicating if the specific timer is running
- (BOOL)isTimedEventRunningWithName:(NSString * _Nonnull)name SWIFT_WARN_UNUSED_RESULT;
/// Check if Analytic flow is in progress
///
/// returns:
/// a Bool indicating if the flow has begun but not ended yet
- (BOOL)isAnalyticFlowBegun SWIFT_WARN_UNUSED_RESULT;
/// Get the current analytic name
/// warning:
/// the name of the actual analytic flow is returned, so this can be an intermediate step as well as a flow begun
///
/// throws:
/// EventAnalyticError if there is no Analytic Flow in progress
///
/// returns:
/// the String of the actual analytic flow
- (NSString * _Nullable)getCurrentAnalyticFlowNameAndReturnError:(NSError * _Nullable * _Nullable)error SWIFT_WARN_UNUSED_RESULT;
/// Rank a Content over a specfic Scope
/// important:
/// This is about recommendation in an application. It leverages the analytics channel to identify relevant actions over a content (identified by content id) inside a category (scope) and with a numeric weight (multiplier). It’s all at discretion of the product
/// \param contentId The content identifier
///
/// \param scope The RankingScope
///
/// \param multiplier A Float to modify the weight of the rank
///
///
/// throws:
/// EventCreationError if constraints are not passed,
- (BOOL)rankContentWithContentId:(NSString * _Nonnull)contentId scope:(RankingScope * _Nonnull)scope multiplier:(float)multiplier error:(NSError * _Nullable * _Nullable)error;
@end


/// The class representing the OAuth provider that is used in the Login Flow
SWIFT_CLASS("_TtC6Newton13OAuthProvider")
@interface OAuthProvider : NSObject
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
@end


/// The scope where the recommendation of a content takes place
SWIFT_CLASS("_TtC6Newton12RankingScope")
@interface RankingScope : NSObject
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
@end


@interface UIDevice (SWIFT_EXTENSION(Newton))
@property (nonatomic, readonly, copy) NSString * _Nonnull modelName;
@end


@interface UILocalNotification (SWIFT_EXTENSION(Newton))
@end

#pragma clang diagnostic pop
