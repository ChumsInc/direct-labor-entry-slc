import {type ChangeEvent} from "react";
import {selectEmployeeList} from "./selectors";
import {employeeSorter} from "./utils";
import type {DLEmployee} from "chums-types";
import {FormSelect, type FormSelectProps} from "react-bootstrap";
import {useAppSelector} from "@/app/configureStore";


export interface EmployeeSelectProps extends Omit<FormSelectProps, 'value' | 'onChange'> {
    value?: string,
    filter?: RegExp,
    onChange: (employee: DLEmployee | null) => void,
    ref?: React.ForwardedRef<HTMLSelectElement>
}

function filterVisibleEmployees(list: DLEmployee[], filter?: RegExp): DLEmployee[] {
    return list.filter(emp => emp.active)
        .filter(emp => !filter || filter.test(emp.Department))
        .sort(employeeSorter({field: 'FullName', ascending: true}));
}

export default function EmployeeSelect({
                                           value,
                                           filter,
                                           onChange,
                                           ref,
                                           ...props
                                       }: EmployeeSelectProps) {
    const list = useAppSelector(selectEmployeeList);

    const selectHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const [employee] = list.filter(emp => emp.EmployeeNumber === ev.target.value);
        onChange(employee || null);
    }

    return (
        <FormSelect size="sm"
                    onChange={selectHandler}
                    onSelect={selectHandler} value={value} ref={ref} {...props}>
            <option value="">Select Employee</option>
            {filterVisibleEmployees(list, filter).map(emp => <option value={emp.EmployeeNumber}
                                                                     key={emp.EmployeeNumber}>{emp.FullName}</option>)}
        </FormSelect>
    )
}
