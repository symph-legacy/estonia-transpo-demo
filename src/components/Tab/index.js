import React, { Component } from 'react';
import {
    Nav,
    NavItem
} from "reactstrap";


import { Link } from "react-router-dom"
import strings from "../../localisation";
import Icon from 'react-icons-kit';
import { signOut } from 'react-icons-kit/fa/signOut';


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
            <NavItem className="ml-auto">
                <a className="nav-link d-flex" href="/logout">
                    <Icon className="mr5" icon={signOut} />
                    {strings.logout}
                </a>
            </NavItem>
        </Nav>
    )
  }
}

export default Tab;