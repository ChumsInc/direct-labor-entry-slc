import {combineReducers} from 'redux';
import {FETCH_RENDERED_REPORT, FETCH_REPORT} from "../constants/reports";
import {FETCH_INIT, FETCH_SUCCESS} from "../constants/app";

const isLoading = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case FETCH_REPORT:
    case FETCH_RENDERED_REPORT:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

const data = (state = [], action) => {
    const {type, status, data = []} = action;
    switch (type) {
    case FETCH_REPORT:
        if (status === FETCH_SUCCESS) {
            return [...data];
        }
        return state;
    default:
        return state;
    }
};

const html = (state = null, action) => {
    const {type, status, html} = action;
    switch (type) {
    case FETCH_RENDERED_REPORT:
        if (status === FETCH_SUCCESS) {
            return html || null;
        }
        return state;
    default:
        return state;
    }
};

export default combineReducers({
    isLoading,
    data,
    html,
});


