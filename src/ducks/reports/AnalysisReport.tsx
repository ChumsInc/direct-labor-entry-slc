import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {format, parseISO} from 'date-fns';
import numeral from 'numeral';
import {
    addPageSetAction,
    ErrorBoundary,
    PagerDuck,
    selectPagedData,
    SortableTable,
    SortableTableField,
    SortableTR,
    tableAddedAction
} from "chums-ducks";
import {ReportData} from "./types";
import {selectDataLength, selectGroupBy, selectSortedData} from "./selectors";
import {between, MAX_DANGER, MAX_SUCCESS, MIN_DANGER, MIN_SUCCESS} from "../entries/utils";

const tableId = 'analysis-report';
const _rate = ({Quantity = 0, Minutes = 0}) => !!Quantity ? Minutes / Quantity : 0;
const _uph = ({Quantity = 0, Minutes = 0}) => !!Quantity ? 60 / _rate({Quantity, Minutes}) : 0;
const _uphStd = ({StandardAllowedMinutes = 0}) => !!StandardAllowedMinutes ? 60 / StandardAllowedMinutes : 0;
const _ratePct = ({AllowedMinutes = 0, Minutes = 0}) => !!Minutes ? AllowedMinutes / Minutes : 0;

interface SortableTableFieldX extends SortableTableField {
    total?: boolean,
}

interface FieldDefinitionObject {
    [key: string]: SortableTableFieldX
}

const fieldsDefinition: FieldDefinitionObject = {
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
    Name: {field: 'FullName', title: 'Name', sortable: true},
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

};

const rowClassName = (row: ReportData) => {
    return {
        'text-danger': !between(row.Rate, [MIN_DANGER, MAX_DANGER]),
        'text-warning': between(row.Rate, [MIN_DANGER, MAX_DANGER]) && !between(row.Rate, [MIN_SUCCESS, MAX_SUCCESS]),
        'text-success': between(row.Rate, [MIN_SUCCESS, MAX_SUCCESS]),
    }
};

const WorkCenter = fieldsDefinition.WorkCenter;
const EntryDate = fieldsDefinition.EntryDate;
// const FirstName = fieldsDefinition.FirstName;
// const LastName = fieldsDefinition.LastName;
const Name = fieldsDefinition.Name;
const DocumentNo = fieldsDefinition.DocumentNo;
const ItemCode = fieldsDefinition.ItemCode;
const WarehouseCode = fieldsDefinition.WarehouseCode;
const StepCode = fieldsDefinition.StepCode;
const Description = fieldsDefinition.Description;
const StandardAllowedMinutes = fieldsDefinition.StandardAllowedMinutes;
const UPHStd = fieldsDefinition.UPHStd;
const AllowedMinutes = fieldsDefinition.AllowedMinutes;

interface AnalysisTotal {
    Minutes: number,
    AllowedMinutes: number,
    Quantity: number,
    Rate: number,
    UPH: number,
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

    useEffect(() => {
        dispatch(tableAddedAction({key: tableId, field: 'idEntries', ascending: true}));
        dispatch(addPageSetAction({key: tableId}))
    }, [])

    const data = useSelector(selectSortedData);
    const pagedData = useSelector(selectPagedData(tableId, data));
    const group0 = useSelector(selectGroupBy(0));
    const group1 = useSelector(selectGroupBy(1));
    const group2 = useSelector(selectGroupBy(2));
    const group3 = useSelector(selectGroupBy(3));
    const group4 = useSelector(selectGroupBy(4));
    const group5 = useSelector(selectGroupBy(5));
    const group6 = useSelector(selectGroupBy(6));
    const dataLength = useSelector(selectDataLength);


    const groupFields = (group: string) => {
        switch (group) {
        case 'WorkCenter':
            return [WorkCenter];
        case 'EntryDate':
            return [EntryDate];
        case 'EmployeeNumber':
            return [Name];
        case 'StepCode':
            return [StepCode, Description];
        case 'DocumentNo':
            return [DocumentNo, ItemCode];
        case 'ItemCode':
            return [ItemCode];
        case 'WarehouseCode':
            return [WarehouseCode];
        case 'idEntries':
            return [
                WorkCenter, EntryDate, Name, DocumentNo, ItemCode,
                WarehouseCode, StepCode, Description
            ];
        default:
            return [];
        }
    }

    const fields: SortableTableField[] = [];

    [group0, group1, group2, group3, group4, group5, group6]
        .filter(group => group !== '')
        .map(group => {
            fields.push(...groupFields(group));
        });

    if ([group0, group1, group2, group3, group4, group5, group6].includes('StepCode')) {
        fields.push(StandardAllowedMinutes, UPHStd);
    }

    fields.push(fieldsDefinition.Minutes);
    fields.push(fieldsDefinition.Quantity);
    fields.push(AllowedMinutes);
    fields.push(fieldsDefinition.UPH);

    if (fields.filter(f => f.field === StepCode.field).length > 0 && !fields.filter(f => f.field === fieldsDefinition.UPHStd.field).length) {
        fields.push(fieldsDefinition.UPHStd);
    }
    // if (fields.filter(f => f.field === StepCode.field).length > 0) {
    //     // fields.StandardAllowedMinutes = StandardAllowedMinutes;
    //     fields.push(UPHStd);
    // }
    if (!!fields.filter(f => f.field === StandardAllowedMinutes.field).length && !fields.filter(f => f.field === fieldsDefinition.UPHStd.field).length) {
        fields.push(fieldsDefinition.UPHStd);
    }
    // if (fields.filter(f => f.field === StandardAllowedMinutes.field).length > 0) {
    //     fields.push(FIELDS.UPHStd);
    // }
    fields.push(fieldsDefinition.Rate);

    const totals = data.reduce((total: AnalysisTotal, row) => {
        total.Quantity += row.Quantity;
        total.Minutes += row.Minutes;
        total.AllowedMinutes += row.AllowedMinutes;
        return total;
    }, {...totalInit})
    totals.UPH = _uph(totals);
    totals.Rate = _rate(totals);

    const tfoot = <ReportTFoot totals={totals} fields={fields}/>

    return (
        <div>
            <ErrorBoundary>
                <SortableTable tableKey={tableId} keyField="idEntries" fields={fields} data={pagedData} size="xs"
                               tfoot={tfoot} rowClassName={rowClassName}/>
            </ErrorBoundary>
            <PagerDuck pageKey={tableId} dataLength={data.length} filtered={dataLength !== data.length}/>
        </div>
    )

}

interface ReportTFoot {
    totals: AnalysisTotal,
    fields: SortableTableField[],
}

const ReportTFoot: React.FC<ReportTFoot> = React.memo(({totals, fields}) => {
    const [f1, ...otherFields] = fields;
    return (
        <tfoot>
        <SortableTR fields={[fieldsDefinition.Name, ...otherFields]}
                    row={{[fieldsDefinition.Name.field]: 'Grand Total', ...totals}}/>
        </tfoot>
    )
});

export default AnalysisReport;

//dM7%AVJy
