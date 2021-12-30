import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import numeral from "numeral";
import {isOutOfLimits, isRateTooHigh, isRateTooLow, rate} from '../constants/hurricane-entries';
import SortableTable from "../common-components/SortableTable";

const ENTRY_TABLE_FIELDS = [
    {field: 'FullName', title: 'Name'},
    {field: 'WorkCenter', title: 'W/C'},
    {field: 'StepCode', title: 'Operation'},
    {field: 'Description', title: 'Description'},
    {field: 'Minutes', render: (row) => numeral(row.Minutes).format('0,0'), total: true, className: 'right'},
    {field: 'Quantity', render: (row) => numeral(row.Quantity).format('0,0'), total: true, className: 'right'},
    {field: 'rate', title: 'Rate', render: (row) => numeral(row.rate).format('0.0000'), className: 'right'},
    {field: 'UPH', render: row => numeral(row.UPH).format('0,0'), className: 'right'},
    {
        field: 'StandardAllowedMinutes', title: "SAM",
        render: (row) => numeral(row.StandardAllowedMinutes).format('0.0000'),
        className: 'right border-left'
    },
    {field: 'StdUPH', title: 'Std UPH', render: row => numeral(row.StdUPH).format('0,0'), className: 'right'},
    {
        field: 'ratePct',
        title: 'Rate',
        render: row => numeral(row.ratePct).format('0.0 %'),
        className: 'right border-left'
    },
];

const footerFields = {
    LineNo: 'Total',
    Minutes: 0,
    Quantity: 0,
    AllowedMinutes: 0,
    ratePct: 0,
};

const rowClassName = (entry) => {
    return {
        'table-danger': isOutOfLimits(entry),
        'table-warning': entry.StandardAllowedMinutes === 0 || isRateTooHigh(entry) || isRateTooLow(entry),
        'table-success': !isRateTooHigh(entry) && !isRateTooLow(entry),
    }
};

class SLCEmployeeEntries extends Component {
    static propTypes = {
        employeeNumber: PropTypes.string.isRequired,
        list: PropTypes.array,
        isLoading: PropTypes.bool,
        onSelectEntry: PropTypes.func.isRequired,
    };

    static defaultProps = {
        employeeNumber: '',
        list: [],
        isLoading: false,
    };

    state = {
        rowsPerPage: 10,
        page: 1
    };

    constructor(props) {
        super(props);
        this.onChangePage = this.onChangePage.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        const {rowsPerPage, page} = this.state;
        const {list} = this.props;
        const pages = Math.ceil(list.length / rowsPerPage);
        const prevPages = Math.ceil(prevProps.list.length / rowsPerPage);
        if (pages < prevPages && pages < page && page > 1) {
            this.setState({page: page - 1});
        }
    }


    onChangePage(page) {
        this.setState({page});
    }


    render() {
        const {isLoading, list, employeeNumber} = this.props;
        const {rowsPerPage, page} = this.state;
        const footerData = {...footerFields};

        const data = list.filter(entry => entry.EmployeeNumber === employeeNumber)
            .sort((a, b) => a.LineNo - b.LineNo)
            .map(entry => {
                entry.key = entry.id;
                entry.rate = rate(entry);
                entry.ratePct = entry.StandardAllowedMinutes === 0 ? 0 : (entry.UPH / entry.StdUPH);
                entry.classNames = {
                    'table-danger': isOutOfLimits(entry),
                    'table-warning': entry.StandardAllowedMinutes === 0 || isRateTooHigh(entry) || isRateTooLow(entry),
                    'table-success': !isRateTooHigh(entry) && !isRateTooLow(entry),
                };
                footerData.Minutes += entry.Minutes;
                footerData.Quantity += entry.Quantity;
                footerData.AllowedMinutes += entry.Quantity * entry.StandardAllowedMinutes;
                return entry;
            });

        footerData.ratePct = footerData.Minutes ? footerData.AllowedMinutes / footerData.Minutes : 0;

        return (
            <div>
                <h3>Employee Entries</h3>

                <SortableTable fields={ENTRY_TABLE_FIELDS} data={data}
                               defaultSort={{field: "LineNo", asc: true}}
                               onSelect={this.props.onSelectEntry}
                               rowClassName={rowClassName}
                               hasFooter={true}
                               footerData={footerData}
                               rowsPerPage={rowsPerPage} page={page}
                               onChangeRowsPerPage={rowsPerPage => this.setState({rowsPerPage, page: 1})}
                               onChangePage={this.onChangePage}
                               loading={isLoading}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {list, isLoading} = state.SLCEntries;
    return {list, isLoading};
};

export default connect(mapStateToProps)(SLCEmployeeEntries)
