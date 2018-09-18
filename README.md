# cordova-plugin-newton

[![Greenkeeper badge](https://badges.greenkeeper.io/D-Mobilelab/cordova-plugin-newton.svg)](https://greenkeeper.io/)

Newton Platform Cordova Plugin

## Installation

### iOS platform

1. After installation of the plugin you have to change the Swift to objectiveC import header to the name of your project.
 
   For example:
   
   1. search for the following line in the file _AppDelegate+notification.m_
  
       #import "Newton_Cordova_Demo-Swift.h"
   
   
   2. change it to the name of the current project, for example if the project is called GetStyle:

      #import "GetStyle-Swift.h"

2. After installation of the plugin you also have to change the Objective-C Bridging Header to: $(PROJECT_DIR)/$(PROJECT_NAME)/Plugins/cordova-plugin-newton/NewtonPlugin-Bridging-Header.h 
You can find this setting in Build Setting -> Swift Compiler – General -> Objective-C Bridging Header

3. Change project properties in XCode: go to Capabilities and set Push Notification to ON

### Android platform

You need to add the plugin [cordova-plugin-settings-hook](https://www.npmjs.com/package/cordova-plugin-settings-hook) and the following configuration on config.xml file inside the platform android section:

    <platform name="android">
        <preference name="android-applicationName" value="com.buongiorno.newton.cordova.NewtonApplication" />
        ...
    </platform>



## Contribute

### Publish new revision

$ git commit -m "sync ver plugin.xml" plugin.xml 

$ npm version patch

$ npm publish

$ git push 

$ git push --tags


### Launch demo project

$ cd demo

$ cordova run -device


### Modify demo source

$ cd demo

$ npm install monaca webpack cordova -g

$ monaca transpile

#### Preview demo in desktop browser

$ monaca preview
