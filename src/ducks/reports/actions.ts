import {selectMaxDate, selectMinDate, selectReportLoading, selectWorkCenter} from "./selectors";
import {HTMLReportType} from "./types";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {
    getStorageShowInactive,
    setStorageMaxDate,
    setStorageMinDate,
    setStorageShowInactive,
    setStorageWorkCenter
} from "./utils";
import {RootState} from "../../app/configureStore";
import {fetchHTMLReport} from "./api";

export const setMinDate = createAction('reports/setMinDate', (arg: string) => {
    return {
        payload: setStorageMinDate(arg)
    };
});

export const setMaxDate = createAction('reports/setMaxDate', (arg: string) => {
    return {
        payload: setStorageMaxDate(arg)
    }
});

export const setWorkCenter = createAction('reports/setWorkCenter', (wc: string) => {
    setStorageWorkCenter(wc);
    return {
        payload: wc,
    }
})
//
// export const toggleShowInactive = createAction('reports/toggleShowInactive', (arg: boolean | undefined) => {
//     const show = getStorageShowInactive();
//     setStorageShowInactive(arg ?? show);
//     return {
//         payload: arg ?? show
//     }
// })
//
// export const setFilterEmployee = createAction('reports/setEmployeeFilter', (arg: string) => {
//     return {
//         payload: arg,
//     }
// })
//
// export const setFilterOperation = createAction<string>('reports/setOperationFilter')
// export const setFilterItem = createAction<string>('reports/setItemFilter');

export const loadHTMLReport = createAsyncThunk<string | null, HTMLReportType>(
    'reports/loadHTML',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const minDate = selectMinDate(state);
        const maxDate = selectMaxDate(state);
        const workCenter = selectWorkCenter(state);
        return await fetchHTMLReport({reportType: arg, minDate, maxDate, workCenter})
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectReportLoading(state);
        }
    })
