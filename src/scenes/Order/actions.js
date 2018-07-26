import { 
    TOGGLE_PAYMENT,
    CHANGE_MAP_CENTER,
    CHANGE_CURRENT_LOCATION,
    CHANGE_TARGET_LOCATION
 } from "./strings";


export const togglePayment = (selectedPaymentOption) => dispatch => {
    dispatch({
        type: TOGGLE_PAYMENT,
        payload: selectedPaymentOption
    });
}

export const changeMapCenter = (latlng) => dispatch => {
    dispatch({
        type: CHANGE_MAP_CENTER,
        payload: latlng
    });
}

export const changeCurrentLocation = (latlng) => dispatch => {
    dispatch({
        type: CHANGE_CURRENT_LOCATION,
        payload: latlng
    });
}

export const changeTargetLocation = (latlng) => dispatch => {
    dispatch({
        type: CHANGE_TARGET_LOCATION,
        payload: latlng
    });
}