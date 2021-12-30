import {
    BasicEntry,
    BasicEntrySorterProps,
    EmployeeEntryTotal,
    EmployeeTotalSorterProps,
    Entry,
    EntrySorterProps
} from "../common-types";


export const entrySorter = (sort:EntrySorterProps) => (a:Entry, b:Entry) => {
    const aVal = a[sort.field] || '';
    const bVal = b[sort.field] || '';
    return (aVal === bVal ? a.id - b.id : (aVal > bVal ? 1 : -1)) * (sort.ascending ? 1 : -1);
}

export const basicEntrySorter = (sort:BasicEntrySorterProps) => (a:BasicEntry, b:BasicEntry) => {
    const aVal = a[sort.field] || '';
    const bVal = b[sort.field] || '';
    return (aVal === bVal ? a.id - b.id : (aVal > bVal ? 1 : -1)) * (sort.ascending ? 1 : -1);
}

export const entryDefaultSort:BasicEntrySorterProps = {field: 'id', ascending: true};


export const employeeTotalsSorter = (sort:EmployeeTotalSorterProps) => (a:EmployeeEntryTotal, b:EmployeeEntryTotal) => {
    const aVal = a[sort.field] || '';
    const bVal = b[sort.field] || '';
    return (aVal === bVal ? (a.EmployeeNumber > b.EmployeeNumber ? 1 : -1) : (aVal > bVal ? 1 : -1)) * (sort.ascending ? 1 : -1);

}
