import {combineReducers} from 'redux';
import {DISMISS_ALERT, SET_ALERT, SET_TAB} from "../constants/app";
import {now} from "../utils";
import {appStorage, STORAGE_KEYS} from "../utils/appStorage";

const defaultTab = appStorage.getItem(STORAGE_KEYS.TAB);

const alertSort = (a, b) => a.id - b.id;

const alerts = (state = [], action) => {
    const {type, props, id} = action;
    switch (type) {
    case SET_ALERT:
        if (!!props.context) {
            const [{id = now(), count = 0} = {}] = state.filter(a => a.context === props.context);
            return [
                ...state.filter(a => a.context !== props.context),
                {...props, id, count: count + 1}
            ].sort(alertSort);
        }
        return [...state, {...props, count: 1, id: now()}].sort(alertSort);
    case DISMISS_ALERT:
        return [...state.filter(alert => alert.id !== id)];
    default:
        return state;
    }
};

const tab = (state = defaultTab, action) => {
    const {type, tab} = action;
    switch (type) {
    case SET_TAB:
        appStorage.setItem(STORAGE_KEYS.TAB, tab)
        return tab;
    default:
        return state;
    }
};


export default combineReducers({
    alerts,
    tab,
})
