import React from "react";
import {useAppSelector} from "../../app/configureStore";
import {selectEmployeeDepartment} from "./selectors";
import {FormSelect, FormSelectProps} from "react-bootstrap";


const DepartmentFilterSelect = ({size, ...props}: FormSelectProps) => {
    const departmentFilter = useAppSelector(selectEmployeeDepartment);
    return (
        <FormSelect size={size} {...props} value={departmentFilter}>
            <option value="all">All</option>
            <option value="slc">SLC</option>
            <option value="slc-temp">SLC Temps</option>
        </FormSelect>
    )
}
export default DepartmentFilterSelect;
