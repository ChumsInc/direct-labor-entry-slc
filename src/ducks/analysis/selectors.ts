import {RootState} from "../../app/configureStore";
import {ReportData, ReportGroupingId} from "./types";
import {createSelector} from "@reduxjs/toolkit";
import {reportSorter} from "./utils";

export const selectMinDate = (state: RootState) => state.analysis.minDate;
export const selectMaxDate = (state: RootState) => state.analysis.maxDate;
export const selectWorkCenter = (state: RootState) => state.analysis.workCenter;
export const selectShowInactive = (state: RootState) => state.analysis.showInactive
export const selectFilterEmployee = (state: RootState) => state.analysis.filterEmployee;
export const selectFilterOperation = (state: RootState) => state.analysis.filterOperation;
export const selectFilterItem = (state: RootState) => state.analysis.filterItem;
export const selectReportData = (state:RootState) => state.analysis.data;
export const selectReportSort = (state:RootState) => state.analysis.sort;

export const selectReportLoading = (state: RootState) => state.analysis.actionStatus === 'loading';
export const selectDataLength = (state: RootState) => state.analysis.data.length;


export const selectAllGroupBy = (state: RootState) => state.analysis.groupBy;

export const selectGroupBy = (state:RootState, id: ReportGroupingId) => state.analysis.groupBy[id];
export const selectLowerGroupBy = (state:RootState, id: ReportGroupingId):string[] => {
    return Object.keys(state.analysis.groupBy)
        .sort()
        .filter(key => key < String(id))
        .map((key: string) => state.analysis.groupBy[+key as ReportGroupingId]);
}

export const selectSortedData = createSelector(
    [selectReportData, selectReportSort, selectFilterItem],
    (data, sort, item) => {
        return data
            .filter(row => !item || row.ItemCode.startsWith(item))
            .sort(reportSorter(sort))
    }
)
