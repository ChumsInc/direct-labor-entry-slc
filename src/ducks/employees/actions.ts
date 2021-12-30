// actions list

import {
    API_PATH_EMPLOYEES,
    API_PATH_SAVE_EMPLOYEE,
    EMPLOYEE_FILTERS, employeesFetchListFailed,
    employeesFetchListRequested, employeesFetchListSucceeded, employeesShowActive, employeesShowInactive,
    FILTER_EMP_ALL,
    FILTER_EMP_HURRICANE,
    FILTER_EMP_HURRICANE_TEMP,
    FILTER_EMP_SLC,
    FILTER_EMP_SLC_TEMP,
    LOADING_EMPLOYEES,
    RECEIVE_EMPLOYEE_LIST, saveEmployeeFailed,
    saveEmployeeRequested, saveEmployeeSucceeded,
    SELECT_EMPLOYEE,
    SELECT_SLC_EMPLOYEE,
    SET_EMPLOYEE_VISIBILITY_FILTER,
    UPDATE_EMPLOYEE,
    UPDATE_SELECTED_EMPLOYEE,
} from "./constants";
import {fetchJSON} from "chums-ducks";
import {FETCH_FAILURE, FETCH_INIT, FETCH_SUCCESS} from "../../constants/app";
import {EmployeeAction, EmployeeThunkAction} from "./actionTypes";
import {Employee, EmployeeFilter} from "../common-types";
import {selectLoaded, selectLoading, selectSaving} from "./selectors";


// action creators


export const selectEmployeeAction = (employee?:Employee, entry?:unknown):EmployeeAction => ({type: SELECT_EMPLOYEE, payload: {employee, entry}});
export const selectSLCEmployeeAction = (employee?:Employee|null, entry?:unknown):EmployeeAction => ({type: SELECT_SLC_EMPLOYEE, payload: {employee, entry}});
export const showInactiveAction = (visible: boolean) => ({type: visible ? employeesShowInactive : employeesShowActive});

export const fetchEmployeesIfNeeded = ():EmployeeThunkAction => (dispatch, getState) => {
    const state = getState();
    if (selectLoaded(state) || selectLoading(state)) {
        return;
    }
    return dispatch(fetchEmployees());
};

export const fetchEmployees = ():EmployeeThunkAction =>
    async (dispatch, getState) => {
    const state = getState();
    if (selectLoading(state) || selectSaving(state)) {
        return;
    }
    try {
        dispatch({type: employeesFetchListRequested});
        const {result} = await fetchJSON(API_PATH_EMPLOYEES, {cache: 'no-cache'})
        const employees:Employee[] = result as Employee[];
        dispatch({type:employeesFetchListSucceeded, payload: {list: employees}})
    } catch(error:unknown) {
        if (error instanceof Error) {
            console.log("fetchEmployees()", error.message);
            return dispatch({type:employeesFetchListFailed, status: FETCH_FAILURE, payload: {error, context: employeesFetchListRequested}})
        }
        console.error("fetchEmployees()", error);
    }
};

/**
 *
 * @param {Employee} employee
 */
export const saveEmployeeAction = (employee:Employee):EmployeeThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state) || selectSaving(state)) {
                return;
            }
            dispatch({type: saveEmployeeRequested});
            const data = {
                id: employee.EmployeeNumber,
                firstName: employee.FirstName,
                lastName: employee.LastName,
                department: employee.Department,
                active: employee.active
            };
            const {result} = await fetchJSON(API_PATH_SAVE_EMPLOYEE, {method: 'POST', body: JSON.stringify(data)});
            dispatch({type: saveEmployeeSucceeded, payload: {employee: result}});
        } catch(error:unknown) {
            if (error instanceof Error) {
                console.log("saveEmployeeAction()", error.message);
                return dispatch({type:saveEmployeeFailed, payload: {error, context: saveEmployeeRequested}})
            }
            console.error("saveEmployeeAction()", error);
        }
};

export const setEmployeeVisibilityFilter = (filter:EmployeeFilter):EmployeeAction => ({type: SET_EMPLOYEE_VISIBILITY_FILTER, payload: {filter}});
