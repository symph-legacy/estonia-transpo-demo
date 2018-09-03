import { createBrowserHistory } from 'history'
import { createStore, applyMiddleware } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { composeWithDevTools } from 'redux-devtools-extension'


import thunk from 'redux-thunk'
import rootReducer from './reducers'

// const initialState = {};
const middleware = [thunk];

export const history = createBrowserHistory();

const store = createStore(
    connectRouter(history)(rootReducer),
    /* initialState, */
    composeWithDevTools(
        applyMiddleware(
            routerMiddleware(history),
            ...middleware
        )
    )
);

export default store