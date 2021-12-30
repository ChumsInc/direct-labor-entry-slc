import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {parseISO, setDay, subWeeks} from 'date-fns';
import ProgressBar from '../common-components/ProgressBar';
import Select from "../common-components/Select";
import {WORK_CENTER_CHU, WORK_CENTER_IMP, WORK_CENTER_INH, WORK_CENTERS} from "../constants/reports";
import {EMPLOYEE_FILTERS, FILTER_EMP_ALL, FILTER_EMP_HURRICANE, FILTER_EMP_SLC} from "../ducks/employees/constants";
import {fetchStepsIfNeeded} from "../actions/steps";
import {fetchEmployeeTotal, fetchReport, fetchStepTotal} from "../actions/reports";
import GroupBySelect from "./GroupBySelect";
import ProductionReport from "./ProductionReport";
import {appStorage, STORAGE_KEYS} from '../utils/appStorage';
import EmployeeSelect from "./EmployeeSelect";
import TextInput from "../common-components/TextInput";
import DateInput from "./DateInput";


const mapStateToProps = state => {
    const {reports, employees, dlSteps} = state;
    return {reports, employees: employees.list, steps: dlSteps.list, html: reports.html};
};

const mapDispatchToProps = {
    fetchEmployeeTotal,
    fetchReport,
    fetchStepsIfNeeded,
    fetchStepTotal,
};

class ReportTab extends Component {
    static propTypes = {
        list: PropTypes.arrayOf(PropTypes.shape({
            url: PropTypes.string,
            title: PropTypes.string
        })),
        employees: PropTypes.arrayOf(PropTypes.shape({
            EmployeeNumber: PropTypes.string,
            FirstName: PropTypes.string,
            LastName: PropTypes.string,
            Department: PropTypes.string,
            active: PropTypes.bool,
        })),
        steps: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            StepCode: PropTypes.string,
            WorkCenter: PropTypes.string,
            Description: PropTypes.string,
        })),
        report: PropTypes.string,
        selected: PropTypes.string,
        isLoading: PropTypes.bool,
        hasError: PropTypes.string,
        html: PropTypes.string,
        fetchEmployeeTotal: PropTypes.func.isRequired,
        fetchStepTotal: PropTypes.func.isRequired,
        fetchStepsIfNeeded: PropTypes.func.isRequired,
        fetchReport: PropTypes.func.isRequired,
    };

    static defaultProps = {
        list: [],
        employees: [],
        steps: [],
    };

    state = {
        minDate: setDay(subWeeks(new Date(), 1), 1),
        maxDate: setDay(subWeeks(new Date(), 1), 5),
        WorkCenter: '%',
        EmployeeNumber: '%',
        active: true,
        StepCode: '%',
        ItemCode: '',
        group1: '',
        group2: '',
        group3: '',
        group4: '',
        group5: '',
        group6: '',
        group7: '',
    };

    constructor(props) {
        super(props);
        this.onChangeMaxDate = this.onChangeMaxDate.bind(this);
        this.onChangeMinDate = this.onChangeMinDate.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onSelectEmployee = this.onSelectEmployee.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClickEmployeeTotal = this.onClickEmployeeTotal.bind(this);
        this.onClickStepTotal = this.onClickStepTotal.bind(this);
        this.onChangeItemCode = this.onChangeItemCode.bind(this);
        this.onChangeWorkCenter = this.onChangeWorkCenter.bind(this);
    }

    componentDidMount() {
        this.props.fetchStepsIfNeeded();
        const state = appStorage.getItem(STORAGE_KEYS.REPORT_SETTINGS) || {};
        if (!!state.minDate && !(state.minDate instanceof Date)) {
            delete state.minDate;
        }
        if (!!state.maxDate && !(state.maxDate instanceof Date)) {
            delete state.maxDate;
        }
        this.setState(state);
    }


    onChangeMinDate({field, value}) {
        this.setState({minDate: value});
    }

    onChangeMaxDate({field, value}) {
        this.setState({maxDate: value});
    }

    onSelectEmployee(employee) {
        this.onChange({field: 'EmployeeNumber', value: employee.EmployeeNumber});
    }

    onChange({field, value}) {
        this.setState({[field]: value}, () => {
            appStorage.setItem(STORAGE_KEYS.REPORT_SETTINGS, this.state);
            this.submit();
        });
    }

    onChangeItemCode({field, value}) {
        this.setState({[field]: value}, () => {
            appStorage.setItem(STORAGE_KEYS.REPORT_SETTINGS, this.state);
        });
    }

    onChangeWorkCenter({value}) {
        this.setState({WorkCenter: value, EmployeeNumber: '%', StepCode: '%'}, () => {
            appStorage.setItem(STORAGE_KEYS.REPORT_SETTINGS, this.state);
            this.submit();
        });
    }

    submit() {
        const {minDate, maxDate, active, ...reportProps} = this.state;
        this.props.fetchReport(minDate, maxDate, reportProps);
    }

    onSubmitForm(ev) {
        ev.preventDefault();
        this.submit();
    }

    employeeFilter() {
        const {WorkCenter} = this.state;
        switch (WorkCenter) {
        case WORK_CENTER_CHU:
            return EMPLOYEE_FILTERS[FILTER_EMP_HURRICANE];
        case WORK_CENTER_INH:
        case WORK_CENTER_IMP:
            return EMPLOYEE_FILTERS[FILTER_EMP_SLC];
        default:
            return EMPLOYEE_FILTERS[FILTER_EMP_ALL];
        }
    }

    onClickEmployeeTotal() {
        this.props.fetchEmployeeTotal(this.state);
    }

    onClickStepTotal() {
        this.props.fetchStepTotal(this.state);
    }

    render() {
        const {list, report, isLoading, hasError, employees, steps, html} = this.props;
        const {
            minDate, maxDate, WorkCenter, EmployeeNumber, active, StepCode, ItemCode,
            group1, group2, group3, group4, group5, group6, group7
        } = this.state;
        const errorMessage = hasError ? <div className="alert alert-danger">{hasError}</div> : '';
        // console.log({minDate, maxDate});

        const visibleSteps = steps
            .filter(step => WorkCenter === '%' || step.WorkCenter === WorkCenter);

        let filter = null;
        try {
            filter = new RegExp(ItemCode || '^');
        } catch (err) {
            // console.log("render() invalid regexp", err.message);
        }

        return (
            <div className="container-fluid">
                <form className="hidden-print report-form" onSubmit={this.onSubmitForm}>
                    <div className="row g-3 my-1">
                        <div className="col-auto">
                            <label>From</label>
                            <DateInput value={minDate} onChange={this.onChangeMinDate} name="minDate"/>
                        </div>
                        <div className="col-auto">
                            <label>To</label>
                            <DateInput value={maxDate} onChange={this.onChangeMaxDate} name="maxDate"/>
                        </div>
                        <div className="col-auto">
                            <label>Work Center</label>
                            <Select value={WorkCenter} onChange={this.onChangeWorkCenter} field="WorkCenter">
                                <option value="%">All</option>
                                {WORK_CENTERS.map(wc => (
                                    <option key={wc.code} value={wc.code}>{wc.description}</option>))}
                            </Select>
                        </div>
                        <div className="col-auto mx-2">
                            <button type="button" className="btn btn-sm btn-outline-secondary"
                                    onClick={this.onClickEmployeeTotal}>Employee Totals
                            </button>
                        </div>
                        <div className="col-auto mx-2">
                            <button type="button" className="btn btn-sm btn-outline-secondary"
                                    onClick={this.onClickStepTotal}>Step Totals
                            </button>

                        </div>
                    </div>
                    <div className="row g-3 my-1">
                        <div className="col-auto">
                            <label>Employee</label>
                            <EmployeeSelect value={EmployeeNumber} onlyActive={active}
                                            onChange={this.onSelectEmployee} workCenter={WorkCenter}
                                            allowAll={true} allowInactive={true}/>
                        </div>
                        <div className="col-auto">
                            <label>Operation</label>
                            <Select value={StepCode} onChange={this.onChange} field="StepCode">
                                <option value="%">All</option>
                                {visibleSteps.map(step => (
                                    <option key={step.id} value={step.StepCode}>
                                        {step.StepCode} - {step.Description}
                                    </option>))
                                }
                            </Select>
                        </div>
                        {WorkCenter !== 'CHU' && (
                            <div className="col-auto">
                                <label>Item</label>
                                <TextInput field="ItemCode" value={ItemCode} onChange={this.onChangeItemCode}/>
                            </div>
                        )}
                        <div className="col-auto">
                            <button type="submit" className="btn btn-sm btn-primary mx-3">Submit</button>
                        </div>
                    </div>
                </form>
                <div className="row g-3 hidden-print my-1">
                    <label>Group By</label>
                    <GroupBySelect field={'group1'} onChange={this.onChange} value={group1}/>
                    <GroupBySelect field={'group2'} onChange={this.onChange} value={group2} selected={[group1]}
                                   disabled={group1 === ''}/>
                    <GroupBySelect field={'group3'} onChange={this.onChange} value={group3} selected={[group1, group2]}
                                   disabled={group2 === ''}/>
                    <GroupBySelect field={'group4'} onChange={this.onChange} value={group4}
                                   selected={[group1, group2, group3]} disabled={group3 === ''}/>
                    <GroupBySelect field={'group5'} onChange={this.onChange} value={group5}
                                   selected={[group1, group2, group3, group4]} disabled={group4 === ''}/>
                    <GroupBySelect field={'group6'} onChange={this.onChange} value={group6}
                                   selected={[group1, group2, group3, group4, group5]} disabled={group5 === ''}/>
                    <GroupBySelect field={'group7'} onChange={this.onChange} value={group7}
                                   selected={[group1, group2, group3, group4, group5, group6]}
                                   disabled={group6 === ''}/>
                </div>
                <ProgressBar visible={isLoading} striped={true} active={true} label="Loading Report"/>
                {errorMessage}
                <div className="container">
                    {!html &&
                    <ProductionReport group1={group1} group2={group2} group3={group3} group4={group4} group5={group5}
                                      group6={group6} group7={group7} filter={filter}/>}
                    {!!html && <div className="container" dangerouslySetInnerHTML={{__html: html}}/>}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportTab);
