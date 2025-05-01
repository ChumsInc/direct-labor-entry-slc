import {selectEntriesActionStatus} from "./selectors";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {deleteEntry, fetchEntries, postEntry} from "./api";
import {RootState} from "../../app/configureStore";
import dayjs from "dayjs";
import {SortProps} from "@chumsinc/sortable-tables";
import {BasicDLEntry, DLEmployee, DLEntry, EmployeeDLEntryTotal} from "chums-types";
import {FetchEntriesProps} from "../common-types";

export const updateEntry = createAction<Partial<DLEntry>>('entries/updateCurrent');
export const setEntryDate = createAction<string | null>('entries/setEntryDate');
export const setCurrentEntry = createAction<DLEntry | null>('entries/setCurrent');
export const setWorkCenters = createAction<string[]>('entries/setWorkCenters')
export const setEntriesSort = createAction<SortProps<DLEntry>>('entries/setSort');
export const setEntryTotalsSort = createAction<SortProps<EmployeeDLEntryTotal>>('entries/setTotalSort');
export const setEntryEmployee = createAction<DLEmployee>('entries/setEmployee');

export const loadEntries = createAsyncThunk<DLEntry[], FetchEntriesProps>(
    'entries/loadList',
    async (arg) => {
        return await fetchEntries(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.entryDate && dayjs(arg.entryDate).isValid() && selectEntriesActionStatus(state) === 'idle';
        }
    }
)

export const setNewEntry = createAction('entries/setNewEntry');


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


