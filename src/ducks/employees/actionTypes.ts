import {ActionInterface, ActionPayload} from "chums-ducks";
import {Employee, EmployeeFilter, EmployeeSorterProps} from "../common-types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";


export interface EmployeePayload extends ActionPayload {
    list?: Employee[],
    employee?: Employee|null,
    entry?: unknown,
    filter?: EmployeeFilter,
    props?: object,
}

export interface EmployeeAction extends ActionInterface {
    payload?: EmployeePayload,
    status?: string,
}

export interface EmployeeThunkAction extends ThunkAction<any, RootState, unknown, EmployeeAction> {
}


export const employeesShowActive = 'employees/showActive';
export const employeesShowInactive = 'employees/showInctive';

export const employeesFetchListRequested = 'employees/fetchListRequested';
export const employeesFetchListSucceeded = 'employees/fetchListSucceeded';
export const employeesFetchListFailed = 'employees/fetchListFailed';

export const saveEmployeeRequested = 'employees/saveRequested';
export const saveEmployeeSucceeded = 'employees/saveSucceeded';
export const saveEmployeeFailed = 'employees/saveFailed';

export const employeeSelected = 'employees/selected';
export const employeeSetVisibilityFilter = 'employees/setVisibilityFilter';

export const defaultEmployeeSort: EmployeeSorterProps = {
    field: 'EmployeeNumber',
    ascending: true,
}

export const employeeSorter = (sort: EmployeeSorterProps) => (a: Employee, b: Employee) => {
    if (sort.field === 'changed') {
        return 0;
    }
    if (sort.field === 'active') {
        const aVal = a.active ? 1 : 0;
        const bVal = b.active ? 1 : 0;
        return (aVal === bVal ? (a.EmployeeNumber > b.EmployeeNumber ? 1 : -1) : aVal - bVal) * (sort.ascending ? 1 : -1);
    }
    const aVal = (a[sort.field] || '').toLowerCase();
    const bVal = (b[sort.field] || '').toLowerCase();
    return (aVal === bVal ? (a.EmployeeNumber > b.EmployeeNumber ? 1 : -1) : (aVal > bVal ? 1 : -1)) * (sort.ascending ? 1 : -1);
}

