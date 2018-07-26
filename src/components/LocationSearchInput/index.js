import React from 'react';
import { connect } from "react-redux";

import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import { classnames } from '../../services/helpers'
import { getAddressByLatLng } from '../../services/geocode'
import {
    changeMapCenter,
    changeCurrentLocation
} from "../../scenes/Order/actions";

import {
    InputGroup,
    InputGroupAddon
} from "reactstrap";

class LocationSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            errorMessage: '',
            latitude: null,
            longitude: null,
            isGeocoding: false,
        };
    }

    componentDidMount = () => {
        if (navigator.geolocation && this.props.setDefault) {
            navigator.geolocation.getCurrentPosition(position => {
                let latlng = {
                    "lat": position.coords.latitude,
                    "lng": position.coords.longitude,
                }
                getAddressByLatLng(latlng).then(response => {
                    let places = response.results;
                    if(places && places.length) {
                        this.props.changeMapCenter(latlng);

                        latlng["address"] = places[0].formatted_address
                        this.props.changeCurrentLocation(latlng);
                        this.setState({
                            address: places[0].formatted_address
                        });
                        
                    }
                });
            });
        }
    }
    

    handleChange = address => {
        this.setState({
            address,
            latitude: null,
            longitude: null,
            errorMessage: '',
        });
    };

    handleSelect = selected => {
        this.setState({ isGeocoding: true, address: selected });
        geocodeByAddress(selected)
            .then(res => getLatLng(res[0]))
            .then(({ lat, lng }) => {
                this.props.changeMapCenter({ lat, lng });
                this.props.propsDispatch({
                    lat, lng, address: selected });
                this.props.renderRoute();
                // this.setState({
                //     latitude: lat,
                //     longitude: lng,
                //     isGeocoding: false,
                // });
            })
            .catch(error => {
                this.setState({ isGeocoding: false });
                console.log('error', error); // eslint-disable-line no-console
            });
    };

    handleCloseClick = () => {
        this.setState({
            address: '',
            latitude: null,
            longitude: null,
        });
    };

    handleError = (status, clearSuggestions) => {
        console.log('Error from Google Maps API', status); // eslint-disable-line no-console
        this.setState({ errorMessage: status }, () => {
            clearSuggestions();
        });
    };

    render() {
        const {
            address,
            errorMessage
        } = this.state;
        const DynamicIcon = this.props.icon || (props => (<div />));
        const placeholder = this.props.placeholder;

        return (
            <div>
                <PlacesAutocomplete
                    onChange={this.handleChange}
                    value={address}
                    onSelect={this.handleSelect}
                    onError={this.handleError}
                    shouldFetchSuggestions={address.length > 2}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps }) => {
                        return (
                            <div>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <span className="input-group-text">
                                            <DynamicIcon />
                                        </span>
                                    </InputGroupAddon>
                                    <input
                                        {...getInputProps({
                                            placeholder,
                                            className: 'form-control Demo__search-input',
                                        })}
                                    />
                                    <InputGroupAddon addonType="prepend">
                                        {this.state.address.length > 0 && (
                                            <button
                                                className="input-group-text Demo__clear-button"
                                                onClick={this.handleCloseClick}
                                            >
                                                x
                                            </button>
                                        )}
                                    </InputGroupAddon>
                                </InputGroup>
                                {suggestions.length > 0 && (
                                    <div className="es-suggestion-box">
                                        {suggestions.map(suggestion => {
                                            const className = classnames('es-suggestion-item', {
                                                'active': suggestion.active,
                                            });

                                            return (
                                                <div
                                                    {...getSuggestionItemProps(suggestion, { className })}
                                                >
                                                    <strong>
                                                        {suggestion.formattedSuggestion.mainText}
                                                    </strong>{' '}
                                                    <small>
                                                        {suggestion.formattedSuggestion.secondaryText}
                                                    </small>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }}
                </PlacesAutocomplete>
                {errorMessage.length > 0 && (
                    // <div className="Demo__error-message d-none">{this.state.errorMessage}</div>
                    <div className="es-error-message">Place not found.</div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    selectedOption: state.order.selectedPaymentOption
});

export default connect(mapStateToProps, { changeMapCenter, changeCurrentLocation })(LocationSearchInput);