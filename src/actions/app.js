import {appStorage, STORAGE_KEYS} from '../utils/appStorage';

/**
 *
 * @param {Error} err
 * @param {String} context
 * @return {{type: string, props: {context: string, color: string, title: *, message: *}}}
 */
export const handleError = (err, context = '') => {
    console.trace(err.message);
    return {
        type: SET_ALERT,
        props: {color: 'danger', title: err.name, message: err.message, context}
    };
};

export const setAlert = ({color = 'warning', title = 'Oops!', message = 'There was an error', action}) => ({
    type: SET_ALERT,
    alert: {color, title, message, action, count: 1}
});

export const dismissAlert = (id) => ({type: DISMISS_ALERT, id});

export const setUserError = (err) => ({type: SET_ERROR, err});

export const setTab = (tab, employeeFilter) => {
    if (!tab) {
        tab = appStorage.getItem(STORAGE_KEYS.TAB) || TABS.HURR_ENTRY.key;
        employeeFilter = TABS[tab].employeeFilter;
    }
    appStorage.setItem(STORAGE_KEYS.TAB, tab);
    return {type: SET_TAB, tab, employeeFilter}
};

export const getTab = () => {
    const tab = appStorage.getItem(STORAGE_KEYS.TAB);
    if (!tab || !TABS[tab]) {
        return TABS.HURR_ENTRY.key;
    }
    return tab;
};

