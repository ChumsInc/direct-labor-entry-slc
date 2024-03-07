import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {stepSorter} from "./utils";

export const selectStepsList = (state:RootState) => state.steps.list;
export const selectStepsLoading = (state:RootState) => state.steps.status === 'loading';
export const selectStepsLoaded = (state:RootState) => state.steps.loaded;
export const selectStepsWorkCenter = (state:RootState, wc:string) => wc;

export const selectWorkCenterSteps = createSelector(
    [selectStepsList, selectStepsWorkCenter],
    (list, wc) => {
        return list.filter(step => !wc || step.workCenter === wc)
            .sort(stepSorter({field: "stepCode", ascending: true}));
    }
)

export const selectStepByID = createSelector(
    [selectStepsList, (state:RootState, id: number) => id],
    (list, id) => {
        const [step] = list.filter(step => step.id === id);
        return step ?? null;
    }
)
