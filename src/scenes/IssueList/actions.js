import {
    GET_ISSUES,
    REMOVE_ISSUE_ITEM
} from "./strings";


export const getIssues = (issueList) => dispatch => {
    dispatch({
        type: GET_ISSUES,
        payload: issueList
    });
}

export const removeIssueItem = (id) => dispatch => {
    dispatch({
        type: REMOVE_ISSUE_ITEM,
        payload: id
    });
}