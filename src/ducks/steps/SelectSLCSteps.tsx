import React, {ChangeEvent, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchSteps, selectLoading, selectSLCSteps} from "./index";
import {Step} from "../common-types";

export interface SelectSLCStepsProps {
    workCenter: string,
    id?: number | null,
    value?: string | null,
    onChange: (step: Step|null) => void,
    required?: boolean,
    disabled?: boolean,
}

const SelectSLCSteps: React.FC<SelectSLCStepsProps> = ({workCenter, value, id, onChange, required, disabled}) => {
    const dispatch = useDispatch();
    const steps = useSelector(selectSLCSteps(workCenter));
    const loading = useSelector(selectLoading);

    useEffect(() => {
        if (!loading && !steps.length) {
            dispatch(fetchSteps());
        }
    }, []);

    const changeHandler = (ev:ChangeEvent<HTMLSelectElement>) => {
        if (!ev.target.value) {
            onChange(null);
        }
        const id = Number(ev.target.value);
        const [step] = steps.filter(step => step.id === id);
        onChange(step || null);
    }

    if (!id && !!value) {
        const [step] = steps.filter(s => s.stepCode === value);
        id = step.id;
    }

    return (
        <select className="form-select form-select-sm" value={id || ''} onChange={changeHandler} required={required}
                disabled={disabled}>
            <option value="">Select Step</option>
            {steps.map(step => (<option key={step.id} value={step.id}>{step.stepCode} - {step.description}</option>))}
        </select>
    )
}

export default SelectSLCSteps;
