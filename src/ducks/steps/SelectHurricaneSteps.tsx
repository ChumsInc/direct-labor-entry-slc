import React, {ChangeEvent, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchSteps, selectHurricaneSteps, selectLoading} from "./index";

export interface SelectHurricaneStepsProps {
    value: string|number|null,
    onChange: (ev:ChangeEvent<HTMLSelectElement>) => void,
}

const SelectHurricaneSteps:React.FC<SelectHurricaneStepsProps> = ({value, onChange}) => {
    const dispatch = useDispatch();
    const steps = useSelector(selectHurricaneSteps);
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

export default SelectHurricaneSteps;
