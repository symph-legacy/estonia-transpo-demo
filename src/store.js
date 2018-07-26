import { createBrowserHistory } from 'history'
import { createStore, compose, applyMiddleware } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'

import thunk from 'redux-thunk'
import rootReducer from './reducers'

const initialState = {};
const middleware = [thunk];

export const history = createBrowserHistory();

const store = createStore(
    connectRouter(history)(rootReducer),
    initialState,
    compose(
        applyMiddleware(
            routerMiddleware(history),
            ...middleware
        ),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

export default store