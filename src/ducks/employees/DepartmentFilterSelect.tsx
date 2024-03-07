import React from "react";
import {Select, SelectProps} from "chums-components";
import {useAppSelector} from "../../app/configureStore";
import {selectEmployeeDepartment} from "./selectors";


const DepartmentFilterSelect = ({bsSize= 'sm', ...props}:SelectProps) => {
    const departmentFilter = useAppSelector(selectEmployeeDepartment);
    return (
        <Select bsSize={bsSize} {...props} value={departmentFilter}>
            <option value="all">All</option>
            <option value="slc">SLC</option>
            <option value="slc-temp">SLC Temps</option>
        </Select>
    )
}
export default DepartmentFilterSelect;
