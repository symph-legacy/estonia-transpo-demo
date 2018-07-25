import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import Welcome from './scenes/Welcome';
import registerServiceWorker from './registerServiceWorker';

import store, { history } from "./store";

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" render={() => (
                        <Welcome />
                    )} />
                </Switch>
            </BrowserRouter>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
