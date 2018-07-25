import React, { Component } from 'react';
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'

import Welcome from "./scenes/Welcome";
import store, { history } from "./store";
import Admin from './scenes/Admin';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Welcome} />
              <Route path="/admin" component={Admin} />
            </Switch>
          </BrowserRouter>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
