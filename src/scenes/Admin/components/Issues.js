import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Table, Row, Col } from 'reactstrap';
import { Icon } from 'react-icons-kit';
import { pencil } from 'react-icons-kit/fa/pencil';
import { trash } from 'react-icons-kit/fa/trash';

import strings from "../../../localisation";

import { translateData } from "../../../services/helpers"

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
  handleDeleteIssue = (id, e) => {
    console.log(id);
    fetch(`/api/issues/${id}`, {
      method: 'delete'
    })
    .then(response => {
      this.setState({
        issues: this.state.issues.filter(issue => issue.id !== id)
      });
    });
  }
  render() {
    return (
      <Row>
        <Col>
          <div className="d-flex mb-3">
            <div className="p-2">{this.state.issues.length} {strings.items} &bull; {strings.sortedByName}</div>
            <div className="ml-auto p-2">
              <NavLink to={`${this.props.match.url}/new`} className="button-primary">{strings.newIssue}</NavLink>
            </div>
          </div>
          <Table borderless>
            <thead className="bg-white border-top border-bottom text-uppercase">
              <tr>
                <th></th>
                <th>{strings.issue}</th>
                <th>{strings.address}</th>
                <th>{strings.reporter}</th>
                <th>{strings.status}</th>
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
                    <button onClick={(e) => this.handleDeleteIssue(issue.id, e)} className="rounded-circle bg-red p-1 text-white">
                      <Icon icon={trash} />
                    </button>
                  </td>
                  <td>{issue.description}</td>
                  <td>{issue.address}</td>
                  <td>{issue.reporter}</td>
                  <td>{translateData(issue.status)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    );
  }
}