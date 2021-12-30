export const storePrefix = 'com.chums.intranet.dl-entry';

export const appStorage = {
    getItem: (key) => {
        if (window.localStorage) {
            const val = window.localStorage.getItem(key);
            try {
                return JSON.parse(val || null);
            } catch (e) {
                console.log('getItem()', e.message, val);
            }
        }
        return null;
    },
    setItem: (key, value) => {
        if (window.localStorage) {
            window.localStorage.setItem(key, JSON.stringify(value));
        }
    },
    delete: (key) => {
        if (window.localStorage) {
            window.localStorage.removeItem(key);
        }
    }
};

export const STORAGE_KEYS = {
    TAB: `${storePrefix}.tab`,
    SLC_ENTRY_DATE: `${storePrefix}.slcEntryDate`,
    reports: {
        minDate: `${storePrefix}.reports.minDate`,
        maxDate: `${storePrefix}.reports.maxDate`,
        workCenter: `${storePrefix}.reports.workCenter`,
        showInactive: `${storePrefix}.reports.showInactive`,
        employee: `${storePrefix}.reports.employee`,
        operationId: `${storePrefix}.reports.operationId`,
        grouping: `${storePrefix}.reports.grouping`,
    },
};
