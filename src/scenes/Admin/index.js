import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  Input,
  Nav,
  NavItem
} from 'reactstrap';
import { NavLink, Route } from 'react-router-dom';
import Icon from 'react-icons-kit';
import { search } from 'react-icons-kit/fa/search';

const Search = () => (
  <InputGroup>
    <InputGroupAddon addonType="prepend">
      <div className="input-group-text">
        <Icon icon={search} />
      </div>
    </InputGroupAddon>
    <Input placeholder="Search in database..." />
  </InputGroup>
);

const RideOrders = ({ match }) => (
  <div class="d-flex mb-3">
    <div class="p-2">0 items</div>
    <div class="p-2">Sorted by Name</div>
    <div class="ml-auto p-2">
      <NavLink to={`${match.url}/new`} className="btn btn-sm btn-primary">New Order</NavLink>
    </div>
  </div>
);

const RideOrder = ({ match }) => (
  <form>
    <div class="form-group">
      <label for="name">Name</label>
      <input type="text" class="form-control" id="name" placeholder="Enter name" />
    </div>
    <div class="form-group">
      <label for="time">Time</label>
      <input type="text" class="form-control" id="time" placeholder="Enter time" />
    </div>
    <div class="form-group">
      <label for="place">Place</label>
      <input type="text" class="form-control" id="place" placeholder="Enter place" />
    </div>
    <div class="form-group form-check">
      <input type="checkbox" class="form-check-input" id="roundtrip" />
      <label class="form-check-label" for="roundtrip">Round trip</label>
    </div>
    <div class="form-group">
      <label for="status">Status</label>
      <select name="status" id="status" className="form-control">
        <option value="new">New</option>
        <option value="directed">Directed</option>
      </select>
    </div>
    <button type="submit" class="btn btn-primary">Submit Ride Order</button>
  </form>
);

const Issue = ({ match }) => (
  <form>
    <div class="form-group">
      <label for="exampleInputEmail1">Email address</label>
      <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
      <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
    </div>
    <div class="form-group">
      <label for="exampleInputPassword1">Password</label>
      <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
    </div>
    <div class="form-group form-check">
      <input type="checkbox" class="form-check-input" id="exampleCheck1" />
      <label class="form-check-label" for="exampleCheck1">Check me out</label>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
);

const Issues = ({ match }) => (
  <div class="d-flex mb-3">
    <div class="p-2">0 items</div>    <div class="p-2">Sorted by Name</div>
    <div class="ml-auto p-2">
      <NavLink to={`${match.url}/new`} className="btn btn-sm btn-primary">New Issue</NavLink>
    </div>
  </div>
);

class Admin extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h1>Our Municipality</h1>
          </Col>
          <Col>
            <Search />
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
            <Route path={`${this.props.match.url}/ride_orders`} component={RideOrders} />
            <Route path={`${this.props.match.url}/ride_orders/:orderId`} component={RideOrder} />
            <Route path={`${this.props.match.url}/issues`} component={Issues} />
            <Route path={`${this.props.match.url}/issues/:orderId`} component={Issue} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Admin;
