import {DepartmentList} from "../common-types";
import {DLEmployee} from "chums-types";

export const REGEX_FILTER_EMPLOYEES_SLC = /^[578][HS][T]*$/;


export const DEPARTMENT_NAMES: DepartmentList = {
    '5H': 'Shipping/Warehouse',
    '5HT': 'Shipping/Warehouse Temp',
    '5S': 'Shipping/Warehouse',
    '8H': 'Work Cell',
    '8HT': 'Work Cell Temp',
};

export const newEmployee: DLEmployee = {
    EmployeeNumber: '',
    Department: 'TEMP',
    FirstName: '',
    LastName: '',
    FullName: '',
    active: true,
}

export const SLCEmployeesRegex = /^[58][HS][T]*$/;
export const SLCTempEmployeesRegex = /^[58]HT$/;
