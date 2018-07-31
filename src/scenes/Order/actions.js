import { 
    TOGGLE_PAYMENT,
    CHANGE_MAP_CENTER,
    CHANGE_CURRENT_LOCATION,
    CHANGE_TARGET_LOCATION,
    NEXT_STEP,
    TOGGLE_DIRECTION,
    CHANGE_DAY1,
    CHANGE_DAY2,
    CHANGE_TIME1,
    CHANGE_TIME2,
 } from "./strings";


export const togglePayment = (selectedPaymentOption) => dispatch => {
    dispatch({
        type: TOGGLE_PAYMENT,
        payload: selectedPaymentOption
    });
}

export const toggleDirection = (selectedDirection) => dispatch => {
    dispatch({
        type: TOGGLE_DIRECTION,
        payload: selectedDirection
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

export const nextStep = (step) => dispatch => {
    dispatch({
        type: NEXT_STEP,
        payload: step
    });
}

export const changeDay1 = (day) => dispatch => {
    dispatch({
        type: CHANGE_DAY1,
        payload: day
    });
}

export const changeDay2 = (day) => dispatch => {
    dispatch({
        type: CHANGE_DAY2,
        payload: day
    });
}

export const changeTime1 = (time) => dispatch => {
    dispatch({
        type: CHANGE_TIME1,
        payload: time
    });
}

export const changeTime2 = (time) => dispatch => {
    dispatch({
        type: CHANGE_TIME2,
        payload: time
    });
}