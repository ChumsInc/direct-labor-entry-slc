import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import classNames from 'classnames';
import {DEPARTMENT_NAMES, newEmployee} from './constants';
import {useSelector} from 'react-redux';
import {selectCurrentEmployee, selectSaving} from "./selectors";
import {saveEmployee, setCurrentEmployee} from "./actions";
import {useAppDispatch} from "../../app/configureStore";
import {DLDepartmentKey, DLEmployee, Editable} from "chums-types";
import Alert from "react-bootstrap/Alert";
import {Col, Form, FormSelect, Row, Stack} from "react-bootstrap";
import {SpinnerButton} from "@chumsinc/react-bootstrap-addons";

const reTemp = /^(TEMP|[0-9]*HT)$/;

const EmployeeEdit: React.FC = () => {
    const dispatch = useAppDispatch();
    const selected = useSelector(selectCurrentEmployee);
    const isSaving = useSelector(selectSaving);

    const [employee, setEmployee] = useState<DLEmployee & Editable>(selected || newEmployee);

    useEffect(() => {
        if (!isSaving) {
            setEmployee(selected || newEmployee);
        }
    }, [selected, isSaving]);

    const onNewEmployee = () => {
        if (employee?.changed && !window.confirm('Are you sure you want to lose your changes?')) {
            return;
        }
        dispatch(setCurrentEmployee(newEmployee));
    }

    const onChangeEmployee = (field: keyof DLEmployee) => (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!employee || !reTemp.test(employee.Department)) {
            return;
        }
        setEmployee({...employee, [field]: ev.target.value, changed: true});
    }
    const onSetActive = (active: boolean) => {
        if (!employee) {
            return;
        }
        setEmployee({...employee, active, changed: true});
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        if (!employee) {
            return;
        }
        dispatch(saveEmployee(employee));
    }

    if (!employee) {
        return (<Alert variant="info">Select Employee</Alert>);
    }

    const isTemp = reTemp.test(employee.Department);
    const readOnly = !isTemp;

    const btnActive = classNames("btn btn-sm", {
        'btn-success': employee.active,
        'btn-outline-success': !employee.active
    });
    const btnInactive = classNames("btn btn-sm", {
        'btn-danger': !employee.active,
        'btn-outline-danger': employee.active
    });
    const deptOptions = Object.keys(DEPARTMENT_NAMES)
        .filter(key => isTemp ? /T$/.test(key) : /.*(?<!T)$/.test(key))
        .map((key) => {
            return (
                <option key={key} value={key}>{DEPARTMENT_NAMES[key as DLDepartmentKey]}</option>
            );
        });

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group as={Row}>
                <Form.Label column sm={4}>ID / Status</Form.Label>
                <Col sm={8}>
                    <Stack gap={3} direction="horizontal">
                        <input type="text" value={employee.EmployeeNumber || 'New'}
                               className="form-control form-control-sm" readOnly/>
                        <button type="button" className={btnActive} onClick={() => onSetActive(true)}
                                disabled={readOnly}>
                            Active
                        </button>
                        <button type="button" className={btnInactive} onClick={() => onSetActive(false)}
                                disabled={readOnly}>
                            Inactive
                        </button>
                    </Stack>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm={4}>First / Last Name</Form.Label>
                <Col sm={8}>
                    <Stack gap={3} direction="horizontal">
                        <input type="text" className="form-control form-control-sm" readOnly={readOnly}
                               placeholder="First Name" aria-label="First Name"
                               value={employee.FirstName} onChange={onChangeEmployee('FirstName')}/>
                        <input type="text" className="form-control form-control-sm" readOnly={readOnly}
                               placeholder="Last Name" aria-label="Last Name"
                               value={employee.LastName} onChange={onChangeEmployee('LastName')}/>
                    </Stack>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm={4}>Department</Form.Label>
                <Col sm={8}>
                    <FormSelect required={true} value={employee.Department || ''} size="sm"
                                onChange={onChangeEmployee('Department')} disabled={!isTemp}>
                        <option/>
                        {deptOptions}
                    </FormSelect>
                </Col>
            </Form.Group>
            <Stack gap={3} direction="horizontal" className="justify-content-end">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onNewEmployee}>New
                    Employee
                </button>

                <SpinnerButton type="submit" spinning={isSaving} variant="primary" size="sm" spinnerProps={{size: "sm"}}
                               disabled={readOnly}>Save</SpinnerButton>
            </Stack>
            {employee?.changed && (
                <Alert variant="warning">Don't forget to save your changes</Alert>
            )}
        </Form>
    )
}

export default EmployeeEdit;
