import {selectEntriesActionStatus} from "./selectors";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {deleteEntry, fetchEntries, postEntry} from "./api";
import {RootState} from "../../app/configureStore";
import dayjs from "dayjs";
import {SortProps} from "chums-components";
import {BasicDLEntry, DLEmployee, DLEntry, EmployeeDLEntryTotal} from "chums-types";

export const API_PATH_ENTRIES = '/api/operations/production/dl/entry/:EntryDate';
export const API_PATH_SAVE_ENTRY = '/api/operations/production/dl/entry';
export const API_PATH_DELETE_ENTRY = '/api/operations/production/dl/entry/:id';


export const updateEntry = createAction<Partial<DLEntry>>('entries/updateCurrent');
export const setEntryDate = createAction<string | null>('entries/setEntryDate');
export const setCurrentEntry = createAction<DLEntry | null>('entries/setCurrent');
export const setWorkCenters = createAction<string[]>('entries/setWorkCenters')
export const setEntriesSort = createAction<SortProps<DLEntry>>('entries/setSort');
export const setEntryTotalsSort = createAction<SortProps<EmployeeDLEntryTotal>>('entries/setTotalSort');
export const setEntryEmployee = createAction<DLEmployee>('entries/setEmployee');

export const loadEntries = createAsyncThunk<DLEntry[], string>(
    'entries/loadList',
    async (arg) => {
        return await fetchEntries(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return dayjs(arg).isValid() && selectEntriesActionStatus(state) === 'idle';
        }
    }
)

export const setNewEntry = createAction('entries/setNewEntry');
//
//
// export const _setNewEntry = (): EntryThunkAction => (dispatch, getState) => {
//     try {
//         const state = getState();
//         const entryDate = selectEntryDate(state);
//         const employee = selectCurrentEmployee(state);
//         if (!employee) {
//             return dispatch(setCurrentEntry({
//                 ...NEW_ENTRY,
//                 EntryDate: entryDate
//             }));
//         }
//         const entries = selectEmployeeEntryList(state);
//         const [lastEntry] = entries.sort(entrySorter({field: 'LineNo', ascending: false}))
//         dispatch(setCurrentEntry({
//             ...NEW_ENTRY,
//             EmployeeNumber: employee.EmployeeNumber,
//             EntryDate: entryDate,
//             LineNo: (lastEntry?.LineNo || 0) + 1
//         }));
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             console.log("newEntry()", error.message);
//         }
//         console.error("newEntry()", error);
//     }
// }

export const saveEntry = createAsyncThunk<DLEntry | null, BasicDLEntry>(
    'entries/saveEntry',
    async (arg) => {
        return await postEntry(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectEntriesActionStatus(state) === 'idle';
        }
    }
)

export const removeEntry = createAsyncThunk<void, BasicDLEntry | DLEntry>(
    'entries/removeEntry',
    async (arg) => {
        return deleteEntry(arg.id);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.id && selectEntriesActionStatus(state) === 'idle';
        }
    }
)


