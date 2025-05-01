import React, {ChangeEvent, FormEvent, useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
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
import InputGroup from "react-bootstrap/InputGroup";
import {Col, Form, FormControl, Row, Stack} from "react-bootstrap";
import {SpinnerButton} from "@chumsinc/react-bootstrap-addons";
import ProgressBar from "react-bootstrap/ProgressBar";

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

    const onChangeEntry = (field: keyof BasicDLEntry) => (ev: ChangeEvent) => {
        switch (field) {
            case 'Minutes':
            case 'Quantity':
                dispatch(updateEntry({[field]: Number((ev as ChangeEvent<HTMLInputElement>).target.value) || 0}))
                return;
            case 'WorkCenter':
                dispatch(updateEntry({[field]: (ev as ChangeEvent<HTMLSelectElement>).target.value}));
                return;
            default:
                dispatch(updateEntry({[field]: (ev as ChangeEvent<HTMLInputElement>).target.value || ''}))
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
            <Form onSubmit={onSaveEntry} className="mb-3" id="entry-form--slc">
                <Form.Group as={Row} width={8} label="Employee">
                    <Form.Label column sm={4}>Employee</Form.Label>
                    <Col sm={8}>
                        <EmployeeSelect filter={REGEX_FILTER_EMPLOYEES_SLC}
                                        value={entry.EmployeeNumber}
                                        onChange={onChangeEmployee}
                                        form="entry-form--slc"
                                        required={true}
                                        ref={employeeSelectRef}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm={4}>WO/IT</Form.Label>
                    <Col sm={8}>
                        <InputGroup size="sm">
                            <FormControl type="text" size="sm"
                                         ref={documentRef} value={entry.DocumentNo}
                                         disabled={!entry.EmployeeNumber}
                                         onChange={onChangeEntry('DocumentNo')}/>
                            <SpinnerButton spinning={workTicketLoading} type="button" variant="outline-primary"
                                           spinnerProps={{size: 'sm'}}
                                           disabled={!entry.EmployeeNumber}
                                           onClick={onLoadDocument}>Load WO/IT</SpinnerButton>
                        </InputGroup>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm={4}>Minutes/Qty</Form.Label>
                    <Col sm={8}>
                        <Stack gap={1} direction="horizontal">
                            <input type="number" value={entry.Minutes || ''} className="form-control form-control-sm"
                                   required ref={minutesRef}
                                   placeholder="minutes"
                                   disabled={!entry.EmployeeNumber}
                                   onChange={onChangeEntry('Minutes')}/>
                            <input type="number" value={entry.Quantity || ''} className="form-control form-control-sm"
                                   required placeholder="quantity"
                                   disabled={!entry.EmployeeNumber}
                                   onChange={onChangeEntry('Quantity')}/>
                        </Stack>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm={4}>Whse/Item</Form.Label>
                    <Col sm={8}>
                        <Stack gap={1} direction="horizontal">
                            <input type="text" value={entry.WarehouseCode ?? ''}
                                   className="form-control form-control-sm"
                                   required placeholder="Warehouse"
                                   disabled={!entry.EmployeeNumber}
                                   onChange={onChangeEntry('WarehouseCode')}/>
                            <input type="text" value={entry.ItemCode ?? ''} className="form-control form-control-sm"
                                   required placeholder="Item"
                                   disabled={!entry.EmployeeNumber}
                                   onChange={onChangeEntry('ItemCode')}/>
                        </Stack>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} width={8} label="Work Center/Step">
                    <Form.Label column sm={4}>Work Center/Step</Form.Label>
                    <Col sm={8}>
                        <Row className="g-1">
                            <Col sm={4}>
                                <select className="form-select form-select-sm" value={entry.WorkCenter || ''}
                                        disabled={!entry.EmployeeNumber}
                                        onChange={onChangeEntry('WorkCenter')}>
                                    <option value="">Select W/C</option>
                                    <option value="INH">INH</option>
                                    <option value="CONSL">CONSL</option>
                                    <option value="CON">CON</option>
                                </select>
                            </Col>
                            <Col sm={8}>
                                <SelectSLCSteps workCenter={entry.WorkCenter} stepId={entry.idSteps}
                                                step={!entry.idSteps ? entryStep(entry) : null}
                                                onChange={onChangeStep} required disabled={!entry.EmployeeNumber}/>
                            </Col>
                        </Row>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm={4}>SAM/Op</Form.Label>
                    <Col sm={8}>
                        <Row className="g-1">
                            <Col sm={4}>
                                <input type="text" value={numeral(entry.StandardAllowedMinutes ?? 0).format('0,0.0000')}
                                       className="form-control form-control-sm"
                                       readOnly
                                       onChange={onChangeEntry('WarehouseCode')}/>
                            </Col>
                            <Col sm={8}>
                                <input type="text" value={entry?.Description ?? ''}
                                       className="form-control form-control-sm"
                                       readOnly
                                       onChange={onChangeEntry('ItemCode')}/>
                            </Col>
                        </Row>
                    </Col>
                </Form.Group>
                <Row className="g-3">
                    <Col sm={4}/>
                    <Col sm={8}>
                        {actionStatus === 'loading' && <ProgressBar striped={true} animated={true} now={100}/>}
                    </Col>
                </Row>
                <Row className="g-3 justify-content-end">
                    <Col xs="auto">
                        <button type="button" className="btn btn-sm btn-outline-secondary"
                                disabled={actionStatus != 'idle'}
                                onClick={onNewEntry}>
                            New
                        </button>
                    </Col>
                    <Col xs="auto">
                        <SpinnerButton type="button" variant="outline-danger" size="sm" spinnerProps={{size: "sm"}}
                                       onClick={onDeleteEntry}
                                       spinning={actionStatus === 'deleting'}
                                       disabled={entry.id === 0 || actionStatus !== 'idle'}>
                            Delete
                        </SpinnerButton>

                    </Col>
                    <Col xs="auto">
                        <SpinnerButton type="submit" size="sm" spinnerProps={{size: "sm"}}
                                       spinning={actionStatus === 'saving'}
                                       variant="primary" disabled={actionStatus !== 'idle' || !entry.EmployeeNumber}>
                            Save
                        </SpinnerButton>
                    </Col>
                </Row>
            </Form>
            <DocumentContainer onSelect={focusNextInputField}/>
        </div>
    );
}

export default SLCEntryForm
