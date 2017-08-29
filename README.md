# cordova-plugin-newton
Newton Platform Cordova Plugin

## Installation

### iOS platform

After installation of the plugin you have to change the Swift to objectiveC import header to the name of your project.

For example:

1. search for the following line in the file _AppDelegate+notification.m_
  
    #import "Newton_Cordova_Demo-Swift.h"


2. change it to the name of the current project, for example if the project is called GetStyle:

    #import "GetStyle-Swift.h"




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
