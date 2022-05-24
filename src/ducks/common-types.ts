import {SortableTableField, SorterProps} from "chums-ducks";

export interface Employee {
    EmployeeNumber: string,
    FirstName: string,
    LastName: string,
    FullName: string,
    active: boolean,
    Department: string,
    changed?: boolean,
}

export interface EmployeeSorterProps extends SorterProps {
    field: keyof Employee,
}

export interface EmployeeTableField extends SortableTableField {
    field: keyof Employee,
}

export type EmployeeFilter = 'slc'|'slc-temp';

export type Department = '5H' | '5HT' | '5S' | '7H' | '7HT' | '7S' | '8H' | '8HT';

export type DepartmentList = {
    [key in Department]: string;
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
    LineNo: number,
    idSteps: number,
    Minutes: number,
    Quantity: number,
    changed?: boolean,
}
export type BasicEntryField = keyof BasicEntry;

export type BasicEntryProps = {
    [key in BasicEntryField]: string | number;
};

export interface Entry extends BasicEntry {
    WorkCenter: string,
    FullName: string,
    StepCode: string,
    StandardAllowedMinutes: number,
    AllowedMinutes: number,
    UPH: number,
    StdUPH: number,
    Description: string,
    DocumentNo: string,
    DocumentType: string,
    ItemCode: string,
    WarehouseCode: string,
    timestamp?: string,
}

export interface EntryTableField extends SortableTableField {
    field: keyof Entry,
}

export interface BasicEntrySorterProps extends SorterProps {
    field: keyof BasicEntry,
}
export interface EntrySorterProps extends SorterProps {
    field: keyof Entry,
}

export interface EmployeeEntryTotal {
    EmployeeNumber: string,
    FullName: string,
    Minutes: number,
    AllowedMinutes: number,
    Rate: number,
}
export interface EmployeeTotalSorterProps extends SorterProps {
    field: keyof EmployeeEntryTotal,
}
export interface EmployeeTotalTableField extends SortableTableField {
    field: keyof EmployeeEntryTotal,
}

export interface WorkOrder {
    Company: string,
    WorkOrder: string,
    ItemBillNumber: string,
    ItemUM: string,
    ParentWhse: string,
    QtyOrdered: number,
    QtyComplete: number,
    operationDetail: WOOperationDetail[],
}

export interface WOOperationDetail {
    Company: string,
    WorkCenter: string,
    OperationCode: string,
    OperationDescription: string,
    PlannedPieceCostDivisor: number,
    StandardAllowedMinutes: number,
    StdRatePiece: number,
    idSteps: number,
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
