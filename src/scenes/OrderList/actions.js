import {
    GET_ORDERS,
    REMOVE_ORDER_ITEM
} from "./strings";


export const getOrders = (orderList) => dispatch => {
    dispatch({
        type: GET_ORDERS,
        payload: orderList
    });
}

export const removeOrderItem = (id) => dispatch => {
    dispatch({
        type: REMOVE_ORDER_ITEM,
        payload: id
    });
}