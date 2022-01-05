// actions list
export const API_PATH_EMPLOYEES = '/api/operations/production/dl/employees';
export const API_PATH_SAVE_EMPLOYEE = '/api/operations/production/dl/employee';

import {
    EmployeeAction,
    employeeSelected,
    employeeSetVisibilityFilter,
    employeesFetchListFailed,
    employeesFetchListRequested,
    employeesFetchListSucceeded,
    employeesShowActive,
    employeesShowInactive,
    EmployeeThunkAction,
    saveEmployeeFailed,
    saveEmployeeRequested,
    saveEmployeeSucceeded,
} from "./actionTypes";

import {fetchJSON} from "chums-ducks";
import {Employee, EmployeeFilter} from "../common-types";
import {selectLoading, selectSaving} from "./selectors";


// action creators


export const selectEmployeeAction = (employee?: Employee | null, entry?: unknown): EmployeeAction => ({
    type: employeeSelected,
    payload: {employee, entry}
});

export const showInactiveAction = (visible: boolean) => ({type: visible ? employeesShowInactive : employeesShowActive});

export const fetchEmployees = (): EmployeeThunkAction =>
    async (dispatch, getState) => {
        const state = getState();
        if (selectLoading(state) || selectSaving(state)) {
            return;
        }
        try {
            dispatch({type: employeesFetchListRequested});
            const {result} = await fetchJSON(API_PATH_EMPLOYEES, {cache: 'no-cache'})
            const employees: Employee[] = result as Employee[];
            dispatch({type: employeesFetchListSucceeded, payload: {list: employees}})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchEmployees()", error.message);
                return dispatch({
                    type: employeesFetchListFailed,
                    payload: {error, context: employeesFetchListRequested}
                })
            }
            console.error("fetchEmployees()", error);
        }
    };

/**
 *
 * @param {Employee} employee
 */
export const saveEmployeeAction = (employee: Employee): EmployeeThunkAction =>
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
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("saveEmployeeAction()", error.message);
                return dispatch({type: saveEmployeeFailed, payload: {error, context: saveEmployeeRequested}})
            }
            console.error("saveEmployeeAction()", error);
        }
    };

export const setEmployeeVisibilityFilter = (filter: EmployeeFilter): EmployeeAction => ({
    type: employeeSetVisibilityFilter,
    payload: {filter}
});
