import React, { Component } from 'react';
import {
    Nav,
    NavItem
} from "reactstrap";


import { Link } from "react-router-dom"
import strings from "../../localisation";


class Tab extends Component {
  render() {
    return (
        <Nav tabs className="mt20">
            <NavItem>
                <Link className={`nav-link ${this.props.active === "orders" ? "active" : ""}`} to="/orders">{strings.orders}</Link>
            </NavItem>
            <NavItem>
                <Link className={`nav-link ${this.props.active === "issues" ? "active" : ""}`} to="/issues">{strings.issues}</Link>
            </NavItem>
        </Nav>
    )
  }
}

export default Tab;