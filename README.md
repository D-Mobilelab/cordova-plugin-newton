# cordova-plugin-newton
Newton Platform Cordova Plugin

## Publish new revision

$ git commit -m "sync ver plugin.xml" plugin.xml 

$ npm version patch

$ npm publish

$ git push 

$ git push --tags


## Launch demo project

$ cd demo

$ cordova run -device


### Modify demo source

$ cd demo

$ npm install monaca webpack cordova -g

$ monaca transpile

#### Preview demo in desktop browser

$ monaca preview
