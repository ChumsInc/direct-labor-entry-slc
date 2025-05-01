import {EmployeePostBody} from "../common-types";
import {fetchJSON} from "@chumsinc/ui-utils";
import {SLCEmployeesRegex} from "./constants";
import {DLEmployee} from "chums-types";

export const API_PATH_EMPLOYEES = '/api/operations/production/dl/employees.json';
export const API_PATH_SAVE_EMPLOYEE = '/api/operations/production/dl/employee.json';

export async function fetchEmployees(): Promise<DLEmployee[]> {
    try {
        const res = await fetchJSON<{ result: DLEmployee[] }>(API_PATH_EMPLOYEES, {cache: 'no-cache'});
        return (res?.result ?? []).filter(emp => SLCEmployeesRegex.test(emp.Department));
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchEmployees()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchEmployees()", err);
        return Promise.reject(new Error('Error in fetchEmployees()'));
    }
}

export async function postEmployee(arg: DLEmployee): Promise<DLEmployee | null> {
    try {
        const employee: EmployeePostBody = {
            id: arg.EmployeeNumber,
            firstName: arg.FirstName,
            lastName: arg.LastName,
            department: arg.Department,
            active: arg.active
        }
        const res = await fetchJSON<{ result: DLEmployee | null }>(API_PATH_SAVE_EMPLOYEE, {
            method: 'POST',
            body: JSON.stringify(employee)
        });
        return res?.result ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postEmployee()", err.message);
            return Promise.reject(err);
        }
        console.debug("postEmployee()", err);
        return Promise.reject(new Error('Error in postEmployee()'));
    }
}
