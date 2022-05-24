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


export const rate = (entry:Entry) => entry.Quantity === 0 ? 0 : (entry.Minutes / entry.Quantity);
export const isRateTooLow = (entry:Entry) => rate(entry) < (entry.StandardAllowedMinutes * 0.9);
export const isRateTooHigh = (entry:Entry) => entry.StandardAllowedMinutes > 0 && rate(entry) > (entry.StandardAllowedMinutes * 1.1);
export const isOutOfLimits = (entry:Entry) => entry.StandardAllowedMinutes > 0 && (rate(entry) > (entry.StandardAllowedMinutes * 1.5) || rate(entry) < (entry.StandardAllowedMinutes * 0.5));

export const between = (value:number, limits:number[]) => {
    const min = Math.min(...limits);
    const max = Math.max(...limits);
    return value >= min && value < max;
}

export const MIN_DANGER = 0.5;
export const MAX_DANGER = 1.75;
export const MIN_SUCCESS = 0.75;
export const MAX_SUCCESS = 1.25;
