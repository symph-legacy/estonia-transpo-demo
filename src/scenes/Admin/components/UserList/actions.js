import {
    GET_USERS,
} from "./strings";


export const getUsers = (users) => dispatch => {
    dispatch({
        type: GET_USERS,
        payload: users
    });
}