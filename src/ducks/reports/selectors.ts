import {RootState} from "../../app/configureStore";

export const selectMinDate = (state: RootState) => state.reports.minDate;
export const selectMaxDate = (state: RootState) => state.reports.maxDate;
export const selectWorkCenter = (state: RootState) => state.reports.workCenter;
export const selectFilterEmployee = (state: RootState) => state.reports.filterEmployee;
export const selectFilterOperation = (state: RootState) => state.reports.filterOperation;
export const selectFilterItem = (state: RootState) => state.reports.filterItem;

export const selectReportLoading = (state: RootState) => state.reports.actionStatus === 'loading';
export const selectHTML = (state: RootState) => state.reports.html;
