import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Alert, Table, Row, Col } from 'reactstrap';

import { Icon } from 'react-icons-kit';
import { pencil } from 'react-icons-kit/fa/pencil';
import { trash } from 'react-icons-kit/fa/trash';

import { Link } from 'react-router-dom';

import { getAllOrders, deleteOrder } from "../../../services/api";
export default class RideOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderList: [],
      showAlert: false,
      message: ''
    }
  }

  componentDidMount() {
    if(this.props.location.hash === "#updated") {
      this.setState({
        message: "Successfully updated ride order.",
        showAlert: true
      });
    }

    if(this.props.location.hash === "#created") {
      this.setState({
        message: "Successfully created a new ride order.",
        showAlert: true
      });
    }

    getAllOrders().then(orderList => {
      this.setState({ orderList });
    })
  }

  renderOrderRow = props => (
    <tr>
      <td className="d-flex">
        <div className="rounded-circle bg-green p-1 mr-2">
          <Link to={`${this.props.match.url}/${props.order.id}`} className="text-white">
            <Icon icon={pencil} />
          </Link>
        </div>
        <button className="rounded-circle bg-red p-1 text-white"
                onClick={(e) => {
                  if (window.confirm(`Are you sure you want to delete order #${props.order.id}? This can't be undone.`)) {
                    deleteOrder(props.order.id).then(() => {
                      let orderList = this.state.orderList.filter(order => order.id !== props.order.id);
                      this.setState({ orderList });
                    });
                  } else {
                    return false;
                  }
                }}>
          <Icon icon={trash} />
        </button>
      </td>
      <td>{props.order.name}</td>
      <td>
        <a href={`https://www.google.com/maps/?q=${props.order.current_location_name}`}
          target="_blank">
          {props.order.current_location_name}
        </a>
        <hr />
        <a href={`https://www.google.com/maps/?q=${props.order.target_location_name}`}
          target="_blank">
          {props.order.target_location_name}
        </a>
      </td>
      <td>
        <p className='mb0'>{props.order.day_chosen}</p>
        <p className='mb0'>{props.order.time_chosen}</p>

        {(props.order.direction_option === "ROUNDTRIP") && (
          <React.Fragment>
            <hr />
            <p className='mb0'>{props.order.day_chosen2}</p>
            <p className='mb0'>{props.order.time_chosen2}</p>
          </React.Fragment>
        )}
      </td>
      <td>{props.order.direction_option}</td>
      <td>{props.order.status}</td>
    </tr>
  )

  render() {
    const RenderRow = this.renderOrderRow;

    return (
      <React.Fragment>
        {
          (this.state.showAlert) && (<Row>
            <Col md="12">
              <Alert color="success">{this.state.message}</Alert>
            </Col>
          </Row>)
        }
        <div className="d-flex mb-3">
          <div className="p-2">0 items</div>
          <div className="p-2">Sorted by Name</div>
          <div className="ml-auto p-2">
            <NavLink to={`${this.props.match.url}/new`} className="btn btn-sm btn-primary">New Order</NavLink>
          </div>
        </div>
        <Row>
          <Col>
            <Table borderless>
              <thead className="bg-white border-top border-bottom text-uppercase">
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Place</th>
                  <th>Date and Time</th>
                  <th>One Way / Roundtrip</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {this.state.orderList.map(order => <RenderRow order={order} key={order.id} />)}
              </tbody>
            </Table>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}