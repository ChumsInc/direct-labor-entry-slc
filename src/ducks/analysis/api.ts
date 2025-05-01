import {ReportData} from "./types";
import dayjs from "dayjs";
import {fetchJSON} from "@chumsinc/ui-utils";

export const API_PATH_REPORT = '/api/operations/production/dl/report/data.json?:queryString';

export interface FetchReportDataArgs {
    minDate: string;
    maxDate: string;
    options: URLSearchParams;
}

export async function fetchReportData(arg: URLSearchParams): Promise<ReportData[]> {
    try {
        const url = API_PATH_REPORT
            .replace(':queryString', arg.toString());
        const res = await fetchJSON<{ result: ReportData[] }>(url, {cache: 'no-cache'});
        return res?.result ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchReportData()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchReportData()", err);
        return Promise.reject(new Error('Error in fetchReportData()'));
    }
}

// const htmlReportURL = (reportType: HTMLReportType) => {
//     switch (reportType) {
//         case "step-total":
//             return API_PATH_REPORT_STEP_TOTAL;
//         case 'employee-total':
//             return API_PATH_REPORT_EMPLOYEE_TOTAL;
//         default:
//             return API_PATH_REPORT_EMPLOYEE_TOTAL;
//     }
// }

// export interface FetchHTMLReportArgs {
//     reportType: HTMLReportType;
//     minDate: string;
//     maxDate: string;
//     workCenter: string;
// }

// export async function fetchHTMLReport(arg: FetchHTMLReportArgs): Promise<string | null> {
//     try {
//         const url = htmlReportURL(arg.reportType)
//             .replace(':minDate', dayjs(arg.minDate).format('YYYYMMDD'))
//             .replace(':maxDate', dayjs(arg.maxDate).format('YYYYMMDD'))
//             .replace(':workCenter', encodeURIComponent(arg.workCenter));
//         return await fetchHTML(url) ?? null;
//     } catch (err: unknown) {
//         if (err instanceof Error) {
//             console.debug("fetchHTMLReport()", err.message);
//             return Promise.reject(err);
//         }
//         console.debug("fetchHTMLReport()", err);
//         return Promise.reject(new Error('Error in fetchHTMLReport()'));
//     }
// }
