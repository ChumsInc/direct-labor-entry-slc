import {RootState} from "../index";
import {Employee, EmployeeFilter, EmployeeSorterProps} from "../common-types";
import {REGEX_FILTER_EMPLOYEES_HURR, REGEX_FILTER_EMPLOYEES_SLC} from "./constants";
import {employeeSorter} from "./actionTypes";

const getREFilter = (filter?: EmployeeFilter): RegExp => {
    switch (filter) {
    case 'slc':
        return /^[578][HS][T]*$/;
    case 'slc-temp':
        return /^[578]HT$/;
    default:
        return /^/;
    }

}

export const selectCurrentEmployee = (state: RootState): Employee | null => state.employees.selected;
export const selectEmployeeList = (state: RootState): Employee[] => state.employees.list;
export const selectVisibilityFilter = (state: RootState): string => state.employees.visibilityFilter;

export const selectVisibleEmployees = (sort: EmployeeSorterProps, filter?: RegExp) => (state: RootState): Employee[] => {
    const list = state.employees.list;
    const showInactive = state.employees.showInactive;
    const reFilter = filter || getREFilter(state.employees.visibilityFilter);
    return list
        .filter(emp => showInactive || emp.active)
        .filter(emp => reFilter.test(emp.Department))
        .sort(employeeSorter(sort));
}

export const selectHurricaneEmployees = (state: RootState): Employee[] => {
    return state.employees.list.filter(emp => REGEX_FILTER_EMPLOYEES_HURR.test(emp.Department));
}
export const selectSLCEmployees = (state: RootState): Employee[] => {
    return state.employees.list.filter(emp => REGEX_FILTER_EMPLOYEES_SLC.test(emp.Department));
}

export const selectLoading = (state: RootState): boolean => state.employees.isLoading;
export const selectSaving = (state: RootState): boolean => state.employees.isSaving;
export const selectLoaded = (state: RootState): boolean => state.employees.loaded;
export const selectShowInactive = (state: RootState): boolean => state.employees.showInactive;
