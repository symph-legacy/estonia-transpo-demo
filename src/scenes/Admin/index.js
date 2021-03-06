import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem
} from 'reactstrap';
import { Icon } from 'react-icons-kit';
import { home } from 'react-icons-kit/fa/home';
import { copy } from 'react-icons-kit/fa/copy';
import { users } from 'react-icons-kit/fa/users';
import { signOut } from 'react-icons-kit/fa/signOut';
import { NavLink, Route, Redirect } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import RideOrders from './components/RideOrders';
import Issues from './components/Issues';
import UserList from './components/UserList';
import RideOrder from './components/RideOrder';
import Issue from './components/Issue';
import './Admin.css';
import logo from './logo.png';

import strings from "../../localisation";
import UserForm from './components/UserForm';

class Admin extends Component {
  componentDidMount() {
    document.title = 'Back Office';
  }
  render() {
    return (
      <div id="Admin">
        <Container fluid>
          <Row className="border-bottom">
            <Col>
              <div className="d-flex align-items-center my-3" id="header">
                <div className="d-flex align-items-center bg-white p-2">
                  <div className="mr-3">
                    <img src={logo} alt={strings.ourMunicipality} className="img-fluid" />
                  </div>
                  <div>
                    <h1>{strings.ourMunicipality}</h1>
                  </div>
                </div>
                <div className="ml-auto">
                  <SearchBar />
                </div>
              </div>
            </Col>
          </Row>
          <Row id="navigation" className="mb-3">
            <Col>
              <Nav tabs>
                <NavItem>
                  <NavLink className="nav-link d-flex" to={`${this.props.match.url}/ride_orders`}>
                    <Icon className="mr-3" icon={home} />
                    {strings.rideOrders}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link d-flex" to={`${this.props.match.url}/issues`}>
                    <Icon className="mr-3" icon={copy} />
                    {strings.issues}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link d-flex" to={`${this.props.match.url}/users`}>
                    <Icon className="mr-3" icon={users} />
                    {strings.users}
                  </NavLink>
                </NavItem>
                <NavItem className="ml-auto">
                  <a className="nav-link d-flex" href="/logout">
                    <Icon className="mr5" icon={signOut} />
                    {strings.logout}
                  </a>
                </NavItem>
              </Nav>
            </Col>
          </Row>
          <Row>
            <Col>
              <Route exact path="/admin" render={() => (
                <Redirect to={`${this.props.match.url}/ride_orders`} />
              )} />
              <Route exact path={`${this.props.match.url}/ride_orders`} component={RideOrders} />
              <Route exact path={`${this.props.match.url}/issues`} component={Issues} />
              <Route exact path={`${this.props.match.url}/users`} component={UserList} />

              <Route path={`${this.props.match.url}/ride_orders/:orderId`} component={RideOrder} />
              <Route path={`${this.props.match.url}/issues/:issueId`} component={Issue} />
              <Route path={`${this.props.match.url}/users/:userId`} component={UserForm} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Admin;
