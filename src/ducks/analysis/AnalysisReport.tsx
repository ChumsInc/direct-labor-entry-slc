import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {format, parseISO} from 'date-fns';
import numeral from 'numeral';
import {DataTableRow, SortableTable, SortableTableField, SortProps, TablePagination,} from "chums-components";
import {ReportData, ReportGroupingId} from "./types";
import {selectAllGroupBy, selectReportSort, selectSortedData} from "./selectors";
import {between, MAX_DANGER, MAX_SUCCESS, MIN_DANGER, MIN_SUCCESS} from "../entries/utils";
import {useAppSelector} from "../../app/configureStore";
import {ErrorBoundary} from 'react-error-boundary'
import ErrorBoundaryFallbackAlert from "../alerts/ErrorBoundaryFallbackAlert";
import {setReportSort} from "./actions";
import Decimal from "decimal.js";

const _rate = ({Quantity = 0, Minutes = 0}:Partial<AnalysisTotal>) => new Decimal(Quantity).eq(0) ? 0 : new Decimal(Minutes).div(Quantity).toString();
const _uph = ({Quantity = 0, Minutes = 0}:Partial<AnalysisTotal>) => new Decimal(Quantity).eq(0) ? 0 : new Decimal(60).div(_rate({Quantity, Minutes})).toString();
const _ratePct = ({AllowedMinutes = 0, Minutes = 0}:Partial<AnalysisTotal>) => new Decimal(Minutes).eq(0) ? 0 : new Decimal(AllowedMinutes).div(Minutes).toString();

interface ReportDataField extends SortableTableField<ReportData> {
    total?: boolean,
}

type FieldDefinitionObject = {
    [key in keyof ReportData]: ReportDataField;
};

const fieldsDefinition: FieldDefinitionObject = {
    idEntries: {field: "idEntries", title: 'ID', sortable: true},
    WorkCenter: {field: 'WorkCenter', title: 'Work Center', sortable: true},
    Minutes: {
        field: 'Minutes',
        title: 'Minutes',
        className: 'right',
        total: true, sortable: true,
        render: (row: ReportData) => numeral(row.Minutes).format('0,0')
    },
    AllowedMinutes: {
        field: 'AllowedMinutes',
        title: 'Std Minutes',
        className: 'right',
        total: true, sortable: true,
        render: (row: ReportData) => numeral(row.AllowedMinutes).format('0,0')
    },
    Quantity: {
        field: 'Quantity',
        title: 'Quantity',
        className: 'right',
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
        render: (row: ReportData) => !!row.EntryDate && row.EntryDate.toLowerCase() !== 'total' ? format(parseISO(row.EntryDate), 'MM-dd-yyyy') : 'N/A',
        sortable: true
    },
    StandardAllowedMinutes: {
        field: 'StandardAllowedMinutes',
        title: 'SAM',
        className: 'right', sortable: true,
        render: (row: ReportData) => numeral(row.StandardAllowedMinutes).format('0.0000')
    },
    Rate: {
        field: 'Rate', className: 'right', sortable: true, title: 'Rate %',
        render: (row: ReportData) => numeral(row.Rate).format('0,0.0%')
    },
    UPH: {
        field: 'UPH',
        className: 'right',
        title: 'UPH',
        render: (row: ReportData) => numeral(row.UPH).format('0,0'),
        sortable: true
    },
    UPHStd: {
        field: 'UPHStd', title: 'Std UPH', className: 'right',
        render: (row: ReportData) => numeral(row.UPHStd).format('0,0'),
        sortable: true
    },
    SAM: {
        field: 'SAM',
        title: 'SAM',
        className: 'text-end',
        sortable: true,
        render: (row) => numeral(row.StandardAllowedMinutes).format('0,0.0%'),
    },
    EmployeeNumber: {field: 'EmployeeNumber', title: "Employee #", sortable: true},
    Department: {field: 'Department', title: 'Dept.', sortable: true}
};

const rowClassName = (row: ReportData) => {
    return {
        'table-danger': !between(row.Rate, [MIN_DANGER, MAX_DANGER]),
        'table-warning': between(row.Rate, [MIN_DANGER, MAX_DANGER]) && !between(row.Rate, [MIN_SUCCESS, MAX_SUCCESS]),
        'table-success': between(row.Rate, [MIN_SUCCESS, MAX_SUCCESS]),
    }
};

const groupFields = (group: keyof ReportData): ReportDataField[] => {
    switch (group) {
        case 'WorkCenter':
            return [fieldsDefinition.WorkCenter];
        case 'EntryDate':
            return [fieldsDefinition.EntryDate];
        case 'EmployeeNumber':
            return [fieldsDefinition.FullName];
        case 'StepCode':
            return [fieldsDefinition.StepCode, fieldsDefinition.Description];
        case 'DocumentNo':
            return [fieldsDefinition.DocumentNo, fieldsDefinition.ItemCode];
        case 'ItemCode':
            return [fieldsDefinition.ItemCode];
        case 'WarehouseCode':
            return [fieldsDefinition.WarehouseCode];
        case 'idEntries':
            return [
                fieldsDefinition.WorkCenter,
                fieldsDefinition.EntryDate,
                fieldsDefinition.FullName,
                fieldsDefinition.DocumentNo,
                fieldsDefinition.ItemCode,
                fieldsDefinition.WarehouseCode,
                fieldsDefinition.StepCode,
                fieldsDefinition.Description
            ];
        default:
            return [];
    }
}

interface AnalysisTotal {
    Minutes: number|string,
    AllowedMinutes: number|string,
    Quantity: number|string,
    Rate: number|string,
    UPH: number|string,
}

const totalInit: AnalysisTotal = {
    Minutes: 0,
    AllowedMinutes: 0,
    Quantity: 0,
    Rate: 0,
    UPH: 0,
};

const AnalysisReport: React.FC = () => {
    const dispatch = useDispatch();
    const data = useSelector(selectSortedData);
    const grouping = useSelector(selectAllGroupBy);
    const sort = useAppSelector(selectReportSort);

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(25)
    const [fields, setFields] = useState<ReportDataField[]>([]);
    const [totals, setTotals] = useState<AnalysisTotal>({...totalInit});

    useEffect(() => {
        setPage(0);
    }, [data, grouping, sort]);

    useEffect(() => {
        const fields: ReportDataField[] = [];
        Object.keys(grouping)
            .map(key => +key as ReportGroupingId)
            .filter(key => !!grouping[key])
            .forEach(key => {
                const field = grouping[key];
                if (field !== '') {
                    fields.push(...groupFields(field));
                }
            })
        if (Object.values(grouping).includes('StepCode')) {
            fields.push(fieldsDefinition.StandardAllowedMinutes)
        }
        fields.push(fieldsDefinition.Minutes);
        fields.push(fieldsDefinition.Quantity);
        fields.push(fieldsDefinition.AllowedMinutes);
        fields.push(fieldsDefinition.UPH);

        if (fields.filter(f => f.field === fieldsDefinition.StepCode.field).length > 0
            && !fields.filter(f => f.field === fieldsDefinition.UPHStd.field).length) {
            fields.push(fieldsDefinition.UPHStd);
        }
        if (!!fields.filter(f => f.field === fieldsDefinition.StandardAllowedMinutes.field).length
            && !fields.filter(f => f.field === fieldsDefinition.UPHStd.field).length) {
            fields.push(fieldsDefinition.UPHStd);
        }
        fields.push(fieldsDefinition.Rate);
        setFields(fields);
    }, [grouping]);

    useEffect(() => {
        const totals = data.reduce((total: AnalysisTotal, row) => {
            return {
                Quantity: new Decimal(total.Quantity).add(row.Quantity).toString(),
                Minutes: new Decimal(total.Minutes).add(row.Minutes).toString(),
                AllowedMinutes: new Decimal(total.AllowedMinutes).add(row.AllowedMinutes).toString(),
                UPH: 0,
                Rate: 0,
            };
        }, {...totalInit})
        totals.UPH = _uph(totals);
        totals.Rate = _ratePct(totals);
        setTotals(totals);
    }, [data]);

    const sortChangeHandler = (sort: SortProps) => {
        setPage(0);
        dispatch(setReportSort(sort));
    }

    const rowsPerPageChangeHandler = (rpp: number) => {
        setPage(0);
        setRowsPerPage(rpp);
    }

    const tfoot = <ReportTFoot totals={totals} fields={fields}/>

    return (
        <div>
            <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
                <SortableTable
                    currentSort={sort} onChangeSort={sortChangeHandler}
                    keyField="idEntries" fields={fields}
                    data={data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                    size="xs"
                    tfoot={tfoot} rowClassName={rowClassName}/>
                <TablePagination page={page} onChangePage={setPage}
                                 rowsPerPage={rowsPerPage} onChangeRowsPerPage={rowsPerPageChangeHandler}
                                 count={data.length}/>
            </ErrorBoundary>
        </div>
    )

}

interface ReportTFoot {
    totals: AnalysisTotal,
    fields: SortableTableField[],
}

const ReportTFoot = ({totals, fields}:ReportTFoot) => {
    const [, ...otherFields] = fields;
    return (
        <tfoot>
        <DataTableRow fields={[fieldsDefinition.FullName, ...otherFields]}
                      row={{[fieldsDefinition.FullName.field]: 'Grand Total', ...totals}}/>
        </tfoot>
    )
};

export default AnalysisReport;

