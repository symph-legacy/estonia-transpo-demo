import { createBrowserHistory } from 'history'
import { createStore, applyMiddleware } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'remote-redux-devtools';
import rootReducer from './reducers'

const initialState = {};
const middleware = [thunk];

export const history = createBrowserHistory();

const store = createStore(
    connectRouter(history)(rootReducer),
    initialState,
    composeWithDevTools(
        applyMiddleware(
            routerMiddleware(history),
            ...middleware
        )
    )
);

export default store