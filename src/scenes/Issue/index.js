import React, { Component } from 'react';
import moment from 'moment';
import Card from './components/Card';
import Navigation from '../../components/Navigation';
import './Issue.css';

export default class Issue extends Component {
  state = {
    currentDate: moment().format('YYYY-MM-DD'),
    issues: [],
    newIssue: false
  }
  componentDidMount() {
    document.title = 'Report an Issue';
    fetch('/api/issues/')
    .then(response => response.json())
    .then(issues => {
      this.setState({
        issues: this.state.issues.concat(issues)
      });
    });
  }
  openNewIssueForm = (e) => {
    this.setState({
      newIssue: true
    });
  }
  closeNewIssueForm = (e) => {
    this.setState({
      newIssue: false
    });
  }
  render() {
    return (
      <div>
        <Navigation brand="Issue" />
        <div className="issues-list m-3">
          <h1>Issue {this.state.currentDate}</h1>
          {this.state.issues.map(issue => (
            <Card key={issue.id} issue={issue} />
          ))}
          {
            this.state.newIssue
            ? <Card editable closeNewIssueForm={this.closeNewIssueForm} />
            : (
              <div className="attachments mt-3 p-3">
                <button className="rounded-circle mx-3 attachment-plus text-white" onClick={this.openNewIssueForm}>+</button>
                <span>Add new aspect</span>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}