/**
 * Created by steve on 2/9/2017.
 */
import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './ducks';
// import Employee from './types/Employee';
// import {ACTIONS, addEmployee, updateEmployee, EMPLOYEE_FILTERS, setEmployeeVisibilityFilter} from './actions';


declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
