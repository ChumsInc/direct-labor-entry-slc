import {createAsyncThunk} from "@reduxjs/toolkit";
import {Step} from "../common-types";
import {fetchSteps} from "./api";
import {RootState} from "../../app/configureStore";
import {selectStepsLoading} from "./selectors";

export const loadSteps = createAsyncThunk<Step[], void>(
    'steps/load',
    async () => {
        return fetchSteps();
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return !selectStepsLoading(state);
        }
    }
)
