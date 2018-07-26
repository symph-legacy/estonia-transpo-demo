import {
    TOGGLE_PAYMENT,
    CHANGE_MAP_CENTER,
    CHANGE_CURRENT_LOCATION,
    CHANGE_TARGET_LOCATION
} from "./strings";

const initialState = {
    selectedPaymentOption: "CHILD",
    center: {
        lat: 58.5953,
        lng: 25.0136
    },
    from: {
        lat: 58.5953,
        lng: 25.0136,
        address: "Estonia"
    },
    target: {}
}

export default function (state = initialState, action) {
    switch (action.type) {
        case TOGGLE_PAYMENT:
            return {
                ...state,
                selectedPaymentOption: action.payload
            }
        case CHANGE_MAP_CENTER:
            return {
                ...state,
                center: action.payload
            }
        case CHANGE_CURRENT_LOCATION:
            return {
                ...state,
                from: action.payload
            }
        case CHANGE_TARGET_LOCATION:
            return {
                ...state,
                target: action.payload
            }
        default:
            return state;
    }
}