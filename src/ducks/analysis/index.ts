import {WORK_CENTER_INH} from "./constants";
import {ReportData, ReportGrouping} from "./types";
import {ActionStatus} from "../common-types";
import {
    getGroupingSortProps,
    getStorageEmployee,
    getStorageMaxDate,
    getStorageMinDate,
    getStorageOperationCode,
    getStorageReportGrouping,
    getStorageShowInactive,
    getStorageWorkCenter
} from "./utils";
import {createReducer} from "@reduxjs/toolkit";
import {SortProps} from "@chumsinc/sortable-tables";
import {
    loadReportData,
    setFilterEmployee,
    setFilterItem,
    setFilterOperation,
    setMaxDate,
    setMinDate,
    setReportGrouping,
    setReportSort,
    setWorkCenter,
    toggleShowInactive
} from "./actions";

export interface ReportsState {
    minDate: string;
    maxDate: string;
    workCenter: string;
    showInactive: boolean;
    filterEmployee: string | null;
    filterOperation: string | null;
    filterItem: string | null;
    groupBy: ReportGrouping;
    actionStatus: ActionStatus;
    data: ReportData[];
    sort: SortProps<ReportData>
}

const initialState = (): ReportsState => ({
    minDate: getStorageMinDate(),
    maxDate: getStorageMaxDate(),
    workCenter: getStorageWorkCenter() ?? WORK_CENTER_INH,
    showInactive: getStorageShowInactive() || false,
    filterEmployee: getStorageEmployee(),
    filterOperation: getStorageOperationCode(),
    filterItem: '',
    groupBy: getStorageReportGrouping(),
    actionStatus: 'idle',
    data: [],
    sort: getGroupingSortProps(getStorageReportGrouping()),
})

const analysisReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setMinDate, (state, action) => {
            state.minDate = action.payload;
        })
        .addCase(setMaxDate, (state, action) => {
            state.maxDate = action.payload;
        })
        .addCase(setWorkCenter, (state, action) => {
            state.workCenter = action.payload;
        })
        .addCase(setFilterEmployee, (state, action) => {
            state.filterEmployee = action.payload;
        })
        .addCase(toggleShowInactive, (state, action) => {
            state.showInactive = action.payload;
        })
        .addCase(setFilterOperation, (state, action) => {
            state.filterOperation = action.payload;
        })
        .addCase(setFilterItem, (state, action) => {
            state.filterItem = action.payload;
        })
        .addCase(setReportGrouping, (state, action) => {
            state.groupBy = action.payload;
            state.sort = getGroupingSortProps(action.payload);
        })
        .addCase(setReportSort, (state, action) => {
            state.sort = action.payload;
        })
        .addCase(loadReportData.pending, (state) => {
            state.actionStatus = 'loading';
        })
        .addCase(loadReportData.fulfilled, (state, action) => {
            state.actionStatus = 'idle';
            state.data = action.payload;
        })
        .addCase(loadReportData.rejected, (state) => {
            state.actionStatus = 'idle';
        })
});

export default analysisReducer;
