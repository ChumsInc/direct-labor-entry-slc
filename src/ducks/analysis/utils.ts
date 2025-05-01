import {STORAGE_KEYS} from "../../utils/appStorage";
import dayjs from "dayjs";
import weekday from 'dayjs/plugin/weekday';
import {LocalStore} from '@chumsinc/ui-utils';
import {ReportData, ReportGrouping, ReportGroupingId} from "./types";
import {RootState} from "../../app/configureStore";
import {FetchReportDataArgs} from "./api";
import {
    selectAllGroupBy,
    selectFilterEmployee,
    selectFilterItem,
    selectFilterOperation,
    selectMaxDate,
    selectMinDate,
    selectWorkCenter
} from "./selectors";
import {SortProps} from "@chumsinc/sortable-tables";

dayjs.extend(weekday);

export const reportSorter = (sort: SortProps<ReportData>) => (a: ReportData, b: ReportData) => {
    const {field, ascending} = sort;
    const sortMod = ascending ? 1 : -1
    switch (field) {
        case "idEntries":
            return a[field] - b[field] * sortMod;
        case "AllowedMinutes":
        case "StandardAllowedMinutes":
        case "SAM":
        case "Minutes":
        case "Quantity":
        case 'Rate':
        case 'UPH':
        case 'UPHStd':
            return (a[field] === b[field]
                ? a.idEntries - b.idEntries
                : a[field] - b[field]) * sortMod;
        case "EntryDate":
            return (new Date(a[field]).valueOf() - new Date(b[field]).valueOf() || a.idEntries - b.idEntries) * sortMod;
        default:
            return (
                a[field] === b[field]
                    ? a.idEntries - b.idEntries
                    : (String(a[field]).toLowerCase() > String(b[field]).toLowerCase() ? 1 : -1)
            ) * sortMod;
    }
}

const defaultGrouping: ReportGrouping = {
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: ''
}

export function isReportGrouping(grouping: null | ReportGrouping): grouping is ReportGrouping {
    const keys: ReportGroupingId[] = [0, 1, 2, 3, 4, 5, 6];
    return !!grouping
        && typeof grouping === 'object'
        && Object.keys(grouping).map(key => keys.includes(+key as ReportGroupingId)).reduce((pv, cv) => pv && cv, true)
        && Object.keys(grouping).map(key => typeof grouping[+key as ReportGroupingId] === 'string').reduce((pv, cv) => pv && cv, true)
}

export function getStorageMinDate(): string {
    const minDate = LocalStore.getItem<string | null>(STORAGE_KEYS.analysis.minDate, null);
    if (minDate && dayjs(minDate).isValid()) {
        return minDate;
    }
    return dayjs().subtract(1, 'week').weekday(1).toISOString();
}

export function setStorageMinDate(date: string): string {
    if (!date || !dayjs(date).isValid()) {
        date = dayjs().subtract(1, 'week').weekday(1).toISOString();
    }
    LocalStore.setItem<string>(STORAGE_KEYS.analysis.minDate, date);
    return date;
}

export function getStorageMaxDate(): string {
    const maxDate = LocalStore.getItem<string | null>(STORAGE_KEYS.analysis.maxDate, null);
    if (maxDate && dayjs(maxDate).isValid()) {
        return maxDate;
    }
    return dayjs().subtract(1, 'weeks').weekday(5).toISOString();
}

export function setStorageMaxDate(date: string): string {
    if (!date || !dayjs(date).isValid()) {
        date = dayjs().subtract(1, 'weeks').weekday(5).toISOString();
        ``
    }
    LocalStore.setItem<string>(STORAGE_KEYS.analysis.maxDate, date);
    return date;
}

export function getStorageWorkCenter(): string | null {
    return LocalStore.getItem<string | null>(STORAGE_KEYS.analysis.workCenter, null);
}

export function setStorageWorkCenter(wc: string) {
    LocalStore.setItem<string>(STORAGE_KEYS.analysis.workCenter, wc);
}

export function getStorageShowInactive() {
    return LocalStore.getItem<boolean>(STORAGE_KEYS.analysis.showInactive, false);
}

export function setStorageShowInactive(show: boolean) {
    LocalStore.setItem<boolean>(STORAGE_KEYS.analysis.showInactive, show);
}

export function getStorageEmployee(): string {
    return LocalStore.getItem<string>(STORAGE_KEYS.analysis.employee, '');
}

export function setStorageEmployee(emp: string) {
    LocalStore.setItem<string>(STORAGE_KEYS.analysis.employee, emp);
}

export function getStorageOperationCode(): string {
    return LocalStore.getItem<string>(STORAGE_KEYS.analysis.operationCode, '');
}

export function setStorageOperationCode(opCode: string) {
    LocalStore.setItem<string>(STORAGE_KEYS.analysis.operationCode, opCode);
}

export function getStorageReportGrouping(): ReportGrouping {
    const grouping = LocalStore.getItem<ReportGrouping | null>(STORAGE_KEYS.analysis.grouping, null);
    return isReportGrouping(grouping) ? {...defaultGrouping, ...grouping} : defaultGrouping;
}

export function setStorageReportGrouping(grouping: ReportGrouping) {
    LocalStore.setItem<ReportGrouping>(STORAGE_KEYS.analysis.grouping, grouping);
}


export function buildReportArgs(state: RootState): URLSearchParams {
    const minDate = selectMinDate(state);
    const maxDate = selectMaxDate(state);
    const employeeNumber = selectFilterEmployee(state);
    const opId = selectFilterOperation(state);
    const workCenter = selectWorkCenter(state);
    const groupBy = selectAllGroupBy(state);
    const itemCode = selectFilterItem(state);

    const options = new URLSearchParams();
    options.set('minDate', dayjs(minDate).format('YYYY-MM-DD'));
    options.set('maxDate', dayjs(maxDate).format('YYYY-MM-DD'));
    if (employeeNumber) {
        options.set('EmployeeNumber', employeeNumber);
    }
    if (opId) {
        options.set('StepCode', String(opId));
    }
    if (workCenter) {
        options.set('WorkCenter', workCenter);
    }
    if (itemCode) {
        options.set('itemCode', itemCode);
    }
    options.set('groups', Object.keys(groupBy).map(key => groupBy[key as unknown as ReportGroupingId] ?? '').filter(g => !!g).join(','))
    return options;
}


export const getGroupingSortProps = (grouping: ReportGrouping): SortProps<ReportData> => {
    switch (grouping[0]) {
        case '':
            return {field: 'idEntries', ascending: true};
        case 'EmployeeNumber':
        case 'FirstName':
        case 'LastName':
        case 'FullName':
            return {field: 'FullName', ascending: true};
        default:
            return {field: grouping[0], ascending: true};
    }
}
