import {fetchHTML, fetchJSON} from "@chumsinc/ui-utils";

export async function fetchVersion():Promise<string|null> {
    try {
        const packageJSON = await fetchJSON<{version:string}>('package.json');
        return packageJSON?.version ?? null
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchVersion()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchVersion()", err);
        return Promise.reject(new Error('Error in fetchVersion()'));
    }
}

export async function fetchChangeLog():Promise<string|null> {
    try {
        const content = await fetchHTML('CHANGELOG.md');
        return content ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchVersion()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchVersion()", err);
        return Promise.reject(new Error('Error in fetchVersion()'));
    }
}

