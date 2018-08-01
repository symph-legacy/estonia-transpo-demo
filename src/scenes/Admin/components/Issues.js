import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Table, Row, Col } from 'reactstrap';
import { Icon } from 'react-icons-kit';
import { pencil } from 'react-icons-kit/fa/pencil';
import { trash } from 'react-icons-kit/fa/trash';

export default class Issues extends Component {
  state = {
    issues: []
  }
  componentDidMount() {
    fetch('/api/issues/', {
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
  handleIssue = (id, e) => {
    console.log(id);
  }
  render() {
    return (
      <Row>
        <Col>
          <div className="d-flex mb-3">
            <div className="p-2">{this.state.issues.length} items &bull; Sorted by Name</div>
            <div className="ml-auto p-2">
              <NavLink to={`${this.props.match.url}/new`} className="button-primary">New Issue</NavLink>
            </div>
          </div>
          <Table borderless>
            <thead className="bg-white border-top border-bottom text-uppercase">
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
                  <td className="d-flex">
                    <div className="rounded-circle bg-green p-1 mr-2">
                      <Link to={`${this.props.match.url}/${issue.id}`} className="text-white">
                        <Icon icon={pencil} />
                      </Link>
                    </div>
                    <button onClick={(e) => this.deleteIssue(issue.id, e)} className="rounded-circle bg-red p-1 text-white">
                      <Icon icon={trash} />
                    </button>
                  </td>
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