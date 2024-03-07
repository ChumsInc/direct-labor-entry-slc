import {DepartmentList, Employee, EmployeeFilter} from "../common-types";

export const FILTER_EMP_ALL = 'FILTER_EMP_ALL';
export const FILTER_EMP_SLC = 'FILTER_EMP_SLC';
export const FILTER_EMP_SLC_TEMP = 'FILTER_EMP_SLC_TEMP';
export const FILTER_EMP_HURRICANE = 'FILTER_EMP_HURRICANE';
export const FILTER_EMP_HURRICANE_TEMP = 'FILTER_EMP_HURRICANE_TEMP';

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
    "all": 'All SLC Employees'
};


export const DEPARTMENT_NAMES:DepartmentList = {
    '5H': 'Shipping/Warehouse',
    '5HT': 'Shipping/Warehouse Temp',
    '5S': 'Shipping/Warehouse',
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

export const SLCEmployeesRegex = /^[58][HS][T]*$/;
export const SLCTempEmployeesRegex = /^[58]HT$/;
