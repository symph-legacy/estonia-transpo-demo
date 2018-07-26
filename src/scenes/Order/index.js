import React, { Component } from "react";

import GoogleMapReact from "google-map-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Icon from 'react-icons-kit';
import { dotCircleO } from 'react-icons-kit/fa/dotCircleO';
import { mapMarker } from 'react-icons-kit/fa/mapMarker';

import { NAV_BRAND, BUTTON_GROUP } from "./strings.js";
import { togglePayment } from "./actions";

import LocationSearchInput from "../../components/LocationSearchInput";
import Navigation from "../../components/Navigation";
import CurrentLocation from "./components/CurrentLocation";
import TargetLocation from "./components/TargetLocation";

import { isEmptyObject } from "../../services/helpers";

import {
    changeCurrentLocation,
    changeTargetLocation
} from "./actions"


import {
    Container,
    FormGroup
} from "reactstrap";

import "./styles.css";

class Order extends Component {

    constructor(props) {
        super(props);
        this.state = {
            address: '',
            map: null,
            maps: null,
            mapLoaded: false,
            directionsDisplay: null,
            directionsService: null
        };
    }

    paymentOptionChange = (e) => {
        this.props.togglePayment(e.target.value);
    }

    renderRoute = () => {
        if(!this.state.mapLoaded) return false;

        if (this.state.directionsDisplay != null) {
            this.state.directionsDisplay.setDirections({ routes: [] });
        }

        if (this.props.from &&
            this.props.from.lat &&
            this.props.from.lat &&
            this.props.target &&
            this.props.target.lat &&
            this.props.target.lng ) {

            this.state.directionsService.route({
                origin: `${this.props.from.lat}, ${this.props.from.lng}`,
                destination: `${this.props.target.lat}, ${this.props.target.lng}`,
                waypoints: [],
                optimizeWaypoints: true,
                travelMode: 'DRIVING'
            }, (response, status) => {
                this.state.directionsDisplay.setDirections(response);
                console.log("response", response);
                console.log("status", status);
            });
        }
    }

    renderPaymentButton = () => {
        return BUTTON_GROUP.map((btn, idx) => {
            let cls = `${(this.props.selectedOption === btn.key) ?
                'active' : ''} btn btn-outline-secondary`;

            return (
                <label className={cls} key={btn.key} >
                    <input type="radio"
                        value={btn.key}
                        name="paymentOptions"
                        autoComplete="off"
                        onChange={this.paymentOptionChange }
                        checked={this.props.selectedOption === btn.key} /> {btn.text}
                </label>
            )
        })
    }

    render() {
        return (
            <React.Fragment>
                <Navigation brand={NAV_BRAND} />
                <Container>
                    <form>
                        <div className="btn-group btn-group-toggle es-btn-group mb25" data-toggle="buttons">    
                            { this.renderPaymentButton() }
                        </div>
                    </form>
                
                    <div className="es-map">
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: 'AIzaSyDbESyZ10IaxgVmjcMBDN2WlGzSEu9vzMM' }}
                            onGoogleApiLoaded={({ map, maps }) => {
                                this.setState({
                                    map,
                                    maps,
                                    mapLoaded: true,
                                    directionsService: new maps.DirectionsService(),
                                    directionsDisplay: new maps.DirectionsRenderer({
                                        map,
                                        suppressMarkers: true
                                    })
                                });
                            }}
                            yesIWantToUseGoogleMapApiInternals={true}
                            center={this.props.center}
                            defaultZoom={12}
                        >
                            <CurrentLocation
                                lat={this.props.from.lat}
                                lng={this.props.from.lng}
                            />
                            {
                                (!isEmptyObject(this.props.target))
                                    && (
                                        <TargetLocation
                                            lat={this.props.target.lat}
                                            lng={this.props.target.lng}
                                        />
                                    )
                            }
                            
                        </GoogleMapReact>
                        <div className="es-destination-wrapper">
                            <FormGroup className="es-destination">
                                <LocationSearchInput
                                    placeholder="From location"
                                    setDefault={true}
                                    renderRoute={this.renderRoute}
                                    propsDispatch={ this.props.changeCurrentLocation }
                                    icon={ (props) => <Icon icon={dotCircleO} /> } />
                            </FormGroup>
                            <FormGroup className="es-destination">
                                <LocationSearchInput
                                    placeholder="Target location"
                                    renderRoute={this.renderRoute}
                                    propsDispatch={this.props.changeTargetLocation}
                                    icon={(props) => <Icon icon={mapMarker} />} />
                            </FormGroup>
                        </div>
                    </div>
                </Container>
            </React.Fragment>
        );
    }
}


Order.propTypes = {
    togglePayment: PropTypes.func.isRequired,
    changeTargetLocation: PropTypes.func.isRequired,
    changeCurrentLocation: PropTypes.func.isRequired,
    selectedOption: PropTypes.string.isRequired,
    center: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number
    }).isRequired,
    from: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
        address: PropTypes.string
    }).isRequired,
    target: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
        address: PropTypes.string
    }),
}

const mapStateToProps = state => ({
    selectedOption: state.order.selectedPaymentOption,
    center: state.order.center,
    from: state.order.from,
    target: state.order.target
});

export default connect(mapStateToProps, {
    togglePayment,
    changeTargetLocation,
    changeCurrentLocation
})(Order);
