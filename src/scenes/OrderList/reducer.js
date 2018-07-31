import {
    GET_ORDERS,
    REMOVE_ORDER_ITEM
} from "./strings";

const initialState = {
    orders: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ORDERS:
            return {
                ...state,
                orders: action.payload
            }
        case REMOVE_ORDER_ITEM:
            return {
                ...state,
                orders: state.orders.filter(order => order.id !== action.payload)
            }
        default:
            return state;
    }
}