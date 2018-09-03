import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import { classnames, isEmptyObject } from '../../services/helpers'

import {
    changeMapCenter,
    changeCurrentLocation
} from "../../scenes/Order/actions";

import {
    InputGroup,
    InputGroupAddon
} from "reactstrap";
import strings from '../../localisation';

class LocationSearchInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            defaultAddress: props.defaultAddress,
            address: props.defaultAddress,
            errorMessage: '',
            latitude: null,
            longitude: null,
            isGeocoding: false,
            showClearButton: false
        };
    }

    componentDidMount() {
        if(!isEmptyObject(this.props.from) && !isEmptyObject(this.props.target)) {
            this.props.renderRoute();
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.defaultAddress !== state.defaultAddress) {
            return ({
                address: props.defaultAddress,
                defaultAddress: props.defaultAddress
            });
        }

        return null;
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
                this.props.propsDispatch({ lat, lng, address: selected });
                this.props.renderRoute();
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
        console.log('Error from Google Maps API', status);
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
                                    <InputGroupAddon
                                        addonType="prepend">
                                        <span
                                            className={`input-group-text ${this.props.activeClick ? 'active': '' }`}>
                                            <DynamicIcon />
                                        </span>
                                    </InputGroupAddon>
                                    <input
                                        {...getInputProps({
                                            placeholder,
                                            className: 'form-control Demo__search-input',
                                            onFocus: this.props.onFocus
                                        })}
                                    />
                                    <InputGroupAddon addonType="prepend">
                                        {(this.state.address.length > 0 && this.state.showClearButton) && (
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
                    <div className="es-error-message">{strings.placeNotFound}</div>
                )}
            </div>
        );
    }
}

LocationSearchInput.propTypes = {
    changeMapCenter: PropTypes.func.isRequired,
    changeCurrentLocation: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    from: state.order.from,
    target: state.order.target,
});


export default connect(mapStateToProps, {
    changeMapCenter,
    changeCurrentLocation
})(LocationSearchInput);