import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem
} from 'reactstrap';

import { Link } from 'react-router-dom';
import Icon from 'react-icons-kit';
import { search } from 'react-icons-kit/fa/search';

import React, { Component } from 'react'

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <Navbar className="es-nav" light expand="md">
        <div className="d-flex align-items-center">
          <NavbarToggler onClick={this.toggle} />
          <Link className="navbar-brand" to="/order">{this.props.brand}</Link>
        </div>
        <button type="button" className="es-search-btn">
          <Icon icon={search} />
        </button>
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Link className="nav-link" to="/">Welcome</Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" to="/order">Order</Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" to="/issue">Issue</Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" to="/orders">History</Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}

export default Navigation