import React, { Component } from "react";
import { connect } from "react-redux";
import { PropTypes  } from "prop-types";


import { NAV_BRAND } from "./strings";
import Navigation from "../../components/Navigation";
import Tab from "../../components/Tab";
import {
    Container,
    Row,
    Col,
    Table
} from "reactstrap";

import { toProperCase } from "../../services/helpers";

import { getOrders, removeOrderItem } from "./actions"

import { getAllOrders, deleteOrder } from '../../services/api'


import Icon from 'react-icons-kit';
import { trash } from 'react-icons-kit/fa/trash';

import "./styles.css";

class OrderList extends Component {
 
    componentDidMount() {
        getAllOrders().then(response => {
            this.props.getOrders(response);
        })
    }

    renderRow = props => (
        <tr>
            <td>
                {props.order.id}
            </td>
            <td>
                <a href={`https://www.google.com/maps/?q=${props.order.current_location_name}`}
                    target="_blank">
                    {props.order.current_location_name}
                </a>
            </td>
            <td>
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
            <td>{ toProperCase(props.order.payment_option) || '-' }</td>
            <td>{ toProperCase(props.order.direction_option) || '-' }</td>
            <td>{ toProperCase(props.order.status) }</td>
            <td>
                <button
                    value
                    className="btn btn-danger"
                    onClick={(e) => {
                        if(window.confirm(`Are you sure you want to delete order #${props.order.id}? This can't be undone.`)) {
                            deleteOrder(props.order.id).then(() => {
                                this.props.removeOrderItem(props.order.id);
                            });
                        } else {
                            return false;
                        }
                    }}
                    ><Icon icon={trash} /></button>
            </td>
        </tr>
    )

    render() {
        const OrderRow = this.renderRow;

        return (
            <React.Fragment>
                <Navigation brand={NAV_BRAND} />
                <Container fluid>
                    <Row>
                        <Col>
                            <Tab active="orders" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table className="es-table mt20" responsive bordered>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Date &amp; Time</th>
                                        <th>Payment Option</th>
                                        <th>Ride Type</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.orderList.map(order => <OrderRow order={order} key={order.id} /> ) }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}


OrderList.propTypes = {
    orderList: PropTypes.array.isRequired,
    getOrders: PropTypes.func.isRequired,
    removeOrderItem: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    orderList: state.orderList.orders
});

export default connect(mapStateToProps, {
    getOrders,
    removeOrderItem
})(OrderList);
