import {Step} from "../common-types";
import {fetchJSON} from "chums-components";

export async function fetchSteps():Promise<Step[]> {
    try {
        const url = '/api/operations/production/dl/steps';
        const res = await fetchJSON<{steps: Step[]}>(url, {cache: 'no-cache'});
        return res.steps ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchSteps()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSteps()", err);
        return Promise.reject(new Error('Error in fetchSteps()'));
    }
}
