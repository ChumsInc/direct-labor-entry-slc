import {fetchJSON} from "@chumsinc/ui-utils";
import {DLStep} from "chums-types";

export async function fetchSteps(): Promise<DLStep[]> {
    try {
        const url = '/api/operations/production/dl/steps.json';
        const res = await fetchJSON<{ steps: DLStep[] }>(url, {cache: 'no-cache'});
        return res?.steps ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchSteps()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSteps()", err);
        return Promise.reject(new Error('Error in fetchSteps()'));
    }
}
