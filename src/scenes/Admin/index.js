import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  Input,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import Icon from 'react-icons-kit';
import { search } from 'react-icons-kit/fa/search';

const Search = () => (
  <div>
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <div className="input-group-text">
          <Icon icon={search} />
        </div>
      </InputGroupAddon>
      <Input placeholder="Search in database..." />
    </InputGroup>
  </div>
);

class Admin extends Component {
    constructor(props) {
      super(props);
      this.toggle = this.toggle.bind(this);
      this.state = {
        dropdownOpen: false
      };
    }

    toggle() {
      this.setState({
        dropdownOpen: !this.state.dropdownOpen
      });
    }
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
                    <NavLink href="#">Ride Orders</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#">Issues</NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
          </Container>
        );
    }
}

export default Admin;
