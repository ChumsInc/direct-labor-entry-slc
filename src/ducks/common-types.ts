import {WorkTicket} from "chums-types";

export interface Employee {
    EmployeeNumber: string,
    FirstName: string,
    LastName: string,
    FullName: string,
    active: boolean,
    Department: DepartmentKey|string,
    changed?: boolean,
}

export interface EmployeePostBody {
    id: string;
    firstName: string;
    lastName: string;
    department: string;
    active: boolean;
}

export type ActionStatus = 'idle'|'loading'|'saving'|'deleting';

export type EmployeeFilter = 'slc'|'slc-temp'|'all';

export type DepartmentKey = '5H' | '5HT' | '5S' | '8H' | '8HT';

export type DepartmentList = {
    [key in DepartmentKey]: string;
};


export interface Step {
    id: number,
    stepCode: string,
    workCenter: string,
    description: string,
    active: boolean,
}



export interface BasicEntry {
    id: number,
    EmployeeNumber: string,
    EntryDate: string|null,
    DocumentNo: string;
    LineNo: number,
    idSteps: number,
    Minutes: number,
    Quantity: number,
    WorkCenter: string;
    StepCode: string;
    Description?: string;
    DocumentType?: string;
    WarehouseCode?: string;
    ItemCode?: string;
    StandardAllowedMinutes?: string|number;
}
export type BasicEntryField = keyof BasicEntry;

export type BasicEntryProps = {
    [key in BasicEntryField]: string | number;
};

export interface Entry extends BasicEntry {
    FullName: string,
    StandardAllowedMinutes: string|number,
    AllowedMinutes: string|number,
    UPH: number,
    StdUPH: number,
    Description: string,
    DocumentType: string,
    ItemCode: string,
    WarehouseCode: string,
    timestamp?: string,
}

export interface EmployeeEntryTotal {
    EmployeeNumber: string,
    FullName: string,
    Minutes: string|number,
    AllowedMinutes: string|number,
    Rate: string|number,
}


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
    [key: string]: EmployeeEntryTotal,
}

export interface WorkTicketResponse {
    workTicket: WorkTicket|null;
    itOrder: ITOrder[];
}
