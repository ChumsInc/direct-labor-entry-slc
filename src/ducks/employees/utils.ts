import {SortProps} from "chums-components";
import {Employee} from "../common-types";

export const employeeSorter = (sort:SortProps<Employee>) => (a:Employee, b:Employee) => {
    const {field, ascending} = sort;
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'EmployeeNumber':
        case 'FirstName':
        case 'LastName':
        case 'FullName':
        case 'Department':
            return (a[field].toLowerCase() === b[field].toLowerCase()
                ? (a.FullName > b.FullName ? 1 : -1)
                : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)) * sortMod;
        default:
            return (a.EmployeeNumber > b.EmployeeNumber ? 1 : -1) * sortMod;
    }
}

