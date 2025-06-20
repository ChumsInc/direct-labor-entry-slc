import {combineReducers, configureStore} from '@reduxjs/toolkit';
import employeesReducer from "../ducks/employees";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import entriesReducer from "../ducks/entries";
import reportsReducer from "../ducks/reports";
import workTicketReducer from "../ducks/work-ticket";
import stepsReducer from "../ducks/steps";
import analysisReducer from "../ducks/analysis";
import versionSlice from "../ducks/version";
import {alertsSlice} from "@chumsinc/alert-list";


const rootReducer = combineReducers({
    [alertsSlice.reducerPath]: alertsSlice.reducer,
    analysis: analysisReducer,
    employees: employeesReducer,
    entries: entriesReducer,
    reports: reportsReducer,
    steps: stepsReducer,
    workTicket: workTicketReducer,
    [versionSlice.reducerPath]: versionSlice.reducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
    })
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export default store;
