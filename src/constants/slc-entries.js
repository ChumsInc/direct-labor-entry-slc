export const SET_COMPANY = 'SET_COMPANY';

export const ADD_SLC_ENTRY = 'ADD_SLC_ENTRY';
export const UPDATE_SLC_ENTRY = 'UPDATE_SLC_ENTRY';

export const SET_SLC_ENTRIES_VISIBILITY_FILTER = 'SET_SLC_ENTRIES_VISIBILITY_FILTER';

export const LOAD_SLC_ENTRIES = 'LOAD_SLC_ENTRIES';
export const SAVE_SLC_ENTRY = 'SAVE_SLC_ENTRY';
export const DELETE_SLC_ENTRY = 'DELETE_SLC_ENTRY';

export const CLEAR_SLC_ENTRIES = 'CLEAR_SLC_ENTRIES';

export const SELECT_SLC_ENTRY = 'SELECT_SLC_ENTRY';
export const UPDATE_SELECTED_SLC_ENTRY = 'UPDATE_SELECTED_SLC_ENTRY';


export const SET_SLC_ENTRY_DATE = 'SET_SLC_ENTRY_DATE';
export const SET_SLC_ENTRY_EMPLOYEE_FILTER = 'SET_SLC_ENTRY_EMPLOYEE_FILTER';

export const LOAD_SLC_STEPS = 'LOAD_SLC_STEPS';
export const LOADING_SLC_STEPS_FAILURE = 'LOADING_SLC_STEPS_FAILURE';
export const RECEIVE_SLC_STEPS = 'RECEIVE_SLC_STEPS';

export const LOAD_SLC_WORKORDER = 'LOAD_SLC_WORKORDER';
export const LOAD_SLC_IT = 'LOAD_SLC_IT';

export const CLEAR_SLC_ENTRY_ALERT = 'CLEAR_SLC_ENTRY_ALERT';

export const SET_SLC_ADD_OPERATION = 'SET_SLC_ADD_OPERATION';
export const SET_SLC_ADD_OPERATION_WC = 'SET_SLC_ADD_OPERATION_WC';
export const LOAD_SLC_ADD_OPERATION_LOOKUP = 'LOAD_SLC_ADD_OPERATION_LOOKUP';
export const LOADING_SLC_ADD_OPERATION_LOOKUP_FAILURE = 'LOADING_SLC_ADD_OPERATION_LOOKUP_FAILURE';


export const NEW_ENTRY = {
    id: 0,
    EmployeeNumber: '',
    EntryDate: null,
    LineNo: 1,
    idSteps: 0,
    Minutes: 0,
    Quantity: 0,
};

export const rate = (entry) => entry.Quantity === 0 ? 0 : (entry.Minutes / entry.Quantity);
export const isRateTooLow = (entry) => rate(entry) < (entry.StandardAllowedMinutes * 0.9);
export const isRateTooHigh = (entry) => entry.StandardAllowedMinutes > 0 && rate(entry) > (entry.StandardAllowedMinutes * 1.1);
export const isOutOfLimits = (entry) => entry.StandardAllowedMinutes > 0 && rate(entry) > (entry.StandardAllowedMinutes * 1.5) || rate(entry) < (entry.StandardAllowedMinutes * 0.5);
