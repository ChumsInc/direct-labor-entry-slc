import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {format, parseISO} from 'date-fns';
import numeral from 'numeral';
import {
    addPageSetAction,
    PagerDuck,
    selectPagedData,
    SortableTable,
    SortableTableField,
    tableAddedAction
} from "chums-ducks";
import {ReportData} from "./types";
import {selectDataLength, selectGroupBy, selectSortedData} from "./selectors";

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
        total: true, sortable: true,
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
        render: (row: ReportData) => format(parseISO(row.EntryDate), 'MM-dd-yyyy'),
        sortable: true
    },
    StandardAllowedMinutes: {
        field: 'StandardAllowedMinutes',
        title: 'SAM',
        className: 'right', sortable: true,
        render: (row: ReportData) => numeral(row.StandardAllowedMinutes).format('0.0000')
    },
    Rate: {
        field: 'Rate', className: 'right', sortable: true, title: 'Rate',
        render: (row: ReportData) => numeral(_ratePct(row)).format('0,0.0%')
    },
    UPH: {
        field: 'UPH', className: 'right', title: 'UPH',
        render: (row: ReportData) => numeral(_uph(row)).format('0,0'),
        sortable: true
    },
    UPHStd: {
        field: 'UPHStd', title: 'Std UPH', className: 'right',
        render: (row: ReportData) => numeral(_uphStd(row)).format('0,0'),
        sortable: true
    },

};

const WorkCenter = fieldsDefinition.WorkCenter;
const EntryDate = fieldsDefinition.EntryDate;
const FirstName = fieldsDefinition.FirstName;
const LastName = fieldsDefinition.LastName;
const Name = fieldsDefinition.Name;
const DocumentNo = fieldsDefinition.DocumentNo;
const ItemCode = fieldsDefinition.ItemCode;
const WarehouseCode = fieldsDefinition.WarehouseCode;
const StepCode = fieldsDefinition.StepCode;
const Description = fieldsDefinition.Description;
const StandardAllowedMinutes = fieldsDefinition.StandardAllowedMinutes;
const UPHStd = fieldsDefinition.UPHStd;
const AllowedMinutes = fieldsDefinition.AllowedMinutes;


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
            return [StepCode, Description, StandardAllowedMinutes, UPHStd];
        case 'DocumentNo':
            return [DocumentNo, ItemCode];
        case 'ItemCode':
            return [ItemCode];
        case 'WarehouseCode':
            return [WarehouseCode];
        case 'idEntries':
            return [
                WorkCenter, EntryDate, Name, DocumentNo, ItemCode,
                WarehouseCode, StepCode, Description, StandardAllowedMinutes
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

    return (
        <div>
            <SortableTable tableKey={tableId} keyField="idEntries" fields={fields} data={pagedData} size="xs"/>
            <PagerDuck pageKey={tableId} dataLength={data.length} filtered={dataLength !== data.length}/>
        </div>
    )

}


export default AnalysisReport;
