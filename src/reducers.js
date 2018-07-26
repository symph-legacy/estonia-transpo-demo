import { combineReducers } from 'redux';
import orderReducer from "./scenes/Order/reducer";

export default combineReducers({
    order: orderReducer
});