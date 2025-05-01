
export type ReportGroupingId = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type ReportGrouping = {
    [key in ReportGroupingId]: keyof ReportData | '';
};


export interface ReportData {
    idEntries: number,
    WorkCenter: string,
    EntryDate: string,
    Minutes: number,
    Quantity: number,
    SAM: number,
    AllowedMinutes: number,
    DocumentNo: string,
    ItemCode: string,
    WarehouseCode: string,
    EmployeeNumber: string,
    FirstName: string,
    LastName: string,
    FullName: string,
    Department: string,
    StepCode: string,
    Description: string,
    StandardAllowedMinutes: number,
    Rate: number,
    UPH: number,
    UPHStd: number,
    UPHHistoric: number|string;
}

export type HTMLReportType = 'employee-total'|'step-total';
