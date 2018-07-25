import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import Welcome from './scenes/Welcome';
import registerServiceWorker from './registerServiceWorker';

import store from "./store";

ReactDOM.render(
    <Provider store={store}>
        <Welcome />
    </Provider>, document.getElementById('root'));
registerServiceWorker();
