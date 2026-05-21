import type {ReportData} from "@/ducks/analysis/types.ts";
import Decimal from "decimal.js";
import type {FieldDefinitionRecord} from "@/ducks/analysis/components/types";
import numeral from "numeral";
import dayjs from "dayjs";


export const fieldsDefinitions: FieldDefinitionRecord = {
    idEntries: {field: "idEntries", title: 'ID', sortable: true},
    WorkCenter: {field: 'WorkCenter', title: 'Work Center', sortable: true},
    Minutes: {
        field: 'Minutes',
        title: 'Minutes',
        align: 'end',
        total: true,
        sortable: true,
        render: (row: ReportData) => numeral(row.Minutes).format('0,0')
    },
    AllowedMinutes: {
        field: 'AllowedMinutes',
        title: 'Std Minutes',
        align: 'end',
        total: true, sortable: true,
        render: (row: ReportData) => numeral(row.AllowedMinutes).format('0,0')
    },
    Quantity: {
        field: 'Quantity',
        title: 'Quantity',
        align: 'end',
        total: true,
        sortable: true,
        render: (row: ReportData) => numeral(row.Quantity).format('0,0')
    },
    FirstName: {field: 'FirstName', title: 'First Name', sortable: true},
    LastName: {field: 'LastName', title: 'Last Name', sortable: true},
    FullName: {field: 'FullName', title: 'Name', sortable: true},
    DocumentNo: {field: 'DocumentNo', title: 'Document No', sortable: true},
    ItemCode: {field: 'ItemCode', title: 'Item Code', sortable: true},
    WarehouseCode: {field: 'WarehouseCode', title: 'Warehouse', sortable: true},
    StepCode: {field: 'StepCode', title: 'Operation', sortable: true},
    Description: {field: 'Description', title: 'Description', sortable: true},
    EntryDate: {
        field: 'EntryDate',
        title: 'Date',
        render: (row: ReportData) => !!row.EntryDate && row.EntryDate.toLowerCase() !== 'total' ? dayjs(row.EntryDate).format('MM-DD-YYYY') : 'N/A',
        sortable: true
    },
    StandardAllowedMinutes: {
        field: 'StandardAllowedMinutes',
        title: 'SAM',
        align: 'end',
        sortable: true,
        render: (row: ReportData) => numeral(row.StandardAllowedMinutes).format('0.0000')
    },
    Rate: {
        field: 'Rate',
        align: 'end',
        sortable: true, title: 'Rate %',
        render: (row: ReportData) => numeral(row.Rate).format('0,0.0%')
    },
    UPH: {
        field: 'UPH',
        align: 'end',
        title: 'UPH',
        render: (row: ReportData) => numeral(row.UPH).format('0,0'),
        sortable: true
    },
    UPHHistoric: {
        field: 'SAM',
        title: 'Std UPH',
        align: 'end',
        sortable: true,
        render: (row) => row.SAM ? numeral(new Decimal(60).div(row.SAM)).format('0,0') : 'N/A',
    },
    UPHStd: {
        field: 'UPHStd',
        title: 'Current Std UPH',
        align: 'end',
        render: (row: ReportData) => row.UPHStd ? numeral(row.UPHStd).format('0,0') : 'N/A',
        sortable: true
    },
    SAM: {
        field: 'SAM',
        title: 'SAM',
        align: 'end',
        sortable: true,
        render: (row) => numeral(row.StandardAllowedMinutes).format('0,0.0%'),
    },
    EmployeeNumber: {field: 'EmployeeNumber', title: "Employee #", sortable: true},
    Department: {field: 'Department', title: 'Dept.', sortable: true}
};
