import {entrySorter, NEW_ENTRY} from "./utils";
import {ActionStatus} from "../common-types";
import {Editable} from "chums-types/src/generics";
import {createReducer} from "@reduxjs/toolkit";
import {LocalStore, SortProps} from "chums-components";
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
import {BasicDLEntry, DLEmployee, DLEntry, EmployeeDLEntryTotal} from "chums-types";
import {storeEntryDate} from "../../contants";
import {previousSLCWorkDay} from "../../utils/workDays";

export interface EntriesState {
    workCenters: string[];
    list: DLEntry[];
    current: (BasicDLEntry & Editable) | null;
    actionStatus: ActionStatus;
    entryDate: string | null;
    employee: DLEmployee | null;
    sort: SortProps<DLEntry>;
    totalsSort: SortProps<EmployeeDLEntryTotal>;
}

const defaultSort:SortProps<DLEntry> = {field: 'id', ascending: false};

export const initialEntriesState = (): EntriesState => ({
    workCenters: [],
    list: [],
    current: null,
    actionStatus: 'idle',
    entryDate: LocalStore.getItem<string>(storeEntryDate, previousSLCWorkDay()),
    employee: null,
    sort: {...defaultSort},
    totalsSort: {
        field: 'FullName',
        ascending: true,
    }
})

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
            state.current = action.payload ?? null;
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
            state.current = {
                ...NEW_ENTRY,
                EntryDate: state.entryDate,
                EmployeeNumber: action.payload.EmployeeNumber ?? '',
            }
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
            state.current = {
                ...NEW_ENTRY,
                EntryDate: state.entryDate,
                EmployeeNumber: state.employee?.EmployeeNumber ?? '',
            }

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
            state.current = null;
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
