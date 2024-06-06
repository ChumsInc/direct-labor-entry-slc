import {SortProps} from "chums-components";
import {DLEmployee} from "chums-types";

export const employeeSorter = (sort: SortProps<DLEmployee>) => (a: DLEmployee, b: DLEmployee) => {
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

