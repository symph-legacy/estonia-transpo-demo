import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { submitOrder, updateOrder, getOrderById } from "../../../services/api";

import Icon from 'react-icons-kit';
import { dotCircleO } from 'react-icons-kit/fa/dotCircleO';
import { mapMarker } from 'react-icons-kit/fa/mapMarker';

import LocationSearchInput from "../../../components/LocationSearchInput";
import strings from '../../../localisation';

export default class RideOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      name: "",
      payment_option: "Child",
      direction_option: "Roundtrip",
      status: "New",
      from: {
        address: "",
        lat: 0,
        lng: 0
      },
      target: {},
      day_chosen: "",
      day_chosen2: "",
      time_chosen: "",
      time_chosen2: "",
      isButtonLoading: false
    }
  }

  componentDidMount = () => {
    if (this.props.match.params.orderId !== 'new') {
      getOrderById(this.props.match.params.orderId)
        .then(order => {
          if(!order.id) return false;

          this.setState({
            id: order.id,
            name: order.name,
            payment_option: order.payment_option,
            direction_option: order.direction_option,
            status: order.status,
            from: {
              address: order.current_location_name,
              lat: parseFloat(order.current_location_lat),
              lng: parseFloat(order.current_location_lng)
            },
            target: {
              address: order.target_location_name,
              lat: parseFloat(order.target_location_lat),
              lng: parseFloat(order.target_location_lng)
            },
            day_chosen: order.day_chosen,
            day_chosen2: order.day_chosen2,
            time_chosen: order.time_chosen,
            time_chosen2: order.time_chosen2
          });
        });
    }
  }
  

  onSubmit = () => {
    this.setState({
      isButtonLoading: !this.state.isButtonLoading
    });

    let params = {
      "roundtrip": false,
      "name": this.state.name,
      "status": this.state.status,
      "payment_option": this.state.payment_option,
      "direction_option": this.state.direction_option,
      "current_location_name": this.state.from.address,
      "current_location_lat": `${this.state.from.lat}`,
      "current_location_lng": `${this.state.from.lng}`,
      "target_location_name": this.state.target.address,
      "target_location_lat": `${this.state.target.lat}`,
      "target_location_lng": `${this.state.target.lng}`,
      "day_chosen": this.state.day_chosen,
      "time_chosen": this.state.time_chosen,
      "day_chosen2": this.state.day_chosen2,
      "time_chosen2": this.state.time_chosen2
    }

    if(this.state.id) params["id"] = this.state.id;
    if (params['direction_option'] !== "Roundtrip") {
      delete params["day_chosen2"]
      delete params["time_chosen2"]
    }

    let func = (this.state.id) ? updateOrder: submitOrder;
    func(params).then(response => {
      this.setState({
        isButtonLoading: !this.state.isButtonLoading
      }, () => {
        if (response.id) {
          this.props.history.push(`/admin/ride_orders#${(this.state.id) ? 'updated' : 'created'}`);
        } else {
          alert("Something went wrong. Please fill in all fields.");
        }
      });
    });
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col md="6">
            <form>
              <div className="form-group">
                <label>{strings.name}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter name"
                  onChange={e => this.setState({name: e.target.value})}
                  value={this.state.name} />
              </div>

              <div className="form-group">
                <label>{strings.from}</label>
                <LocationSearchInput
                  placeholder="From location"
                  propsDispatch={from => {
                    this.setState({ from });
                  }}
                  renderRoute={() => false}
                  defaultAddress={this.state.from.address}
                  icon={props => <Icon icon={dotCircleO} />} />
              </div>

              <div className="form-group">
                <label>{strings.to}</label>
                <LocationSearchInput
                  placeholder="Target location"
                  propsDispatch={target => {
                    this.setState({ target });
                  }}
                  renderRoute={() => false}
                  defaultAddress={(this.state.target.address) ? this.state.target.address : ''}
                  icon={props => <Icon icon={mapMarker} />} />
              </div>

              <div className="form-group">
                <label>{strings.paymentOption}</label>
                <select
                  name="payment_option"
                  value={this.state.payment_option}
                  onChange={e => this.setState({ payment_option: e.target.value })}
                  className="form-control">

                  <option value="Child">{strings.child}</option>
                  <option value="Subsidised">{strings.subsidised}</option>
                  <option value="Regular">{strings.regular}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{strings.status}</label>
                <select
                  name="status"
                  value={this.state.status}
                  className="form-control"
                  onChange={e => this.setState({ status: e.target.value })}>
                  <option value="New">{strings.new}</option>
                  <option value="Directed">{strings.directed}</option>
                </select>
              </div>

              <div className="form-group">
                <label>Direction</label>
                <select
                  name="direction_option"
                  className="form-control"
                  value={this.state.direction_option}
                  onChange={e => this.setState({ direction_option: e.target.value })}>
                  <option value="Roundtrip">{strings.roundTrip}</option>
                  <option value="Oneway">{strings.oneWay}</option>
                </select>
              </div>

              <Row>
                <Col>
                  <div className="form-group">
                    <label>Day</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter date (DD.MM.YYYY)"
                      value={this.state.day_chosen}
                      onChange={e => this.setState({ day_chosen: e.target.value })} />
                  </div>

                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter time (HH.mm)"
                      value={this.state.time_chosen}
                      onChange={e => this.setState({ time_chosen: e.target.value })} />
                  </div>
                </Col>
                {(this.state.direction_option === "Roundtrip") && (
                  <Col>
                    <div className="form-group">
                      <label>Day</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter date (DD.MM.YYYY)"
                        value={this.state.day_chosen2}
                        onChange={e => this.setState({ day_chosen2: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter time (HH.mm)"
                        value={this.state.time_chosen2}
                        onChange={e => this.setState({ time_chosen2: e.target.value })} />
                    </div>
                  </Col>
                )}
              </Row>

              <button
                type="button"
                className="mt20 btn btn-primary"
                disabled={this.state.isButtonLoading}
                onClick={this.onSubmit}>
                {(this.state.isButtonLoading ? 'Saving...' : 'Save Ride Order')}
              </button>
            </form>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}