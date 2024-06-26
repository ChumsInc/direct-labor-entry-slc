import React, {ChangeEvent, FormEvent, useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {FormColumn, InputGroup, ProgressBar, SpinnerButton} from "chums-components";
import {selectCurrentEntry, selectEntriesActionStatus, selectEntryEmployee} from "./selectors";
import {removeEntry, saveEntry, setEntryEmployee, setNewEntry, updateEntry} from "./actions";
import EmployeeSelect from "../employees/EmployeeSelect";
import {REGEX_FILTER_EMPLOYEES_SLC} from "../employees/constants";
import SelectSLCSteps from "../steps/SelectSLCSteps";
import DocumentContainer from "../work-ticket/DocumentContainer";
import numeral from "numeral";
import {selectWorkTicketLoading} from "../work-ticket/selectors";
import {useAppDispatch} from "../../app/configureStore";
import {loadDocument} from "../work-ticket/actions";
import {BasicDLEntry, DLEmployee} from "chums-types";
import {MinimalStep} from "../common-types";

const SLCEntryForm = () => {
    const dispatch = useAppDispatch();
    const entry = useSelector(selectCurrentEntry);
    const actionStatus = useSelector(selectEntriesActionStatus);
    const workTicketLoading = useSelector(selectWorkTicketLoading);
    const currentEmployee = useSelector(selectEntryEmployee);

    useEffect(() => {
        focusNextInputField();
    }, []);

    useEffect(() => {
        focusNextInputField();
    }, [entry?.EmployeeNumber]);

    const employeeSelectRef = useRef<HTMLSelectElement>(null);
    const documentRef = useRef<HTMLInputElement>(null);
    const minutesRef = useRef<HTMLInputElement>(null);

    const onChangeEmployee = (employee?: DLEmployee | null) => {
        if (entry) {
            dispatch(updateEntry({...entry, EmployeeNumber: employee?.EmployeeNumber || ''}));
            focusNextInputField();
        }
        if (!currentEmployee && !!employee) {
            dispatch(setEntryEmployee(employee));
        }
    }

    const onSaveEntry = (ev: FormEvent) => {
        ev.preventDefault();
        if (entry) {
            dispatch(saveEntry(entry));
            documentRef.current?.focus();
        }
    }

    const onDeleteEntry = () => {
        if (!window.confirm('Are you sure you want to delete this entry?')) {
            return;
        }
        if (!entry || !entry?.id) {
            dispatch(setNewEntry());
        } else {
            dispatch(removeEntry(entry));
        }
        focusNextInputField();
    }

    const onNewEntry = () => {
        dispatch(setNewEntry());
        focusNextInputField();
    }

    const onChangeEntry = (field: keyof BasicDLEntry) => (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (field) {
            case 'Minutes':
            case 'Quantity':
                dispatch(updateEntry({[field]: Number(ev.target.value) || 0}))
                return;
            default:
                dispatch(updateEntry({[field]: ev.target.value || ''}))
        }
    }

    const onChangeStep = (step: MinimalStep | null) => {
        if (!entry || !step) {
            return;
        }
        dispatch(updateEntry({
            idSteps: step.id,
            StandardAllowedMinutes: step.standardAllowedMinutes
        }));
    }


    const focusNextInputField = () => {
        if (!entry?.EmployeeNumber && employeeSelectRef.current) {
            return employeeSelectRef.current.focus();
        }
        if (!entry?.DocumentNo && documentRef.current) {
            return documentRef.current.focus();
        }
        minutesRef.current?.focus();
    }

    const onLoadDocument = () => {
        if (!entry?.DocumentNo) {
            return;
        }
        dispatch(loadDocument(entry?.DocumentNo));
        minutesRef.current?.focus();
    }

    if (!entry) {
        return (
            <div className="row g-3">
                <div className="col-auto">
                    <button type="button" className="btn btn-sm btn-outline-secondary"
                            disabled={actionStatus !== 'idle'}
                            onClick={onNewEntry}>
                        New Entry
                    </button>
                </div>
            </div>
        )
    }

    const entryStep = (entry: BasicDLEntry): MinimalStep => {
        return {
            id: entry.idSteps ?? 0,
            stepCode: entry.StepCode,
            description: entry.Description ?? '',
            workCenter: entry.WorkCenter,
            standardAllowedMinutes: entry.StandardAllowedMinutes ?? 0,
        }
    }

    return (
        <div>
            <form onSubmit={onSaveEntry} className="mb-3" id="entry-form--slc">
                <FormColumn width={8} label="Employee">
                    <EmployeeSelect filter={REGEX_FILTER_EMPLOYEES_SLC}
                                    value={entry.EmployeeNumber}
                                    onSelect={onChangeEmployee}
                                    form="entry-form--slc"
                                    required={true}
                                    ref={employeeSelectRef}/>
                </FormColumn>
                <FormColumn width={8} label="WO/IT">
                    <InputGroup bsSize="sm">
                        <input type="text" className="form-control form-control-sm" maxLength={8}
                               ref={documentRef} value={entry.DocumentNo}
                               disabled={!entry.EmployeeNumber}
                               onChange={onChangeEntry('DocumentNo')}/>
                        <SpinnerButton spinning={workTicketLoading} type="button" color="outline-primary"
                                       disabled={!entry.EmployeeNumber}
                                       onClick={onLoadDocument}>Load WO/IT</SpinnerButton>
                    </InputGroup>
                </FormColumn>
                <FormColumn width={8} label="Minutes/Qty">
                    <div className="row g-1">
                        <div className="col-6">
                            <input type="number" value={entry.Minutes || ''} className="form-control form-control-sm"
                                   required ref={minutesRef}
                                   placeholder="minutes"
                                   disabled={!entry.EmployeeNumber}
                                   onChange={onChangeEntry('Minutes')}/>
                        </div>
                        <div className="col-6">
                            <input type="number" value={entry.Quantity || ''} className="form-control form-control-sm"
                                   required placeholder="quantity"
                                   disabled={!entry.EmployeeNumber}
                                   onChange={onChangeEntry('Quantity')}/>
                        </div>
                    </div>
                    <InputGroup bsSize="sm">
                    </InputGroup>
                </FormColumn>
                <FormColumn width={8} label="Whse/Item">
                    <div className="row g-1">
                        <div className="col-4">
                            <input type="text" value={entry.WarehouseCode ?? ''}
                                   className="form-control form-control-sm"
                                   required placeholder="Warehouse"
                                   disabled={!entry.EmployeeNumber}
                                   onChange={onChangeEntry('WarehouseCode')}/>
                        </div>
                        <div className="col-8">
                            <input type="text" value={entry.ItemCode ?? ''} className="form-control form-control-sm"
                                   required placeholder="Item"
                                   disabled={!entry.EmployeeNumber}
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
                                    disabled={!entry.EmployeeNumber}
                                    onChange={onChangeEntry('WorkCenter')}>
                                <option value="">Select W/C</option>
                                <option value="INH">INH</option>
                                <option value="CONSL">CONSL</option>
                                <option value="CON">CON</option>
                            </select>
                        </div>
                        <div className="col-8">
                            <SelectSLCSteps workCenter={entry.WorkCenter} stepId={entry.idSteps}
                                            step={!entry.idSteps ? entryStep(entry) : null}
                                            onChange={onChangeStep} required disabled={!entry.EmployeeNumber}/>
                        </div>
                    </div>

                </FormColumn>
                <FormColumn width={8} label="SAM/Op">
                    <div className="row g-1">
                        <div className="col-4">
                            <input type="text" value={numeral(entry.StandardAllowedMinutes ?? 0).format('0,0.0000')}
                                   className="form-control form-control-sm"
                                   readOnly
                                   onChange={onChangeEntry('WarehouseCode')}/>
                        </div>
                        <div className="col-8">
                            <input type="text" value={entry?.Description ?? ''} className="form-control form-control-sm"
                                   readOnly
                                   onChange={onChangeEntry('ItemCode')}/>
                        </div>
                    </div>
                    <InputGroup bsSize="sm">
                    </InputGroup>
                </FormColumn>
                <FormColumn width={8} label="">
                    {actionStatus === 'loading' && <ProgressBar striped={true} animated={true}/>}
                </FormColumn>
                <FormColumn width={8} label="">
                    <div className="row g-3">
                        <div className="col-auto">
                            <SpinnerButton type="submit" size="sm"
                                           spinning={actionStatus === 'saving'}
                                           color="primary" disabled={actionStatus !== 'idle' || !entry.EmployeeNumber}>
                                Save
                            </SpinnerButton>
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn btn-sm btn-outline-secondary"
                                    disabled={actionStatus != 'idle'}
                                    onClick={onNewEntry}>
                                New
                            </button>
                        </div>
                        <div className="col-auto">
                            <SpinnerButton type="button" color="outline-danger" size="sm"
                                           onClick={onDeleteEntry}
                                           spinning={actionStatus === 'deleting'}
                                           disabled={entry.id === 0 || actionStatus !== 'idle'}>
                                Delete
                            </SpinnerButton>
                        </div>
                    </div>
                </FormColumn>
            </form>
            <DocumentContainer onSelect={focusNextInputField}/>
        </div>
    );
}

export default SLCEntryForm
