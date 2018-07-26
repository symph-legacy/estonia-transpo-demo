import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Issue extends Component {
  state = {
    description: '',
    address: '',
    reporter: '',
    status: 'new',
    submitted: false
  }
  handleChange = (e) => {
    let newState = {}
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    let payload = {
      description: this.state.description,
      address: this.state.address,
      reporter: this.state.reporter,
      status: this.state.status
    }
    fetch('http://localhost:8000/api/issues/', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      this.setState({ submitted: true });
    });
  }
  render() {
    return this.state.submitted ? 
      (
        <Redirect to="/admin/issues" />
      ) : (
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="description">Issue</label>
            <input type="text" className="form-control" id="description" name="description" value={this.state.description} onChange={this.handleChange} placeholder="Enter issue description" />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input type="text" className="form-control" id="address" name="address" value={this.state.address} onChange={this.handleChange} placeholder="Enter issue address" />
          </div>
          <div className="form-group">
            <label htmlFor="reporter">Reporter</label>
            <input type="text" className="form-control" id="reporter" name="reporter" value={this.state.reporter} onChange={this.handleChange} placeholder="Enter issue reporter" />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select name="status" id="status" className="form-control" value={this.state.status} onChange={this.handleChange}>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Submit Issue</button>
        </form>
      );
  }
}