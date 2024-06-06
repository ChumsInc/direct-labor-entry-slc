import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import classNames from 'classnames';
import {Alert, FormColumn, Select, SpinnerButton} from 'chums-components';
import {DEPARTMENT_NAMES, newEmployee} from './constants';
import {useSelector} from 'react-redux';
import {selectCurrentEmployee, selectSaving} from "./selectors";
import {saveEmployee, setCurrentEmployee} from "./actions";
import {useAppDispatch} from "../../app/configureStore";
import {DLDepartmentKey, DLEmployee, Editable} from "chums-types";

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
        return (<Alert color="info">Select Employee</Alert>);
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
        <form onSubmit={onSubmit}>
            <FormColumn label="ID/Status" width={8}>
                <div className="row g-3">
                    <div className="col-auto">
                        <input type="text" value={employee.EmployeeNumber || 'New'}
                               className="form-control form-control-sm" readOnly/>
                    </div>
                    <div className="col-auto">
                        <button type="button" className={btnActive} onClick={() => onSetActive(true)}
                                disabled={readOnly}>
                            Active
                        </button>
                        {' '}
                        <button type="button" className={btnInactive} onClick={() => onSetActive(false)}
                                disabled={readOnly}>
                            Inactive
                        </button>
                    </div>
                </div>
            </FormColumn>
            <FormColumn label="First / Last Name">
                <div className="row g-3">
                    <div className="col">
                        <input type="text" className="form-control form-control-sm" readOnly={readOnly}
                               value={employee.FirstName} onChange={onChangeEmployee('FirstName')}/>
                    </div>
                    <div className="col">
                        <input type="text" className="form-control form-control-sm" readOnly={readOnly}
                               value={employee.LastName} onChange={onChangeEmployee('LastName')}/>
                    </div>
                </div>
            </FormColumn>
            <FormColumn width={8} label="DepartmentKey">
                <Select required={true} value={employee.Department || ''} bsSize="sm"
                        onChange={onChangeEmployee('Department')} disabled={!isTemp}>
                    <option/>
                    {deptOptions}
                </Select>
            </FormColumn>
            <FormColumn width={8} label="">
                <SpinnerButton type="submit" spinning={isSaving} className="btn btn-primary" size="sm"
                               disabled={readOnly}>Save</SpinnerButton>
                {' '}
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onNewEmployee}>New
                    Employee
                </button>
            </FormColumn>
            {employee?.changed && (
                <Alert color="warning">Don't forget to save your changes</Alert>
            )}
        </form>
    )
}

export default EmployeeEdit;
