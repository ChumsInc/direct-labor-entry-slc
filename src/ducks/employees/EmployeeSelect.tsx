import React, {ChangeEvent, forwardRef} from "react";
import {useSelector} from "react-redux";
import {selectEmployeeList} from "./selectors";
import {employeeSorter} from "./utils";
import {DLEmployee} from "chums-types";


export interface EmployeeSelectProps {
    value?: string,
    filter?: RegExp,
    onSelect: (employee: DLEmployee | null) => void,
    required?: boolean,
    form?: string | undefined,
}

export default forwardRef(function EmployeeSelect({
                            value,
                            filter,
                            onSelect,
                            required
                        }:EmployeeSelectProps, ref:React.Ref<HTMLSelectElement>) {
    const list = useSelector(selectEmployeeList);
    const visibleList = list.filter(emp => emp.active)
        .filter(emp => !filter || filter.test(emp.Department))
        .sort(employeeSorter({field: 'FullName', ascending: true}));

    const selectHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const [employee] = visibleList.filter(emp => emp.EmployeeNumber === ev.target.value);
        console.log(employee);
        onSelect(employee || null);
    }

    return (
        <select className="form-select form-select-sm"
                onChange={selectHandler}
                onSelect={selectHandler} value={value} required={required} ref={ref}>
            <option value="">Select Employee</option>
            {visibleList.map(emp => <option value={emp.EmployeeNumber}
                                            key={emp.EmployeeNumber}>{emp.FullName}</option>)}
        </select>
    )
})
