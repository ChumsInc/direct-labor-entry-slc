import React, {ChangeEvent} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ReportGroupingId} from "./types";
import {selectGroupBy, selectLowerGroupBy} from "./selectors";
import {changeGroupByAction} from "./actions";

const options = [
    {value: 'WorkCenter', text: 'Work Center'},
    {value: 'EntryDate', text: 'Entry Date'},
    {value: 'EmployeeNumber', text: 'Employee'},
    {value: 'StepCode', text: 'Step Code'},
    {value: 'DocumentNo', text: 'Document'},
    {value: 'ItemCode', text: 'Item Code'},
    {value: 'WarehouseCode', text: 'Warehouse'},
    {value: 'idEntries', text: 'Entry'},
];

export interface GroupBySelectProps {
    groupId: ReportGroupingId,
    onChange: () => void,
}
const GroupBySelect:React.FC<GroupBySelectProps> = ({groupId, onChange}) => {
    const dispatch = useDispatch();
    const value = useSelector(selectGroupBy(groupId));
    const lower = useSelector(selectLowerGroupBy(groupId));

    const changeHandler = (ev:ChangeEvent<HTMLSelectElement>) => {
        dispatch(changeGroupByAction(groupId, ev.target.value));
        onChange();
    }

    const disabled = !!lower.length && lower[lower.length - 1] === '';
    return (
        <div className="col-auto">
            <select value={value} className="form-select form-select-sm"
                    onChange={(val) => changeHandler(val)} disabled={disabled}>
                <option value="">-</option>
                {options.map(opt => (
                    <option value={opt.value} key={opt.value} disabled={lower.includes(opt.value)}>
                        {opt.text}
                    </option>
                ))}
            </select>
        </div>
    )
};

export default GroupBySelect;
