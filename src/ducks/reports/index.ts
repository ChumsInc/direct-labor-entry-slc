import {WORK_CENTER_INH} from "./constants";
import {ActionStatus} from "../common-types";
import {
    getStorageEmployee,
    getStorageMaxDate,
    getStorageMinDate,
    getStorageOperationCode,
    getStorageWorkCenter
} from "./utils";
import {createReducer} from "@reduxjs/toolkit";
import {loadHTMLReport, setMaxDate, setMinDate, setWorkCenter} from "./actions";

export interface ReportsState {
    minDate: string;
    maxDate: string;
    workCenter: string;
    filterEmployee: string | null;
    filterOperation: string | null;
    filterItem: string | null;
    actionStatus: ActionStatus;
    html: string;
}

const initialState = (): ReportsState => ({
    minDate: getStorageMinDate(),
    maxDate: getStorageMaxDate(),
    workCenter: getStorageWorkCenter() ?? WORK_CENTER_INH,
    filterEmployee: getStorageEmployee(),
    filterOperation: getStorageOperationCode(),
    filterItem: '',
    actionStatus: 'idle',
    html: '',
})

const reportsReducer = createReducer(initialState, (builder) => {
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
        .addCase(loadHTMLReport.pending, (state) => {
            state.actionStatus = 'loading';
        })
        .addCase(loadHTMLReport.fulfilled, (state, action) => {
            state.actionStatus = 'idle';
            state.html = action.payload ?? '<div className="alert alert-info">No report data returned</div>';
        })
        .addCase(loadHTMLReport.rejected, (state, action) => {
            state.actionStatus = 'idle';
            state.html = `<div className="alert alert-info"><strong class="me-3">Error</strong>${action.error.message}</div>`;
        })
});

export default reportsReducer;
