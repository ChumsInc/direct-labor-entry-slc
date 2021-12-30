import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {parseISO} from 'date-fns';
import TextInput from "./TextInput";

import {WORK_CENTER_INH} from "../constants/reports";
import numeral from "numeral";
import {
    deleteEntry,
    loadOperationLookup,
    saveEntry,
    selectEntry,
    setCompany,
    setDate,
    updateSelectedEntry,
} from '../actions/slc-entries'
import {selectSLCEmployeeAction} from "../ducks/employees/actions";
import EmployeeSelect from './EmployeeSelect';
import Select from '../common-components/Select';
import TypeaheadInput from "../common-components/TypeaheadInput";
import {setUserError} from "../actions/app";
import {NEW_ENTRY} from "../constants/slc-entries";
import FormRow from "../common-components/FormRow";
import DateInput from "./DateInput";


const OperationDropDownItem = ({OperationCode, OperationDescription = ''}) => (
    <div className="form-row">
        <div className="col-4">{OperationCode}</div>
        <div className="col-8">{OperationDescription.replace(/,[ ]*/g, ', ')}</div>
    </div>
);

class SLCEntryEditor extends Component {
    static propTypes = {
        entryDate: PropTypes.instanceOf(Date),
        selected: PropTypes.shape({
            id: PropTypes.number,
            EmployeeNumber: PropTypes.string,
            Company: PropTypes.string,
            WorkOrderNo: PropTypes.string,
            ItemCode: PropTypes.string,
            WarehouseCode: PropTypes.string,
            idSteps: PropTypes.number,
            WorkCenter: PropTypes.string,
            OperationCode: PropTypes.string,
            OperationDescription: PropTypes.string,
            EntryDate: PropTypes.instanceOf(Date),
            Minutes: PropTypes.number,
            Quantity: PropTypes.number,
            StandardAllowedMinutes: PropTypes.number,
            Quantityaasdasd: PropTypes.string,
            DocumentNo: PropTypes.string,
        }),
        EmployeeNumber: PropTypes.string,
        addOperationList: PropTypes.array,

        setDate: PropTypes.func.isRequired,
        updateSelectedEntry: PropTypes.func.isRequired,
        saveEntry: PropTypes.func.isRequired,
        selectSLCEmployee: PropTypes.func.isRequired,
        loadOperationLookup: PropTypes.func.isRequired,
        selectEntry: PropTypes.func.isRequired,
        deleteEntry: PropTypes.func.isRequired,
        setUserError: PropTypes.func.isRequired,
        setCompany: PropTypes.func.isRequired,

    };

    static defaultProps = {
        entryDate: null,
        selected: {},
        EmployeeNumber: '',
        addOperationList: [],
    };


    constructor(props) {
        super(props);

        this.timer = null;
        this.minutesRef = React.createRef();

        this.onSubmitEntry = this.onSubmitEntry.bind(this);
        this.onSelectEmployee = this.onSelectEmployee.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChangeOpCode = this.onChangeOpCode.bind(this);
        this.onSelectOpCode = this.onSelectOpCode.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onClickNewEntry = this.onClickNewEntry.bind(this);
        this.onDeleteEntry = this.onDeleteEntry.bind(this);
        this.onChangeCompany = this.onChangeCompany.bind(this);
    }

    onSubmitEntry(ev) {
        ev.preventDefault();
        ev.preventDefault();
        const {selected} = this.props;
        if (!selected.idSteps) {
            this.props.setUserError(new Error('You must select a valid operation'));
            return;
        }
        if (!selected.WarehouseCode) {
            this.props.setUserError(new Error('Warehouse Code is required'));
            return;
        }
        if (!selected.ItemCode) {
            this.props.setUserError(new Error('Item Code is required'));
            return;
        }
        if (!selected.WorkCenter) {
            this.props.setUserError(new Error('Work Center is required'));
            return;
        }
        this.props.saveEntry(selected);
        this.minutesRef.current.focus();
    }

    onChangeCompany({value}) {
        this.props.setCompany(value);
    }

    onChangeDate({value}) {
        this.props.setDate(new Date(value));
    }


    onChange({field, value}) {
        this.props.updateSelectedEntry({[field]: value});
    }

    onSelectEmployee(employee) {
        const {selected, entryDate} = this.props;
        this.props.selectSLCEmployee(employee, {
            ...NEW_ENTRY,
            ...selected,
            ...employee,
            EntryDate: entryDate
        });
    }

    onChangeOpCode(val) {
        this.props.updateSelectedEntry({OperationCode: val});


        // debounce the lookup list.
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(this.props.loadOperationLookup, 400);
    }

    onSelectOpCode(op) {
        if (!op) {
            return;
        }
        const {OperationCode, StandardAllowedMinutes, OperationDescription, WorkCenter, idSteps} = op;
        if (StandardAllowedMinutes === null) {
            return;
        }
        this.props.updateSelectedEntry({
            OperationCode,
            StandardAllowedMinutes,
            OperationDescription,
            idSteps,
            WorkCenter
        });
    }

    onClickNewEntry() {
        const {entryDate, selected} = this.props;
        const {EmployeeNumber, FullName, WorkCenter = 'INH'} = selected;
        this.props.selectEntry({...NEW_ENTRY, EmployeeNumber, FullName, EntryDate: entryDate, WorkCenter});
        this.minutesRef.current.focus();
    }

    onDeleteEntry() {
        const {selected} = this.props;
        this.props.deleteEntry(selected);
        this.minutesRef.current.focus();
    }

    render() {
        const {entryDate, EmployeeNumber, selected, addOperationList, company} = this.props;
        const {Minutes = 0, Quantity = 0, WarehouseCode, ItemCode, WorkCenter, OperationCode} = selected;
        return (
            <form className="form-horizontal" onSubmit={this.onSubmitEntry}>
                <FormRow colWidth={8} label="Company">
                    <Select value={company} onChange={this.onChangeCompany}>
                        <option value="chums">Chums</option>
                        <option value="bc">Beyond Coastal</option>
                    </Select>
                </FormRow>
                <FormRow colWidth={8} label="Date">
                    <DateInput value={entryDate}
                               required={true}
                               onChange={this.onChangeDate}/>
                </FormRow>
                <FormRow colWidth={8} label="Employee">
                    <EmployeeSelect workCenter={WORK_CENTER_INH} onChange={this.onSelectEmployee}
                                    required={true}
                                    value={EmployeeNumber}/>
                </FormRow>
                <FormRow label="Minutes / Qty" colWidth={8}>
                    <div className="row g-1">
                        <div className="col-6">
                            <TextInput type="number"
                                       placeholder="Minutes"
                                       value={Minutes || ''} field="Minutes"
                                       min={0} step={1}
                                       required={true}
                                       ref={this.minutesRef}
                                       onChange={this.onChange}/>
                        </div>
                        <div className="col-6">
                            <TextInput type="number" placeholder="Quantity"
                                       value={Quantity || ''} field="Quantity" required={true}
                                       min={0} step={1}
                                       onChange={this.onChange}/>
                        </div>
                    </div>
                </FormRow>
                <FormRow type="text" colWidth={8} label="Whse / Item Code">
                    <div className="row g-1">
                        <div className="col-4">
                            <TextInput value={WarehouseCode || ''} field="WarehouseCode" maxLength={3}
                                       placeholder="Whse" onChange={this.onChange}/>
                        </div>
                        <div className="col-8">
                            <TextInput value={ItemCode || ''} field="ItemCode"
                                       placeholder="Item Code" onChange={this.onChange}/>
                        </div>
                    </div>
                </FormRow>
                <FormRow type="" colWidth={8} label="Operation">
                    <div className="row g-1">
                        <div className="col-4">
                            <Select value={WorkCenter || ''} field="WorkCenter" onChange={this.onChange}>
                                <option value="INH">INH</option>
                                <option value="CONSL">CONSL</option>
                                <option value="CON">CON</option>
                            </Select>
                        </div>
                        <div className="col-8">
                            <TypeaheadInput minLength={1} data={addOperationList} className="form-control-sm"
                                            placeholder="Operation Code"
                                            value={OperationCode} required={true}
                                            itemRender={OperationDropDownItem}
                                            onChange={this.onChangeOpCode}
                                            onSelect={this.onSelectOpCode}/>
                        </div>
                    </div>
                </FormRow>
                <FormRow type="" colWidth={8} label="SAM / Operation">
                    <div className="row g-1">
                        <div className="col-4">
                            <input type="text" className="form-control form-control-sm" placeholder="0.000"
                                   readOnly={true}
                                   value={numeral(selected.StandardAllowedMinutes || 0).format('0.000')}/>
                        </div>
                        <div className="col-8">
                            <input type="text" className="form-control form-control-sm"
                                   placeholder="Operation Description" readOnly={true}
                                   value={selected.OperationDescription || ''}/>
                        </div>
                    </div>
                </FormRow>
                <FormRow colWidth={8} label={' '}>
                    <button type="submit" className="btn btn-primary btn-sm mr-sm-1">Save</button>
                    <button type="button" className="btn btn-outline-secondary btn-sm mx-sm-1"
                            onClick={this.onClickNewEntry}>New
                    </button>
                    <button type="button" className="btn btn-outline-danger btn-sm mx-sm-1"
                            disabled={selected.id === 0}
                            onClick={this.onDeleteEntry}>Delete
                    </button>
                </FormRow>
            </form>
        );
    }
}

const mapStateToProps = ({SLCEntries, employees}) => {
    const {entryDate, selected, addOperationList, company} = SLCEntries;
    const {EmployeeNumber = ''} = employees.selectedSLC || {};
    return {
        company,
        entryDate,
        EmployeeNumber,
        selected,
        addOperationList,
    };
};

const mapDispatchToProps = {
    setDate,
    selectSLCEmployee: selectSLCEmployeeAction,
    updateSelectedEntry,
    loadOperationLookup,
    selectEntry,
    deleteEntry,
    setUserError,
    saveEntry,
    setCompany,
};

export default connect(mapStateToProps, mapDispatchToProps)(SLCEntryEditor) 
