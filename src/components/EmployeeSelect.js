import React, {Component, forwardRef} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {CheckBoxInline, PlainCheckBox} from "./CheckBox";
import Select from "../common-components/Select";
import classNames from "classnames";
import {WORK_CENTER_CHU, WORK_CENTER_IMP, WORK_CENTER_INH} from "../constants/reports";
import {EMPLOYEE_FILTERS, FILTER_EMP_ALL, FILTER_EMP_HURRICANE, FILTER_EMP_SLC} from "../ducks/employees/constants";
import {fetchEmployeesIfNeeded} from '../ducks/employees/actions';

const mapStateToProps = ({employees}) => {
    const {list} = employees;
    return {list}
};
const mapDispatchToProps = {
    fetchEmployeesIfNeeded
};


class EmployeeSelect extends Component {
    static propTypes = {
        value: PropTypes.string,
        list: PropTypes.arrayOf(PropTypes.shape({
            EmployeeNumber: PropTypes.string,
            FirstName: PropTypes.string,
            LastName: PropTypes.string,
            Department: PropTypes.string,
            active: PropTypes.bool,
        })),
        allowAll: PropTypes.bool.isRequired,
        allowInactive: PropTypes.bool.isRequired,
        onlyActive: PropTypes.bool,
        workCenter: PropTypes.string,
        forwardedRef: PropTypes.any,
        onChange: PropTypes.func.isRequired,
        fetchEmployeesIfNeeded: PropTypes.func.isRequired,
    };

    static defaultProps = {
        value: '',
        employees: [],
        allowAll: false,
        allowInactive: false,
        onlyActive: true,
        workCenter: '',
    };

    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
    }


    componentDidMount() {
        this.props.fetchEmployeesIfNeeded();
    }

    employeeFilter() {
        const {workCenter} = this.props;
        switch (workCenter) {
        case WORK_CENTER_CHU:
            return EMPLOYEE_FILTERS[FILTER_EMP_HURRICANE];
        case WORK_CENTER_INH:
        case WORK_CENTER_IMP:
            return EMPLOYEE_FILTERS[FILTER_EMP_SLC];
        default:
            return EMPLOYEE_FILTERS[FILTER_EMP_ALL];
        }
    }

    onSelect({value}) {
        const [employee = {}] = this.props.list
            .filter(e => e.EmployeeNumber === value);
        this.props.onChange(employee);
    }


    render() {
        const {list, value, onChange, onlyActive, allowAll, allowInactive, forwardedRef, workCenter, fetchEmployeesIfNeeded, ...rest} = this.props;
        const visibleEmployees = list
            .filter(emp => !(onlyActive || !allowInactive) || emp.active)
            .filter(this.employeeFilter());

        return (
            <div className={classNames({'input-group input-group-sm': !!allowInactive})}>
                {!!allowInactive &&
                <div className="input-group-text">
                    <CheckBoxInline field={'active'} label="Only Active" checked={onlyActive}
                                   onChange={this.props.onChange}/>
                </div>
                }
                <Select value={value} onChange={this.onSelect} field="EmployeeNumber" {...rest}
                        ref={forwardedRef}>
                    {!!allowAll && <option value="%">All</option>}
                    {!allowAll && <option value="">Select One</option>}
                    {visibleEmployees.map(emp => (
                        <option key={emp.EmployeeNumber} value={emp.EmployeeNumber}
                                className={classNames({inactive: !emp.active})}>
                            {emp.FirstName} {emp.LastName} ({emp.Department})
                        </option>))
                    }
                </Select>
            </div>
        );
    }
}



const ConnectedEmployeeSelect = connect(mapStateToProps, mapDispatchToProps)(EmployeeSelect);

export default forwardRef((props, ref) => <ConnectedEmployeeSelect forwardedRef={ref} {...props}/>);
