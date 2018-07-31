import React, { Component } from 'react';
import {
    Nav,
    NavItem
} from "reactstrap";


import { Link } from "react-router-dom"


class Tab extends Component {
  render() {
    return (
        <Nav tabs className="mt20">
            <NavItem>
                <Link className={`nav-link ${this.props.active === "orders" ? "active" : ""}`} to="/orders">Orders</Link>
            </NavItem>
            <NavItem>
                <Link className={`nav-link ${this.props.active === "issues" ? "active" : ""}`} to="/issues">Issues</Link>
            </NavItem>
        </Nav>
    )
  }
}

export default Tab;