import {RootState} from "../../app/configureStore";
import {EmployeeFilter} from "../common-types";
import {SLCEmployeesRegex, SLCTempEmployeesRegex} from "./constants";
import {employeeSorter} from "./utils";
import {createSelector} from "@reduxjs/toolkit";

const getREFilter = (filter?: EmployeeFilter): RegExp => {
    switch (filter) {
        case 'slc':
            return SLCEmployeesRegex;
        case 'slc-temp':
            return SLCTempEmployeesRegex;
        default:
            return /^/;
    }
}
export const selectEmployeesActionStatus = (state: RootState) => state.employees.actionStatus;
export const selectCurrentEmployee = (state: RootState) => state.employees.current;
export const selectEmployeeList = (state: RootState) => state.employees.list;
export const selectEmployeeDepartment = (state: RootState) => state.employees.department;
export const selectEmployeeFilter = (state: RootState) => state.employees.filter;
export const selectEmployeeShowInactive = (state: RootState) => state.employees.showInactive;
export const selectEmployeesSort = (state: RootState) => state.employees.sort;

export const selectVisibleEmployees = createSelector(
    [selectEmployeeList, selectEmployeeDepartment, selectEmployeeFilter, selectEmployeeShowInactive, selectEmployeesSort],
    (list, department, filter, showInactive, sort) => {
        let reFilter = /^/;
        try {
            reFilter = new RegExp(filter, 'i');
        } catch (err: unknown) {
            reFilter = /^/;
        }
        return list
            .filter(emp => getREFilter(department).test(emp.Department))
            .filter(emp => showInactive || emp.active)
            .filter(emp => reFilter.test(emp.FullName) || reFilter.test(emp.EmployeeNumber))
            .sort(employeeSorter(sort));
    }
)

export const selectLoading = (state: RootState): boolean => state.employees.actionStatus === 'loading';
export const selectSaving = (state: RootState): boolean => state.employees.actionStatus === 'saving';
export const selectLoaded = (state: RootState): boolean => state.employees.loaded;
export const selectShowInactive = (state: RootState): boolean => state.employees.showInactive;
