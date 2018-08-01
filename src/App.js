import React, { Component } from 'react';
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'

import Welcome from "./scenes/Welcome";
import Order from "./scenes/Order";
import OrderList from "./scenes/OrderList";
import Issue from "./scenes/Issue";
import IssueList from "./scenes/IssueList";

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
              <Route exact path="/order" component={Order} />
              <Route exact path="/orders" component={OrderList} />
              <Route exact path="/issue" component={Issue} />
              <Route exact path="/issues" component={IssueList} />
            </Switch>
          </BrowserRouter>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
