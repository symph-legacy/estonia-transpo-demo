import { combineReducers } from 'redux';
import orderReducer from "./scenes/Order/reducer";
import orderListReducer from "./scenes/OrderList/reducer";

export default combineReducers({
    order: orderReducer,
    orderList: orderListReducer
});