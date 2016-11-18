import React from 'react';
import ReactDOM from 'react-dom';
import {Page, Button, Toolbar, List, ListHeader, ListItem, Input, Range} from 'react-onsenui';
import {notification} from 'onsenui';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      logLines: [],
      //logLines: [{id: 0, value: 'test row 1'}, {id: 1, value: 'test row 2'}],
      nextLogIndex: 0,
      initDone: false,
      receivedNotifications: 0,
      environment: "",
      badgeNum: 0,
      flowName: "",
      timedEventName: ""
    };
  }

  alertPopup() {
    notification.alert('This is an Onsen UI alert notification test.');
  }

  addLogRow(logRow) {
    let newLogLines = this.state.logLines.slice();
    let nextLogIndex = this.state.nextLogIndex;
    newLogLines.push({id: nextLogIndex, value: logRow});   
    this.setState({logLines:newLogLines, nextLogIndex: ++nextLogIndex})
  }

  sendInit() {
    this.newton = Newton.init({})

    // notification callback
    this.newton.on("notification", (n)=>{
      let notificationMessage = JSON.stringify(n)
      this.addLogRow("Notification: "+notificationMessage)
      notification.alert(notificationMessage)
      this.setState({receivedNotifications: ++this.state.receivedNotifications})
    })

    // wait for initialization complete event
    this.newton.on("initialized", (n)=>{

      this.newton.getEnvironmentString((j)=>{
        this.setState({environment: j.environmentString})
      },(e)=>{
        this.addLogRow("getEnvironmentString ERR "+e)
      })
      
      this.setState({initDone:true})
    })

    
  }

  sendEvent() {
    this.newton.sendEvent(
      (res) => this.addLogRow("Event OK"),
      (err) => this.addLogRow("Event ERR "+err),
      this.state.eventName
    )
  }

  sendLogin() {
    this.newton.startLoginFlowWithParams(
      (res) => this.addLogRow("Login OK"),
      (err) => this.addLogRow("Login ERR "+err),
      {
        customData: {customDataForTest: 1, foo: "bar"},
        externalID: "111111",
        type: "external"
      }
    )
  }

  renderToolbar() {
    return (
      <Toolbar>
        <div className='center'>Newton Demo App</div>
        <div className='right'>
        {this.state.environment}
        </div>
      </Toolbar>
    );
  }

  renderLogRow(row) {
    let id = row['id']
    let value = row['value']
    return (
      <ListItem key={id}>
        <label className='center'>
          {value}
        </label>
      </ListItem>
    )
  }

  render() {
    return (
      <Page renderToolbar={() => this.renderToolbar()}>
        <section style={{textAlign: 'center'}}>
          <p>
            Set badge number:
            <Range
              onChange={(e) => {
                let val = e.target.value
                this.setState({badgeNum: val})
                this.newton.setApplicationIconBadgeNumber(
                  (res) => this.addLogRow("setApplicationIconBadgeNumber OK: "+JSON.stringify(res)),
                  (err) => this.addLogRow("setApplicationIconBadgeNumber ERR "+err),
                  val
                )
              }}
              disabled={!this.state.initDone}
              value={this.state.badgeNum}
              min={0}
              max={50}
            />
            <span className="notification">{this.state.badgeNum}</span>
          </p>
        </section>
        
        <section style={{textAlign: 'center'}}>
          <Button
            onClick={() => this.sendInit()}
            disabled={this.state.initDone}            
          >Init</Button>

          Received Notifications<span className="notification">{this.state.receivedNotifications}</span>
          <Button
            onClick={() => {
             this.newton.clearAllNotifications(
                (res) => this.addLogRow("clearAllNotifications OK"),
                (err) => this.addLogRow("clearAllNotifications ERR "+err)
              )  
            }}
            disabled={!this.state.initDone}            
          >Clear</Button>
        </section>
        <section style={{textAlign: 'center'}}>
          <p>
            <Input
              value={this.state.eventName}
              onChange={(e) => {this.setState({eventName:e.target.value})}}
              modifier='underbar'
              disabled={!this.state.initDone}
              float
              placeholder='Event Name' />
          </p>
        <Button
          onClick={() => this.sendEvent()}
          disabled={!this.state.initDone}
        >Send Event</Button>
        </section>

        <section style={{textAlign: 'center'}}>
          <Button
            onClick={() => this.sendLogin()}
            disabled={!this.state.initDone}            
          >Send Start Login</Button>

          <Button
            onClick={() => {
             this.newton.userLogout(
                (res) => this.addLogRow("Logout OK"),
                (err) => this.addLogRow("Logout ERR "+err)
              )  
            }}
            disabled={!this.state.initDone}            
          >Send Logout</Button>
          
          <Button
            onClick={() => {
             this.newton.isUserLogged(
                (res) => this.addLogRow("isUserLogged OK: "+JSON.stringify(res)),
                (err) => this.addLogRow("isUserLogged ERR "+err)
              )  
            }}
            disabled={!this.state.initDone}
          >Is user logged ?</Button>

          <Button
            onClick={() => {
             this.newton.getUserMetaInfo(
                (res) => this.addLogRow("getUserMetaInfo OK: "+JSON.stringify(res)),
                (err) => this.addLogRow("getUserMetaInfo ERR "+err)
              )  
            }}
            disabled={!this.state.initDone}
          >getUserMetaInfo</Button>

          <Button
            onClick={() => {
             this.newton.getUserToken(
                (res) => this.addLogRow("getUserToken OK: "+JSON.stringify(res)),
                (err) => this.addLogRow("getUserToken ERR "+err)
              )  
            }}
            disabled={!this.state.initDone}
          >getUserToken</Button>

          <Button
            onClick={() => {
             this.newton.getOAuthProviders(
                (res) => this.addLogRow("getOAuthProviders OK: "+JSON.stringify(res)),
                (err) => this.addLogRow("getOAuthProviders ERR "+err)
              )  
            }}
            disabled={!this.state.initDone}
          >getOAuthProviders</Button>
        </section>

        <section style={{textAlign: 'center'}}>
          
        </section>

        <section style={{textAlign: 'center'}}>
          <p>
            <Input
              value={this.state.contentIdRank}
              onChange={(e) => {this.setState({contentIdRank:e.target.value})}}
              modifier='underbar'
              disabled={!this.state.initDone}
              float
              placeholder='rank Content Id' />
          </p>
        <Button
          onClick={() => {
             this.newton.rankContent(
                (res) => this.addLogRow("rankContent OK: "+JSON.stringify(res)),
                (err) => this.addLogRow("rankContent ERR "+err),
                this.state.contentIdRank,
                "CONSUMPTION"
              )
            }}
          disabled={!this.state.initDone}
        >rankContent</Button>
        </section>

        <section style={{textAlign: 'center'}}>
          <p>
            <Input
              value={this.state.timedEventName}
              onChange={(e) => {this.setState({timedEventName:e.target.value})}}
              modifier='underbar'
              disabled={!this.state.initDone}
              float
              placeholder='Timed Event Name' />
          </p>
        <Button
          onClick={() => {
             this.newton.timedEventStart(
                (res) => this.addLogRow("timedEventStart OK: "+JSON.stringify(res)),
                (err) => this.addLogRow("timedEventStart ERR "+err),
                this.state.timedEventName
              )
            }}
          disabled={!this.state.initDone}
        >timedEventStart</Button>
        <Button
          onClick={() => {
             this.newton.timedEventStop(
                (res) => this.addLogRow("timedEventStop OK: "+JSON.stringify(res)),
                (err) => this.addLogRow("timedEventStop ERR "+err),
                this.state.timedEventName
              )
            }}
          disabled={!this.state.initDone}
        >timedEventStop</Button>
        </section>

        <section style={{textAlign: 'center'}}>
          <p>
            <Input
              value={this.state.flowName}
              onChange={(e) => {this.setState({flowName:e.target.value})}}
              modifier='underbar'
              disabled={!this.state.initDone}
              float
              placeholder='Flow Name' />
          </p>
          <Button
          onClick={() => {
             this.newton.flowBegin(
                (res) => this.addLogRow("flowBegin OK: "+JSON.stringify(res)),
                (err) => this.addLogRow("flowBegin ERR "+err),
                this.state.flowName
              )
            }}
          disabled={!this.state.initDone}
        >flowBegin</Button>
        <Button
          onClick={() => {
             this.newton.flowCancel(
                (res) => this.addLogRow("flowCancel OK: "+JSON.stringify(res)),
                (err) => this.addLogRow("flowCancel ERR "+err),
                this.state.flowName
              )
            }}
          disabled={!this.state.initDone}
        >flowCancel</Button>
        <Button
          onClick={() => {
             this.newton.flowFail(
                (res) => this.addLogRow("flowFail OK: "+JSON.stringify(res)),
                (err) => this.addLogRow("flowFail ERR "+err),
                this.state.flowName
              )
            }}
          disabled={!this.state.initDone}
        >flowFail</Button>
        <Button
          onClick={() => {
             this.newton.flowStep(
                (res) => this.addLogRow("flowStep OK: "+JSON.stringify(res)),
                (err) => this.addLogRow("flowStep ERR "+err),
                this.state.flowName
              )
            }}
          disabled={!this.state.initDone}
        >flowStep</Button>
        <Button
          onClick={() => {
             this.newton.flowSucceed(
                (res) => this.addLogRow("flowSucceed OK: "+JSON.stringify(res)),
                (err) => this.addLogRow("flowSucceed ERR "+err),
                this.state.flowName
              )
            }}
          disabled={!this.state.initDone}
        >flowSucceed</Button>
        
        </section>

        <List
          dataSource={this.state.logLines}
          renderHeader={() => <ListHeader>Log</ListHeader>}
          renderRow={this.renderLogRow}
        />
      </Page>
    );
  }
}

App.propTypes = {
  logLines: React.PropTypes.array
}

export default App