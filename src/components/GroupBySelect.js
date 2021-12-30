import React from 'react';
import Select from "../common-components/Select";

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

const GroupBySelect = ({field, value, onChange, selected = [], disabled = false}) => {
    return (
        <div className="col-auto">
            <Select value={value} onChange={(val) => onChange(val)} field={field} disabled={disabled}>
                <option value="">-</option>
                {options.map(opt => (
                    <option value={opt.value} key={opt.value}
                            disabled={selected.includes(opt.value)}>{opt.text}</option>
                ))}
            </Select>
        </div>
    )
};

export default GroupBySelect;
