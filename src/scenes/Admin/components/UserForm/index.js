import React, { Component } from 'react';
import { Row, Col, Alert } from 'reactstrap';
import { cloneDeep } from 'lodash';

import strings from '../../../../localisation';
import { saveUser, getUserById } from '../../../../services/api';

const initialState = {
  id: '',
  username: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  email: '',
  role: 'Transportation Officer',
  profile: null,
  alertType: 'danger',
  alertMessages: []
};

class UserForm extends Component {
  state = cloneDeep(initialState);

  componentDidMount() {
    const { match } = this.props;
    getUserById(match.params.userId).then(data => {
      if(data.id) {
        this.setState({
          id: data.id,
          username: data.username,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          profile: data.profile,
          role: data.profile ? data.profile.role : initialState.role
        });
      }
    });
  }

  handleSubmit = evt => {
    evt.preventDefault();

    const {
      id,
      username,
      password,
      confirmPassword,
      firstName,
      lastName,
      email,
      role,
      profile
    } = this.state;

    this.setState({
      alertType: 'danger',
      alertMessages: []
    });

    if (password.length !== 0 && password !== confirmPassword) {
      this.setState({
        alertType: 'danger',
        alertMessages: [
          {
            strong: 'Oops!',
            message: 'Password does not match the confirm password.'
          }
        ]
      });

      return false;
    }

    let params = {
      username,
      email,
      first_name: firstName,
      last_name: lastName,
      profile: {
        role
      }
    }

    if (password.length !== 0) params.password = password
    if (id.length !== 0) {
      // use for updating existing user
      params.id = id;
      params.profile.role = role;
    }

    saveUser(params).then(res => {
      const json = res.json();
      if (res.status === 201 || res.status === 200) {
        this.setState({
          ...(id.length ? cloneDeep(initialState) : {}),
          alertType: 'success',
          alertMessages: [
            {
              strong: 'Success!',
              message: 'User saved successfully.'
            }
          ]
        });
      } else {
        return json;
      }
    }).then(err => {
      if(err) {
        this.setState({
          alertType: 'danger',
          alertMessages: Object.keys(err).map(k => (
            { 'strong': `Oops! for '${k}', `, 'message': err[k] }
          ))
        })
      }
    });
  }

  onChangeValue = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  }

  render() {
    const {
      username,
      password,
      confirmPassword,
      firstName,
      lastName,
      email,
      role,
      alertType,
      alertMessages
    } = this.state;

    return (
      <Row>
        <Col lg="6">
          { alertMessages.length !== 0 && alertMessages.map(err => (
              <Alert color={alertType} key={err}>
              <strong>{err.strong}</strong>&nbsp;
                {err.message}
              </Alert>
            ))
          }
          <form onSubmit={this.handleSubmit} method="POST">
            <div className="form-group">
              <label htmlFor="username">
                {strings.username}
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                required
                value={username}
                onChange={this.onChangeValue}
                autoFocus
              />
            </div>
            <Row>
              <Col lg="6">
                <div className="form-group">
                  <label htmlFor="password">
                    {strings.password}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={password}
                    onChange={this.onChangeValue}
                  />
                </div>
              </Col>
              <Col lg="6">
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  {strings.confirmPassword}
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  required={password.length !== 0}
                  disabled={password.length === 0}
                  value={confirmPassword}
                  onChange={this.onChangeValue}
                />
              </div>
            </Col>
            </Row>
            <div className="form-group">
              <label htmlFor="email">
                {strings.emailAddress}
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                required
                value={email}
                onChange={this.onChangeValue}
              />
            </div>
            <div className="form-group">
              <label htmlFor="firstName">
                {strings.firstName}
              </label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                required
                value={firstName}
                onChange={this.onChangeValue}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">
                {strings.lastName}
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                required
                value={lastName}
                onChange={this.onChangeValue}
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">
                {strings.role}
              </label>
              <select
                className="form-control"
                id="role"
                name="role"
                required
                value={role}
                onChange={this.onChangeValue}
              >
                <option value={'Transportation Officer'}>
                  {'Transportation Officer'}
                </option>
                <option value={'Financial Controller'}>
                  {'Financial Controller'}
                </option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              {strings.saveUser}
            </button>
          </form>
        </Col>
      </Row>
    );
  }
}

export default UserForm;
