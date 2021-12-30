import {
    entriesDeleteFailed,
    entriesDeleteRequested,
    entriesDeleteSucceeded,
    entriesFetchListFailed,
    entriesFetchListRequested,
    entriesFetchListSucceeded,
    entriesSaveFailed,
    entriesSaveRequested,
    entriesSaveSucceeded,
    hurricaneSelectEntry,
    NEW_ENTRY,
    hurricaneSelectEmployee,
    hurricaneUpdateEntry,
    hurricaneSetEntryDate,
    UPDATE_HURR_ENTRY, entriesFilterWorkCenter
} from "./constants";

import {format} from 'date-fns'
import {fetchJSON} from "chums-ducks";
import {API_PATH_DELETE_ENTRY, API_PATH_ENTRIES, API_PATH_SAVE_ENTRY} from "../../constants/paths";
import {EntryAction, EntryThunkAction} from "./actionTypes";
import {BasicEntry, BasicEntryField, BasicEntryProps, Employee, Entry} from "../common-types";
import {
    selectEmployeeEntryList,
    selectEntryDate,
    selectHurricaneEmployee,
    selectLoading,
    selectSaving
} from "./selectors";
import {entrySorter} from "./utils";


export const updateEntryAction = (change:object):EntryAction => ({type: hurricaneUpdateEntry, payload: {change}});
export const setEntryDateAction = (date: Date|null):EntryAction => ({type: hurricaneSetEntryDate, payload: {date}});
export const selectEntryAction = (entry: Entry):EntryAction => ({type: hurricaneSelectEntry, payload: {entry}});
export const selectHurricaneEmployeeAction = (employee: Employee|null, entry?: Entry):EntryAction => ({
    type: hurricaneSelectEmployee,
    payload: {employee, entry}
});

export const selectWorkCenterAction = (workCenters:string[] = []) => ({type: entriesFilterWorkCenter, payload: {workCenters}});

export const fetchEntriesAction = (): EntryThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state) || selectSaving(state)) {
                return;
            }
            const date = selectEntryDate(state);
            dispatch({type: entriesFetchListRequested});
            const url = API_PATH_ENTRIES
                .replace(':EntryDate', encodeURIComponent(format(date, 'yyyy-MM-dd')));
            const res = await fetchJSON(url, {cache: 'no-cache'});
            dispatch({type: entriesFetchListSucceeded, payload: {list: res.result || []}});
            dispatch(newEntryAction());
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchEntriesAction()", error.message);
                return dispatch({
                    type: entriesFetchListFailed,
                    payload: {error, context: entriesFetchListRequested}
                })
            }
            console.error("fetchEntriesAction()", error);
        }
    };

export const newEntryAction = (): EntryThunkAction => (dispatch, getState) => {
    try {
        const state = getState();
        const employee = selectHurricaneEmployee(state);
        if (!employee) {
            return;
        }
        const entries = selectEmployeeEntryList(state);
        const entryDate = selectEntryDate(state);
        const [lastEntry] = entries.sort(entrySorter({field: 'LineNo', ascending: false}))
        dispatch(selectEntryAction({
            ...NEW_ENTRY,
            EmployeeNumber: employee.EmployeeNumber,
            EntryDate: entryDate.toISOString(),
            LineNo: (lastEntry?.LineNo || 0) + 1
        }));
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("newEntry()", error.message);
        }
        console.error("newEntry()", error);
    }
}


export const saveEntryAction = (entry: Entry): EntryThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state) || selectSaving(state)) {
                return;
            }
            dispatch({type: entriesSaveRequested});
            const body = JSON.stringify(entry);
            const res = await fetchJSON(API_PATH_SAVE_ENTRY, {method: 'POST', body});
            const [savedEntry] = res.result;
            dispatch({type: entriesSaveSucceeded, payload: {savedEntry}});
            dispatch(newEntryAction());
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("saveEntry()", error.message);
                return dispatch({
                    type: entriesSaveFailed,
                    payload: {error, context: entriesSaveRequested}
                })
            }
            console.error("saveEntry()", error);
        }
    };

export const deleteEntryAction = (entry: Entry): EntryThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state) || selectSaving(state) || !entry.id) {
                return;
            }
            dispatch({type: entriesDeleteRequested});
            const url = API_PATH_DELETE_ENTRY
                .replace(':id', encodeURIComponent(entry.id));
            await fetchJSON(url, {method: 'DELETE'});
            dispatch({type: entriesDeleteSucceeded, payload: {id: entry.id}});
            dispatch(newEntryAction());
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("deleteEntryAction()", error.message);
                return dispatch({
                    type: entriesDeleteFailed,
                    payload: {error, context: entriesDeleteRequested}
                })
            }
            console.error("deleteEntryAction()", error);
        }
    }


