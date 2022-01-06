import {
    entriesDeleteFailed,
    entriesDeleteRequested,
    entriesDeleteSucceeded,
    entriesFetchListFailed,
    entriesFetchListRequested,
    entriesFetchListSucceeded,
    entriesFilterWorkCenter,
    entriesSaveFailed,
    entriesSaveRequested,
    entriesSaveSucceeded,
    entriesSelectEntry,
    entriesUpdateEntry,
    entriesSetEntryDate,
    NEW_ENTRY
} from "./constants";
import {format} from 'date-fns'
import {fetchJSON} from "chums-ducks";
import {EntryAction, EntryThunkAction} from "./actionTypes";
import {Entry} from "../common-types";
import {
    selectEmployeeEntryList,
    selectEntryDate,
    selectHurricaneEmployee,
    selectLoading,
    selectSaving
} from "./selectors";
import {entrySorter} from "./utils";
import {previousSLCWorkDay} from "../../utils/workDays";

export const API_PATH_ENTRIES = '/api/operations/production/dl/entry/:EntryDate';
export const API_PATH_SAVE_ENTRY = '/api/operations/production/dl/entry';
export const API_PATH_DELETE_ENTRY = '/api/operations/production/dl/entry/:id';


export const updateEntryAction = (change: object): EntryAction => ({type: entriesUpdateEntry, payload: {change}});
export const setEntryDateAction = (date: string | null): EntryAction => ({type: entriesSetEntryDate, payload: {date}});
export const selectEntryAction = (entry: Entry): EntryAction => ({type: entriesSelectEntry, payload: {entry}});
export const selectWorkCenterAction = (workCenters: string[] = []) => ({
    type: entriesFilterWorkCenter,
    payload: {workCenters}
});

export const fetchEntriesAction = (): EntryThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state) || selectSaving(state)) {
                return;
            }
            const date:string = selectEntryDate(state) || previousSLCWorkDay();
            dispatch({type: entriesFetchListRequested});
            const url = API_PATH_ENTRIES
                .replace(':EntryDate', encodeURIComponent(format(new Date(date), 'yyyy-MM-dd')));
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
        const entryDate = selectEntryDate(state);
        const employee = selectHurricaneEmployee(state);
        if (!employee) {
            return dispatch(selectEntryAction({
                ...NEW_ENTRY,
                EntryDate: entryDate
            }));
        }
        const entries = selectEmployeeEntryList(state);
        const [lastEntry] = entries.sort(entrySorter({field: 'LineNo', ascending: false}))
        dispatch(selectEntryAction({
            ...NEW_ENTRY,
            EmployeeNumber: employee.EmployeeNumber,
            EntryDate: entryDate,
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


