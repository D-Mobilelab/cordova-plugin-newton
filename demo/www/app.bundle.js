webpackJsonp([0],{0:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}n(1);var r=n(4),i=n(8),a=o(i),s=n(35),l=o(s);n(178);n(181),n(200);var u=n(202),c=o(u);document.addEventListener("deviceready",function(e){console.log("Device ready",e),l["default"].render(a["default"].createElement(r.AppContainer,null,a["default"].createElement(c["default"],null)),document.getElementById("app"))}),function(){"undefined"==typeof __REACT_HOT_LOADER__}()},1:function(e,t,n){e.exports=n(2)},2:function(e,t,n){"use strict";e.exports=n(3)},3:function(e,t){"use strict"},4:function(e,t,n){e.exports=n(5)},5:function(e,t,n){"use strict";var o=n(6);e.exports=function(e){throw this&&this.callback?new Error('React Hot Loader: The Webpack loader is now exported separately. If you use Babel, we recommend that you remove "react-hot-loader" from the "loaders" section of your Webpack configuration altogether, and instead add "react-hot-loader/babel" to the "plugins" section of your .babelrc file. If you prefer not to use Babel, replace "react-hot-loader" or "react-hot" with "react-hot-loader/webpack" in the "loaders" section of your Webpack configuration.'):e&&e.types&&e.types.IfStatement?new Error('React Hot Loader: The Babel plugin is exported separately. Replace "react-hot-loader" with "react-hot-loader/babel" in the "plugins" section of your .babelrc file. While we recommend the above, if you prefer not to use Babel, you may remove "react-hot-loader" from the "plugins" section of your .babelrc file altogether, and instead add "react-hot-loader/webpack" to the "loaders" section of your Webpack configuration.'):new Error('React Hot Loader does not have a default export. If you use the import statement, make sure to include the curly braces: import { AppContainer } from "react-hot-loader". If you use CommonJS, make sure to read the named export: require("react-hot-loader").AppContainer.')},e.exports.AppContainer=o},6:function(e,t,n){"use strict";e.exports=n(7)},7:function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(8),l=s.Component,u=function(e){function t(){return o(this,t),r(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),a(t,[{key:"render",value:function(){return this.props.component?s.createElement(this.props.component,this.props.prop):s.Children.only(this.props.children)}}]),t}(l);e.exports=u},181:function(e,t){},200:181,202:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),l=n(8),u=o(l),c=n(35),d=(o(c),n(203)),f=(n(178),n(204)),p=o(f),m=n(205),g=o(m),h=function(e){function t(e){r(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={index:0},n}return a(t,e),s(t,[{key:"renderTabs",value:function(){return[{content:u["default"].createElement(g["default"],{title:"Cordova Adapted",useNewtonAdapter:"1"}),tab:u["default"].createElement(d.Tab,{key:"2",label:"Cordova Adapted",icon:"md-home"})},{content:u["default"].createElement(p["default"],{title:"Cordova Pure"}),tab:u["default"].createElement(d.Tab,{key:"1",label:"Cordova Pure",icon:"md-home"})}]}},{key:"render",value:function(){var e=this;return u["default"].createElement(d.Tabbar,{index:this.state.index,onPreChange:function(t){t.index!=e.state.index&&e.setState({index:t.index})},renderTabs:this.renderTabs})}}]),t}(u["default"].Component),w=h;t["default"]=w,function(){"undefined"!=typeof __REACT_HOT_LOADER__&&(__REACT_HOT_LOADER__.register(h,"App","/home/pasquale/projects/cordova-plugin-newton/demo/src/App.jsx"),__REACT_HOT_LOADER__.register(w,"default","/home/pasquale/projects/cordova-plugin-newton/demo/src/App.jsx"))}()},204:function(e,t,o){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=o(8),c=r(u),d=o(35),f=(r(d),o(203)),p=o(178),m=void 0,g=function(e){function t(e){i(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={logLines:[],nextLogIndex:0,initDone:!1,receivedNotifications:0,environment:"",badgeNum:0,flowName:"",timedEventName:""},m=Newton.getSharedInstanceWithConfig("secretId",{myCustomData:"appdemocordova"},n.onPush.bind(n)),n}return s(t,e),l(t,[{key:"alertPopup",value:function(){p.notification.alert("This is an Onsen UI alert notification test.")}},{key:"onPush",value:function(e){console.log("onPush!",e);var t=JSON.stringify(n);this.addLogRow("Notification: "+t),p.notification.alert(t),this.setState({receivedNotifications:++this.state.receivedNotifications})}},{key:"addLogRow",value:function(e){var t=this.state.logLines.slice(),n=this.state.nextLogIndex;t.push({id:n,value:e}),this.setState({logLines:t,nextLogIndex:++n})}},{key:"sendInit",value:function(){this.newton=Newton.getSharedInstance()}},{key:"sendEvent",value:function(){this.newton.sendEvent(this.state.eventName)}},{key:"sendLogin",value:function(){var e=this;this.newton.getLoginBuilder().setCustomData(Newton.SimpleObject.fromJSONObject({customDataForTest:1,foo:"bar"})).setOnFlowCompleteCallback(function(t){return e.addLogRow("Login OK")}).setExternalID("111111").getExternalLoginFlow().startLoginFlow()}},{key:"renderToolbar",value:function(){return c["default"].createElement(f.Toolbar,null,c["default"].createElement("div",{className:"center"},"Newton Plugin ",c["default"].createElement("small",{style:{fontSize:"12px"}},this.props.title)),c["default"].createElement("div",{className:"right"},c["default"].createElement("small",{style:{fontSize:"12px"}},this.state.environment)))}},{key:"renderLogRow",value:function(e){var t=e.id,n=e.value;return c["default"].createElement(f.ListItem,{key:t},c["default"].createElement("label",{className:"center"},n))}},{key:"render",value:function(){var e=this;return c["default"].createElement(f.Page,{renderToolbar:function(){return e.renderToolbar()}},c["default"].createElement("section",{style:{textAlign:"center"}},c["default"].createElement("p",null,"Set badge number:",c["default"].createElement(f.Range,{onChange:function(t){var n=t.target.value;e.setState({badgeNum:n}),e.newton.setApplicationIconBadgeNumber(n)},disabled:!this.state.initDone,value:this.state.badgeNum,min:0,max:50}),c["default"].createElement("span",{className:"notification"},this.state.badgeNum))),c["default"].createElement("section",{style:{textAlign:"center"}},c["default"].createElement(f.Button,{onClick:function(){return e.sendInit()},disabled:this.state.initDone},"Init"),"Received Notifications",c["default"].createElement("span",{className:"notification"},this.state.receivedNotifications),c["default"].createElement(f.Button,{onClick:function(){e.newton.clearAllNotifications()},disabled:!this.state.initDone},"Clear")),c["default"].createElement("section",{style:{textAlign:"center"}},c["default"].createElement("p",null,c["default"].createElement(f.Input,{value:this.state.eventName,onChange:function(t){e.setState({eventName:t.target.value})},modifier:"underbar",disabled:!this.state.initDone,"float":!0,placeholder:"Event Name"})),c["default"].createElement(f.Button,{onClick:function(){return e.sendEvent()},disabled:!this.state.initDone},"Send Event")),c["default"].createElement("section",{style:{textAlign:"center"}},c["default"].createElement(f.Button,{onClick:function(){return e.sendLogin()},disabled:!this.state.initDone},"Send Start Login"),c["default"].createElement(f.Button,{onClick:function(){e.newton.userLogout()},disabled:!this.state.initDone},"Send Logout"),c["default"].createElement(f.Button,{onClick:function(){e.addLogRow("isUserLogged OK: "+JSON.stringify(e.newton.isUserLogged()))},disabled:!this.state.initDone},"Is user logged ?"),c["default"].createElement(f.Button,{onClick:function(){e.newton.getUserMetaInfo(function(t){return e.addLogRow("getUserMetaInfo OK: "+JSON.stringify(t))},function(t){return e.addLogRow("getUserMetaInfo ERR "+t)})},disabled:!this.state.initDone},"getUserMetaInfo"),c["default"].createElement(f.Button,{onClick:function(){e.newton.getUserToken(function(t){return e.addLogRow("getUserToken OK: "+JSON.stringify(t))},function(t){return e.addLogRow("getUserToken ERR "+t)})},disabled:!this.state.initDone},"getUserToken"),c["default"].createElement(f.Button,{onClick:function(){e.newton.getOAuthProviders(function(t){return e.addLogRow("getOAuthProviders OK: "+JSON.stringify(t))},function(t){return e.addLogRow("getOAuthProviders ERR "+t)})},disabled:!this.state.initDone},"getOAuthProviders")),c["default"].createElement("section",{style:{textAlign:"center"}}),c["default"].createElement("section",{style:{textAlign:"center"}},c["default"].createElement("p",null,c["default"].createElement(f.Input,{value:this.state.contentIdRank,onChange:function(t){e.setState({contentIdRank:t.target.value})},modifier:"underbar",disabled:!this.state.initDone,"float":!0,placeholder:"rank Content Id"})),c["default"].createElement(f.Button,{onClick:function(){e.newton.rankContent(e.state.contentIdRank,"CONSUMPTION")},disabled:!this.state.initDone},"rankContent")),c["default"].createElement("section",{style:{textAlign:"center"}},c["default"].createElement("p",null,c["default"].createElement(f.Input,{value:this.state.timedEventName,onChange:function(t){e.setState({timedEventName:t.target.value})},modifier:"underbar",disabled:!this.state.initDone,"float":!0,placeholder:"Timed Event Name"})),c["default"].createElement(f.Button,{onClick:function(){e.newton.timedEventStart(e.state.timedEventName)},disabled:!this.state.initDone},"timedEventStart"),c["default"].createElement(f.Button,{onClick:function(){e.newton.timedEventStop(e.state.timedEventName)},disabled:!this.state.initDone},"timedEventStop")),c["default"].createElement("section",{style:{textAlign:"center"}},c["default"].createElement("p",null,c["default"].createElement(f.Input,{value:this.state.flowName,onChange:function(t){e.setState({flowName:t.target.value})},modifier:"underbar",disabled:!this.state.initDone,"float":!0,placeholder:"Flow Name"})),c["default"].createElement(f.Button,{onClick:function(){e.newton.flowBegin(e.state.flowName)},disabled:!this.state.initDone},"flowBegin"),c["default"].createElement(f.Button,{onClick:function(){e.newton.flowCancel(e.state.flowName)},disabled:!this.state.initDone},"flowCancel"),c["default"].createElement(f.Button,{onClick:function(){e.newton.flowFail(e.state.flowName)},disabled:!this.state.initDone},"flowFail"),c["default"].createElement(f.Button,{onClick:function(){e.newton.flowStep(e.state.flowName)},disabled:!this.state.initDone},"flowStep"),c["default"].createElement(f.Button,{onClick:function(){e.newton.flowSucceed(e.state.flowName)},disabled:!this.state.initDone},"flowSucceed")),c["default"].createElement(f.List,{dataSource:this.state.logLines,renderHeader:function(){return c["default"].createElement(f.ListHeader,null,"Log")},renderRow:this.renderLogRow}))}}]),t}(c["default"].Component),h=g;t["default"]=h,g.propTypes={logLines:c["default"].PropTypes.array},function(){"undefined"!=typeof __REACT_HOT_LOADER__&&(__REACT_HOT_LOADER__.register(m,"NewtonInstance","/home/pasquale/projects/cordova-plugin-newton/demo/src/TabCordova.jsx"),__REACT_HOT_LOADER__.register(g,"TabCordova","/home/pasquale/projects/cordova-plugin-newton/demo/src/TabCordova.jsx"),__REACT_HOT_LOADER__.register(h,"default","/home/pasquale/projects/cordova-plugin-newton/demo/src/TabCordova.jsx"))}()},205:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),l=n(8),u=o(l),c=n(35),d=(o(c),n(203)),f=n(178),p=n(206),m=o(p);window.NewtonAdapter=m["default"];var g=function(e){function t(e){r(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={logLines:[],nextLogIndex:0,initDone:!1,receivedNotifications:0,environment:"",badgeNum:0,flowName:"",timedEventName:""},m["default"].init({secretId:"secretId",enable:!0,waitLogin:!1,pushCallback:n.onPush.bind(n)}).then(function(){var e=Newton.getSharedInstance();n.setState({environment:e.getEnvironmentString(),initDone:!0}),n.newton=e}),n}return a(t,e),s(t,[{key:"alertPopup",value:function(){f.notification.alert("This is an Onsen UI alert notification test.")}},{key:"addLogRow",value:function(e){var t=this.state.logLines.slice(),n=this.state.nextLogIndex;t.push({id:n,value:e}),this.setState({logLines:t,nextLogIndex:++n})}},{key:"onPush",value:function(e){console.log(e);var t=JSON.stringify(e);this.addLogRow("Notification:"+t),f.notification.alert(t),this.setState({receivedNotifications:++this.state.receivedNotifications})}},{key:"sendInit",value:function(){}},{key:"sendEvent",value:function(){m["default"].trackEvent({name:this.state.eventName})}},{key:"sendLogin",value:function(){var e=this;m["default"].login({logged:!0,type:"external",userId:"123456789"}).then(function(){e.addLogRow("Login OK")})["catch"](function(){e.addLogRow("Login KO")})}},{key:"renderToolbar",value:function(){return u["default"].createElement(d.Toolbar,null,u["default"].createElement("div",{className:"center"},"Newton Plugin ",u["default"].createElement("small",{style:{"font-size":"12px"}},this.props.title)),u["default"].createElement("div",{className:"right"},u["default"].createElement("small",{style:{"font-size":"12px"}},this.state.environment)))}},{key:"renderLogRow",value:function(e){var t=e.id,n=e.value;return u["default"].createElement(d.ListItem,{key:t},u["default"].createElement("label",{className:"center"},n))}},{key:"render",value:function(){var e=this;return u["default"].createElement(d.Page,{renderToolbar:function(){return e.renderToolbar()}},u["default"].createElement("section",{style:{textAlign:"center"}},u["default"].createElement("p",null,"Set badge number:",u["default"].createElement(d.Range,{onChange:function(t){var n=t.target.value;e.setState({badgeNum:n}),e.newton.setApplicationIconBadgeNumber(n)},disabled:!this.state.initDone,value:this.state.badgeNum,min:0,max:50}),u["default"].createElement("span",{className:"notification"},this.state.badgeNum))),u["default"].createElement("section",{style:{textAlign:"center"}},u["default"].createElement(d.Button,{onClick:function(){return e.sendInit()},disabled:this.state.initDone},"Init"),"Received Notifications",u["default"].createElement("span",{className:"notification"},this.state.receivedNotifications),u["default"].createElement(d.Button,{onClick:function(){e.newton.clearAllNotifications()},disabled:!this.state.initDone},"Clear")),u["default"].createElement("section",{style:{textAlign:"center"}},u["default"].createElement("p",null,u["default"].createElement(d.Input,{value:this.state.eventName,onChange:function(t){e.setState({eventName:t.target.value})},modifier:"underbar",disabled:!this.state.initDone,"float":!0,placeholder:"Event Name"})),u["default"].createElement(d.Button,{onClick:function(){return e.sendEvent()},disabled:!this.state.initDone},"Send Event")),u["default"].createElement("section",{style:{textAlign:"center"}},u["default"].createElement(d.Button,{onClick:function(){return e.sendLogin()},disabled:!this.state.initDone},"Send Start Login"),u["default"].createElement(d.Button,{onClick:function(){e.newton.userLogout()},disabled:!this.state.initDone},"Send Logout"),u["default"].createElement(d.Button,{onClick:function(){e.addLogRow("isUserLogged OK: "+JSON.stringify(e.newton.isUserLogged()))},disabled:!this.state.initDone},"Is user logged ?"),u["default"].createElement(d.Button,{onClick:function(){e.newton.getUserMetaInfo(function(t){return e.addLogRow("getUserMetaInfo OK: "+JSON.stringify(t))},function(t){return e.addLogRow("getUserMetaInfo ERR "+t)})},disabled:!this.state.initDone},"getUserMetaInfo"),u["default"].createElement(d.Button,{onClick:function(){e.newton.getUserToken(function(t){return e.addLogRow("getUserToken OK: "+JSON.stringify(t))},function(t){return e.addLogRow("getUserToken ERR "+t)})},disabled:!this.state.initDone},"getUserToken"),u["default"].createElement(d.Button,{onClick:function(){e.newton.getOAuthProviders(function(t){return e.addLogRow("getOAuthProviders OK: "+JSON.stringify(t))},function(t){return e.addLogRow("getOAuthProviders ERR "+t)})},disabled:!this.state.initDone},"getOAuthProviders")),u["default"].createElement("section",{style:{textAlign:"center"}}),u["default"].createElement("section",{style:{textAlign:"center"}},u["default"].createElement("p",null,u["default"].createElement(d.Input,{value:this.state.contentIdRank,onChange:function(t){e.setState({contentIdRank:t.target.value})},modifier:"underbar",disabled:!this.state.initDone,"float":!0,placeholder:"rank Content Id"})),u["default"].createElement(d.Button,{onClick:function(){e.newton.rankContent(e.state.contentIdRank,"CONSUMPTION")},disabled:!this.state.initDone},"rankContent")),u["default"].createElement("section",{style:{textAlign:"center"}},u["default"].createElement("p",null,u["default"].createElement(d.Input,{value:this.state.timedEventName,onChange:function(t){e.setState({timedEventName:t.target.value})},modifier:"underbar",disabled:!this.state.initDone,"float":!0,placeholder:"Timed Event Name"})),u["default"].createElement(d.Button,{onClick:function(){e.newton.timedEventStart(e.state.timedEventName)},disabled:!this.state.initDone},"timedEventStart"),u["default"].createElement(d.Button,{onClick:function(){e.newton.timedEventStop(e.state.timedEventName)},disabled:!this.state.initDone},"timedEventStop")),u["default"].createElement("section",{style:{textAlign:"center"}},u["default"].createElement("p",null,u["default"].createElement(d.Input,{value:this.state.flowName,onChange:function(t){e.setState({flowName:t.target.value})},modifier:"underbar",disabled:!this.state.initDone,"float":!0,placeholder:"Flow Name"})),u["default"].createElement(d.Button,{onClick:function(){e.newton.flowBegin(e.state.flowName)},disabled:!this.state.initDone},"flowBegin"),u["default"].createElement(d.Button,{onClick:function(){e.newton.flowCancel(e.state.flowName)},disabled:!this.state.initDone},"flowCancel"),u["default"].createElement(d.Button,{onClick:function(){e.newton.flowFail(e.state.flowName)},disabled:!this.state.initDone},"flowFail"),u["default"].createElement(d.Button,{onClick:function(){e.newton.flowStep(e.state.flowName)},disabled:!this.state.initDone},"flowStep"),u["default"].createElement(d.Button,{onClick:function(){e.newton.flowSucceed(e.state.flowName)},disabled:!this.state.initDone},"flowSucceed")),u["default"].createElement(d.List,{dataSource:this.state.logLines,renderHeader:function(){return u["default"].createElement(d.ListHeader,null,"Log")},renderRow:this.renderLogRow}))}}]),t}(u["default"].Component),h=g;t["default"]=h,g.propTypes={logLines:u["default"].PropTypes.array},function(){"undefined"!=typeof __REACT_HOT_LOADER__&&(__REACT_HOT_LOADER__.register(g,"TabNewtonAdapter","/home/pasquale/projects/cordova-plugin-newton/demo/src/TabNewtonAdapter.jsx"),__REACT_HOT_LOADER__.register(h,"default","/home/pasquale/projects/cordova-plugin-newton/demo/src/TabNewtonAdapter.jsx"))}()},206:function(e,t,n){(function(t,n){!function(t,n){e.exports=n()}(this,function(){return function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={exports:{},id:o,loaded:!1};return e[o].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){var o=n(1),r=n(5),i=new function(){var e,t,n,a,s=function(e){try{var t=e||{};return Newton.SimpleObject.fromJSONObject(t)}catch(o){return n.warn("NewtonAdapter","Newton.SimpleObject.fromJSONObject is failed",o),Newton.SimpleObject.fromJSONObject({})}};(a=function(){e=2,t=!1,n={debug:function(){},log:function(){},info:function(){},warn:function(){},error:function(){}},r.cleanAll()})(),this.resetForTest=function(){a()},this.init=function(i){return new o(function(o,a){if(i.logger&&(n=i.logger),i.newtonversion&&(e=i.newtonversion),Newton){var l=function(){if(1===e)t=Newton.getSharedInstanceWithConfig(i.secretId),i.properties&&n.warn("NewtonAdapter","Init","Newton v.1 not support properties on init method");else{var a=[i.secretId,s(i.properties)];i.pushCallback&&a.push(i.pushCallback),t=Newton.getSharedInstanceWithConfig.apply(null,a)}o(!0),n.log("NewtonAdapter","Init",i),r.trigger("init"),i.waitLogin||r.trigger("login")};i.enable?i.waitDeviceReady?document.addEventListener("deviceready",l,!1):l():(o(!1),n.warn("NewtonAdapter","Init","Newton not enabled"))}else a("Newton not exist"),n.error("NewtonAdapter","Init","Newton not exist")})},this.login=function(i){return new o(function(o,a){r.bind("init",function(){i.callback&&n.warn("NewtonAdapter","Login","Callback method for login is not supported, use promise-then");var l=function(e){e?(a(e),n.error("NewtonAdapter","Login",e)):(o(),n.log("NewtonAdapter","Login",i),r.trigger("login"))};if(!i.logged||t.isUserLogged())l();else{var u=i.type?i.type:"custom";1===e?"custom"===u?i.userId?t.getLoginBuilder().setLoginData(s(i.userProperties)).setCallback(l).setCustomID(i.userId).getCustomFlow().startLoginFlow():(a("Custom login requires userId"),n.error("NewtonAdapter","Login","Custom login requires userId")):(a("Newton v.1 not support this type of login"),n.error("NewtonAdapter","Login","Newton v.1 not support this type of login")):"custom"===u?i.userId?t.getLoginBuilder().setCustomData(s(i.userProperties)).setOnFlowCompleteCallback(l).setCustomID(i.userId).getCustomLoginFlow().startLoginFlow():(a("Custom login requires userId"),n.error("NewtonAdapter","Login","Custom login requires userId")):"external"===u?i.userId?t.getLoginBuilder().setCustomData(s(i.userProperties)).setOnFlowCompleteCallback(l).setExternalID(i.userId).getExternalLoginFlow().startLoginFlow():(a("External login requires userId"),n.error("NewtonAdapter","Login","External login requires userId")):"msisdn"===u?i.msisdn&&i.pin?t.getLoginBuilder().setOnFlowCompleteCallback(l).setMSISDN(i.msisdn).setPIN(i.pin).getMSISDNPINLoginFlow().startLoginFlow():(a("Msisdn login requires msisdn and pin"),n.error("NewtonAdapter","Login","Msisdn login requires msisdn and pin")):"autologin"===u?i.domain?t.getLoginBuilder().setOnFlowCompleteCallback(l).__setDomain(i.domain).getMSISDNURLoginFlow().startLoginFlow():(a("Autologin requires domain"),n.error("NewtonAdapter","Login","Autologin requires domain")):"oauth"===u?i.provider&&i.access_token?t.getLoginBuilder().setOAuthProvider(i.provider).setAccessToken(i.access_token).setOnFlowCompleteCallback(l).getOAuthLoginFlow().startLoginFlow():(a("OAuth login requires provider and access_token"),n.error("NewtonAdapter","Login","OAuth login requires provider and access_token")):(a("This type of login is unknown"),n.error("NewtonAdapter","Login","This type of login is unknown"))}})})},this.logout=function(){return new o(function(e){r.bind("init",function(){t.isUserLogged()?(t.userLogout(),e(!0),n.log("NewtonAdapter","Logout")):(e(!1),n.warn("NewtonAdapter","Logout","User is already unlogged"))})})},this.rankContent=function(i){return new o(function(o,a){r.bind("login",function(){var r=i.score?i.score:1;1===e?(a("Newton v.1 not support rank content"),n.error("NewtonAdapter","rankContent","Newton v.1 not support rank content")):i.contentId&&i.scope?(t.rankContent(i.contentId,i.scope,r),o(),n.log("NewtonAdapter","rankContent",i)):(a("rankContent requires scope and contentId"),n.error("NewtonAdapter","rankContent","rankContent requires scope and contentId"))})})},this.trackEvent=function(e){return new o(function(o,a){r.bind("login",function(){e.name?(t.sendEvent(e.name,s(e.properties)),o(),n.log("NewtonAdapter","trackEvent",e),e.rank&&i.rankContent(e.rank)):(a("trackEvent requires name"),n.error("NewtonAdapter","trackEvent","trackEvent requires name"))})})},this.trackPageview=function(e){var t=e||{};return t.name="pageview",t.properties||(t.properties={}),t.properties.url||(t.properties.url=window.location.href),i.trackEvent(t)},this.startHeartbeat=function(e){return new o(function(o,i){r.bind("login",function(){e.name?(t.timedEventStart(e.name,s(e.properties)),o(),n.log("NewtonAdapter","startHeartbeat",e)):(i("startHeartbeat requires name"),n.error("NewtonAdapter","startHeartbeat","startHeartbeat requires name"))})})},this.stopHeartbeat=function(e){return new o(function(o,i){r.bind("login",function(){e.name?(t.timedEventStop(e.name,s(e.properties)),o(),n.log("NewtonAdapter","startHeartbeat",e)):(i("startHeartbeat requires name"),n.error("NewtonAdapter","startHeartbeat","startHeartbeat requires name"))})})},this.isUserLogged=function(){return!!t&&t.isUserLogged()},this.isInitialized=function(){return r.isTriggered("init")},this.getUserToken=function(){return!!t&&t.getUserToken()},this.setUserStateChangeListener=function(e){return!(!t||!e)&&(t.setUserStateChangeListener(e),!0)},this.finalizeLoginFlow=function(e){return!(!t||!e)&&(t.finalizeLoginFlow(e),!0)},this.addIdentity=function(e){return new o(function(o,i){r.bind("login",function(){var r=e.type?e.type:"oauth";"oauth"===r?e.provider&&e.access_token?t.getIdentityManager().getIdentityBuilder().setOAuthProvider(e.provider).setAccessToken(e.access_token).setOnFlowCompleteCallback(function(t){t?(i(t),n.error("NewtonAdapter","addIdentity",t)):(o(),n.log("NewtonAdapter","addIdentity",e))}).getAddOAuthIdentityFlow().startAddIdentityFlow():(i("addIdentity requires provider and access_token"),n.error("NewtonAdapter","addIdentity","addIdentity requires provider and access_token")):(i("This type of add identity is not supported"),n.error("NewtonAdapter","addIdentity","This type of add identity is not supported"))})})},this.removeIdentity=function(e){return new o(function(o,i){r.bind("login",function(){e.type?t.getIdentityManager().getIdentities(function(t,r){if(t)i(t),n.error("NewtonAdapter","removeIdentity","getIdentities failed",t);else if(n.log("NewtonAdapter","removeIdentity","getIdentities success",e,r),r.length<2)i("it's not possible remove unique identity"),n.error("NewtonAdapter","removeIdentity","it's not possible remove unique identity");else for(var a=0,s=!0;a<r.length&&s;a++)e.type===r[a].getType()&&(s=!1,r[a]["delete"](function(e){e?(i(e),n.error("NewtonAdapter","removeIdentity","delete failed",e)):(o(),n.log("NewtonAdapter","removeIdentity","delete success"))}))}):(i("removeIdentity requires type"),n.error("NewtonAdapter","removeIdentity","removeIdentity requires type"))})})},this.userDelete=function(){return new o(function(e,o){r.bind("login",function(){t.getIdentityManager().getIdentities(function(r,i){if(r)o(r),n.error("NewtonAdapter","userDelete","getIdentities failed",r);else{n.log("NewtonAdapter","userDelete","getIdentities success",i);for(var a=0,s=!0;a<i.length&&s;a++)"msisdn"===i[a].getType()&&(s=!1,o("Error on userDelete: please use unsubscribe instead"),n.error("NewtonAdapter","userDelete","Error on userDelete: please use unsubscribe instead"));t.getIdentityManager().userDelete(function(t){t?(o(t),n.error("NewtonAdapter","userDelete","delete",t)):(e(),n.log("NewtonAdapter","userDelete",i))})}})})})},this.recoverPassword=function(e){return new o(function(o,i){r.bind("login",function(){e.msisdn?t.getLoginBuilder().setOnForgotFlowCallback(function(t){t?(i(t),n.error("NewtonAdapter","recoverPassword",t)):(o(),n.log("NewtonAdapter","recoverPassword",e))}).setMSISDN(e.msisdn).getMSISDNPINForgotFlow().startForgotFlow():(i("recoverPassword requires msisdn"),n.error("NewtonAdapter","recoverPassword","recoverPassword requires msisdn"))})})}};e.exports=i},function(e,t,n){(function(t){!function(n){function o(){}function r(e,t){return function(){e.apply(t,arguments)}}function i(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],d(e,this)}function a(e,t){for(;3===e._state;)e=e._value;return 0===e._state?void e._deferreds.push(t):(e._handled=!0,void i._immediateFn(function(){var n=1===e._state?t.onFulfilled:t.onRejected;if(null===n)return void(1===e._state?s:l)(t.promise,e._value);var o;try{o=n(e._value)}catch(r){return void l(t.promise,r)}s(t.promise,o)}))}function s(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var n=t.then;if(t instanceof i)return e._state=3,e._value=t,void u(e);if("function"==typeof n)return void d(r(n,t),e)}e._state=1,e._value=t,u(e)}catch(o){l(e,o)}}function l(e,t){e._state=2,e._value=t,u(e)}function u(e){2===e._state&&0===e._deferreds.length&&i._immediateFn(function(){e._handled||i._unhandledRejectionFn(e._value)});for(var t=0,n=e._deferreds.length;t<n;t++)a(e,e._deferreds[t]);e._deferreds=null}function c(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n}function d(e,t){var n=!1;try{e(function(e){n||(n=!0,s(t,e));
},function(e){n||(n=!0,l(t,e))})}catch(o){if(n)return;n=!0,l(t,o)}}var f=setTimeout;i.prototype["catch"]=function(e){return this.then(null,e)},i.prototype.then=function(e,t){var n=new this.constructor(o);return a(this,new c(e,t,n)),n},i.all=function(e){var t=Array.prototype.slice.call(e);return new i(function(e,n){function o(i,a){try{if(a&&("object"==typeof a||"function"==typeof a)){var s=a.then;if("function"==typeof s)return void s.call(a,function(e){o(i,e)},n)}t[i]=a,0===--r&&e(t)}catch(l){n(l)}}if(0===t.length)return e([]);for(var r=t.length,i=0;i<t.length;i++)o(i,t[i])})},i.resolve=function(e){return e&&"object"==typeof e&&e.constructor===i?e:new i(function(t){t(e)})},i.reject=function(e){return new i(function(t,n){n(e)})},i.race=function(e){return new i(function(t,n){for(var o=0,r=e.length;o<r;o++)e[o].then(t,n)})},i._immediateFn="function"==typeof t&&function(e){t(e)}||function(e){f(e,0)},i._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},i._setImmediateFn=function(e){i._immediateFn=e},i._setUnhandledRejectionFn=function(e){i._unhandledRejectionFn=e},"undefined"!=typeof e&&e.exports?e.exports=i:n.Promise||(n.Promise=i)}(this)}).call(t,n(2).setImmediate)},function(e,o,r){function i(e,t){this._id=e,this._clearFn=t}var a=Function.prototype.apply;o.setTimeout=function(){return new i(a.call(setTimeout,window,arguments),clearTimeout)},o.setInterval=function(){return new i(a.call(setInterval,window,arguments),clearInterval)},o.clearTimeout=o.clearInterval=function(e){e&&e.close()},i.prototype.unref=i.prototype.ref=function(){},i.prototype.close=function(){this._clearFn.call(window,this._id)},o.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},o.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},o._unrefActive=o.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout(function(){e._onTimeout&&e._onTimeout()},t))},r(3),o.setImmediate=t,o.clearImmediate=n},function(e,t,n){(function(e,t){!function(e,n){"use strict";function o(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),n=0;n<t.length;n++)t[n]=arguments[n+1];var o={callback:e,args:t};return g[m]=o,p(m),m++}function r(e){delete g[e]}function i(e){var t=e.callback,o=e.args;switch(o.length){case 0:t();break;case 1:t(o[0]);break;case 2:t(o[0],o[1]);break;case 3:t(o[0],o[1],o[2]);break;default:t.apply(n,o)}}function a(e){if(h)setTimeout(a,0,e);else{var t=g[e];if(t){h=!0;try{i(t)}finally{r(e),h=!1}}}}function s(){p=function(e){t.nextTick(function(){a(e)})}}function l(){if(e.postMessage&&!e.importScripts){var t=!0,n=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage("","*"),e.onmessage=n,t}}function u(){var t="setImmediate$"+Math.random()+"$",n=function(n){n.source===e&&"string"==typeof n.data&&0===n.data.indexOf(t)&&a(+n.data.slice(t.length))};e.addEventListener?e.addEventListener("message",n,!1):e.attachEvent("onmessage",n),p=function(n){e.postMessage(t+n,"*")}}function c(){var e=new MessageChannel;e.port1.onmessage=function(e){var t=e.data;a(t)},p=function(t){e.port2.postMessage(t)}}function d(){var e=w.documentElement;p=function(t){var n=w.createElement("script");n.onreadystatechange=function(){a(t),n.onreadystatechange=null,e.removeChild(n),n=null},e.appendChild(n)}}function f(){p=function(e){setTimeout(a,0,e)}}if(!e.setImmediate){var p,m=1,g={},h=!1,w=e.document,v=Object.getPrototypeOf&&Object.getPrototypeOf(e);v=v&&v.setTimeout?v:e,"[object process]"==={}.toString.call(e.process)?s():l()?u():e.MessageChannel?c():w&&"onreadystatechange"in w.createElement("script")?d():f(),v.setImmediate=o,v.clearImmediate=r}}("undefined"==typeof self?"undefined"==typeof e?this:e:self)}).call(t,function(){return this}(),n(4))},function(e,t){function n(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function r(e){if(c===setTimeout)return setTimeout(e,0);if((c===n||!c)&&setTimeout)return c=setTimeout,setTimeout(e,0);try{return c(e,0)}catch(t){try{return c.call(null,e,0)}catch(t){return c.call(this,e,0)}}}function i(e){if(d===clearTimeout)return clearTimeout(e);if((d===o||!d)&&clearTimeout)return d=clearTimeout,clearTimeout(e);try{return d(e)}catch(t){try{return d.call(null,e)}catch(t){return d.call(this,e)}}}function a(){g&&p&&(g=!1,p.length?m=p.concat(m):h=-1,m.length&&s())}function s(){if(!g){var e=r(a);g=!0;for(var t=m.length;t;){for(p=m,m=[];++h<t;)p&&p[h].run();h=-1,t=m.length}p=null,g=!1,i(e)}}function l(e,t){this.fun=e,this.array=t}function u(){}var c,d,f=e.exports={};!function(){try{c="function"==typeof setTimeout?setTimeout:n}catch(e){c=n}try{d="function"==typeof clearTimeout?clearTimeout:o}catch(e){d=o}}();var p,m=[],g=!1,h=-1;f.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];m.push(new l(e,t)),1!==m.length||g||r(s)},l.prototype.run=function(){this.fun.apply(null,this.array)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=u,f.addListener=u,f.once=u,f.off=u,f.removeListener=u,f.removeAllListeners=u,f.emit=u,f.binding=function(e){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(e){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},function(e,t,n){!function(t,n){e.exports=n()}(this,function(){return function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={exports:{},id:o,loaded:!1};return e[o].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t){e.exports={events:{},bind:function(e,t){var n=this.events[e];n?n.triggered?t.call(this,n.parameters):n.stack.push(t):this.events[e]={triggered:!1,parameters:void 0,stack:[t]}},trigger:function(e,t){var n=this.events[e];if(n&&!n.triggered)for(var o=0;o<n.stack.length;o++)n.stack[o].call(this,t);this.events[e]={triggered:!0,parameters:t,stack:[]}},isTriggered:function(e){var t=this.events[e];return!!t&&t.triggered},clean:function(e){this.events[e]={triggered:!1,parameters:void 0,stack:[]}},cleanAll:function(){this.events={}}}}])})}])})}).call(t,n(180).setImmediate,n(180).clearImmediate)}});