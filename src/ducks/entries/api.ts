import {fetchJSON} from "@chumsinc/ui-utils";
import {reSLCWorkCenter} from "../../contants";
import {BasicDLEntry, DLEntry} from "chums-types";
import {FetchEntriesProps, KeyedObject} from "../common-types";
import {searchParams} from "../../utils/fetch";


export async function fetchEntries(arg: FetchEntriesProps): Promise<DLEntry[]> {
    try {
        const params = searchParams(arg as KeyedObject);
        const url = `/api/operations/production/dl/entries${encodeURIComponent(arg.id ?? '')}.json?${params.toString()}`;
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
        const url = arg.id === 0
            ? '/api/operations/production/dl/entries.json'
            : `/api/operations/production/dl/entries/${encodeURIComponent(arg.id)}.json`
        const res = await fetchJSON<{ result: DLEntry[] }>(url, {method: arg.id === 0 ? 'POST' : 'PUT', body});
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
        const url = `/api/operations/production/dl/entries/${encodeURIComponent(arg)}.json`;
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
