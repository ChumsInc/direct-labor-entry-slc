import dayjs from "dayjs";
import {fetchJSON} from "chums-components";
import {reSLCWorkCenter} from "../../contants";
import {BasicDLEntry, DLEntry} from "chums-types";

export const API_PATH_ENTRIES = '/api/operations/production/dl/entry/:EntryDate';
export const API_PATH_SAVE_ENTRY = '/api/operations/production/dl/entry';
export const API_PATH_DELETE_ENTRY = '/api/operations/production/dl/entry/:id';


export async function fetchEntries(arg: string): Promise<DLEntry[]> {
    try {
        const url = API_PATH_ENTRIES
            .replace(':EntryDate', encodeURIComponent(dayjs(arg).format('YYYY-MM-DD')));
        const res = await fetchJSON<{ result: DLEntry[] }>(url, {cache: 'no-cache'});
        return (res?.result ?? []).filter(entry => reSLCWorkCenter.test(entry.WorkCenter));
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchEntries()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchEntries()", err);
        return Promise.reject(new Error('Error in fetchEntries()'));
    }
}

export async function postEntry(arg: BasicDLEntry): Promise<DLEntry | null> {
    try {
        const body = JSON.stringify(arg);
        const res = await fetchJSON<{ result: DLEntry[] }>(API_PATH_SAVE_ENTRY, {method: 'POST', body});
        const [savedEntry] = res?.result ?? [];
        return savedEntry ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postEntry()", err.message);
            return Promise.reject(err);
        }
        console.debug("postEntry()", err);
        return Promise.reject(new Error('Error in postEntry()'));
    }
}

export async function deleteEntry(arg: number): Promise<void> {
    try {
        const url = API_PATH_DELETE_ENTRY.replace(':id', encodeURIComponent(arg));
        await fetchJSON(url, {method: 'DELETE'});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("deleteEntry()", err.message);
            return Promise.reject(err);
        }
        console.debug("deleteEntry()", err);
        return Promise.reject(new Error('Error in deleteEntry()'));
    }
}
