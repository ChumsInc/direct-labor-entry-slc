import {combineReducers} from 'redux';

import {
    defaultEmployeeSort,
    EmployeeAction,
    employeeSelected,
    employeesFetchListFailed,
    employeesFetchListRequested,
    employeesFetchListSucceeded,
    employeeSorter,
    employeesShowActive,
    employeesShowInactive,
    saveEmployeeFailed,
    saveEmployeeRequested,
    saveEmployeeSucceeded,
    employeeSetVisibilityFilter
} from './actionTypes';
import {Employee, EmployeeFilter} from "../common-types";

const defaultState = {
    isFetching: false,
};

const listReducer = (state: Employee[] = [], action: EmployeeAction): Employee[] => {
    const {type, payload, status} = action;
    switch (type) {
    case saveEmployeeSucceeded:
        if (payload?.employee) {
            return [
                ...state.filter(e => e.EmployeeNumber !== payload.employee?.EmployeeNumber),
                payload.employee,
            ].sort(employeeSorter(defaultEmployeeSort))
        }
        return state;
    case employeesFetchListSucceeded:
        if (payload?.list) {
            return [...payload.list].sort(employeeSorter(defaultEmployeeSort));
        }
        return state;
    default:
        return state;
    }
};


const visibilityFilterReducer = (state: EmployeeFilter = 'slc', action: EmployeeAction): string => {
    const {type, payload} = action;
    switch (type) {
    case employeeSetVisibilityFilter:
        return payload?.filter || 'all';
    default:
        return state;
    }
};

const showInactiveReducer = (state: boolean = false, action: EmployeeAction): boolean => {
    switch (action.type) {
    case employeesShowInactive:
        return true;
    case employeesShowActive:
        return false;
    default:
        return state;
    }
}

const isLoadingReducer = (state: boolean = false, action: EmployeeAction): boolean => {
    const {type} = action;
    switch (type) {
    case employeesFetchListRequested:
        return true;
    case employeesFetchListSucceeded:
    case employeesFetchListFailed:
        return false;
    default:
        return state;
    }
};

const selectedReducer = (state: Employee | null = null, action: EmployeeAction): Employee | null => {
    const {type, payload, status} = action;
    switch (type) {
    case saveEmployeeSucceeded:
        if (payload?.employee) {
            return {...payload.employee};
        }
        return state;
    case employeeSelected:
        if (payload?.employee) {
            return payload.employee;
        }
        return null;
    case employeeSetVisibilityFilter:
        return null;
    default:
        return state;
    }
};

// const selectedSLCReducer = (state: Employee | null = null, action: EmployeeAction): Employee | null => {
//     const {type, payload, status} = action;
//     switch (type) {
//     case saveEmployeeRequested:
//         if (status === FETCH_SUCCESS && payload?.employee) {
//             return {...payload.employee};
//         }
//         return state;
//     case employeeSelected:
//         if (payload?.employee) {
//             return payload.employee;
//         }
//         return null;
//     case UPDATE_SELECTED_EMPLOYEE:
//         if (!!state && payload?.props) {
//             return {...state, ...payload.props};
//         }
//         return state;
//     case SET_EMPLOYEE_VISIBILITY_FILTER:
//         return null;
//     default:
//         return state;
//     }
// };

const isSavingReducer = (state: boolean = false, action: EmployeeAction) => {
    const {type, status} = action;
    switch (type) {
    case saveEmployeeRequested:
        return true;
    case saveEmployeeSucceeded:
    case saveEmployeeFailed:
        return false;
    default:
        return state;
    }
};

const loadedReducer = (state: boolean = false, action: EmployeeAction): boolean => {
    const {type} = action;
    switch (type) {
    case employeesFetchListSucceeded:
        return true;
    default:
        return state;
    }
}

export default combineReducers({
    list: listReducer,
    visibilityFilter: visibilityFilterReducer,
    showInactive: showInactiveReducer,
    isLoading: isLoadingReducer,
    isSaving: isSavingReducer,
    selected: selectedReducer,
    // selectedSLC: selectedSLCReducer,
    loaded: loadedReducer,
});



