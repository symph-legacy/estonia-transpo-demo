import React, { Component } from 'react';
import moment from 'moment';
import './Issue.css';

class Card extends Component {
  state = {
    description: '',
    address: ''
  }
  submit = (e) => {
    console.log(e);
  }
  render() {
    return this.props.editable ? (
      <div className="issue p-3 my-3">
          <h2><input type="text" placeholder="Issue description" name="description" /></h2>
          <div className="d-flex">
            <div>Address:</div>
            <div className="ml-2 flex-fill">
              <input type="text" placeholder="Address of the issue" name="address" />
            </div>
          </div>
        <div className="attachments mt-3 p-3">
          <button className="rounded-circle mx-3 attachment-plus text-white">+</button>
            <span>Add picture</span>
        </div>
        <div className="d-flex flex-row float-right">
          <button className="btn btn-link">Send to us</button>
          <button className="btn btn-link">Discard</button>
        </div>
      </div>
    ) : (
      <div className="issue p-3 my-3">
        <h2>There is a hole near my home</h2>
        <span>Address: Jahu tänav 1-15</span>
        <div className="attachments mt-3 p-3">
          <img src="https://picsum.photos/30/30" alt="Attachment" className="rounded-circle mx-3"/>
          <span>Picture of the hole.jpg</span>
        </div>
      </div>
    )
  }
}

export default class Issue extends Component {
  state = {
    currentDate: moment().format('YYYY-MM-DD'),
    newIssue: false
  }
  componentDidMount() {
    document.title = 'Report an Issue'
  }
  addNewIssue = (e) => {
    this.setState({
      newIssue: true
    });
  }
  render() {
    return (
      <div className="issues-list m-3">
        <h1>Issue {this.state.currentDate}</h1>
        <Card />
        { this.state.newIssue && (
          <Card editable />
        )}
        { !this.state.newIssue && (
          <div className="attachments mt-3 p-3">
            <button className="rounded-circle mx-3 attachment-plus text-white" onClick={this.addNewIssue}>+</button>
            <span>Add new aspect</span>
          </div>
        )}
      </div>
    )
  }
}