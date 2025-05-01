import {EmployeeTotalList} from "../common-types";
import {SortProps} from "@chumsinc/sortable-tables";
import Decimal from "decimal.js";
import {BasicDLEntry, DLEntry, EmployeeDLEntryTotal} from "chums-types";

export const friendlyDocumentNo = (value: string) => value.replace(/^0+/, '');

export const entrySorter = (sort: SortProps<DLEntry>) => (a: DLEntry, b: DLEntry) => {
    const {field, ascending} = sort;
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'id':
            return (a.id - b.id) * sortMod;
        case 'Minutes':
        case 'Quantity':
        case 'AllowedMinutes':
        case 'UPH':
        case 'StdUPH':
        case 'StandardAllowedMinutes':
            return (
                new Decimal(a[field]).eq(b[field])
                    ? (a.id - b.id)
                    : new Decimal(a[field]).sub(b[field]).toNumber()
            ) * sortMod;
        case 'WorkCenter':
        case 'WarehouseCode':
        case 'EmployeeNumber':
        case 'Description':
        case 'StepCode':
            return (a[field].toLowerCase() === b[field].toLowerCase()
                ? (a.id - b.id)
                : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)) * sortMod;
        case 'DocumentNo':
            return (a[field].toLowerCase() === b[field].toLowerCase()
                ? (a.id - b.id)
                : (friendlyDocumentNo(a[field]) > friendlyDocumentNo(b[field]) ? 1 : -1)) * sortMod;
        default:
            return (a.id - b.id) * sortMod;
    }
}

export const basicEntrySorter = (sort: SortProps<BasicDLEntry>) => (a: BasicDLEntry, b: BasicDLEntry) => {
    const {field, ascending} = sort;
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'id':
        case 'Minutes':
        case 'Quantity':
            return (a[field] === b[field]
                ? (a.id - b.id)
                : (a[field] - b[field])) * sortMod;
        case 'EmployeeNumber':
            return (a[field].toLowerCase() === b[field].toLowerCase()
                ? (a.id - b.id)
                : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)) * sortMod;
        default:
            return (a.id - b.id) * sortMod;
    }
}

export const entryDefaultSort: SortProps<BasicDLEntry> = {field: 'id', ascending: true};


export const employeeTotalsSorter = (sort: SortProps<EmployeeDLEntryTotal>) => (a: EmployeeDLEntryTotal, b: EmployeeDLEntryTotal) => {
    const {field, ascending} = sort;
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'EmployeeNumber':
        case 'FullName':
            return ((a[field] === b[field])
                ? (a.EmployeeNumber > b.EmployeeNumber ? 1 : -1)
                : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)) * sortMod;
        case 'Minutes':
        case 'AllowedMinutes':
        case 'Rate':
            return (
                new Decimal(a[field]).eq(b[field])
                    ? (a.EmployeeNumber > b.EmployeeNumber ? 1 : -1)
                    : new Decimal(a[field]).sub(-b[field]).toNumber()
            ) * sortMod;
    }
}

export const buildEmployeeTotals = (list: DLEntry[], workCenters: string[] = []): EmployeeDLEntryTotal[] => {
    const totals: EmployeeTotalList = {};
    list
        .filter(entry => workCenters.length === 0 || workCenters.includes(entry.WorkCenter))
        .forEach(entry => {
            const {EmployeeNumber, FullName, AllowedMinutes, Minutes} = entry;
            if (!totals[EmployeeNumber]) {
                totals[EmployeeNumber] = {EmployeeNumber, FullName, AllowedMinutes: 0, Minutes: 0, Rate: 0}
            }
            totals[EmployeeNumber].AllowedMinutes = new Decimal(totals[EmployeeNumber].AllowedMinutes).add(AllowedMinutes).toString();
            totals[EmployeeNumber].Minutes = new Decimal(totals[EmployeeNumber].Minutes).add(Minutes).toString();
            totals[EmployeeNumber].Rate = new Decimal(totals[EmployeeNumber].Minutes).eq(0)
                ? 0
                : new Decimal(totals[EmployeeNumber].AllowedMinutes).dividedBy(totals[EmployeeNumber].Minutes).toString();
        });
    return Object.values(totals);
}


export const rate = (entry: DLEntry) => new Decimal(entry.Quantity).eq(0) ? new Decimal(0) : new Decimal(entry.Minutes).dividedBy(entry.Quantity);
export const isRateTooLow = (entry: DLEntry) => rate(entry).lessThan(new Decimal(entry.StandardAllowedMinutes).times(0.9));
export const isRateTooHigh = (entry: DLEntry) => new Decimal(entry.StandardAllowedMinutes).gt(0) && rate(entry).greaterThan(new Decimal(entry.StandardAllowedMinutes).times(1.1));
export const isOutOfLimits = (entry: DLEntry) => new Decimal(entry.StandardAllowedMinutes).gt(0) && (rate(entry).gt(new Decimal(entry.StandardAllowedMinutes).times(1.5)) || rate(entry).lt(new Decimal(entry.StandardAllowedMinutes).times(0.5)));

export const between = (value: number, limits: number[]) => {
    const min = Math.min(...limits);
    const max = Math.max(...limits);
    return value >= min && value < max;
}

export const MIN_DANGER = 0.5;
export const MAX_DANGER = 1.75;
export const MIN_SUCCESS = 0.75;
export const MAX_SUCCESS = 1.25;


export const NEW_ENTRY: BasicDLEntry = {
    id: 0,
    EmployeeNumber: '',
    EntryDate: null,
    LineNo: 1,
    idSteps: 0,
    Minutes: 0,
    Quantity: 0,
    DocumentNo: '',
    StepCode: '',
    WorkCenter: 'INH',
};
