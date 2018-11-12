import { combineReducers } from 'redux';
import orderReducer from "./scenes/Order/reducer";
import orderListReducer from "./scenes/OrderList/reducer";
import issueListReducer from "./scenes/IssueList/reducer";
import usersReducer from "./scenes/Admin/components/UserList/reducer";

export default combineReducers({
    order: orderReducer,
    orderList: orderListReducer,
    issueList: issueListReducer,
    users: usersReducer
});