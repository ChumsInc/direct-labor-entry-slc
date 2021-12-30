import {
    DELETE_HURRICANE_ENTRY,
    FETCH_HURRICANE_ENTRIES,
    FETCH_STEPS,
    LOADING_HURR_ENTRIES,
    LOADING_HURR_STEPS,
    NEW_ENTRY,
    SAVE_HURRICANE_ENTRY,
    SAVING_HURR_ENTRY_FAILURE,
    SELECT_HURR_EMPLOYEE,
    SELECT_HURR_ENTRY,
    SET_HURR_ENTRY,
    SET_HURR_ENTRY_DATE,
    UPDATE_HURR_ENTRY,
    UPDATE_SELECTED_HURR_ENTRY
} from "../constants/hurricane-entries";
import StepCode from "../types/StepCode";
import {RECEIVE_DL_STEPS} from "../constants/steps";
import {format} from 'date-fns'
import {fetchDELETE, fetchGET, fetchPOST} from "./fetch";
import {FETCH_FAILURE, FETCH_INIT, FETCH_SUCCESS} from "../constants/app";
import {API_PATH_DELETE_ENTRY, API_PATH_ENTRIES, API_PATH_SAVE_ENTRY} from "../constants/paths";
import {handleError} from "./app";


export const setEntry = (props) => ({type: SET_HURR_ENTRY, props});
export const setDate = (date) => ({type: SET_HURR_ENTRY_DATE, date});
export const updateEntry = (entry, entries) => ({type: UPDATE_HURR_ENTRY, entry, entries});
export const selectEntry = (entry) => ({type: SELECT_HURR_ENTRY, entry});
export const selectHurricaneEmployee = (employee, entry) => ({type: SELECT_HURR_EMPLOYEE, employee, entry});

export const fetchEntries = (date) => (dispatch, getState) => {
    const {hurricaneEntries} = getState();
    if (hurricaneEntries.isLoading || hurricaneEntries.isSaving) {
        return;
    }

    if (!date) {
        date = hurricaneEntries.entryDate;
    }

    dispatch({type: FETCH_HURRICANE_ENTRIES, status: FETCH_INIT});
    const url = API_PATH_ENTRIES
        .replace(':EntryDate', encodeURIComponent(format(date, 'yyyy-MM-dd')));
    return fetchGET(url, {cache: 'no-cache'})
        .then(res => {
            const entries = res.result || [];
            dispatch({type: FETCH_HURRICANE_ENTRIES, status: FETCH_SUCCESS, entries});
        })
        .catch(err => {
            dispatch({type: FETCH_HURRICANE_ENTRIES, status: FETCH_FAILURE});
            dispatch(handleError(err, FETCH_HURRICANE_ENTRIES));
        });
};

export const newEntry = () => (dispatch, getState) => {
    const {hurricaneEntry} = getState();
    const {employee, list, entryDate} = hurricaneEntry;
    if (!employee.employeeNumber) {
        return dispatch({...NEW_ENTRY});
    }
    const [{LineNo = 0} = {}] = list.filter(e => e.EmployeeNumber === employee.EmployeeNumber)
        .sort((a, b) => a.LineNo - b.LineNo)
        .reverse();
    dispatch(selectEntry({
        ...NEW_ENTRY,
        EmployeeNumber: employee.EmployeeNumber,
        EntryDate: entryDate,
        LineNo: LineNo + 1
    }));
}


export const saveEntry = (entry) => (dispatch, getState) => {
    const {hurricaneEntries} = getState();
    const {entryDate, employee, isSaving, isLoading} = hurricaneEntries;
    if (isSaving || isLoading) {
        return;
    }

    dispatch({type: SAVE_HURRICANE_ENTRY, status: FETCH_INIT});
    return fetchPOST(API_PATH_SAVE_ENTRY, entry)
        .then(res => {
            const [entry] = res.result;
            const nextEntry = {
                ...NEW_ENTRY,
                EntryDate: entryDate,
                EmployeeNumber: employee.EmployeeNumber || '',
                LineNo: entry.LineNo + 1
            };
            dispatch({type: SAVE_HURRICANE_ENTRY, status: FETCH_SUCCESS, entry, nextEntry});
        })
        .catch(err => {
            dispatch({type: SAVE_HURRICANE_ENTRY, status: FETCH_FAILURE});
            dispatch(handleError(err, SAVE_HURRICANE_ENTRY));
        });
};

export const deleteEntry = (entry = {}) => (dispatch, getState) => {
    if (!entry.id) {
        return;
    }
    const {hurricaneEntries} = getState();
    const {isLoading, isSaving, entryDate, employee} = hurricaneEntries;
    if (isLoading || isSaving) {
        return;
    }
    const nextEntry = {
        ...NEW_ENTRY,
        EntryDate: entryDate,
        EmployeeNumber: employee.EmployeeNumber || '',
        LineNo: null,
    };

    dispatch({type: DELETE_HURRICANE_ENTRY, status: FETCH_INIT});
    const url = API_PATH_DELETE_ENTRY
        .replace(':id', encodeURIComponent(entry.id));

    return fetchDELETE(url)
        .then(res => {
            dispatch({type: DELETE_HURRICANE_ENTRY, status: FETCH_SUCCESS, id: entry.id, nextEntry});
        })
        .catch(err => {
            dispatch({type: DELETE_HURRICANE_ENTRY, status: FETCH_FAILURE});
            dispatch(handleError(err, DELETE_HURRICANE_ENTRY));
        });
};

const shouldReceiveSteps = (state) => {
    return !state.dlSteps.isLoading
        && state.dlSteps.list.length === 0
};

const receiveSteps = (steps) => ({type: RECEIVE_DL_STEPS, steps});

export const fetchStepsIfNeeded = () => (dispatch, getState) => {
    if (shouldReceiveSteps(getState())) {
        dispatch({type: FETCH_STEPS, status: FETCH_INIT});
        const url = '/node/production/dl/step-codes';
        return fetchGET(url)
            .then(res => {
                if (res.error) {
                    dispatch({type: FETCH_STEPS, status: FETCH_FAILURE});
                    return Promise.reject(new Error(res.error));
                }
                const steps = res.result.map(s => new StepCode(s));
                dispatch(receiveSteps(steps));
            })
            .catch(err => {
                console.log(err.message);

            });
    }
};

export const loadSteps = () => ({type: LOADING_HURR_STEPS});


