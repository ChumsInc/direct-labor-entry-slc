import React, {ChangeEvent, Ref} from "react";
import {Employee} from "../common-types";
import {useSelector} from "react-redux";
import {selectEmployeeList} from "./selectors";
import {employeeSorter} from "./actionTypes";
import {Select} from "chums-ducks";


export interface EmployeeSelectProps {
    value?: string,
    filter?: RegExp,
    onSelect: (employee:Employee|null) => void,
    required?: boolean,
    myRef?: Ref<HTMLSelectElement>
    form?: string|undefined,
}

const EmployeeSelect:React.FC<EmployeeSelectProps> = ({value, filter, onSelect, required, myRef}) => {
    const list = useSelector(selectEmployeeList);
    const visibleList = list.filter(emp => emp.active)
        .filter(emp => !filter || filter.test(emp.Department))
        .sort(employeeSorter({field: 'FullName', ascending: true}));

    const selectHandler = (ev:ChangeEvent<HTMLSelectElement>) => {
        const [employee] = visibleList.filter(emp => emp.EmployeeNumber === ev.target.value);
        onSelect(employee || null);
    }

    return (
        <select className="form-select form-select-sm"
                onChange={selectHandler}
                onSelect={selectHandler} value={value} required={required} ref={myRef}>
            <option value="">Select Employee</option>
            {visibleList.map(emp => <option value={emp.EmployeeNumber} key={emp.EmployeeNumber}>{emp.FullName}</option>)}
        </select>
    )
}

export default EmployeeSelect;
