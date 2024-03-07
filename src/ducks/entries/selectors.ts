import {RootState} from "../../app/configureStore";
import {buildEmployeeTotals, employeeTotalsSorter, entrySorter} from "./utils";
import {createSelector} from "@reduxjs/toolkit";


export const selectEntriesActionStatus = (state: RootState) => state.entries.actionStatus;
export const selectEntriesLoading = (state: RootState) => state.entries.actionStatus === 'loading';
export const selectSaving = (state: RootState) => state.entries.actionStatus === 'saving';
export const selectEntryDate = (state: RootState) => state.entries.entryDate;
export const selectWorkCenterFilter = (state: RootState) => state.entries.workCenters;
export const selectCurrentEntry = (state: RootState) => state.entries.current;
export const selectEntryList = (state: RootState) => state.entries.list;
export const selectEntryEmployee = (state: RootState) => state.entries.employee;
export const selectEntrySort = (state: RootState) => state.entries.sort;
export const selectEntryTotalsSort = (state: RootState) => state.entries.totalsSort;
export const selectCurrentEmployee = (state: RootState) => state.entries.employee;

export const selectEmployeeEntryList = createSelector(
    [selectEntryList, selectEntryEmployee, selectEntrySort],
    (list, employee, sort) => {
        return list
            .filter(entry => !employee || entry.EmployeeNumber === employee?.EmployeeNumber)
            .sort(entrySorter(sort))
    }
)


export const selectEmployeeTotals = createSelector(
    [selectEntryList, selectWorkCenterFilter, selectEntryTotalsSort],
    (list, wcFilter, sort) => {
        return [...buildEmployeeTotals(list, wcFilter)]
            .sort(employeeTotalsSorter(sort));
    }
)
