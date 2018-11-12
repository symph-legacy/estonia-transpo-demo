import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { NavLink } from 'react-router-dom';

import strings from '../../../../localisation';
import AdminTable from '../../../../components/AdminTable';
import { getAllUsers, deleteUser } from '../../../../services/api';

class UserList extends Component {
  state = {
    users: []
  }
  static propTypes = {
    match: PropTypes.object.isRequired
  }

  componentDidMount() {
    getAllUsers().then(users => {
      this.setState({
        users
      })
    })
  }

  onClickDelete = id => {
    if(window.confirm('Are you sure you want to delete this user? This can\'t be undone.')) {
      deleteUser(id).then(() => {
        this.setState(prevState => ({
          users: prevState.users.filter(u => u.id !== id)
        }));
      })
    }
  }

  flattenRow = list => list.map(u => 
    ({
      'id': u.id,
      'Username': u.username,
      'First Name': u.first_name,
      'Last Name': u.last_name,
      'Email': u.email,
      'Role': u.profile ? u.profile.role : ''
    })
  )

  render() {
    const { users } = this.state;
    const { match } = this.props;

    return (
      <Row>
        <Col sm="12">
          <div className="d-flex mb-3">
            <div className="p-2">
              {users.length} {strings.items} &bull; {strings.sortedByName}
            </div>
            <div className="ml-auto p-2">
              <NavLink to={`${this.props.match.url}/new`} className="button-primary">
                {strings.newUser}
              </NavLink>
            </div>
          </div>
        </Col>
        <Col sm="12">
          <AdminTable
            match={match}
            headerColumns={[
              '', 'Username', 'First Name', 'Last Name', 'Email', 'Role'
            ]}
            dataRow={this.flattenRow(users)}
            onDeleteRow={this.onClickDelete}
          />
        </Col>
      </Row>
    )
  }
}

export default UserList;