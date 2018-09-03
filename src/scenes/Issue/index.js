import React, { Component } from 'react';
import moment from 'moment';
import Card from './components/Card';
import Navigation from '../../components/Navigation';
import './Issue.css';

import strings from "../../localisation";

export default class Issue extends Component {
  state = {
    currentDate: moment().format('DD.MM.YYYY'),
    issues: [],
    newIssue: false
  }
  componentDidMount() {
    document.title = strings.reportAnIssue;
    fetch('/api/issues/')
    .then(response => response.json())
    .then(issues => {
      this.setState({
        issues: this.state.issues.concat(issues)
      });
    });
  }
  addIssueToState = issue => {
    console.log(issue);
    this.setState({
      newIssue: false,
      issues: [issue, ...this.state.issues]
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
        <Navigation brand={strings.issue} />
        <div className="issues-list m-3">
          <h1>{strings.issue} {this.state.currentDate}</h1>
          {this.state.issues.map(issue => (
            <Card key={issue.id} issue={issue} />
          ))}
          {
            this.state.newIssue
            ? <Card editable closeNewIssueForm={this.closeNewIssueForm} addIssueToState={this.addIssueToState} />
            : (
              <div className="attachments mt-3 p-3">
                <button className="rounded-circle mx-3 attachment-plus text-white" onClick={this.openNewIssueForm}>+</button>
                  <span>{strings.addNewAspect}</span>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}