import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchChangeLog, fetchVersion} from "./api";
import {RootState} from "@/app/configureStore";
import {selectLoadingChangeLog, selectVersionLoading} from "./index";

export const loadVersion = createAsyncThunk<string | null, void>(
    'version/load',
    async () => {
        return await fetchVersion();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectVersionLoading(state);
        }
    }
)

export const loadChangeLog = createAsyncThunk<string | null, void>(
    'version/changeLog/load',
    async () => {
        return await fetchChangeLog();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoadingChangeLog(state);
        }
    }
)
