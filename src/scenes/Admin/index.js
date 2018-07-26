import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem
} from 'reactstrap';
import { NavLink, Route, Redirect } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import RideOrders from './components/RideOrders';
import Issues from './components/Issues';
import RideOrder from './components/RideOrder';
import Issue from './components/Issue';

class Admin extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h1>Our Municipality</h1>
          </Col>
          <Col>
            <SearchBar />
          </Col>
        </Row>
        <Row>
          <Col>
            <Nav tabs>
              <NavItem>
                <NavLink className="nav-link" to={`${this.props.match.url}/ride_orders`}>Ride Orders</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" to={`${this.props.match.url}/issues`}>Issues</NavLink>
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
            <Route path={`${this.props.match.url}/ride_orders/:orderId`} component={RideOrder} />
            <Route path={`${this.props.match.url}/issues/:orderId`} component={Issue} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Admin;
