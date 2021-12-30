import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import numeral from "numeral";
import SortableTable from "../common-components/SortableTable";

const employeeTableFields = [
    {field: 'FullName', title: 'Name'},
    {field: 'Minutes', render: row => numeral(row.Minutes).format('0,0'), total: true, className: 'right'},
    {
        field: 'AllowedMinutes',
        title: 'Allowed',
        render: row => numeral(row.AllowedMinutes).format('0,0'),
        total: true,
        className: 'right'
    },
    {field: 'Rate', render: row => numeral(row.Rate).format('0.0 %'), className: 'right'}
];

class SLCEmployeeTotals extends Component {
    static propTypes = {
        list: PropTypes.array,
        isLoading: PropTypes.bool,
        selected: PropTypes.object,
        onSelectEmployee: PropTypes.func.isRequired,
    };

    static defaultProps = {
        list: [],
        isLoading: false,
        selected: {},
    };

    state = {
        rowsPerPage: 25,
        page: 1,
    };

    render() {
        const {isLoading, list, selected} = this.props;

        const totals = {};
        const footerData = {
            FullName: 'Total',
            Minutes: 0,
            AllowedMinutes: 0,
            Quantity: 0,
            Rate: null,
        };

        list
            .map(row => {
                const {EmployeeNumber, FullName, Minutes, Quantity, StandardAllowedMinutes, AllowedMinutes} = row;
                if (totals[EmployeeNumber] === undefined) {
                    totals[EmployeeNumber] = {
                        key: EmployeeNumber,
                        EmployeeNumber,
                        FullName: FullName,
                        Minutes: 0,
                        Quantity: 0,
                        AllowedMinutes: 0,
                    };
                }
                totals[EmployeeNumber].Minutes += Minutes;
                totals[EmployeeNumber].AllowedMinutes += AllowedMinutes;
                totals[EmployeeNumber].Quantity += Quantity;
                totals[EmployeeNumber].Rate = totals[EmployeeNumber].AllowedMinutes / totals[EmployeeNumber].Minutes;

                footerData.Minutes += Minutes;
                footerData.AllowedMinutes += AllowedMinutes;
                footerData.Quantity += Quantity;
            });

        const data = Object.keys(totals).map(key => totals[key]);
        footerData.Rate = footerData.AllowedMinutes / footerData.Minutes;

        return (
            <div>
                <h3>Employee Totals</h3>
                <SortableTable fields={employeeTableFields} data={data}
                               defaultSort={{field: "FullName", asc: true}}
                               keyField="key"
                               rowClassName={(row) => ({'table-active': row.key === selected?.EmployeeNumber})}
                               onSelect={this.props.onSelectEmployee}
                               hasFooter={true}
                               footerData={footerData}
                               rowsPerPage={this.state.rowsPerPage} page={this.state.page}
                               onChangeRowsPerPage={val => this.setState({rowsPerPage: Number(val)})}
                               onChangePage={page => this.setState({page})}
                               loading={isLoading}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {list, isLoading} = state.SLCEntries;
    return {list, isLoading};
};

export default connect(mapStateToProps)(SLCEmployeeTotals)
