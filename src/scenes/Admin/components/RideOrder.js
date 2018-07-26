import React, { Component } from 'react';

export default class RideOrder extends Component {
  render() {
    return (
      <form>
        <div className="form-group">
          <label for="name">Name</label>
          <input type="text" className="form-control" id="name" placeholder="Enter name" />
        </div>
        <div className="form-group">
          <label for="time">Time</label>
          <input type="text" className="form-control" id="time" placeholder="Enter time" />
        </div>
        <div className="form-group">
          <label for="current_location">Current Location</label>
          <input type="text" className="form-control" id="current_location" placeholder="Enter current location" />
        </div>
        <div className="form-group">
          <label for="target_location">Target Location</label>
          <input type="text" className="form-control" id="target_location" placeholder="Enter target location" />
        </div>
        <div className="form-group form-check">
          <input type="checkbox" className="form-check-input" id="roundtrip" />
          <label className="form-check-label" for="roundtrip">Roundtrip</label>
        </div>
        <div className="form-group">
          <label for="status">Status</label>
          <select name="status" id="status" className="form-control">
            <option value="new">New</option>
            <option value="directed">Directed</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Submit Ride Order</button>
      </form>
    );
  }
}