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

import { translateData } from "../../services/helpers";
import { getOrders, removeOrderItem } from "./actions"
import { getAllOrders, deleteOrder } from '../../services/api'

import Icon from 'react-icons-kit';
import { trash } from 'react-icons-kit/fa/trash';

import strings from "../../localisation";

import "./styles.css";

class OrderList extends Component {
 
    componentDidMount() {
        getAllOrders().then(response => {
            this.props.getOrders(response);
        })
    }

    renderRow = props => (
        <tr>
            <td data-xs-label="ID #">
                {props.order.id}
            </td>
            <td data-xs-label={strings.from}>
                <a href={`https://www.google.com/maps/?q=${props.order.current_location_name}`}
                    target="_blank">
                    {props.order.current_location_name}
                </a>
            </td>
            <td data-xs-label={strings.to}>
                <a href={`https://www.google.com/maps/?q=${props.order.target_location_name}`}
                    target="_blank">
                    {props.order.target_location_name}
                </a>
            </td>
            
            <td data-xs-label={strings.from}>
                {
                    props.order.direction_option === "Roundtrip" ?
                        (<a href={`https://www.google.com/maps/?q=${props.order.second_current_location_name}`}
                            target="_blank">
                            {props.order.second_current_location_name}
                        </a>)
                        : "-"
                }
            </td>
            <td data-xs-label={strings.to}>
                {
                    props.order.direction_option === "Roundtrip" ?
                        (<a href={`https://www.google.com/maps/?q=${props.order.second_target_location_name}`}
                            target="_blank">
                            {props.order.second_target_location_name}
                        </a>)
                        : "-"
                }
            </td>

            <td data-xs-label={strings.dateTime}>
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
            <td data-xs-label={strings.paymentOption}>{translateData(props.order.payment_option) || '-' }</td>
            <td data-xs-label={strings.rideType}>{translateData(props.order.direction_option) || '-' }</td>
            <td data-xs-label={strings.status}>{translateData(props.order.status) }</td>
            <td>
                <button
                    value
                    className="btn btn-danger"
                    onClick={(e) => {
                        if(window.confirm(strings.deleteOrder)) {
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
                            <Table className="es-table mt20 es-table-responsive" responsive bordered>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>{strings.from}</th>
                                        <th>{strings.to}</th>
                                        <th>{strings.from}</th>
                                        <th>{strings.to}</th>
                                        <th>{strings.dateTime}</th>
                                        <th>{strings.paymentOption}</th>
                                        <th>{strings.rideType}</th>
                                        <th>{strings.status}</th>
                                        <th>{strings.action}</th>
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
