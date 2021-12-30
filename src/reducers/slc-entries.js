import {combineReducers} from 'redux';
import {
    ADD_SLC_ENTRY,
    CLEAR_SLC_ENTRIES,
    CLEAR_SLC_ENTRY_ALERT,
    DELETE_SLC_ENTRY,
    LOAD_SLC_ADD_OPERATION_LOOKUP,
    LOAD_SLC_ENTRIES,
    LOAD_SLC_IT,
    LOAD_SLC_STEPS,
    LOAD_SLC_WORKORDER,
    LOADING_SLC_ADD_OPERATION_LOOKUP_FAILURE,
    LOADING_SLC_STEPS_FAILURE,
    NEW_ENTRY,
    RECEIVE_SLC_STEPS,
    SAVE_SLC_ENTRY,
    SELECT_SLC_ENTRY,
    SET_COMPANY,
    SET_SLC_ADD_OPERATION,
    SET_SLC_ADD_OPERATION_WC,
    SET_SLC_ENTRY_DATE,
    UPDATE_SELECTED_SLC_ENTRY,
    UPDATE_SLC_ENTRY
} from "../constants/slc-entries";
import {SELECT_SLC_EMPLOYEE} from "../ducks/employees/constants";

import {FETCH_FAILURE, FETCH_INIT, FETCH_SUCCESS, SET_ERROR} from "../constants/app";
import {RECEIVE_DL_STEPS} from "../constants/steps";
import {previousSLCWorkDay} from "../utils/workDays";

const company = (state = 'chums', action) => {
    const {type, company} = action;
    switch (type) {
    case SET_COMPANY:
        return company;
    default:
        return state;
    }
};

const list = (state = [], action) => {
    const {type, status, entry, newEntry, entries} = action;
    switch (type) {
    case LOAD_SLC_ENTRIES:
        return status === FETCH_SUCCESS ? entries : [];
    case SAVE_SLC_ENTRY:
        if (status === FETCH_SUCCESS) {
            return [
                ...state.filter(e => e.id === entry.id),
                {...entry}
            ];
        }
        return state;

    case CLEAR_SLC_ENTRIES:
    case SET_SLC_ENTRY_DATE:
        return [];

    case DELETE_SLC_ENTRY:
        return status === FETCH_SUCCESS
            ? [...state.filter(e => e.id !== entry.id)]
            : state;

    default:
        return state;
    }
};

const steps = (state = [], action) => {
    const {type, steps} = action;
    switch (type) {
    case RECEIVE_DL_STEPS:
        return steps;
    default:
        return state;
    }
};

const isLoading = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case LOAD_SLC_ENTRIES:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

const isLoadingSteps = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case LOAD_SLC_STEPS:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

const workOrder = (state = {}, action) => {
    const {type, status, workorder} = action;
    switch (action.type) {
    case LOAD_SLC_WORKORDER:
        return status === FETCH_SUCCESS
            ? workorder
            : {};
    case LOAD_SLC_IT:
        return {};
    default:
        return state;
    }
};

const inventoryTransfer = (state = [], action) => {
    const {type, status, result} = action;
    switch (type) {
    case LOAD_SLC_IT:
        return status === FETCH_SUCCESS
            ? [...result]
            : [];
    case LOAD_SLC_WORKORDER:
        return [];
    default:
        return state;
    }
};

const isLoadingWorkOrder = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case LOAD_SLC_WORKORDER:
    case LOAD_SLC_IT:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

const selected = (state = {...NEW_ENTRY, WorkCenter: 'INH'}, action) => {
    const {type, status, entry, employee, date, list, change, selected, props, nextEntry} = action;
    switch (type) {
    case SET_SLC_ENTRY_DATE:
        return {...state, EntryDate: date};
    case SAVE_SLC_ENTRY:
        return {...nextEntry};

    case SELECT_SLC_ENTRY:
        return {...entry, OperationCode: entry.StepCode, OperationDescription: entry.Description};

    case DELETE_SLC_ENTRY:
        return {...props};

    case UPDATE_SELECTED_SLC_ENTRY:
        return {...state, ...change};

    case SELECT_SLC_EMPLOYEE:
        return {...state, EmployeeNumber: employee.EmployeeNumber};

    case LOAD_SLC_WORKORDER:
    case LOAD_SLC_IT:
        return status === FETCH_SUCCESS
            ? {...state, ...selected}
            : state;

    case LOAD_SLC_ADD_OPERATION_LOOKUP:
        if (status === FETCH_SUCCESS) {
            const [op] = list.filter(op => op.OperationCode.toUpperCase() === state.OperationCode.toUpperCase());
            if (!op) {
                return state;
            }
            return {...state, ...op};
        }
        return state;
    default:
        return state;
    }
};

const isSaving = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case SAVE_SLC_ENTRY:
    case DELETE_SLC_ENTRY:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

const entryDate = (state = previousSLCWorkDay(), action) => {
    const {type, date} = action;
    switch (type) {
    case SET_SLC_ENTRY_DATE:
        return date;
    default:
        return state;
    }
};

const addOperation = (state = '', action) => {
    const {type, code} = action;
    switch (type) {
    case SET_SLC_ADD_OPERATION:
        return code;
    default:
        return state;
    }
};

const addOperationWC = (state = 'INH', action) => {
    const {type, wc} = action;
    switch (type) {
    case SET_SLC_ADD_OPERATION_WC:
        return wc;
    default:
        return state;
    }
};

const addOperationList = (state = [], action) => {
    const {type, status, list} = action;
    switch (type) {
    case LOAD_SLC_ADD_OPERATION_LOOKUP:
        return status === FETCH_SUCCESS ? list : [];
    default:
        return state;
    }
};

export default combineReducers({
    company,
    list,
    isLoading,
    isLoadingWorkOrder,
    workOrder,
    inventoryTransfer,
    isSaving,
    selected,
    entryDate,
    steps,
    isLoadingSteps,
    addOperation,
    addOperationWC,
    addOperationList,
});
