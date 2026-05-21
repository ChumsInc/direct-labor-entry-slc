export const storePrefix = 'chums::intranet::dl-entry-slc';

export const STORAGE_KEYS = {
    TAB: `${storePrefix}.tab`,
    SLC_ENTRY_DATE: `${storePrefix}.slcEntryDate`,
    reports: {
        minDate: `${storePrefix}.reports.minDate`,
        maxDate: `${storePrefix}.reports.maxDate`,
        workCenter: `${storePrefix}.reports.workCenter`,
        showInactive: `${storePrefix}.reports.showInactive`,
        employee: `${storePrefix}.reports.employee`,
        operationCode: `${storePrefix}.reports.operationCode`
    },
    analysis: {
        minDate: `${storePrefix}.analysis.minDate`,
        maxDate: `${storePrefix}.analysis.maxDate`,
        workCenter: `${storePrefix}.analysis.workCenter`,
        showInactive: `${storePrefix}.analysis.showInactive`,
        employee: `${storePrefix}.analysis.employee`,
        operationCode: `${storePrefix}.analysis.operationCode`,
        itemCode: `${storePrefix}.analysis.itemCode`,
        grouping: `${storePrefix}.analysis.grouping`,
    },
};
