import {WorkTicket} from "chums-types";
import {fetchJSON} from "@chumsinc/ui-utils";
import {ITOrder, WorkTicketResponse} from "../common-types";

export async function fetchWorkTicket(arg: string): Promise<WorkTicket | null> {
    try {
        const url = '/api/operations/production/work-ticket/:document.json'
            .replace(':document', encodeURIComponent(arg.trim().padStart(12, '0')));
        const res = await fetchJSON<{ workTicket: WorkTicket | null }>(url, {cache: 'no-cache'});
        return res?.workTicket ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchWorkTicket()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchWorkTicket()", err);
        return Promise.reject(new Error('Error in fetchWorkTicket()'));
    }
}

export async function fetchInventoryTransfer(arg: string): Promise<ITOrder[]> {
    try {
        const url = '/api/operations/production/wo/it/:document.json'
            .replace(':document', encodeURIComponent(arg.trim().padStart(7, '0')));
        const res = await fetchJSON<{ result: ITOrder[] }>(url, {cache: 'no-cache'});
        return res?.result ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchInventoryTransfer()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchInventoryTransfer()", err);
        return Promise.reject(new Error('Error in fetchInventoryTransfer()'));
    }
}

export async function fetchDocument(arg: string): Promise<WorkTicketResponse> {
    try {
        const [workTicket, itOrder] = await Promise.all([fetchWorkTicket(arg), fetchInventoryTransfer(arg)]);
        return {workTicket, itOrder}
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchDocument()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchDocument()", err);
        return Promise.reject(new Error('Error in fetchDocument()'));
    }
}
