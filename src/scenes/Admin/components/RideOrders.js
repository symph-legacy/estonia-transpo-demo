import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class RideOrders extends Component {
  render() {
    return (
      <div className="d-flex mb-3">
        <div className="p-2">0 items</div>
        <div className="p-2">Sorted by Name</div>
        <div className="ml-auto p-2">
          <NavLink to={`${this.props.match.url}/new`} className="btn btn-sm btn-primary">New Order</NavLink>
        </div>
      </div>
    );
  }
}