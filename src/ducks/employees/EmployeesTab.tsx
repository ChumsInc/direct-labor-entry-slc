import React, {useEffect} from 'react';
import {loadEmployees} from './actions';

import EmployeeList from './EmployeeList';
import EmployeeEdit from './EmployeeEdit';
import {ErrorBoundary} from "react-error-boundary";
import ErrorBoundaryFallbackAlert from "../../components/ErrorBoundaryFallbackAlert";
import {useAppDispatch} from "../../app/configureStore";

const EmployeesTab = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(loadEmployees())
    }, [])


    return (
        <div>
            <h3>Employee List</h3>
            <div className="row g-3">
                <div className="col-sm-6">
                    <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
                        <EmployeeList/>
                    </ErrorBoundary>
                </div>
                <div className="col-sm-6">
                    <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
                        <EmployeeEdit/>
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
}


export default EmployeesTab;
