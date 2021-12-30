import {DepartmentList, Employee, EmployeeFilter} from "../common-types";

export const FILTER_EMP_ALL = 'FILTER_EMP_ALL';
export const FILTER_EMP_SLC = 'FILTER_EMP_SLC';
export const FILTER_EMP_SLC_TEMP = 'FILTER_EMP_SLC_TEMP';
export const FILTER_EMP_HURRICANE = 'FILTER_EMP_HURRICANE';
export const FILTER_EMP_HURRICANE_TEMP = 'FILTER_EMP_HURRICANE_TEMP';

export const employeesShowActive = 'employees/showActive';
export const employeesShowInactive = 'employees/showInctive';

export const employeesFetchListRequested = 'employees/fetchListRequested';
export const employeesFetchListSucceeded = 'employees/fetchListSucceeded';
export const employeesFetchListFailed = 'employees/fetchListFailed';

export const saveEmployeeRequested = 'employees/saveRequested';
export const saveEmployeeSucceeded = 'employees/saveSucceeded';
export const saveEmployeeFailed = 'employees/saveFailed';


export const ADD_EMPLOYEE = 'employees/add-employee';
export const ADD_LIST = 'ADD_LIST';
export const UPDATE_EMPLOYEE = 'UPDATE_EMPLOYEE';
export const UPDATE_SELECTED_EMPLOYEE = 'UPDATE_SELECTED_EMPLOYEE';
export const SET_EMPLOYEE_VISIBILITY_FILTER = 'SET_EMPLOYEE_VISIBILITY_FILTER';
export const LOADING_EMPLOYEES = 'LOADING_EMPLOYEES';
export const LOADING_EMPLOYEES_FAILURE = 'LOADING_EMPLOYEES_FAILURE';
export const LOADING_EMPLOYEES_SUCCESS = 'LOADING_EMPLOYEES_SUCCESS';
export const RECEIVE_EMPLOYEE_LIST = 'RECEIVE_EMPLOYEE_LIST';
export const SELECT_EMPLOYEE = 'SELECT_EMPLOYEE';

export const SELECT_SLC_EMPLOYEE = 'SELECT_SLC_EMPLOYEE';
export const SAVING_EMPLOYEE = 'SAVING_EMPLOYEE';
export const SAVING_EMPLOYEE_FAILURE = 'SAVING_EMPLOYEE_FAILURE';
export const SAVING_EMPLOYEE_SUCCESS = 'SAVING_EMPLOYEE_SUCCESS';

export const API_PATH_EMPLOYEES = '/api/operations/production/dl/employees';
export const API_PATH_SAVE_EMPLOYEE = '/api/operations/production/dl/employee';

export const REGEX_FILTER_EMPLOYEES_ALL = /^/;
export const REGEX_FILTER_EMPLOYEES_HURR = /^3[HS][T]*$/;
export const REGEX_FILTER_EMPLOYEES_HURR_TEMP = /^3HT$/;
export const REGEX_FILTER_EMPLOYEES_SLC = /^[578][HS][T]*$/;
export const REGEX_FILTER_EMPLOYEES_SLC_TEMP = /^[578]HT$/;

export const EMPLOYEE_FILTERS = {
    [FILTER_EMP_ALL]: () => true,
    [FILTER_EMP_HURRICANE]: (employee:Employee) => REGEX_FILTER_EMPLOYEES_HURR.test(employee.Department),
    [FILTER_EMP_HURRICANE_TEMP]: (employee:Employee) => REGEX_FILTER_EMPLOYEES_HURR_TEMP.test(employee.Department),
    [FILTER_EMP_SLC]: (employee:Employee) => REGEX_FILTER_EMPLOYEES_SLC.test(employee.Department),
    [FILTER_EMP_SLC_TEMP]: (employee:Employee) => REGEX_FILTER_EMPLOYEES_SLC_TEMP.test(employee.Department),
};

export type DepartmentFilterList = {
    [key in EmployeeFilter]: string;
};
export const DEPARTMENTS:DepartmentFilterList = {
    'slc': 'SLC',
    "slc-temp": 'SLC Temps',
};


export const DEPARTMENT_NAMES:DepartmentList = {
    '5H': 'Shipping/Warehouse',
    '5HT': 'Shipping/Warehouse Temp',
    '5S': 'Shipping/Warehouse',
    '7H': 'Imprint',
    '7HT': 'Imprint Temp',
    '7S': 'Imprint',
    '8H': 'Work Cell',
    '8HT': 'Work Cell Temp',
};

export const newEmployee:Employee = {
    EmployeeNumber: '',
    Department: 'TEMP',
    FirstName: '',
    LastName: '',
    FullName: '',
    active: true,
}
