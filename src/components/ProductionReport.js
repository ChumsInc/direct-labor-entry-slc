import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {format, parseISO} from 'date-fns';
import numeral from 'numeral';
import {STORAGE_KEYS} from "../utils/appStorage";
import SortableTable from "../common-components/SortableTable";

const _rate = ({Quantity = 0, Minutes = 0}) => !!Quantity ? Minutes / Quantity : 0;
const _uph = ({Quantity = 0, Minutes = 0}) => !!Quantity ? 60 / _rate({Quantity, Minutes}) : 0;
const _uphStd = ({StandardAllowedMinutes = 0}) => !!StandardAllowedMinutes ? 60 / StandardAllowedMinutes : 0;
const _ratePct = ({AllowedMinutes = 0, Minutes = 0}) => !!Minutes ? AllowedMinutes / Minutes : 0;

const FIELDS = {
    WorkCenter: {field: 'WorkCenter', title: 'Work Center'},
    Minutes: {
        field: 'Minutes',
        title: 'Minutes',
        className: 'right',
        total: true,
        render: (row) => numeral(row.Minutes).format('0,0')
    },
    AllowedMinutes: {
        field: 'AllowedMinutes',
        title: 'Std Minutes',
        className: 'right',
        total: true,
        render: (row) => numeral(row.AllowedMinutes).format('0,0')
    },
    Quantity: {
        field: 'Quantity',
        title: 'Quantity',
        className: 'right',
        total: true,
        render: (row) => numeral(row.Quantity).format('0,0')
    },
    FirstName: {field: 'FirstName', title: 'First Name'},
    LastName: {field: 'LastName', title: 'Last Name'},
    Name: {field: 'FullName', title: 'Name'},
    DocumentNo: {field: 'DocumentNo', title: 'Document No'},
    ItemCode: {field: 'ItemCode', title: 'Item Code'},
    WarehouseCode: {field: 'WarehouseCode', title: 'Warehouse'},
    StepCode: {field: 'StepCode', title: 'Operation'},
    Description: {field: 'Description', title: 'Description'},
    EntryDate: {field: 'EntryDate', title: 'Date', render: (row) => format(parseISO(row.EntryDate), 'MM-dd-yyyy')},
    StandardAllowedMinutes: {
        field: 'StandardAllowedMinutes',
        title: 'SAM',
        className: 'right',
        render: (row) => numeral(row.StandardAllowedMinutes).format('0.0000')
    },
    Rate: {
        field: 'Rate', className: 'right',
        render: (row) => numeral(_ratePct(row)).format('0,0.0%'),
        sortFn: (row) => _ratePct(row)
    },
    UPH: {
        field: 'UPH', className: 'right',
        render: (row) => numeral(_uph(row)).format('0,0'),
        sortFn: (row) => _uph(row)
    },
    UPHStd: {
        field: 'UPHStd', title: 'Std UPH', className: 'right',
        render: (row) => numeral(_uphStd(row)).format('0,0'),
        sortFn: (row) => _uphStd(row)
    },

};

const WorkCenter = FIELDS.WorkCenter;
const EntryDate = FIELDS.EntryDate;
const FirstName = FIELDS.FirstName;
const LastName = FIELDS.LastName;
const Name = FIELDS.Name;
const DocumentNo = FIELDS.DocumentNo;
const ItemCode = FIELDS.ItemCode;
const WarehouseCode = FIELDS.WarehouseCode;
const StepCode = FIELDS.StepCode;
const Description = FIELDS.Description;
const StandardAllowedMinutes = FIELDS.StandardAllowedMinutes;
const UPHStd = FIELDS.UPHStd;
const AllowedMinutes = FIELDS.AllowedMinutes;


class ProductionReport extends Component {
    static propTypes = {
        isLoading: PropTypes.bool,
        hasError: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.shape({
            idEntries: PropTypes.number,
            WorkCenter: PropTypes.string,
            EntryDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
            Minutes: PropTypes.number,
            Quantity: PropTypes.number,
            SAM: PropTypes.number,
            DocumentNo: PropTypes.string,
            ItemCode: PropTypes.string,
            WarehouseCode: PropTypes.string,
            FirstName: PropTypes.string,
            LastName: PropTypes.string,
            FullName: PropTypes.string,
            Department: PropTypes.string,
            StepCode: PropTypes.string,
            Description: PropTypes.string,
            StandardAllowedMinutes: PropTypes.number,
        })),
        group1: PropTypes.string,
        group2: PropTypes.string,
        group3: PropTypes.string,
        group4: PropTypes.string,
        group5: PropTypes.string,
        group6: PropTypes.string,
        group7: PropTypes.string,
        html: PropTypes.string,
        filter: PropTypes.instanceOf(RegExp),
    };

    static defaultProps = {
        isLoading: false,
        hasError: null,
        data: [],
        group1: '',
        group2: '',
        group3: '',
        group4: '',
        group5: '',
        group6: '',
        group7: '',
        html: null,
        filter: '',
    };

    state = {
        fields: [],
        sortFields: [],
        rowsPerPage: localStorage.getItem(STORAGE_KEYS.ROWS_PER_PAGE) || 25,
        page: 1,
    };

    constructor(props) {
        super(props);
        this.onChangeRowsPerPage = this.onChangeRowsPerPage.bind(this);
    }

    onChangeRowsPerPage(rowsPerPage) {
        rowsPerPage = Number(rowsPerPage) || 25;
        localStorage.setItem(STORAGE_KEYS.ROWS_PER_PAGE, rowsPerPage);
        this.setState({rowsPerPage});
    }

    groupFields(group) {
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

    render() {
        const {
            isLoading,
            hasError,
            data,
            group1,
            group2,
            group3,
            group4,
            group5,
            group6,
            group7,
            html,
            filter
        } = this.props;
        const {rowsPerPage, page} = this.state;
        const fields = [];
        [group1, group2, group3, group4, group5, group6, group7]
            .filter(group => group !== '')
            .map(group => {
                fields.push(...this.groupFields(group));
            });
        fields.push(FIELDS.Minutes);
        fields.push(FIELDS.Quantity);
        fields.push(AllowedMinutes);
        fields.push(FIELDS.UPH);
        if (fields.includes(StepCode) && !fields.includes(FIELDS.UPHStd)) {
            fields.push(FIELDS.UPHStd);
        }
        // if (fields.filter(f => f.field === StepCode.field).length > 0) {
        //     // fields.StandardAllowedMinutes = StandardAllowedMinutes;
        //     fields.push(UPHStd);
        // }
        if (fields.includes(StandardAllowedMinutes) && !fields.includes(FIELDS.UPHStd)) {
            fields.push(FIELDS.UPHStd);
        }
        // if (fields.filter(f => f.field === StandardAllowedMinutes.field).length > 0) {
        //     fields.push(FIELDS.UPHStd);
        // }
        fields.push(FIELDS.Rate);

        const filteredData = data.filter(row => !filter || filter.test(row.ItemCode));


        return (
            <div>
                <SortableTable fields={fields} data={filteredData} loading={isLoading} keyField={'idEntries'}
                               page={page} rowsPerPage={rowsPerPage}
                               defaultSort={fields[0].field}
                               hasTotal={true} filtered={data.length !== filteredData.length}
                               onChangeRowsPerPage={this.onChangeRowsPerPage}
                               onChangePage={(page) => this.setState({page})}/>

            </div>
        );
    }

}


const mapStateToProps = state => {
    const {isLoading, hasError, data, html} = state.reports;
    return {isLoading, hasError, data, html};
};

export default connect(mapStateToProps)(ProductionReport);
