import {RootState} from "../../app/configureStore";

export const selectVersionNo = (state: RootState) => state.version.version;
export const selectVersionLoading = (state: RootState) => state.version.loading;
export const selectLoadingChangeLog = (state: RootState) => state.version.loadingChangelog;
export const selectChangeLog = (state: RootState) => state.version.changeLog;

