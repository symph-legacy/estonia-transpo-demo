import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Table, Row, Col } from 'reactstrap';

export default class Issues extends Component {
  state = {
    issues: []
  }
  componentDidMount() {
    fetch('http://localhost:8000/api/issues/', {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
    .then(response => response.json())
    .then(data => {
      let newState = {};
      newState.issues = this.state.issues.concat(data);
      this.setState(newState);
    });
  }
  render() {
    return (
      <Row>
        <Col>
          <div className="d-flex mb-3">
            <div className="p-2">{this.state.issues.length} items</div>
            <div className="p-2">Sorted by Name</div>
            <div className="ml-auto p-2">
              <NavLink to={`${this.props.match.url}/new`} className="btn btn-sm btn-primary">New Issue</NavLink>
            </div>
          </div>
          <Table>
            <thead>
              <tr>
                <th></th>
                <th>Issue</th>
                <th>Address</th>
                <th>Reporter</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {this.state.issues.map(issue => (
                <tr key={issue.id}>
                  <td></td>
                  <td>{issue.description}</td>
                  <td>{issue.address}</td>
                  <td>{issue.reporter}</td>
                  <td>{issue.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    );
  }
}