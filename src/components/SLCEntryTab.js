import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {
    fetchEmployeesIfNeeded,
    selectSLCEmployeeAction,
    setEmployeeVisibilityFilter
} from '../ducks/employees/actions';
import {FILTER_EMP_SLC} from '../ducks/employees/constants';
import {
    clearSLCEntryAlert,
    fetchEntries,
    fetchSteps,
    selectEntry,
    setDate
} from "../actions/slc-entries";
import SLCWorkOrderITOperations from "./SLCWorkOrderITOperations";
import SLCEntryEditor from "./SLCEntryEditor";
import SLCEmployeeTotals from "./SLCEmployeeTotals";
import SLCEmployeeEntries from "./SLCEmployeeEntries";
import {NEW_ENTRY} from "../constants/slc-entries";
import {selectSLCEmployees} from "../ducks/employees/selectors";


class SLCEntryTab extends Component {
    static propTypes = {
        SLCEntries: PropTypes.object.isRequired,
        employees: PropTypes.array.isRequired,

        fetchEmployeesIfNeeded: PropTypes.func.isRequired,
        setEmployeeVisibilityFilter: PropTypes.func.isRequired,
        setDate: PropTypes.func.isRequired,
        fetchEntries: PropTypes.func.isRequired,
        fetchSteps: PropTypes.func.isRequired,
        selectSLCEmployee: PropTypes.func.isRequired,
        clearSLCEntryAlert: PropTypes.func.isRequired,
        selectEntry: PropTypes.func.isRequired,
    };


    timer = null;

    state = {
        addOpWorkCenter: 'INH',
        addOpCode: '',
        addOpDropDownShow: false,
        operations: [],
        WorkOrderNo: '',
        test: '',
        rowsPerPageTotals: 10,
        rowsPerPageEntries: 10,
        pageTotals: 1,
        pageEntries: 1,
    };

    constructor(props) {
        super(props);
        this.onDismissError = this.onDismissError.bind(this);
        this.onSelectEntry = this.onSelectEntry.bind(this);
        this.onSelectEmployeeTable = this.onSelectEmployeeTable.bind(this);
        this.setEmployee = this.setEmployee.bind(this);
    }

    componentDidMount() {

        this.props.fetchEmployeesIfNeeded();
        this.props.setEmployeeVisibilityFilter(FILTER_EMP_SLC);
        this.props.setDate(this.props.SLCEntries.entryDate);
        this.props.fetchEntries();
        this.props.fetchSteps();
    }

    setEmployee(employee) {
        const {SLCEntries} = this.props;
        this.props.selectSLCEmployee(employee, {
            ...NEW_ENTRY,
            ...SLCEntries.selected,
            ...employee,
            EntryDate: SLCEntries.entryDate
        });
    }

    onDismissError() {
        this.props.clearSLCEntryAlert();
    }

    onSelectEntry(entry) {
        this.props.selectEntry(entry);
    }

    onSelectEmployeeTable(emp) {
        let employee = {};
        this.props.employees.list
            .filter(e => e.EmployeeNumber === emp.EmployeeNumber)
            .forEach(e => {
                employee = {...e};
            });
        this.setEmployee(employee);
        this.setState({pageEntries: 1, pageTotals: 1});
    }

    render() {
        const {employees, SLCEntries} = this.props;
        const {hasError} = SLCEntries;
        const {selectedSLC} = employees;

        const errorMessage = hasError
            ? (
                <div className="alert alert-danger alert-dismissable">
                    <button type="button" className="close" onClick={this.onDismissError}>
                        <span aria-hidden={true}>&times;</span>
                    </button>
                    {hasError}
                </div>
            )
            : '';

        return (
            <div>
                <h3>SLC Entry</h3>

                <div className="row">
                    <div className="col-sm-4">
                        {errorMessage}
                        <SLCEntryEditor/>
                        <hr/>
                        <SLCWorkOrderITOperations/>
                    </div>
                    <div className="col-sm-8">
                        <SLCEmployeeEntries employeeNumber={selectedSLC?.EmployeeNumber}
                                            onSelectEntry={this.onSelectEntry}/>

                        <SLCEmployeeTotals onSelectEmployee={this.onSelectEmployeeTable} selected={selectedSLC}/>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const {employees, SLCEntries} = state;
    return {SLCEntries, employees: selectSLCEmployees(state)};
};

const mapDispatchToProps = {
    clearSLCEntryAlert,
    fetchEntries,
    fetchSteps,
    selectEntry,
    setDate,
    setEmployeeVisibilityFilter,
    fetchEmployeesIfNeeded,
    selectSLCEmployee: selectSLCEmployeeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(SLCEntryTab);
