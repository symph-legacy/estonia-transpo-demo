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
import { isEmptyObject, translateData } from "../../services/helpers";

import ReactTooltip from 'react-tooltip';
import DatePicker from 'react-datepicker';

import moment from 'moment';
import 'moment/locale/et';
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
    changeTime2,
    toggleMapClick,
    switchTrip,
    updateSecondTrip
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

import strings from "../../localisation";
import { GOOGLE_API_KEY } from "../../constants";

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
            distance: "",
            selectedDate1: moment(),
            selectedDate2: moment(),
            selectedTime1: moment("00.00", "HH.mm"),
            selectedTime2: moment("00.00", "HH.mm"),
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
                let lat = !latest.fields.second_target_location_lat
                    ? parseFloat(latest.fields.target_location_lat)
                    : parseFloat(latest.fields.second_target_location_lat);

                let lng = !latest.fields.second_target_location_lng
                    ? parseFloat(latest.fields.target_location_lng)
                    : parseFloat(latest.fields.second_target_location_lng);

                let address = !latest.fields.second_target_location_name
                    ? latest.fields.target_location_name
                    : latest.fields.second_target_location_name;

                this.setState({
                    latest: { lat, lng, address }
                });
            } else {
                console.log("Latest order not found.");
            }
        });

        this.props.changeDay1(this.state.selectedDate1.format("DD.MM.YYYY"));
        this.props.changeDay2(this.state.selectedDate2.format("DD.MM.YYYY"));
        
        setTimeout(() => {
            this.renderRoute();
        }, 1000);
    }


    paymentOptionChange = (e) => {
        this.props.togglePayment(e.target.value);
    }

    isCorrectDateTime = () => {
        let dateTime1 = moment(`${this.state.selectedDate1.format("DD.MM.YYYY")} ${this.state.selectedTime1.format("HH.mm")}`, "DD.MM.YYYY HH.mm");
        let dateTime2 = moment(`${this.state.selectedDate2.format("DD.MM.YYYY")} ${this.state.selectedTime2.format("HH.mm")}`, "DD.MM.YYYY HH.mm");

        if (dateTime1.isValid() && dateTime2.isValid()) {
            if (dateTime2.isBefore(dateTime1, 'days')) {
                this.props.changeDay2(dateTime1.format("DD.MM.YYYY"));
                this.setState({ selectedDate2: this.state.selectedDate1 });
            }

            if (this.props.chosenTime1 && dateTime2.isSameOrBefore(dateTime1)) {
                this.props.changeTime2(dateTime1.clone().add(5, 'minutes').format("HH.mm"));
                this.setState({ selectedTime2: dateTime1.clone().add(5, 'minutes') });
            }
        }
    }

    handleDateChange1 = date => {
        this.props.changeDay1(date.format("DD.MM.YYYY"));
        this.toggleDatepicker1();

        this.setState({ selectedDate1: date }, this.isCorrectDateTime);
    }

    handleDateChange2 = date => {
        this.props.changeDay2(date.format("DD.MM.YYYY"));
        this.toggleDatepicker2();

        this.setState({ selectedDate2: date }, this.isCorrectDateTime);
    }

    handleTimeChange1 = time => {
        this.props.changeTime1(time.format("HH.mm"));
        this.toggleTimepicker1();

        this.setState({ selectedTime1: time }, this.isCorrectDateTime);
    }

    handleTimeChange2 = time => {
        this.props.changeTime2(time.format("HH.mm"));
        this.toggleTimepicker2();

        this.setState({ selectedTime2: time }, this.isCorrectDateTime);
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

    getMinTime = () => {
        let day1 = moment(this.props.chosenDay1, "DD.MM.YYYY");
        let day2 = moment(this.props.chosenDay2, "DD.MM.YYYY");
        let chosenTime = moment(this.props.chosenTime1, "HH.mm");

        if (day1.isSame(day2, 'day') && chosenTime.isValid()) {
            return chosenTime.clone().add(5, 'minutes');
        }

        return moment().hours(0).minutes(0);
    }

    getMaxTime = () => {
        return moment().hours(23).minutes(55);
    }

    onPreviousLocationClicked = () => {
        if(this.props.selectedTrip === 2) {
            this.props.updateSecondTrip({
                ...this.props.secondTrip,
                target: this.state.latest
            })
        } else {
            this.props.changeTargetLocation(this.state.latest);
        }
        this.renderRoute(this.state.latest);
        this.toggleLatest();
    }

    toggleLatest = () => {
        this.setState({ showLatest: !this.state.showLatest })
    }

    onMapClick = ({ x, y, lat, lng, event }) => {
        let func = null;
        switch (this.props.chosenLocationInput) {
            case "FROM":
                func = this.props.changeCurrentLocation;
                break;
            case "TARGET":
                func = this.props.changeTargetLocation;
                break;
            default:
                break;
        }

        if(this.props.selectedTrip === 2) {
            func = this.updateTripWrapper;    
        }
        
        if(func) {
            func({ lat, lng, address: strings.processingAddress});
            getAddressByLatLng({ lat, lng }).then(response => {
                let places = response.results;
                if (places && places.length) {
                    this.props.changeMapCenter({ lat, lng });
                    func({
                        lat,
                        lng,
                        address: places[0].formatted_address
                    });

                    this.renderRoute();
                }
            });
        }
    }

    updateTripWrapper = trip => {
        this.props.updateSecondTrip({
            ...this.props.secondTrip,
            [this.props.chosenLocationInput.toLowerCase()]: trip
        });
    }

    onToggleMapClick = ( e ) => {
        e.preventDefault();
        if(e.target.value) {
            this.props.toggleMapClick(e.target.value);
        }
    }

    onFocus = (e) => {
        switch (e.target.placeholder) {
            case strings.fromLocation:
                this.props.toggleMapClick("FROM");
                break;
            case strings.targetLocation:
                this.props.toggleMapClick("TARGET");
                break;
        
            default:
                break;
        }
        console.log(e.target.placeholder);
    }

    onBlur = (e) => {
        console.log(e.target.placeholder);
    }

    chooseFrom = () => {
        return this.props.selectedTrip === 1 ?
            this.props.from :
                this.props.secondTrip.from;
    }

    chooseTarget = () => {
        return this.props.selectedTrip === 1 ?
            this.props.target :
            this.props.secondTrip.target;
    }

    changeSecondTripFrom = trip => {
        this.props.updateSecondTrip({
            ...this.props.secondTrip,
            from: trip
        });
    }

    changeSecondTripTarget = trip => {
        this.props.updateSecondTrip({
            ...this.props.secondTrip,
            target: trip
        });
    }

    initSecondTrip = () => {
        this.props.updateSecondTrip({
            ...this.props.selectedTrip,
            from: { ...this.props.target },
            target: { ...this.props.from }
        })
    }

    onChangeButtonClick = e => {
        let selectedTrip = parseInt(e.target.value);
        let from = this.props.secondTrip.from;
        if(selectedTrip === 2
            && isEmptyObject(from)) {
            this.initSecondTrip();
        }

        this.props.switchTrip(parseInt(e.target.value));
        this.props.nextStep(this.props.step - 1);
    }

    onClickConfirmOrder = e => {
        this.setState({ isButtonLoading: !this.state.isButtonLoading });

        let formData = {
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

        if (formData['direction_option'] !== "Roundtrip") {
            delete formData["day_chosen2"]
            delete formData["time_chosen2"]
        } else {
            // if empty let target be the from of the second trip
            let from = isEmptyObject(this.props.secondTrip.from)
                ? this.props.target : this.props.secondTrip.from;

            // if empty let from be the from of the second trip
            let target = isEmptyObject(this.props.secondTrip.target)
                ? this.props.from : this.props.secondTrip.target;

            formData["second_current_location_name"] = from.address;
            formData["second_current_location_lat"] = `${from.lat}`;
            formData["second_current_location_lng"] = `${from.lng}`;

            formData["second_target_location_name"] = target.address;
            formData["second_target_location_lat"] = `${target.lat}`;
            formData["second_target_location_lng"] = `${target.lng}`;
        }

        submitOrder(formData).then(response => {
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
    }

    renderRoute = (defaultTarget = null) => {
        if (!this.state.mapLoaded) return false;

        if (this.state.directionsDisplay != null) {
            this.state.directionsDisplay.setDirections({ routes: [] });
        }

        let from = this.chooseFrom();
        let target = this.chooseTarget();

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
            if (response.routes.length) {
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
                        onChange={this.paymentOptionChange}
                        checked={this.props.selectedOption === btn.key} /> {btn.text}
                </label>
            )
        })
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

                            map.addListener('click', event => {
                                this.onMapClick({ 'x': event.pixel.x, 'y': event.pixel.y, 'lat': event.latLng.lat(), 'lng': event.latLng.lng() });
                            });
                        }}
                        yesIWantToUseGoogleMapApiInternals={true}
                        center={this.props.from}
                        defaultZoom={12}
                    >
                        <CurrentLocation
                            lat={this.chooseFrom().lat}
                            lng={this.chooseFrom().lng}
                        />
                        {
                            (!isEmptyObject(this.chooseTarget()))
                            && (
                                <TargetLocation
                                    lat={this.chooseTarget().lat}
                                    lng={this.chooseTarget().lng}
                                />
                            )
                        }

                    </GoogleMapReact>

                    <div className="es-destination-wrapper">
                        <FormGroup className="es-destination">
                            <LocationSearchInput
                                tip="Click this to activate selecting current location by clicking the map."
                                placeholder={strings.fromLocation}
                                onFocus={this.onFocus}
                                onBlur={this.onBlur}
                                activeClick={this.props.chosenLocationInput === "FROM"}
                                defaultAddress={this.chooseFrom().address}
                                renderRoute={this.renderRoute}
                                propsDispatch={this.props.selectedTrip === 1
                                    ? this.props.changeCurrentLocation :
                                    this.changeSecondTripFrom}
                                icon={props => <Icon icon={dotCircleO} />} />
                        </FormGroup>
                        <FormGroup className="es-destination">
                            <LocationSearchInput
                                tip="Click this to activate selecting target location by clicking the map."
                                placeholder={strings.targetLocation}
                                onFocus={this.onFocus}
                                onBlur={this.onBlur}
                                activeClick={this.props.chosenLocationInput === "TARGET"}
                                defaultAddress={!isEmptyObject(this.chooseTarget())
                                    ? this.chooseTarget().address : ""}
                                renderRoute={this.renderRoute}
                                propsDispatch={this.props.selectedTrip === 1
                                    ? this.props.changeTargetLocation :
                                    this.changeSecondTripTarget}
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
                            {strings.confirmCurrentTarget}
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
                                {translateData(`${selectedDirection} TRANSPORT`)}
                            </small>
                        </div>
                    </Col>
                    <Col sm="12" md="4" className="d-flex es-btn-group">
                        <button
                            className={`btn btn-block btn-outline-secondary m-1 ${(selectedDirection === "Roundtrip" ? "active" : "")}`}
                            onClick={ (e) => this.props.toggleDirection(e.target.value) }
                            value="Roundtrip">{strings.roundTrip}</button>
                        <button
                            className={`btn btn-block btn-outline-secondary m-1 ${(selectedDirection === "Oneway" ? "active" : "")}`}
                            onClick={(e) => this.props.toggleDirection(e.target.value)}
                            value="Oneway">{strings.oneWay}</button>
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
                                            {strings.day}
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
                                            {strings.time}
                                        </button>
                                    </Col>
                                    <Col className="align-items-center d-flex mb10">
                                        <p className="mb0">{this.props.chosenTime1}</p>
                                    </Col>
                                </Row>

                                {
                                    this.state.isDatePickerOpen1 && (
                                        <DatePicker
                                            selected={this.state.selectedDate1 }
                                            minDate={ moment() }
                                            locale={window.navigator.userLanguage || window.navigator.language}
                                            onChange={this.handleDateChange1}
                                            withPortal
                                            inline />
                                    )
                                }
                                {
                                    this.state.isTimePickerOpen1 && (
                                        <DatePicker
                                            locale={window.navigator.userLanguage || window.navigator.language}
                                            onChange={this.handleTimeChange1}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            dateFormat="LT"
                                            timeCaption={strings.timePickerCaption}
                                            timeFormat="HH.mm"
                                            timeIntervals={5}
                                            withPortal
                                            inline />
                                    )
                                }
                            </CardBody>
                            <CardFooter>
                                <small className="mb5">{strings.from}</small>
                                <h6>{ this.props.from.address }</h6>
                                <small className="mb5">{strings.to}</small>
                                <h6 className="mb25">{ this.props.target.address }</h6>
                                
                                <Row>
                                    <Col>
                                        <Button
                                            color="link"
                                            value={1}
                                            onClick={this.onChangeButtonClick}>
                                            {strings.change}
                                        </Button>
                                    </Col>
                                    <Col>
                                        <a href="/order"
                                            className="btn btn-link">
                                            {strings.cancel}
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
                                                    {strings.day}
                                                </button>
                                            </Col>
                                            <Col className="align-items-center d-flex mb10">
                                                <p className="mb0">{this.props.chosenDay2}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="mb10">
                                                <button
                                                    className={`btn btn-secondary es-btn-picker ${ !this.props.chosenTime1 ? 'disabled' : '' }`}
                                                    disabled={!this.props.chosenTime1}
                                                    onClick={this.toggleTimepicker2}>
                                                    {strings.time}
                                                </button>
                                            </Col>
                                            <Col className="align-items-center d-flex mb10">
                                                <p className="mb0">{this.props.chosenTime2}</p>
                                            </Col>
                                        </Row>

                                        {
                                            this.state.isDatePickerOpen2 && (
                                                <DatePicker
                                                    locale={window.navigator.userLanguage || window.navigator.language}
                                                    minDate={this.state.selectedDate1}
                                                    onChange={this.handleDateChange2}
                                                    selected={this.state.selectedDate2}
                                                    withPortal
                                                    inline />
                                            )
                                        }
                                        {
                                            this.state.isTimePickerOpen2 && (
                                                <DatePicker
                                                    locale={window.navigator.userLanguage || window.navigator.language}
                                                    onChange={this.handleTimeChange2}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    dateFormat="LT"
                                                    timeFormat="HH.mm"
                                                    timeIntervals={5}
                                                    timeCaption={strings.timePickerCaption}
                                                    minTime={this.getMinTime()}
                                                    maxTime={this.getMaxTime()}
                                                    withPortal
                                                    inline />
                                            )
                                        }
                                    </CardBody>
                                    <CardFooter>
                                        <small className="mb5">{strings.from}</small>
                                        <h6>{ isEmptyObject(this.props.secondTrip.from) ?
                                                this.props.target.address : 
                                                this.props.secondTrip.from.address }</h6>
                                        <small className="mb5">{strings.to}</small>
                                        <h6 className="mb25">{ isEmptyObject(this.props.secondTrip.target) ?
                                                this.props.from.address : 
                                                this.props.secondTrip.target.address }</h6>
                                        <Row>
                                            <Col>
                                                <Button
                                                    color="link"
                                                    value={2}
                                                    onClick={this.onChangeButtonClick}>
                                                    {strings.change}
                                                </Button>
                                            </Col>
                                            <Col>
                                                <a href="/order" className="btn btn-link">
                                                    {strings.cancel}
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
                            onClick={ this.onClickConfirmOrder }>
                            { ( this.state.isButtonLoading ? strings.confirming : strings.confirmOrder) }
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
                        <h4>{strings.orderReceived}</h4>
                        <p>{strings.confirmationWillReceive}</p>
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
                <ReactTooltip />
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
    toggleMapClick: PropTypes.func.isRequired,
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
    selectedTrip: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    chosenLocationInput: PropTypes.string.isRequired,
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
    selectedTrip: state.order.selectedTrip,
    secondTrip: state.order.secondTrip,
    step: state.order.step,
    chosenDay1: state.order.chosenDay1,
    chosenDay2: state.order.chosenDay2,
    chosenTime1: state.order.chosenTime1,
    chosenTime2: state.order.chosenTime2,
    chosenLocationInput: state.order.chosenLocationInput
});

export default connect(mapStateToProps, {
    togglePayment,
    toggleDirection,
    toggleMapClick,
    switchTrip,
    nextStep,
    changeTargetLocation,
    changeCurrentLocation,
    changeMapCenter,
    updateSecondTrip,
    changeDay1,
    changeDay2,
    changeTime1,
    changeTime2
})(Order);
