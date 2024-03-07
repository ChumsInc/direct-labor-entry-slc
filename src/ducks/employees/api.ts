import {Employee, EmployeePostBody} from "../common-types";
import {fetchJSON} from "chums-components";
import {SLCEmployeesRegex} from "./constants";

export const API_PATH_EMPLOYEES = '/api/operations/production/dl/employees';
export const API_PATH_SAVE_EMPLOYEE = '/api/operations/production/dl/employee';

export async function fetchEmployees():Promise<Employee[]> {
    try {
        const res = await fetchJSON<{result: Employee[]}>(API_PATH_EMPLOYEES, {cache: 'no-cache'});
        return (res.result ?? []).filter(emp => SLCEmployeesRegex.test(emp.Department));
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchEmployees()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchEmployees()", err);
        return Promise.reject(new Error('Error in fetchEmployees()'));
    }
}

export async function postEmployee(arg:Employee):Promise<Employee|null> {
    try {
        const employee:EmployeePostBody = {
            id: arg.EmployeeNumber,
            firstName: arg.FirstName,
            lastName: arg.LastName,
            department: arg.Department,
            active: arg.active
        }
        const res = await fetchJSON<{result:Employee|null}>(API_PATH_SAVE_EMPLOYEE, {method: 'POST', body: JSON.stringify(employee)});
        return res.result ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postEmployee()", err.message);
            return Promise.reject(err);
        }
        console.debug("postEmployee()", err);
        return Promise.reject(new Error('Error in postEmployee()'));
    }
}
