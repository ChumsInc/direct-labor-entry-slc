import {ActionInterface, ActionPayload} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {ReportData} from "./types";

export interface ReportPayload extends ActionPayload {
    date?: string|null,
    value?: string,
    active?: boolean,
    id?: number,
    data?: ReportData[]
    html?: string,
}

export interface ReportAction extends ActionInterface {
    payload?: ReportPayload,
}

export interface ReportThunkAction extends ThunkAction<any, RootState, unknown, ReportAction> {}


export const reportsSetMinDate = 'reports/setMinDate';
export const reportsSetMaxDate = 'reports/setMaxDate';
export const reportsSetWorkCenter = 'reports/setWorkCenter';
export const reportsToggleFilterInactive = 'reports/toggleFilterInactive';
export const reportsFilterEmployee = 'reports/filterEmployee';
export const reportsFilterOperation = 'reports/filterOperation';
export const reportsFilterItem = 'reports/filterItem';
export const reportsSetGroupBy = 'reports/setGroupBy';
export const reportsFetchDataRequested = 'reports/fetchDataRequested';
export const reportsFetchDataSucceeded = 'reports/fetchDataSucceeded';
export const reportsFetchDataFailed = 'reports/fetchDataFailed';
export const reportsFetchHTMLRequested = 'reports/fetchHTMLRequested';
export const reportsFetchHTMLSucceeded = 'reports/fetchHTMLSucceeded';
export const reportsFetchHTMLFailed = 'reports/fetchHTMLFailed';


