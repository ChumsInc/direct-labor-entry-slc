import React, {ChangeEvent, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchSteps, selectLoading, selectSLCSteps} from "./index";

export interface SelectSLCStepsProps {
    workCenter: string,
    value: string | number | null,
    onChange: (ev: ChangeEvent<HTMLSelectElement>) => void,
}

const SelectSLCSteps: React.FC<SelectSLCStepsProps> = ({workCenter, value, onChange}) => {
    const dispatch = useDispatch();
    const steps = useSelector(selectSLCSteps(workCenter));
    const loading = useSelector(selectLoading);

    useEffect(() => {
        if (!loading && !steps.length) {
            dispatch(fetchSteps());
        }
    }, [])

    return (
        <select className="form-select form-select-sm" value={value || ''} onChange={onChange} required>
            <option value="">Select Step</option>
            {steps.map(step => (<option key={step.id} value={step.id}>{step.stepCode} - {step.description}</option>))}
        </select>
    )
}

export default SelectSLCSteps;
