import {
    FETCH_RENDERED_REPORT,
    FETCH_REPORT,
    LOADING_REPORT,
    LOADING_REPORT_ERROR,
    RECEIVE_REPORT
} from "../constants/reports";
import {fetchGET, fetchHTML} from "./fetch";
import {format} from 'date-fns';
import {stringify} from 'query-string';
import {API_PATH_REPORT, API_PATH_REPORT_EMPLOYEE_TOTAL, API_PATH_REPORT_STEP_TOTAL} from "../constants/paths";
import {FETCH_FAILURE, FETCH_INIT, FETCH_SUCCESS} from "../constants/app";
import {handleError} from "./app";

export const fetchReport = (minDate, maxDate, reportProps) => (dispatch, getState) => {
    dispatch({type: FETCH_REPORT, status: FETCH_INIT});
    const url = API_PATH_REPORT
        .replace(':minDate', format(minDate, 'yyyyMMdd'))
        .replace(':maxDate', format(maxDate, 'yyyyMMdd'))
        .replace(':queryString', stringify(reportProps));
    fetchGET(url, {cache: 'no-cache'})
        .then(res => {
            dispatch({type: FETCH_REPORT, status: FETCH_SUCCESS, data: res.result});

        })
        .catch(err => {
            dispatch({type: FETCH_REPORT, status: FETCH_FAILURE});
            dispatch(handleError(err, FETCH_REPORT));
        });
};

export const fetchEmployeeTotal = ({minDate, maxDate, WorkCenter}) => (dispatch) => {
    dispatch({type: FETCH_RENDERED_REPORT, status: FETCH_INIT});
    const url = API_PATH_REPORT_EMPLOYEE_TOTAL
        .replace(':minDate', format(minDate, 'yyyy-MM-dd'))
        .replace(':maxDate', format(maxDate, 'yyyy-MM-dd'))
        .replace(':workCenter', encodeURIComponent(WorkCenter));
    fetchHTML(url, {cache: 'no-cache'})
        .then(html => {
            dispatch({type: FETCH_RENDERED_REPORT, status: FETCH_SUCCESS, html});
        })
        .catch(err => {
            dispatch({type: FETCH_RENDERED_REPORT, status: FETCH_FAILURE});
            dispatch(handleError(err, FETCH_RENDERED_REPORT));
        })
};

export const fetchStepTotal = ({minDate, maxDate, WorkCenter}) => (dispatch) => {
    dispatch({type: FETCH_RENDERED_REPORT, status: FETCH_INIT});
    const url = API_PATH_REPORT_STEP_TOTAL
        .replace(':minDate', format(minDate, 'yyyy-MM-dd'))
        .replace(':maxDate', format(maxDate, 'yyyy-MM-dd'))
        .replace(':workCenter', encodeURIComponent(WorkCenter));

    fetchHTML(url, {cache: 'no-cache'})
        .then(html => {
            dispatch({type: FETCH_RENDERED_REPORT, status: FETCH_SUCCESS, html});
        })
        .catch(err => {
            dispatch({type: FETCH_RENDERED_REPORT, status: FETCH_FAILURE});
            dispatch(handleError(err, FETCH_RENDERED_REPORT));
        })
};
