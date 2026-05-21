import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import type {WorkTicketResponse} from "../common-types";
import {fetchDocument} from "./api";
import type {RootState} from "@/app/configureStore";
import {selectWorkTicketLoading} from "./selectors";

export const loadDocument = createAsyncThunk<WorkTicketResponse, string>(
    'work-ticket/loadDocument',
    async (arg) => {
        return await fetchDocument(arg);
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return !selectWorkTicketLoading(state);
        }
    }
)

export const setWorkTicketNo = createAction<string>('work-ticket/setDocumentNo');
