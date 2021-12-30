import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {fetchEmployees} from './actions';

import EmployeeList from './EmployeeList';
import EmployeeEdit from './EmployeeEdit';
import {ErrorBoundary} from "chums-ducks";

const EmployeesTab: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchEmployees())
    })

    const onReload = () => dispatch(fetchEmployees());

    return (
        <div>
            <h3>Employee List</h3>
            <div className="row">
                <div className="col-sm-6">
                    <ErrorBoundary>
                        <EmployeeList/>
                    </ErrorBoundary>
                </div>
                <div className="col-sm-6">
                    <ErrorBoundary>
                        <EmployeeEdit/>
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
}


export default EmployeesTab;
