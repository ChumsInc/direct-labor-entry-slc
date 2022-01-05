import {
    ReportAction,
    reportsFetchDataFailed,
    reportsFetchDataRequested,
    reportsFetchDataSucceeded,
    reportsFetchHTMLFailed,
    reportsFetchHTMLRequested,
    reportsFetchHTMLSucceeded,
    reportsFilterEmployee,
    reportsFilterItem,
    reportsFilterOperation,
    reportsSetGroupBy,
    reportsSetMaxDate,
    reportsSetMinDate,
    reportsSetWorkCenter,
    reportsToggleFilterInactive
} from "./actionTypes";
import {setDay, subWeeks} from "date-fns";
import {WORK_CENTER_INH} from "./constants";
import {ReportData, ReportGrouping} from "./types";
import {combineReducers} from "redux";
import {appStorage, STORAGE_KEYS} from "../../utils/appStorage";

interface AppDefaults {
    minDate: string,
    maxDate: string,
    workCenter: string,
    showInactive: boolean,
    employee: string,
    operationId: number,
    grouping: ReportGrouping,
}

const appDefaults: AppDefaults = {
    minDate: setDay(subWeeks(new Date(), 1), 1).toISOString(),
    maxDate: setDay(subWeeks(new Date(), 1), 5).toISOString(),
    workCenter: WORK_CENTER_INH,
    showInactive: false,
    employee: '',
    operationId: 0,
    grouping: {
        0: '',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: ''
    }
}

const defaults: AppDefaults = {
    minDate: appStorage.getItem(STORAGE_KEYS.reports.minDate)
        ? new Date(appStorage.getItem(STORAGE_KEYS.reports.minDate)).toISOString()
        : appDefaults.minDate,
    maxDate: appStorage.getItem(STORAGE_KEYS.reports.maxDate)
        ? new Date(appStorage.getItem(STORAGE_KEYS.reports.maxDate)).toISOString()
        : appDefaults.maxDate,
    workCenter: appStorage.getItem(STORAGE_KEYS.reports.workCenter) || appDefaults.workCenter,
    showInactive: appStorage.getItem(STORAGE_KEYS.reports.showInactive) || appDefaults.showInactive,
    employee: appStorage.getItem(STORAGE_KEYS.reports.employee) || appDefaults.employee,
    operationId: appStorage.getItem(STORAGE_KEYS.reports.operationId) || appDefaults.operationId,
    grouping: appStorage.getItem(STORAGE_KEYS.reports.grouping) || appDefaults.grouping,
}

const minDateReducer = (state: string = defaults.minDate, action: ReportAction): string => {
    const {type, payload} = action;
    switch (type) {
    case reportsSetMinDate:
        if (payload?.date) {
            appStorage.setItem(STORAGE_KEYS.reports.minDate, payload.date);
            return payload.date;
        }
        return state;
    default:
        return state;
    }
}

const maxDateReducer = (state: string = defaults.maxDate, action: ReportAction): string => {
    const {type, payload} = action;
    switch (type) {
    case reportsSetMaxDate:
        if (payload?.date) {
            appStorage.setItem(STORAGE_KEYS.reports.maxDate, payload.date);
            return payload.date;
        }
        return state;
    default:
        return state;
    }
}

const workCenterReducer = (state: string = defaults.workCenter, action: ReportAction): string => {
    const {type, payload} = action;
    switch (type) {
    case reportsSetWorkCenter:
        appStorage.setItem(STORAGE_KEYS.reports.workCenter, payload?.value || '');
        return String(payload?.value || WORK_CENTER_INH);
    default:
        return state;
    }
}

const showInactiveReducer = (state: boolean = defaults.showInactive, action: ReportAction): boolean => {
    switch (action.type) {
    case reportsToggleFilterInactive:
        appStorage.setItem(STORAGE_KEYS.reports.showInactive, !state);
        return !state;
    default:
        return state;
    }
}

const filterEmployeeReducer = (state: string = defaults.employee, action: ReportAction): string => {
    const {type, payload} = action;
    switch (type) {
    case reportsFilterEmployee:
        appStorage.setItem(STORAGE_KEYS.reports.employee, payload?.value || '');
        return payload?.value || '';
    default:
        return state;
    }
}

const filterOperationReducer = (state: number = defaults.operationId, action: ReportAction): number => {
    const {type, payload} = action;
    switch (type) {
    case reportsFilterOperation:
        appStorage.setItem(STORAGE_KEYS.reports.operationId, payload?.id || 0);
        return payload?.id || 0;
    default:
        return state;
    }
}

const filterItemReducer = (state: string = '', action: ReportAction): string => {
    const {type, payload} = action;
    switch (type) {
    case reportsFilterItem:
        return payload?.value || '';
    default:
        return state;
    }
}

const groupByReducer = (state: ReportGrouping = defaults.grouping, action: ReportAction): ReportGrouping => {
    const {type, payload} = action;
    switch (type) {
    case reportsSetGroupBy:
        if (payload?.id !== undefined && payload?.value !== undefined) {
            const newState = {...state, [payload.id]: payload.value};
            appStorage.setItem(STORAGE_KEYS.reports.grouping, newState);
            return newState;
        }
        return state;
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: ReportAction): boolean => {
    const {type} = action;
    switch (type) {

    case reportsFetchDataRequested:
    case reportsFetchHTMLRequested:
        return true;
    case reportsFetchDataSucceeded:
    case reportsFetchDataFailed:
    case reportsFetchHTMLSucceeded:
    case reportsFetchHTMLFailed:
        return false;
    default:
        return state;
    }
};

const dataReducer = (state: ReportData[] = [], action: ReportAction): ReportData[] => {
    const {type, payload} = action;
    switch (type) {
    case reportsFetchDataSucceeded:
        if (payload?.data) {
            return [...payload.data];
        }
        return state;
    default:
        return state;
    }
};

const htmlReducer = (state = '', action: ReportAction): string => {
    const {type, payload} = action;
    switch (type) {
    case reportsFetchHTMLSucceeded:
        if (payload?.html) {
            return payload.html || '';
        }
        return state;
    default:
        return state;
    }
};


export default combineReducers({
    minDate: minDateReducer,
    maxDate: maxDateReducer,
    workCenter: workCenterReducer,
    showInactive: showInactiveReducer,
    filterEmployee: filterEmployeeReducer,
    filterOperation: filterOperationReducer,
    filterItem: filterItemReducer,
    groupBy: groupByReducer,
    loading: loadingReducer,
    data: dataReducer,
    html: htmlReducer,
})
