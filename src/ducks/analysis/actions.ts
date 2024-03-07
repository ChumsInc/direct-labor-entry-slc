import {selectReportLoading} from "./selectors";
import {ReportData, ReportGrouping} from "./types";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {
    buildReportArgs,
    getStorageReportGrouping,
    getStorageShowInactive,
    setStorageMaxDate,
    setStorageMinDate,
    setStorageReportGrouping,
    setStorageShowInactive,
    setStorageWorkCenter
} from "./utils";
import {RootState} from "../../app/configureStore";
import {fetchReportData} from "./api";
import dayjs from "dayjs";
import {SortProps} from "chums-components";

export const API_PATH_REPORT = '/api/operations/production/dl/report/data/:minDate/:maxDate?:queryString';

export const setMinDate = createAction('analysis/setMinDate', (arg: string) => {
    return {
        payload: setStorageMinDate(arg)
    };
});

export const setMaxDate = createAction('analysis/setMaxDate', (arg: string) => {
    return {
        payload: setStorageMaxDate(arg)
    }
});

export const setWorkCenter = createAction('analysis/setWorkCenter', (wc: string) => {
    setStorageWorkCenter(wc);
    return {
        payload: wc,
    }
})

export const toggleShowInactive = createAction('analysis/toggleShowInactive', (arg: boolean | undefined) => {
    const show = getStorageShowInactive();
    setStorageShowInactive(arg ?? show);
    return {
        payload: arg ?? show
    }
})

export const setFilterEmployee = createAction('analysis/setEmployeeFilter', (arg: string) => {
    return {
        payload: arg,
    }
})

export const setFilterOperation = createAction<string>('analysis/setOperationFilter')
export const setFilterItem = createAction<string>('analysis/setItemFilter');

export const setReportGrouping = createAction('analysis/setGrouping', (arg: Partial<ReportGrouping>) => {
    const grouping = getStorageReportGrouping();
    setStorageReportGrouping({...grouping, ...arg});
    return {
        payload: {...grouping, ...arg}
    }
})

export const setReportSort = createAction<SortProps<ReportData>>('analysis/setSort');

export const loadReportData = createAsyncThunk<ReportData[], void>(
    'analysis/loadData',
    async (_, {getState}) => {
        const state = getState() as RootState;
        return await fetchReportData(buildReportArgs(state));
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return !selectReportLoading(state);
        }
    }
)


export const loadReportExcel = createAsyncThunk<void, void>(
    'analysis/loadReportExcel',
    (_, {getState}) => {
        const state = getState() as RootState;
        const arg = buildReportArgs(state);
        const url = API_PATH_REPORT
            .replace(':minDate', dayjs(arg.minDate).format('YYYYMMDD'))
            .replace(':maxDate', dayjs(arg.maxDate).format('YYYYMMDD'))
            .replace(':queryString', arg.options.toString());
        window.open(url, '_blank');
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectReportLoading(state);
        }
    }
)


