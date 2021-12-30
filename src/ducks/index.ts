import {combineReducers} from "redux";

import {alertsReducer, sortableTablesReducer, tabsReducer, pagesReducer} from 'chums-ducks'

import employeesReducer from './employees';
import entriesReducer from './entries';
import SLCEntriesReducer from '../reducers/slc-entries';
import reportsReducer from './reports';
import dlStepsReducer from './steps';
import workOrderReducer from './work-order';
import appReducer from '../reducers/app';


const rootReducer = combineReducers({
    alerts: alertsReducer,
    sortableTables: sortableTablesReducer,
    tabs: tabsReducer,
    app: appReducer,
    employees: employeesReducer,
    entries: entriesReducer,
    SLCEntries: SLCEntriesReducer,
    reports: reportsReducer,
    dlSteps: dlStepsReducer,
    pages: pagesReducer,
    workOrder: workOrderReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
