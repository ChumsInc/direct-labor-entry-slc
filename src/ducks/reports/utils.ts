import {STORAGE_KEYS} from "../../utils/appStorage";
import dayjs from "dayjs";
import weekday from 'dayjs/plugin/weekday'
import {LocalStore} from '@chumsinc/ui-utils';

dayjs.extend(weekday);

export function getStorageMinDate(): string {
    const minDate = LocalStore.getItem<string | null>(STORAGE_KEYS.reports.minDate, null);
    if (minDate && dayjs(minDate).isValid()) {
        return minDate;
    }
    return dayjs().subtract(1, 'week').weekday(1).toISOString()
}

export function setStorageMinDate(date: string): string {
    if (!date || !dayjs(date).isValid()) {
        date = dayjs().subtract(1, 'week').weekday(1).toISOString();
    }
    LocalStore.setItem<string>(STORAGE_KEYS.reports.minDate, date);
    return date;
}

export function getStorageMaxDate(): string {
    const maxDate = LocalStore.getItem<string | null>(STORAGE_KEYS.reports.maxDate, null);
    if (maxDate && dayjs(maxDate).isValid()) {
        return maxDate;
    }
    return dayjs().subtract(1, "week").weekday(5).toISOString();
}

export function setStorageMaxDate(date: string): string {
    if (!date || !dayjs(date).isValid()) {
        date = dayjs().subtract(1, "week").weekday(5).toISOString();
    }
    LocalStore.setItem<string>(STORAGE_KEYS.reports.maxDate, date);
    return date;
}

export function getStorageWorkCenter(): string | null {
    return LocalStore.getItem<string | null>(STORAGE_KEYS.reports.workCenter, null);
}

export function setStorageWorkCenter(wc: string) {
    LocalStore.setItem<string>(STORAGE_KEYS.reports.workCenter, wc);
}

export function getStorageShowInactive() {
    return LocalStore.getItem<boolean>(STORAGE_KEYS.reports.showInactive, false);
}

export function setStorageShowInactive(show: boolean) {
    LocalStore.setItem<boolean>(STORAGE_KEYS.reports.showInactive, show);
}

export function getStorageEmployee(): string {
    return LocalStore.getItem<string>(STORAGE_KEYS.reports.employee, '');
}

export function setStorageEmployee(emp: string) {
    LocalStore.setItem<string>(STORAGE_KEYS.reports.employee, emp);
}

export function getStorageOperationCode(): string {
    return LocalStore.getItem<string>(STORAGE_KEYS.reports.operationCode, '');
}

export function setStorageOperationCode(opCode: string) {
    LocalStore.setItem<string>(STORAGE_KEYS.reports.operationCode, opCode);
}


