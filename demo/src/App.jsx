import React from 'react';
import ReactDOM from 'react-dom';
import {Page, Button, Toolbar, List, ListHeader, ListItem, Input} from 'react-onsenui';
import {notification} from 'onsenui';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      logLines: [],
      //logLines: [{id: 0, value: 'test row 1'}, {id: 1, value: 'test row 2'}],
      nextLogIndex: 0,
      initDone: false,
      receivedNotifications: 0
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

    this.newton.getEnvironmentString((j)=>{
      this.setState({environment: j.environmentString})
    },(e)=>{
      this.addLogRow("getEnvironmentString ERR "+e)
    })
    
    this.setState({initDone:true})
  }

  sendEvent() {
    this.newton.event(
      (res) => this.addLogRow("Event OK"),
      (err) => this.addLogRow("Event ERR "+err),
      this.state.eventName
    )
  }

  sendLogin() {
    this.newton.login(
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
      <Page renderToolbar={this.renderToolbar}>
        <section style={{textAlign: 'center'}}>
          <Button
            onClick={() => this.sendInit()}
            disabled={this.state.initDone}            
          >Init</Button>
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
        </section>

        <section style={{textAlign: 'center'}}>
          Received Notifications<span className="notification">{this.state.receivedNotifications}</span>
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