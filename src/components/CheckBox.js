import React from 'react';

export const PlainCheckBox = ({checked = false, className = '', field, onChange, label = ''}) => {
    return (
        <input type="checkbox" className={className}
               checked={checked === true}
               aria-label={label} title={label}
               onChange={() => onChange({field, value: !checked})} />
    )
};

export const CheckBoxInline = ({checked = false, label, field, onChange}) => {
    return (
        <CheckBox checked={checked} label={label} field={field} onChange={onChange} className={'form-check form-check-sm form-check-inline'}/>
    )
};

const CheckBox = ({checked, label, field, onChange, className = 'form-check form-check-sm'}) => {
    return (
        <div className={className}>
            <PlainCheckBox checked={checked} className="form-check-input" field={field} label={label}
                           onChange={({field, value}) => onChange({field, value})}/>
            <label className="form-check-label"
                   onClick={() => onChange({field, value: !checked})}>
                {label}
            </label>
        </div>
    )
};

export default CheckBox;
