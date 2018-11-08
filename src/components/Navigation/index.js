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

import strings from "../../localisation";

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
              <Link className="nav-link" to="/">{strings.welcome}</Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" to="/order">{strings.order}</Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" to="/issue">{strings.issue}</Link>
            </NavItem>
            <NavItem>
              <a className="nav-link" href="/orders">{strings.history}</a>
            </NavItem>
            <NavItem className="ml15">
              <a className="nav-link" href="/logout">{strings.logout}</a>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}

export default Navigation