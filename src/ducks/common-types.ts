import {WorkTicket, DLDepartmentKey, EmployeeDLEntryTotal} from "chums-types";

export interface EmployeePostBody {
    id: string;
    firstName: string;
    lastName: string;
    department: string;
    active: boolean;
}

export type ActionStatus = 'idle'|'loading'|'saving'|'deleting';

export type EmployeeFilter = 'slc'|'slc-temp'|'all';

export type DepartmentList = {
    [key in DLDepartmentKey]: string;
};


export interface ITOrder {
    Company: string,
    PurchaseOrderNo: string,
    WarehouseCode: string,
    ItemCode: string,
    QuantityOrdered: number,
    idSteps: number,
    WorkCenter?: string,
    OperationCode: string,
    StandardAllowedMinutes: number,
    OperationDescription: string,
    StepCost: number,
}

export interface EmployeeTotalList {
    [key: string]: EmployeeDLEntryTotal,
}

export interface WorkTicketResponse {
    workTicket: WorkTicket|null;
    itOrder: ITOrder[];
}
