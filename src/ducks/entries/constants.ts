import {BasicEntry, Entry} from "../common-types";

export const entriesFetchListRequested = 'entries/fetchListRequested';
export const entriesFetchListSucceeded = 'entries/fetchListSucceeded';
export const entriesFetchListFailed = 'entries/fetchListFailed';

export const entriesSaveRequested = 'entries/saveRequested';
export const entriesSaveSucceeded = 'entries/saveSucceeded';
export const entriesSaveFailed = 'entries/saveFailed';

export const entriesDeleteRequested = 'entries/deleteRequested';
export const entriesDeleteSucceeded = 'entries/deleteSucceeded';
export const entriesDeleteFailed = 'entries/deleteFailed';

export const entriesFilterWorkCenter = 'entries/filterWorkCenter';


export const FETCH_HURRICANE_ENTRIES = 'FETCH_HURRICANE_ENTRIES';
export const SAVE_HURRICANE_ENTRY = 'SAVE_HURRICANE_ENTRY';
export const DELETE_HURRICANE_ENTRY = 'DELETE_HURRICANE_ENTRY';

export const ADD_HURR_ENTRY = 'ADD_HURR_ENTRY';
export const UPDATE_HURR_ENTRY = 'UPDATE_HURR_ENTRY';

export const SET_HURR_ENTRIES_VISIBILITY_FILTER = 'SET_HURR_ENTRIES_VISIBILITY_FILTER';

export const hurricaneUpdateEntry = 'hurricane/updateEntry';

export const LOADING_HURR_ENTRIES = 'LOADING_HURR_ENTRIES';
export const LOADING_HURR_ENTRIES_FAILURE = 'LOADING_HURR_ENTRIES_FAILURE';
export const LOADING_HURR_ENTRIES_SUCCESS = 'LOADING_HURR_ENTRIES_SUCCESS';
export const RECEIVE_HURR_ENTRIES_LIST = 'RECEIVE_HURR_ENTRIES_LIST';
export const RECEIVE_HURR_ENTRIES_TOTALS = 'RECEIVE_HURR_ENTRIES_TOTALS';
export const CLEAR_HURR_ENTRIES = 'CLEAR_HURR_ENTRIES';

export const hurricaneSelectEmployee = 'hurricane/selectEmployee';
export const hurricaneSelectEntry = 'hurricane/selectEntry';
export const UPDATE_SELECTED_HURR_ENTRY = 'UPDATE_SELECTED_HURR_ENTRY';

export const SAVING_HURR_ENTRY = 'SAVING_HURR_ENTRY';
export const SAVING_HURR_ENTRY_FAILURE = 'SAVING_HURR_ENTRY_FAILURE';
export const SAVING_HURR_ENTRY_SUCCESS = 'SAVING_HURR_ENTRY_SUCCESS';

export const DELETE_HURR_ENTRY = 'DELETE_HURR_ENTRY';

export const hurricaneSetEntryDate = 'hurricane/setEntryDate';
export const SET_HURR_ENTRY_EMPLOYEE_FILTER = 'SET_HURR_ENTRY_EMPLOYEE_FILTER';

export const FETCH_STEPS = 'FETCH_STEPS';
export const LOADING_HURR_STEPS = 'LOADING_HURR_STEPS';
export const LOADING_HURR_STEPS_FAILURE = 'LOADING_HURR_STEPS_FAILURE';
export const LOADING_HURR_STEPS_SUCCESS = 'LOADING_HURR_STEPS_SUCCESS';
export const RECEIVE_HURR_STEPS = 'RECEIVE_HURR_STEPS';

export const NEW_ENTRY:Entry = {
    id: 0,
    EmployeeNumber: '',
    WorkCenter: '',
    FullName: '',
    EntryDate: null,
    LineNo: 1,
    idSteps: 0,
    Minutes: 0,
    Quantity: 0,
    StandardAllowedMinutes: 0,
    AllowedMinutes: 0,
    UPH: 0,
    StdUPH: 0,
    Description: '',
    DocumentNo: '',
    DocumentType: '',
    ItemCode: '',
    WarehouseCode: '',
    StepCode: '',
};

export const rate = (entry:Entry) => entry.Quantity === 0 ? 0 : (entry.Minutes / entry.Quantity);
export const isRateTooLow = (entry:Entry) => rate(entry) < (entry.StandardAllowedMinutes * 0.9);
export const isRateTooHigh = (entry:Entry) => entry.StandardAllowedMinutes > 0 && rate(entry) > (entry.StandardAllowedMinutes * 1.1);
export const isOutOfLimits = (entry:Entry) => entry.StandardAllowedMinutes > 0 && rate(entry) > (entry.StandardAllowedMinutes * 1.5) || rate(entry) < (entry.StandardAllowedMinutes * 0.5);
