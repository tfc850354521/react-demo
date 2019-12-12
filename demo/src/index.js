import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import './assets/js/rem'
import * as serviceWorker from './serviceWorker';
import './assets/css/public-style.css'
import 'antd-mobile/dist/antd-mobile.css';
import './assets/icon/css/font-awesome.min.css'
import 'antd/dist/antd.css'
import './assets/js/axios'
import './assets/js/hint'
import './assets/js/bus'
import './assets/js/webscoket'
import store from './store/index'
import { Provider } from 'react-redux'


ReactDOM.render(<Provider store={ store }><App /></Provider>, document.getElementById('root'));


serviceWorker.unregister();
