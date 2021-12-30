import React from "react";
import {Select} from "chums-ducks";
import {SelectProps} from "chums-ducks/dist/components/Select";
import {useSelector} from "react-redux";
import {selectVisibilityFilter} from "./selectors";


const DepartmentFilterSelect:React.FC<SelectProps> = ({bsSize= 'sm', ...props}) => {
    const departmentFilter = useSelector(selectVisibilityFilter);
    return (
        <Select bsSize={bsSize} {...props} value={departmentFilter}>
            <option value="slc">SLC</option>
            <option value="slc-temp">SLC Temps</option>
        </Select>
    )
}
export default DepartmentFilterSelect;
