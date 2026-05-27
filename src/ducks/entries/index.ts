import {entrySorter, NEW_ENTRY} from "./utils";
import type {ActionStatus} from "../common-types";
import type {BasicDLEntry, DLEmployee, DLEntry, Editable, EmployeeDLEntryTotal} from "chums-types";
import {createReducer} from "@reduxjs/toolkit";
import {
    loadEntries,
    removeEntry,
    saveEntry,
    setCurrentEntry,
    setEntriesSort,
    setEntryDate,
    setEntryEmployee,
    setEntryTotalsSort,
    setNewEntry,
    setWorkCenters,
    updateEntry
} from "./actions";
import {loadDocument} from "../work-ticket/actions";
import Decimal from "decimal.js";
import {currentSLCWorkDay} from "@/utils/workDays";
import type {SortProps} from "@chumsinc/sortable-tables";
import {STORAGE_KEYS} from "@/utils/appStorage.ts";
import {LocalStore} from "@chumsinc/ui-utils";

export interface EntriesState {
    workCenters: string[];
    list: DLEntry[];
    current: (BasicDLEntry & Editable);
    actionStatus: ActionStatus;
    entryDate: string | null;
    employee: DLEmployee | null;
    sort: SortProps<DLEntry>;
    totalsSort: SortProps<EmployeeDLEntryTotal>;
}

const defaultSort: SortProps<DLEntry> = {field: 'id', ascending: false};

export const initialEntriesState = (): EntriesState => ({
    workCenters: [],
    list: [],
    current: newEntry(),
    actionStatus: 'idle',
    entryDate: LocalStore.getItem(STORAGE_KEYS.SLC_ENTRY_DATE, currentSLCWorkDay()),
    employee: null,
    sort: {...defaultSort},
    totalsSort: {
        field: 'FullName',
        ascending: true,
    }
})

function newEntry(state?:EntriesState):BasicDLEntry {
    return {
        ...NEW_ENTRY,
        EntryDate: state?.entryDate ?? currentSLCWorkDay(),
        EmployeeNumber: state?.employee?.EmployeeNumber ?? '',
    }
}

const entriesReducer = createReducer(initialEntriesState, (builder) => {
    builder
        .addCase(updateEntry, (state, action) => {
            if (state.current) {
                state.current = {...state.current, ...action.payload, changed: true};
            }
        })
        .addCase(setEntryDate, (state, action) => {
            if (action.payload !== state.entryDate) {
                state.list = [];
            }
            state.entryDate = action.payload;
        })
        .addCase(setCurrentEntry, (state, action) => {
            state.current = action.payload ?? newEntry(state)
        })
        .addCase(setWorkCenters, (state, action) => {
            state.workCenters = action.payload.sort();
        })
        .addCase(setEntriesSort, (state, action) => {
            state.sort = action.payload;
        })
        .addCase(setEntryTotalsSort, (state, action) => {
            state.totalsSort = action.payload;
        })
        .addCase(setEntryEmployee, (state, action) => {
            state.employee = action.payload ?? null;
            state.current = newEntry(state)
        })
        .addCase(loadEntries.pending, (state, action) => {
            state.actionStatus = 'loading';
            if (action.meta.arg.entryDate && action.meta.arg.entryDate !== state.entryDate) {
                state.list = [];
            }
        })
        .addCase(loadEntries.fulfilled, (state, action) => {
            state.actionStatus = 'idle';
            const newIds = action.payload.map(entry => entry.id);
            state.list = [
                ...state.list.filter(entry => !newIds.includes(entry.id)),
                ...action.payload
            ].sort(entrySorter(defaultSort))
        })
        .addCase(loadEntries.rejected, (state) => {
            state.actionStatus = 'idle';
        })
        .addCase(saveEntry.pending, (state) => {
            state.actionStatus = 'saving';
        })
        .addCase(saveEntry.fulfilled, (state, action) => {
            state.actionStatus = 'idle';
            if (action.payload) {
                state.list = [
                    ...state.list.filter(entry => entry.id !== action.meta.arg.id),
                    action.payload,
                ].sort(entrySorter(defaultSort));

            } else {
                state.list = state.list
                    .filter(entry => entry.id !== action.meta.arg.id)
                    .sort(entrySorter(defaultSort));
            }
            state.current = newEntry(state);
        })
        .addCase(saveEntry.rejected, (state) => {
            state.actionStatus = 'idle';
        })
        .addCase(removeEntry.pending, (state) => {
            state.actionStatus = 'deleting';
        })
        .addCase(removeEntry.fulfilled, (state, action) => {
            state.actionStatus = 'idle';
            state.list = state.list
                .filter(entry => entry.id !== action.meta.arg.id)
                .sort(entrySorter(defaultSort));
            state.current = newEntry(state)
            if (state.entryDate) {
                state.current = {
                    ...NEW_ENTRY,
                    EntryDate: state.entryDate,
                    EmployeeNumber: state.employee?.EmployeeNumber ?? '',
                }
            }
        })
        .addCase(removeEntry.rejected, (state) => {
            state.actionStatus = 'idle';
        })
        .addCase(setNewEntry, (state) => {
            if (state.entryDate) {
                state.current = {
                    ...NEW_ENTRY,
                    EntryDate: state.entryDate,
                    EmployeeNumber: state.employee?.EmployeeNumber ?? '',
                }
            }
        })
        .addCase(loadDocument.fulfilled, (state, action) => {
            if (state.current) {
                if (action.payload.workTicket) {
                    state.current.DocumentNo = action.payload.workTicket.WorkTicketNo;
                    state.current.Quantity = new Decimal(action.payload.workTicket.QuantityOrdered ?? '0')
                        .sub(action.payload.workTicket.QuantityCompleted ?? '0').toNumber();
                    state.current.ItemCode = action.payload.workTicket.ParentItemCode ?? '';
                    state.current.WarehouseCode = action.payload.workTicket.ParentWarehouseCode ?? '';
                }
            }
        })

});

export default entriesReducer;
