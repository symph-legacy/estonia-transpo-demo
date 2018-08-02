import React, { Component } from 'react';

export default class Card extends Component {
  state = {
    description: '',
    address: '',
    file: null,
    reporter: 'Issue page form',
    status: 'New'
  }
  change = e => {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }
  submit = e => {
    e.preventDefault();
    let form = new FormData();
    form.append('description', this.state.description);
    form.append('address', this.state.address);
    form.append('reporter', this.state.reporter);
    form.append('status', this.state.status);
    form.append('attachments', this.state.file);
    fetch(`/api/issues/`, {
      method: 'post',
      mode: 'cors',
      body: form
    })
    .then(response => response.json())
    .then(issue => {
      console.log(issue);
      this.props.addIssueToState(issue);
    });
  }
  selectFile = e => {
    let file = document.getElementById('attachment');
    file.click();
  }
  fileSelected = e => {
    let file = e.target.files[0];
    let button = e.target.parentNode.firstChild;
    let span = button.nextSibling;
    let reader = new FileReader();
    reader.onload = e => {
      button.style.backgroundImage = `url(${e.target.result})`;
      span.innerHTML = file.name;
      this.setState({
        file: file
      });
    }
    reader.readAsDataURL(file);
  }
  render() {
    let filename = '';
    if(this.props.issue && this.props.issue.attachments) {
      filename = this.props.issue.attachments.split(/[\s/]+/);
      filename = filename[filename.length-1];
    }
    return this.props.editable ? (
      <form className="clearfix" onSubmit={this.submit}>
        <div className="issue p-3 my-3">
            <h2>
              <input type="text" placeholder="Issue description" name="description" onChange={this.change} value={this.state.description} />
            </h2>
            <div className="d-flex">
              <div>Address:</div>
              <div className="ml-2 flex-fill">
                <input type="text" placeholder="Address of the issue" name="address" onChange={this.change} value={this.state.address} />
              </div>
            </div>
          <div className="attachments mt-3 p-3">
            <button type="button" className="rounded-circle mx-3 attachment-plus text-white" onClick={this.selectFile}>+</button>
            <span>Add picture</span>
            <input type="file" name="attachment" id="attachment" className="d-none" onChange={this.fileSelected} />
          </div>
        </div>
        <div className="d-flex flex-row float-right">
          <button type="submit" className="btn btn-link">Send to us</button>
          <button type="button" className="btn btn-link" onClick={this.props.closeNewIssueForm}>Discard</button>
        </div>
      </form>
    ) : (
      <div className="issue p-3 my-3">
        <h2>{this.props.issue.description}</h2>
        <span>Address: {this.props.issue.address}</span>
        <div className="attachments mt-3 p-3">
          <img src={this.props.issue.attachments} alt="Attachment" className="rounded-circle mx-3"/>
          <a href={this.props.issue.attachments}>
            <div className="d-inline-block truncate">{filename}</div>
          </a>
        </div>
      </div>
    )
  }
}