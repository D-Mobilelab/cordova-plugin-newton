import React from 'react';
import ReactDOM from 'react-dom';
import {Page, Button, Toolbar, List, ListHeader, ListItem, Input, Range, Tabbar, Tab} from 'react-onsenui';
import { notification } from 'onsenui';

import TabCordova from './TabCordova';
import TabNewtonAdapter from './TabNewtonAdapter';

class App extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      index: 0
    };
  }

  renderTabs() {
    return [
      {
        content: <TabCordova title='Cordova Pure' />,
        tab: <Tab key="1" label='Cordova Pure' icon='md-home' />
      },
      {
        content: <TabNewtonAdapter title='Cordova Adapted' useNewtonAdapter="1" />,
        tab: <Tab key="2" label='Cordova Adapted' icon='md-home' />
      }
    ];
  }

  render() {
    return (
      <Tabbar
        index={this.state.index}
        onPreChange={(event) =>
          {
            if (event.index != this.state.index) {
              this.setState({index: event.index});
            }
          }
        }
        renderTabs={this.renderTabs}
      />
    );
  }
}

export default App