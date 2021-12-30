import {
    ADD_SLC_ENTRY,
    CLEAR_SLC_ENTRIES,
    DELETE_SLC_ENTRY,
    LOAD_SLC_ENTRIES,
    LOAD_SLC_STEPS,
    SAVE_SLC_ENTRY,
    SELECT_SLC_ENTRY,
    SET_SLC_ENTRY_DATE,
    SET_SLC_ENTRY_EMPLOYEE_FILTER,
    UPDATE_SLC_ENTRY,
    UPDATE_SELECTED_SLC_ENTRY,
    LOAD_SLC_WORKORDER,
    CLEAR_SLC_ENTRY_ALERT,
    SET_SLC_ADD_OPERATION_WC,
    SET_SLC_ADD_OPERATION,
    LOADING_SLC_ADD_OPERATION_LOOKUP_FAILURE,
    NEW_ENTRY,
    SET_COMPANY,
    LOAD_SLC_ADD_OPERATION_LOOKUP, LOAD_SLC_IT,
} from "../constants/slc-entries";
import {format} from 'date-fns';

import {fetchDELETE, fetchGET, fetchPOST, buildPath } from './fetch';
import {FETCH_FAILURE, FETCH_INIT, FETCH_SUCCESS} from "../constants/app";

import {handleError, setAlert} from './app';
import {
    API_PATH_DELETE_ENTRY,
    API_PATH_ENTRIES,
    API_PATH_INVTRANSFER, API_PATH_OP_LOOKUP,
    API_PATH_SAVE_ENTRY, API_PATH_STEPS,
    API_PATH_WORKORDER
} from "../constants/paths";

export const clearEntries = () => ({type: CLEAR_SLC_ENTRIES});

export const addEntry = (entry) => ({type: ADD_SLC_ENTRY, entry});
export const filterEmployee = (id) => ({type: SET_SLC_ENTRY_EMPLOYEE_FILTER, id});
export const updateEntry = (entry, entries) => ({type: UPDATE_SLC_ENTRY, entry, entries});
export const selectEntry = (entry) => ({type: SELECT_SLC_ENTRY, entry});
export const updateSelectedEntry = (change) => ({type: UPDATE_SELECTED_SLC_ENTRY, change});
export const clearSLCEntryAlert = () => ({type: CLEAR_SLC_ENTRY_ALERT});
export const setCompany = (company) => ({type: SET_COMPANY, company});


export const setDate = (date) => (dispatch, getState) => {
    dispatch({type: SET_SLC_ENTRY_DATE, date});
    dispatch(fetchEntries(date));
};

export const fetchEntries = (date) => (dispatch, getState) => {
    const {SLCEntries} = getState();
    const {entryDate, loading} = SLCEntries;
    if (loading) {
        return;
    }
    if (!date) {
        date = entryDate;
    }
    dispatch({type: LOAD_SLC_ENTRIES, status: FETCH_INIT});
    const EntryDate = format(date, 'yyyy-MM-dd');
    const url = buildPath(API_PATH_ENTRIES, {EntryDate});
    return fetchGET(url, {cache: 'no-cache'})
        .then(({result}) => {
            const entries = result.filter(e => /INH|IMP|CON/.test(e.WorkCenter));
            dispatch({type: LOAD_SLC_ENTRIES, status: FETCH_SUCCESS, entries});
        })
        .catch(err => {
            dispatch(setAlert({message: err.message}));
            dispatch({type: LOAD_SLC_ENTRIES, status: FETCH_FAILURE, err});
        });
};

export const loadWorkOrder = () => (dispatch, getState) => {
    const state = getState();
    const {isLoadingWorkOrder, selected, company: Company} = state.SLCEntries;

    if (isLoadingWorkOrder) {
        return;
    }

    dispatch({type: LOAD_SLC_WORKORDER, status: FETCH_INIT});
    const WorkOrderNo = `0000000${selected.DocumentNo}`.substr(-7);
    const url = buildPath(API_PATH_WORKORDER, {Company, WorkOrderNo});
    fetchGET(url, {cache: 'no-cache'})
        .then(({workorder}) => {
            let operation = {};
            if (!workorder.operationDetail) {
                dispatch(setAlert({message: `WorkOrder ${selected.WorkOrderNo} not found`}));
                dispatch({TYPE: LOAD_SLC_WORKORDER, status: FETCH_FAILURE});
                return;
            }
            workorder.operationDetail
                .filter(d => d.StdRatePiece > 0 && d.idSteps)
                .forEach(d => {
                    if (!operation.OperationCode) {
                        operation = {...d};
                    }
                });
            const {OperationCode, StandardAllowedMinutes, OperationDescription, idSteps, WorkCenter} = operation;
            dispatch({
                type: LOAD_SLC_WORKORDER,
                status: FETCH_SUCCESS,
                workorder,
                selected: {
                    ...selected,
                    ItemCode: workorder.ItemBillNumber,
                    WarehouseCode: workorder.ParentWhse,
                    WorkCenter,
                    OperationCode,
                    StandardAllowedMinutes,
                    OperationDescription,
                    idSteps,
                }
            });
        })
        .catch(err => {
            dispatch({type: LOAD_SLC_WORKORDER, status: FETCH_FAILURE, err});
        });
};

export const loadInventoryTransfer = () => (dispatch, getState) => {
    const state = getState();
    const {isLoadingWorkOrder, selected, company: Company} = state.SLCEntries;

    if (isLoadingWorkOrder) {
        return;
    }

    dispatch({type: LOAD_SLC_IT, status: FETCH_INIT});
    const WorkOrderNo = `0000000${selected.DocumentNo}`.substr(-7);
    const url = buildPath(API_PATH_INVTRANSFER, {Company, WorkOrderNo});
    fetchGET(url, {cache: 'no-cache'})
        .then(res => {
            const {result} = res;
            if (!result || !result.length) {
                dispatch(setAlert({message: `I/T ${selected.WorkOrderNo} not found`}));
                dispatch({TYPE: LOAD_SLC_IT, status: FETCH_FAILURE});
                return;
            }
            let [operation] = result;
            const {OperationCode, StandardAllowedMinutes, OperationDescription, idSteps} = operation;
            dispatch({
                type: LOAD_SLC_IT,
                status: FETCH_SUCCESS,
                result,
                selected: {
                    ...selected,
                    ItemCode: operation.ItemCode,
                    WarehouseCode: operation.WarehouseCode,
                    WorkCenter: 'INH',
                    OperationCode,
                    StandardAllowedMinutes: Number(StandardAllowedMinutes),
                    OperationDescription,
                    idSteps,
                }
            });
        })
        .catch(err => {
            dispatch({type: LOAD_SLC_IT, status: FETCH_FAILURE, err});
        });

};

export const getVisibleEntries = (entries) => {
    const { list, employeeNumber } = entries;
    switch (employeeNumber) {
    case '':
    case 0:
        return {
            ...entries,
            list: list.filter(entry => entry.EmployeeNumber === employeeNumber)
        };
    default:
        return entries;
    }
};

export const saveEntry = (entry) => (dispatch, getState) => {
    const {SLCEntries} = getState();
    const {isLoading, isSaving, entryDate} = SLCEntries;
    if (isLoading || isSaving) {
        return;
    }

    dispatch({type: SAVE_SLC_ENTRY, status: FETCH_INIT});
    return fetchPOST(API_PATH_SAVE_ENTRY, entry)
        .then(res => {
            const [entry] = res.result;
            // const entries = res.result.map(e => new SLCEntry(e));
            const {EmployeeNumber, WorkCenter, FullName,} = entry;
            const nextEntry = {
                ...NEW_ENTRY,
                EmployeeNumber,
                WorkCenter,
                FullName,
                EntryDate: entryDate,
            };
            dispatch({type: SAVE_SLC_ENTRY, status: FETCH_SUCCESS, entry, nextEntry});
        })
        .catch(err => {
            console.log(err.message);
            dispatch({type: SAVE_SLC_ENTRY, status: FETCH_FAILURE});
            dispatch(handleError(err, SAVE_SLC_ENTRY));
        });
};

export const deleteEntry = (entry) => (dispatch, getState) => {
    dispatch({type: DELETE_SLC_ENTRY, status: FETCH_INIT});
    const url = buildPath(API_PATH_DELETE_ENTRY, {id: entry.id});
    return fetchDELETE(url)
        .then(res => {
            const {employees, SLCEntries} = getState();
            const newEntry = {
                ...NEW_ENTRY,
                ...employees.selectedSLC,
                EntryDate: SLCEntries.entryDate
            };
            dispatch({type: DELETE_SLC_ENTRY, status: FETCH_SUCCESS, entry, props: newEntry});
        })
        .catch(err => {
            dispatch(setAlert({message: err.message}));
            dispatch({type: DELETE_SLC_ENTRY, status: FETCH_FAILURE, err});
        });
};

export const fetchSteps = () => (dispatch, getState) => {
    const {SLCEntries} = getState();
    if (SLCEntries.isLoadingSteps) {
        return;
    }
    dispatch({type: LOAD_SLC_STEPS});
    const url = buildPath(API_PATH_STEPS, {});
    return fetchGET(url, {cache: 'no-cache'})
        .then(({result, error}) => {
            if (error) {
                dispatch(setAlert({message: error}));
            }
            const steps = result.map(s => ({...s, key: s.id}));
            dispatch({type: LOAD_SLC_STEPS, status: FETCH_SUCCESS, steps});
        })
        .catch(err => {
            console.log(err.message);
            return Promise.reject(err);
        });
};


export const setAddOperation = (code) => ({type: SET_SLC_ADD_OPERATION, code});
export const setAddOperationWC = (wc) => ({type: SET_SLC_ADD_OPERATION_WC, wc});
export const loadOperationLookup = () => (dispatch, getState) => {
    const {SLCEntries} = getState();
    const {company, addOperationWC: WorkCenter, selected} = SLCEntries;
    const search = selected.OperationCode || '%';
    const url = buildPath(API_PATH_OP_LOOKUP, {company, WorkCenter, search});
    dispatch({type: LOAD_SLC_ADD_OPERATION_LOOKUP, status: FETCH_INIT});
    fetchGET(url, {cache: 'no-cache'})
        .then(res => {
            const list = res.result
                .filter(op => !!op.idSteps)
                .map(op => {
                    op.StandardAllowedMinutes = Number(op.StandardAllowedMinutes);
                    return op;
                });
            dispatch({type: LOAD_SLC_ADD_OPERATION_LOOKUP, status: FETCH_SUCCESS, list});
        })
        .catch(err => {
            dispatch(setAlert({message: err.message}));
            dispatch({type: LOADING_SLC_ADD_OPERATION_LOOKUP_FAILURE, err});
        });
};


