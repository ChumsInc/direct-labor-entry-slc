import {createSlice} from "@reduxjs/toolkit";
import {loadChangeLog, loadVersion} from "./actions";

export interface VersionState {
    version: string | null;
    nextVersion: string | null;
    loading: boolean;
    changeLog: string | null;
    loadingChangelog: boolean;
}

export const initialVersionState: VersionState = {
    version: null,
    nextVersion: null,
    loading: false,
    changeLog: null,
    loadingChangelog: false,
}

const versionSlice = createSlice({
    'name': 'version',
    initialState: initialVersionState,
    reducers: {
        dismissNewVersion: (state) => {
            state.nextVersion = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadVersion.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadVersion.fulfilled, (state, action) => {
                state.loading = false;
                if (!state.version) {
                    state.version = action.payload;
                }
                state.nextVersion = action.payload;
            })
            .addCase(loadVersion.rejected, (state) => {
                state.loading = false;
            })
            .addCase(loadChangeLog.pending, (state) => {
                state.loadingChangelog = true;
            })
            .addCase(loadChangeLog.fulfilled, (state, action) => {
                state.changeLog = action.payload;
                state.loadingChangelog = false;
            })
            .addCase(loadChangeLog.rejected, (state) => {
                state.loadingChangelog = false;
            })
    },
    selectors: {
        selectVersionNo: (state) => state.version,
        selectNextVersionNo: (state) => {
            return !state.nextVersion || state.nextVersion === state.version ? null : state.nextVersion
        },
        selectVersionLoading: (state) => state.loading,
        selectLoadingChangeLog: (state) => state.loadingChangelog,
        selectChangeLog: (state) => state.changeLog,
    }
});
export const {
    dismissNewVersion
} = versionSlice.actions;

export const {
    selectNextVersionNo,
    selectVersionLoading,
    selectLoadingChangeLog,
    selectVersionNo,
    selectChangeLog
} = versionSlice.selectors;

export default versionSlice;
