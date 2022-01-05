import {RootState} from "../index";
import {EmployeeEntryTotal, EmployeeTotalSorterProps, Entry} from "../common-types";
import {employeeTotalsSorter} from "./utils";


export const selectLoading = (state: RootState): boolean => state.entries.isLoading;
export const selectSaving = (state: RootState): boolean => state.entries.isLoading;
export const selectEntryDate = (state: RootState): Date => state.entries.entryDate;
export const selectWorkCenterFilter = (state: RootState) => state.entries.workCenterFilter;

export const selectCurrentEntry = (state: RootState): Entry => state.entries.entry;

export const selectEntryList = (state: RootState) => {
    return state.entries.list.sort((a, b) => a.id - b.id);
}
export const selectEmployeeEntryList = (state: RootState) => {
    const employee = state.entries.employee;
    return state.entries.list
        .filter(entry => entry.EmployeeNumber === employee?.EmployeeNumber);
}

export const selectHurricaneEmployee = (state: RootState) => state.entries.employee;


export const selectEmployeeTotals = (sort: EmployeeTotalSorterProps) => (state: RootState) => {
    interface EmployeeTotalList {
        [key: string]: EmployeeEntryTotal,
    }

    const totals: EmployeeTotalList = {};

    const workCenters = selectWorkCenterFilter(state);

    state.entries.list
        .filter(entry => workCenters.length === 0 || workCenters.includes(entry.WorkCenter))
        .forEach(entry => {
            const {EmployeeNumber, FullName, AllowedMinutes, Minutes} = entry;
            if (!totals[EmployeeNumber]) {
                totals[EmployeeNumber] = {EmployeeNumber, FullName, AllowedMinutes: 0, Minutes: 0, Rate: 0}
            }
            totals[EmployeeNumber].AllowedMinutes += AllowedMinutes;
            totals[EmployeeNumber].Minutes += Minutes;
            totals[EmployeeNumber].Rate = !!totals[EmployeeNumber].Minutes
                ? (totals[EmployeeNumber].AllowedMinutes / totals[EmployeeNumber].Minutes)
                : 0;
        });
    return Object.values(totals).sort(employeeTotalsSorter(sort));
}
