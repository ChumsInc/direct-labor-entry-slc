import {createReducer} from "@reduxjs/toolkit";
import {loadChangeLog, loadVersion} from "./actions";

export interface VersionState {
    version: string|null;
    loading: boolean;
    changeLog: string|null;
    loadingChangelog: boolean;
}

export const initialVersionState:VersionState = {
    version: null,
    loading: false,
    changeLog: null,
    loadingChangelog: false,
}

const versionReducer = createReducer(initialVersionState, builder => {
    builder
        .addCase(loadVersion.pending, (state) => {
        state.loading = true;
    })
        .addCase(loadVersion.fulfilled, (state, action) => {
            state.loading = false;
            state.version = action.payload;
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
});

export default versionReducer;
