import React, {ChangeEvent, FormEvent, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {DateInput, FormColumn, InputGroup, ProgressBar, SpinnerButton} from "chums-ducks";
import {selectCurrentEntry, selectEntryDate, selectLoading, selectSaving} from "./selectors";
import {fetchDocumentAction, selectLoading as selectWOLoading} from "../work-order";
import {Employee, Entry} from "../common-types";
import {deleteEntryAction, newEntryAction, saveEntryAction, setEntryDateAction, updateEntryAction} from "./actions";
import EmployeeSelect from "../employees/EmployeeSelect";
import {REGEX_FILTER_EMPLOYEES_SLC} from "../employees/constants";
import SelectSLCSteps from "../steps/SelectSLCSteps";
import DocumentContainer from "../work-order/DocumentContainer";
import numeral from "numeral";
import {selectEmployeeAction} from "../employees/actions";

const SLCEntryForm: React.FC = () => {
    const dispatch = useDispatch();
    const entryDate = useSelector(selectEntryDate);
    const entry = useSelector(selectCurrentEntry);
    const loading = useSelector(selectLoading);
    const saving = useSelector(selectSaving);
    const loadingWO = useSelector(selectWOLoading)

    useEffect(() => {
        if (entry.WorkCenter === '') {
            dispatch(updateEntryAction({...entry, WorkCenter: 'INH'}));
        }
    }, [entry.WorkCenter]);

    const employeeSelectRef = useRef<HTMLSelectElement>(null);
    const documentRef = useRef<HTMLInputElement>(null);
    const minutesRef = useRef<HTMLInputElement>(null);

    const onChangeEntryDate = (date: Date | null) => {
        dispatch(setEntryDateAction(date));
    }

    const onChangeEmployee = (employee?: Employee | null) => {
        console.log('onChangeEmployee', employee)
        dispatch(selectEmployeeAction(employee));
        if (!employee) {
            dispatch(newEntryAction());
        } else {
            dispatch(updateEntryAction({...entry, EmployeeNumber: employee?.EmployeeNumber || ''}));
        }

        focusNextInputField();
    }

    const onSaveEntry = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveEntryAction(entry));
        minutesRef.current?.focus();
    }

    const onDeleteEntry = () => {
        if (!window.confirm('Are you sure you want to delete this entry?')) {
            return;
        }
        dispatch(deleteEntryAction(entry));
        focusNextInputField();
    }
    const onNewEntry = () => {
        dispatch(newEntryAction());
        focusNextInputField();
    }
    const onChangeNumericEntry = (field: keyof Entry) => (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(updateEntryAction({[field]: Number(ev.target.value) || 0}))
    }

    const onChangeEntry = (field: keyof Entry) => (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        dispatch(updateEntryAction({[field]: ev.target.value || ''}))
    }

    const onChangeStep = (ev: ChangeEvent<HTMLSelectElement>) => {
        dispatch(updateEntryAction({idSteps: Number(ev.target.value)}));
    }


    const focusNextInputField = () => {
        if (!entry.EmployeeNumber && employeeSelectRef.current) {
            return employeeSelectRef.current.focus();
        }
        if (!entry.DocumentNo && documentRef.current) {
            return documentRef.current.focus();
        }
        minutesRef.current?.focus();
    }

    const onLoadDocument = () => {
        dispatch(fetchDocumentAction());
    }

    const onSubmitLoadDocument = (ev: FormEvent) => {
        ev.preventDefault();
        onLoadDocument();
    }

    const {id, EmployeeNumber, LineNo, idSteps, Minutes, Quantity, changed} = entry;
    return (
        <div>
            <form onSubmit={onSaveEntry} className="mb-3" id="entry-form--slc">
                <FormColumn width={8} label="Date">
                    <DateInput date={entryDate} onChangeDate={onChangeEntryDate}
                               form="entry-form--slc"
                               required={true}/>
                </FormColumn>
                <FormColumn width={8} label="Employee">
                    <EmployeeSelect filter={REGEX_FILTER_EMPLOYEES_SLC}
                                    value={EmployeeNumber}
                                    onSelect={onChangeEmployee}
                                    form="entry-form--slc"
                                    required={true}
                                    myRef={employeeSelectRef}/>
                </FormColumn>
                <FormColumn width={8} label="WO/IT">
                    <InputGroup bsSize="sm">
                        <input type="text" className="form-control form-control-sm" maxLength={8}
                               ref={documentRef} value={entry.DocumentNo}
                               onChange={onChangeEntry('DocumentNo')}/>
                        <SpinnerButton spinning={loadingWO} type="button" color="outline-primary"
                                       onClick={onLoadDocument}>Load WO/IT</SpinnerButton>
                    </InputGroup>
                </FormColumn>
                <FormColumn width={8} label="Minutes/Qty">
                    <div className="row g-1">
                        <div className="col-6">
                            <input type="number" value={Minutes || ''} className="form-control form-control-sm"
                                   required ref={minutesRef}
                                   placeholder="minutes"
                                   onChange={onChangeNumericEntry('Minutes')}/>
                        </div>
                        <div className="col-6">
                            <input type="number" value={Quantity || ''} className="form-control form-control-sm"
                                   required placeholder="quantity"
                                   onChange={onChangeNumericEntry('Quantity')}/>
                        </div>
                    </div>
                    <InputGroup bsSize="sm">
                    </InputGroup>
                </FormColumn>
                <FormColumn width={8} label="Whse/Item">
                    <div className="row g-1">
                        <div className="col-4">
                            <input type="text" value={entry.WarehouseCode} className="form-control form-control-sm"
                                   required placeholder="Warehouse"
                                   onChange={onChangeEntry('WarehouseCode')}/>
                        </div>
                        <div className="col-8">
                            <input type="text" value={entry.ItemCode} className="form-control form-control-sm"
                                   required placeholder="Item"
                                   onChange={onChangeEntry('ItemCode')}/>
                        </div>
                    </div>
                    <InputGroup bsSize="sm">
                    </InputGroup>
                </FormColumn>
                <FormColumn width={8} label="Work Center/Step">
                    <div className="row g-1">
                        <div className="col-4">
                            <select className="form-select form-select-sm" value={entry.WorkCenter || ''}
                                    onChange={onChangeEntry('WorkCenter')}>
                                <option value="">Select W/C</option>
                                <option value="INH">INH</option>
                                <option value="CONSL">CONSL</option>
                                <option value="CON">CON</option>
                            </select>
                        </div>
                        <div className="col-8">
                            <SelectSLCSteps workCenter={entry.WorkCenter} value={idSteps} onChange={onChangeStep}/>
                        </div>
                    </div>

                </FormColumn>
                <FormColumn width={8} label="SAM/Op">
                    <div className="row g-1">
                        <div className="col-4">
                            <input type="text" value={numeral(entry.StandardAllowedMinutes).format('0,0.0000')}
                                   className="form-control form-control-sm"
                                   readOnly
                                   onChange={onChangeEntry('WarehouseCode')}/>
                        </div>
                        <div className="col-8">
                            <input type="text" value={entry.Description} className="form-control form-control-sm"
                                   readOnly
                                   onChange={onChangeEntry('ItemCode')}/>
                        </div>
                    </div>
                    <InputGroup bsSize="sm">
                    </InputGroup>
                </FormColumn>
                <FormColumn width={8} label="">
                    {loading && <ProgressBar striped={true} animated={true}/>}
                </FormColumn>
                <FormColumn width={8} label="">
                    <div className="row g-3">
                        <div className="col-auto">
                            <button type="submit" className="btn btn-sm btn-primary" disabled={loading || saving}>
                                Save
                            </button>
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn btn-sm btn-outline-secondary"
                                    disabled={loading || saving}
                                    onClick={onNewEntry}>
                                New
                            </button>
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn btn-sm btn-outline-danger"
                                    onClick={onDeleteEntry}
                                    disabled={id === 0 || loading || saving}>
                                Delete
                            </button>
                        </div>
                    </div>
                </FormColumn>
            </form>
            <DocumentContainer onSelect={focusNextInputField}/>
        </div>
    );
}

export default SLCEntryForm
