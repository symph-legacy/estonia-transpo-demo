import {
    GET_ISSUES,
    REMOVE_ISSUE_ITEM
} from "./strings";

const initialState = {
    issues: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ISSUES:
            return {
                ...state,
                issues: action.payload
            }
        case REMOVE_ISSUE_ITEM:
            return {
                ...state,
                issues: state.issues.filter(issue => issue.id !== action.payload)
            }
        default:
            return state;
    }
}