import {combineReducers} from "redux";

import {alertsReducer, pagesReducer, sortableTablesReducer, tabsReducer} from 'chums-ducks'

import employeesReducer from './employees';
import entriesReducer from './entries';
import reportsReducer from './reports';
import dlStepsReducer from './steps';
import workOrderReducer from './work-order';



const rootReducer = combineReducers({
    alerts: alertsReducer,
    sortableTables: sortableTablesReducer,
    tabs: tabsReducer,
    employees: employeesReducer,
    entries: entriesReducer,
    reports: reportsReducer,
    dlSteps: dlStepsReducer,
    pages: pagesReducer,
    workOrder: workOrderReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
