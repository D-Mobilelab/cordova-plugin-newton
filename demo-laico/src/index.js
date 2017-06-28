import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import {ready} from 'onsenui';

// Onsen UI Styling and Icons
import 'onsenui/css/onsen-css-components.css';
import 'onsenui/css/onsenui.css';

ready(() => 
  ReactDOM.render(<App />, document.getElementById('root'))
);

registerServiceWorker();
