import React, { Component } from "react";

import GoogleMapReact from "google-map-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Icon from 'react-icons-kit';
import { dotCircleO } from 'react-icons-kit/fa/dotCircleO';
import { mapMarker } from 'react-icons-kit/fa/mapMarker';
import { check } from 'react-icons-kit/fa/check';
import { checkCircle } from 'react-icons-kit/fa/checkCircle';
import { times } from 'react-icons-kit/fa/times';

import { NAV_BRAND, BUTTON_GROUP } from "./strings";

import LocationSearchInput from "../../components/LocationSearchInput";
import Navigation from "../../components/Navigation";
import CurrentLocation from "./components/CurrentLocation";
import TargetLocation from "./components/TargetLocation";

import { submitOrder, getLatestOrder } from "../../services/api";
import { getAddressByLatLng } from '../../services/geocode'
import { isEmptyObject, toProperCase } from "../../services/helpers";

import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import {
    togglePayment,
    toggleDirection,
    nextStep,
    changeCurrentLocation,
    changeTargetLocation,
    changeMapCenter,
    changeDay1,
    changeDay2,
    changeTime1,
    changeTime2
} from "./actions"


import {
    Container,
    FormGroup,
    Button,
    Row,
    Col,
    Card,
    CardBody,
    CardFooter
} from "reactstrap";

import "./styles.css";

const GOOGLE_API_KEY = 'AIzaSyDbESyZ10IaxgVmjcMBDN2WlGzSEu9vzMM';

class Order extends Component {

    constructor(props) {
        super(props);
        this.state = {
            default: '',
            map: null,
            maps: null,
            mapLoaded: false,
            directionsDisplay: null,
            directionsService: null,
            time: "",
            isDatePickerOpen1: false,
            isDatePickerOpen2: false,
            isTimePickerOpen1: false,
            isTimePickerOpen2: false,
            isButtonLoading: false,
            latest: {},
            showLatest: true,
            distance: ""
        };
    }

    componentDidMount = () => {
        if (navigator.geolocation && this.props.from.address === "Estonia") {
            navigator.geolocation.getCurrentPosition(position => {
                let latlng = {
                    "lat": position.coords.latitude,
                    "lng": position.coords.longitude,
                }
                getAddressByLatLng(latlng).then(response => {
                    let places = response.results;
                    if (places && places.length) {
                        this.props.changeMapCenter(latlng);

                        latlng["address"] = places[0].formatted_address;
                        this.props.changeCurrentLocation(latlng);
                        this.setState({
                            default: latlng
                        });
                    }
                });
            }, err => {
                console.log("Can't get current location.");
                console.log(err);
            });
        }

        getLatestOrder().then((latest) => {
            if(!isEmptyObject(latest)) {
                this.setState({
                    latest: {
                        lat: parseFloat(latest.fields.target_location_lat),
                        lng: parseFloat(latest.fields.target_location_lng),
                        address: latest.fields.target_location_name
                    }
                });
            } else {
                console.log("Latest order not found.");
            }
        });
    }


    paymentOptionChange = (e) => {
        this.props.togglePayment(e.target.value);
    }

    renderRoute = (defaultTarget = null) => {
        if(!this.state.mapLoaded) return false;

        if (this.state.directionsDisplay != null) {
            this.state.directionsDisplay.setDirections({ routes: [] });
        }

        let { from, target } = this.props;
        if (defaultTarget) target = Object.assign({}, defaultTarget);
        if ((isEmptyObject(from) || isEmptyObject(target))) {
            console.log("Can't render router, missing origin or destination.");
            return false;
        }

        this.state.directionsService.route({
            origin: `${from.lat}, ${from.lng}`,
            destination: `${target.lat}, ${target.lng}`,
            waypoints: [],
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
        }, (response, status) => {
            this.state.directionsDisplay.setDirections(response);
            if(response.routes.length){
                this.setState({
                    distance: response.routes[0].legs[0].distance.text,
                    time: response.routes[0].legs[0].duration.text,
                });
            }
        });
    }

    renderPaymentButton = () => {
        return BUTTON_GROUP.map(btn => {
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

    handleDateChange1 = date => {
        this.props.changeDay1(date.format("DD.MM.YYYY"));
        this.toggleDatepicker1();
    }

    handleDateChange2 = date => {
        this.props.changeDay2(date.format("DD.MM.YYYY"));
        this.toggleDatepicker2();
    }

    handleTimeChange1 = time => {
        this.props.changeTime1(time.format("HH.mm"));
        this.toggleTimepicker1();
    }

    handleTimeChange2 = time => {
        this.props.changeTime2(time.format("HH.mm"));
        this.toggleTimepicker2();
    }

    toggleDatepicker1 = e => {
        e && e.preventDefault()
        this.setState({ isDatePickerOpen1: !this.state.isDatePickerOpen1 })
    }

    toggleDatepicker2 = e => {
        e && e.preventDefault()
        this.setState({ isDatePickerOpen2: !this.state.isDatePickerOpen2 })
    }


    toggleTimepicker1 = e => {
        e && e.preventDefault()
        this.setState({ isTimePickerOpen1: !this.state.isTimePickerOpen1 })
    }

    toggleTimepicker2 = e => {
        e && e.preventDefault()
        this.setState({ isTimePickerOpen2: !this.state.isTimePickerOpen2 })
    }

    onPreviousLocationClicked = () => {
        this.props.changeTargetLocation(this.state.latest);
        this.renderRoute(this.state.latest);
        this.toggleLatest();
    }

    toggleLatest = () => {
        this.setState({ showLatest: !this.state.showLatest })
    }

    renderStepOne = () => {
        return (
            <Container>
                <div className="btn-group btn-group-toggle es-btn-group mb25" data-toggle="buttons">
                    {this.renderPaymentButton()}
                </div>

                <div className="es-map">
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
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
                        center={this.props.from}
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
                                defaultAddress={this.props.from.address}
                                renderRoute={this.renderRoute}
                                propsDispatch={this.props.changeCurrentLocation}
                                icon={props => <Icon icon={dotCircleO} />} />
                        </FormGroup>
                        <FormGroup className="es-destination">
                            <LocationSearchInput
                                placeholder="Target location"
                                defaultAddress={(!isEmptyObject(this.props.target)) ? this.props.target.address : ""}
                                renderRoute={this.renderRoute}
                                propsDispatch={this.props.changeTargetLocation}
                                icon={props => <Icon icon={mapMarker} />} />
                        </FormGroup>
                    </div>

                    <div>
                        {
                            (!isEmptyObject(this.state.latest) && this.state.showLatest) && (
                                <div className="es-previous-location">
                                    <button className='btn' onClick={this.onPreviousLocationClicked}>
                                        <Icon icon={checkCircle} className="es-check" />
                                        {this.state.latest.address}
                                    </button>
                                    <Icon icon={times} className="es-close" onClick={this.toggleLatest} />
                                </div>
                            )
                        }
                    </div>

                    <div className="text-center p15">
                        <span> {this.state.time} </span> - <span>{this.state.distance}</span>
                    </div>

                    <div className="text-center p15">
                        <Button
                            color="primary"
                            onClick={() => this.props.nextStep(this.props.step + 1)}
                            disabled={
                                (isEmptyObject(this.props.from) || isEmptyObject(this.props.target))
                            }>
                            Confirm current location and target
                        </Button>
                    </div>
                </div>
            </Container>
        )
    }

    renderStepTwo = () => {
        let { from, target, selectedDirection } = this.props;

        let mapSrc = `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_API_KEY}&origin=${from.lat},${from.lng}&destination=${target.lat},${target.lng}&avoid=tolls|highways`;
        return (
           <Container>
                <Row className="p15 pl0 pr0">
                    <Col md="8" className="d-flex align-items-center">
                        <div className="es-avatar"></div>
                        <div className="es-order-info">
                            <h6 className="mb0">Kersti Kangro</h6>
                            <small className="mb0">
                                { toProperCase(this.props.selectedOption) } transport
                            </small>
                        </div>
                    </Col>
                    <Col sm="12" md="4" className="d-flex es-btn-group">
                        <button
                            className={`btn btn-block btn-outline-secondary m-1 ${(selectedDirection === "Roundtrip" ? "active" : "")}`}
                            onClick={ (e) => this.props.toggleDirection(e.target.value) }
                            value="Roundtrip">Roundtrip</button>
                        <button
                            className={`btn btn-block btn-outline-secondary m-1 ${(selectedDirection === "Oneway" ? "active" : "")}`}
                            onClick={(e) => this.props.toggleDirection(e.target.value)}
                            value="Oneway">Oneway</button>
                    </Col>
                </Row>
                <Row>
                    <Col className="mb20">
                        <iframe
                            className="es-map embedded"
                            title="preview-map"
                            src={mapSrc} />
                    </Col>
                </Row>
                <Row>
                    <Col className="mb20" md="6">
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col className="mb10">
                                        <button
                                            className="btn btn-secondary es-btn-picker"
                                            onClick={this.toggleDatepicker1}>
                                            Day
                                        </button>
                                    </Col>
                                    <Col className="align-items-center d-flex mb10">
                                        <p className="mb0">{this.props.chosenDay1}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="mb10">
                                        <button
                                            className="btn btn-secondary es-btn-picker"
                                            onClick={this.toggleTimepicker1}>
                                            Time
                                        </button>
                                    </Col>
                                    <Col className="align-items-center d-flex mb10">
                                        <p className="mb0">{this.props.chosenTime1}</p>
                                    </Col>
                                </Row>

                                {
                                    this.state.isDatePickerOpen1 && (
                                        <DatePicker
                                            selected={this.state.startDate}
                                            onChange={this.handleDateChange1}
                                            withPortal
                                            inline />
                                    )
                                }
                                {
                                    this.state.isTimePickerOpen1 && (
                                        <DatePicker
                                            selected={this.state.startDate}
                                            onChange={this.handleTimeChange1}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            dateFormat="LT"
                                            timeCaption="Time"
                                            timeFormat="HH:mm"
                                            timeIntervals={5}
                                            withPortal
                                            inline />
                                    )
                                }
                            </CardBody>
                            <CardFooter>
                                <h6>{ this.props.from.address } - { this.props.target.address }</h6>
                                <small className="mb25">To</small>
                                <Row>
                                    <Col>
                                        <Button
                                            color="link"
                                            onClick={() => this.props.nextStep(this.props.step - 1)}>
                                            CHANGE
                                        </Button>
                                    </Col>
                                    <Col>
                                        <a href="/order" className="btn btn-link"
                                            onClick={() => this.props.nextStep(this.props.step - 1)}>
                                            CANCEL
                                        </a>
                                    </Col>
                                </Row>
                            </CardFooter>
                        </Card>
                    </Col>
                    {
                        (this.props.selectedDirection === "Roundtrip") && (
                            <Col className="mb20">
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col className="mb10">
                                                <button
                                                    className="btn btn-secondary es-btn-picker"
                                                    onClick={this.toggleDatepicker2}>
                                                    Day
                                                </button>
                                            </Col>
                                            <Col className="align-items-center d-flex mb10">
                                                <p className="mb0">{this.props.chosenDay2}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="mb10">
                                                <button
                                                    className="btn btn-secondary es-btn-picker"
                                                    onClick={this.toggleTimepicker2}>
                                                    Time
                                                </button>
                                            </Col>
                                            <Col className="align-items-center d-flex mb10">
                                                <p className="mb0">{this.props.chosenTime2}</p>
                                            </Col>
                                        </Row>

                                        {
                                            this.state.isDatePickerOpen2 && (
                                                <DatePicker
                                                    selected={this.state.startDate}
                                                    onChange={this.handleDateChange2}
                                                    withPortal
                                                    inline />
                                            )
                                        }
                                        {
                                            this.state.isTimePickerOpen2 && (
                                                <DatePicker
                                                    selected={this.state.startDate}
                                                    onChange={this.handleTimeChange2}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    dateFormat="LT"
                                                    timeFormat="HH:mm"
                                                    timeIntervals={5}
                                                    timeCaption="Time"
                                                    withPortal
                                                    inline />
                                            )
                                        }
                                    </CardBody>
                                    <CardFooter>
                                        <h6>{this.props.target.address} - {this.props.from.address}</h6>
                                        <small className="mb25">From</small>
                                        <Row>
                                            <Col>
                                                <Button
                                                    color="link"
                                                    onClick={() => this.props.nextStep(this.props.step - 1)}>
                                                    CHANGE
                                                </Button>
                                            </Col>
                                            <Col>
                                                <a href="/order" className="btn btn-link"
                                                    onClick={() => this.props.nextStep(this.props.step - 1)}>
                                                    CANCEL
                                                </a>
                                            </Col>
                                        </Row>
                                    </CardFooter>
                                </Card>
                            </Col>
                        )
                    }
                </Row>
                <Row>
                    <Col className="text-center p15">
                        <Button
                            color="primary"
                            disabled={this.state.isButtonLoading ||
                                (!(this.props.chosenDay1 && this.props.chosenTime1)) ||
                                (!(this.props.chosenDay2 && this.props.chosenTime2) &&
                                this.props.selectedDirection === "Roundtrip")}
                            onClick={() => {
                                this.setState({
                                    isButtonLoading: !this.state.isButtonLoading
                                });

                                let params = {
                                    "name": "Kersti Kangro",
                                    "roundtrip": false,
                                    "payment_option": this.props.selectedOption,
                                    "direction_option": this.props.selectedDirection,
                                    "current_location_name": this.props.from.address,
                                    "current_location_lat": `${this.props.from.lat}`,
                                    "current_location_lng": `${this.props.from.lng}`,
                                    "target_location_name": this.props.target.address,
                                    "target_location_lat": `${this.props.target.lat}`,
                                    "target_location_lng": `${this.props.target.lng}`,
                                    "day_chosen": this.props.chosenDay1,
                                    "time_chosen": this.props.chosenTime1,
                                    "day_chosen2": this.props.chosenDay2,
                                    "time_chosen2": this.props.chosenTime2
                                }
                    
                                if (params['direction_option'] !== "Roundtrip") {
                                    delete params["day_chosen2"]
                                    delete params["time_chosen2"]
                                }

                                submitOrder(params).then(response => {
                                    this.setState({
                                        isButtonLoading: !this.state.isButtonLoading
                                    }, () => {
                                        if (response.id) {
                                            this.props.nextStep(this.props.step + 1);
                                        } else {
                                            alert("Something went wrong...");
                                        }
                                    });
                                });
                            }}>
                            { ( this.state.isButtonLoading ? 'Confirming...' : 'Confirm Order') }
                        </Button>
                    </Col>
                </Row>
            </Container>
        )
    }

    renderStepThree = () => {
        return (
            <Container>
                <Row className="text-center es-confirmation-box">
                    <Col sm="12">
                        <div className="icon-wrapper-circle">
                            <Icon icon={check} />
                        </div>
                    </Col>
                    <Col sm="12" className="mb100">
                        <h4>Your order is well received!</h4>
                        <p>Confirmation will arrive to your mail</p>
                    </Col>
                    <Col sm="12" className="mb20">
                        <a className="btn btn-outline-primary btn-120" href="/order">OK</a>
                    </Col>
                </Row>
            </Container>
        )
    }

    render() {
        return (
            <React.Fragment>
                <Navigation brand={NAV_BRAND} />
                { (this.props.step === 1) && this.renderStepOne() }
                { (this.props.step === 2) && this.renderStepTwo() }
                { (this.props.step === 3) && this.renderStepThree() }
            </React.Fragment>
        );
    }
}


Order.propTypes = {
    selectedOption: PropTypes.string.isRequired,
    selectedDirection: PropTypes.string.isRequired,
    togglePayment: PropTypes.func.isRequired,
    toggleDirection: PropTypes.func.isRequired,
    changeTargetLocation: PropTypes.func.isRequired,
    changeCurrentLocation: PropTypes.func.isRequired,
    changeMapCenter: PropTypes.func.isRequired,
    changeDay1: PropTypes.func.isRequired,
    changeDay2: PropTypes.func.isRequired,
    changeTime1: PropTypes.func.isRequired,
    changeTime2: PropTypes.func.isRequired,
    nextStep: PropTypes.func,
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
    step: PropTypes.number.isRequired,
    chosenDay1: PropTypes.string.isRequired,
    chosenDay2: PropTypes.string.isRequired,
    chosenTime1: PropTypes.string.isRequired,
    chosenTime2: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
    selectedOption: state.order.selectedPaymentOption,
    selectedDirection: state.order.selectedDirection,
    center: state.order.center,
    from: state.order.from,
    target: state.order.target,
    step: state.order.step,
    chosenDay1: state.order.chosenDay1,
    chosenDay2: state.order.chosenDay2,
    chosenTime1: state.order.chosenTime1,
    chosenTime2: state.order.chosenTime2
});

export default connect(mapStateToProps, {
    togglePayment,
    toggleDirection,
    nextStep,
    changeTargetLocation,
    changeCurrentLocation,
    changeMapCenter,
    changeDay1,
    changeDay2,
    changeTime1,
    changeTime2
})(Order);
