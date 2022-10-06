import {
    ReportAction,
    reportsFetchDataFailed,
    reportsFetchDataRequested,
    reportsFetchDataSucceeded,
    reportsFetchHTMLFailed,
    reportsFetchHTMLRequested,
    reportsFetchHTMLSucceeded,
    reportsFilterEmployee,
    reportsFilterItem,
    reportsFilterOperation,
    reportsSetGroupBy,
    reportsSetMaxDate,
    reportsSetMinDate,
    reportsSetWorkCenter,
    reportsToggleFilterInactive,
    ReportThunkAction
} from "./actionTypes";
import {
    selectAllGroupBy,
    selectFilterEmployee,
    selectFilterOperation,
    selectLoading,
    selectMaxDate,
    selectMinDate,
    selectWorkCenter
} from "./selectors";
import {format} from "date-fns";
import {fetchHTML, fetchJSON} from "chums-ducks";
import {HTMLReportType, ReportGroupingId} from "./types";

export const API_PATH_REPORT = '/api/operations/production/dl/report/data/:minDate/:maxDate?:queryString';
export const API_PATH_REPORT_DOWNLOAD = 'https://intranet.chums.com/api/operations/production/dl/report/data/:minDate/:maxDate.xlsx?:queryString';
export const API_PATH_REPORT_EMPLOYEE_TOTAL = '/api/operations/production/dl/report/employee-total/:minDate/:maxDate/:workCenter/render';
export const API_PATH_REPORT_STEP_TOTAL = '/api/operations/production/dl/report/step-total/:minDate/:maxDate/:workCenter/render';

export const minDateChangedAction = (date: string) => ({type: reportsSetMinDate, payload: {date}});
export const maxDateChangedAction = (date: string) => ({type: reportsSetMaxDate, payload: {date}});
export const workCenterChangedAction = (value: string) => ({type: reportsSetWorkCenter, payload: {value}});
export const toggleShowInactiveAction = () => ({type: reportsToggleFilterInactive});
export const filterEmployeeAction = (value: string) => ({type: reportsFilterEmployee, payload: {value}});
export const filterOperationAction = (value: string) => ({type: reportsFilterOperation, payload: {value}});
export const filterItemAction = (value: string) => ({type: reportsFilterItem, payload: {value}});
export const changeGroupByAction = (id: ReportGroupingId, value: string): ReportAction => ({
    type: reportsSetGroupBy,
    payload: {id, value}
});

export const fetchReportDataAction = (): ReportThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            const minDate = selectMinDate(state);
            const maxDate = selectMaxDate(state);
            const employeeNumber = selectFilterEmployee(state);
            const opId = selectFilterOperation(state);
            const workCenter = selectWorkCenter(state);
            const groupBy = selectAllGroupBy(state);

            const params = new URLSearchParams();
            if (employeeNumber) {
                params.set('EmployeeNumber', employeeNumber);
            }
            if (opId) {
                params.set('StepCode', String(opId));
            }
            if (workCenter) {
                params.set('WorkCenter', workCenter);
            }
            params.set(`group1`, groupBy[0]);
            params.set(`group2`, groupBy[1]);
            params.set(`group3`, groupBy[2]);
            params.set(`group4`, groupBy[3]);
            params.set(`group5`, groupBy[4]);
            params.set(`group6`, groupBy[5]);
            params.set(`group7`, groupBy[6]);

            dispatch({type: reportsFetchDataRequested});
            const url = API_PATH_REPORT
                .replace(':minDate', format(new Date(minDate), 'yyyyMMdd'))
                .replace(':maxDate', format(new Date(maxDate), 'yyyyMMdd'))
                .replace(':queryString', params.toString());
            const res = await fetchJSON(url, {cache: 'no-cache'});
            dispatch({type: reportsFetchDataSucceeded, payload: {data: res.result || []}})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchHTMLAction()", error.message);
                return dispatch({type: reportsFetchDataFailed, payload: {error, context: reportsFetchDataRequested}})
            }
            console.error("fetchHTMLAction()", error);
        }
    }

export const fetchReportExcelAction = (): ReportThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            const minDate = selectMinDate(state);
            const maxDate = selectMaxDate(state);
            const employeeNumber = selectFilterEmployee(state);
            const opId = selectFilterOperation(state);
            const workCenter = selectWorkCenter(state);
            const groupBy = selectAllGroupBy(state);

            const params = new URLSearchParams();
            if (employeeNumber) {
                params.set('EmployeeNumber', employeeNumber);
            }
            if (opId) {
                params.set('StepCode', String(opId));
            }
            if (workCenter) {
                params.set('WorkCenter', workCenter);
            }
            params.set(`group1`, groupBy[0]);
            params.set(`group2`, groupBy[1]);
            params.set(`group3`, groupBy[2]);
            params.set(`group4`, groupBy[3]);
            params.set(`group5`, groupBy[4]);
            params.set(`group6`, groupBy[5]);
            params.set(`group7`, groupBy[6]);

            const url = API_PATH_REPORT_DOWNLOAD
                .replace(':minDate', format(new Date(minDate), 'yyyyMMdd'))
                .replace(':maxDate', format(new Date(maxDate), 'yyyyMMdd'))
                .replace(':queryString', params.toString());

            console.log(url);
            window.open(url, '_blank');
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchHTMLAction()", error.message);
                return dispatch({type: reportsFetchDataFailed, payload: {error, context: reportsFetchDataRequested}})
            }
            console.error("fetchHTMLAction()", error);
        }
    }

const htmlReportURL = (reportType: HTMLReportType) => {
    switch (reportType) {
    case "step-total":
        return API_PATH_REPORT_STEP_TOTAL;
    case 'employee-total':
        return API_PATH_REPORT_EMPLOYEE_TOTAL;
    default:
        return API_PATH_REPORT_EMPLOYEE_TOTAL;
    }
}
export const fetchHTMLReportAction = (reportType: HTMLReportType): ReportThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            const minDate = selectMinDate(state);
            const maxDate = selectMaxDate(state);
            const workCenter = selectWorkCenter(state);
            dispatch({type: reportsFetchHTMLRequested});
            const url = htmlReportURL(reportType)
                .replace(':minDate', format(new Date(minDate), 'yyyy-MM-dd'))
                .replace(':maxDate', format(new Date(maxDate), 'yyyy-MM-dd'))
                .replace(':workCenter', encodeURIComponent(workCenter));
            const html = await fetchHTML(url);
            dispatch({type: reportsFetchHTMLSucceeded, payload: {html}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchEmployeeTotal()", error.message);
                return dispatch({type: reportsFetchHTMLFailed, payload: {error, context: reportsFetchHTMLRequested}})
            }
            console.error("fetchEmployeeTotal()", error);
        }
    };
