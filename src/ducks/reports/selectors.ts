import {RootState} from "../index";
import {ReportData, ReportGroupingId} from "./types";
import {selectTableSort, SorterProps} from "chums-ducks";

export const tableId = 'analysis-report';

interface ReportDataSorterProps extends SorterProps {
    field: keyof ReportData,
}

const sorter = (sortProps: ReportDataSorterProps) => (a: ReportData, b: ReportData) => {
    const {field, ascending} = sortProps;
    switch (field) {
    case "idEntries":
        return a[field] - b[field] * (ascending ? 1 : -1);
    case "AllowedMinutes":
    case "StandardAllowedMinutes":
    case "SAM":
    case "Minutes":
        return (a[field] === b[field] ? a.idEntries - b.idEntries : a[field] - b[field]) * (ascending ? 1 : -1);
    case "EntryDate":
        return (new Date(a[field]).valueOf() - new Date(b[field]).valueOf() || a.idEntries - b.idEntries) * (ascending ? 1 : -1);
    default:
        return (a[field] === b[field] ? a.idEntries - b.idEntries : (String(a[field]).toLowerCase() > String(b[field]).toLowerCase() ? 1 : -1)) * (ascending ? 1 : -1);
    }
}


export const selectMinDate = (state: RootState) => state.reports.minDate;
export const selectMaxDate = (state: RootState) => state.reports.maxDate;
export const selectWorkCenter = (state: RootState) => state.reports.workCenter;
export const selectShowInactive = (state: RootState) => state.reports.showInactive
export const selectFilterEmployee = (state: RootState) => state.reports.filterEmployee;
export const selectFilterOperation = (state: RootState) => state.reports.filterOperation;
export const selectFilterItem = (state: RootState) => state.reports.filterItem;

export const selectLoading = (state: RootState) => state.reports.loading;
export const selectDataLength = (state: RootState) => state.reports.data.length;
export const selectHTML = (state: RootState) => state.reports.html;

export const selectAllGroupBy = (state: RootState) => state.reports.groupBy;
export const selectGroupBy = (id: ReportGroupingId) => (state: RootState) => {
    return state.reports.groupBy[id];
}
export const selectLowerGroupBy = (id: ReportGroupingId) => (state: RootState) => {
    return Object.keys(state.reports.groupBy)
        .sort()
        .filter(key => key < String(id))
        .map((key: unknown) => state.reports.groupBy[key as ReportGroupingId]);
}

export const selectSortedData = (state: RootState) => {
    const sort = selectTableSort(tableId)(state);
    const item = selectFilterItem(state);
    let regex: RegExp | null = null;
    try {
        regex = new RegExp(item);
    } catch (err) {
    }
    return state.reports.data.filter(row => !regex || regex.test(row.ItemCode))
        .sort(sorter(sort as ReportDataSorterProps));
}
