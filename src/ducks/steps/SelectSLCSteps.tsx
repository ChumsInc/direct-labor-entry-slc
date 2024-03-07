import React, {ChangeEvent, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {loadSteps} from "./actions";
import {Step} from "../common-types";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectStepsLoaded, selectStepsLoading, selectWorkCenterSteps} from "./selectors";
import {stepSorter} from "./utils";

export interface SelectSLCStepsProps {
    workCenter: string,
    stepId?: number | null,
    value?: string | null,
    onChange: (step: Step | null) => void,
    required?: boolean,
    disabled?: boolean,
}

const SelectSLCSteps = ({workCenter, value, stepId, onChange, required, disabled}: SelectSLCStepsProps) => {
    const dispatch = useAppDispatch();
    const list = useAppSelector(state => selectWorkCenterSteps(state, workCenter));
    const loading = useSelector(selectStepsLoading);
    const loaded = useSelector(selectStepsLoaded);
    const [steps, setSteps] = useState<Step[]>([]);

    useEffect(() => {
        if (!loaded) {
            dispatch(loadSteps());
        }
    }, []);

    useEffect(() => {
        const steps = list.filter(step => !workCenter || step.workCenter === workCenter)
            .sort(stepSorter({field: "stepCode", ascending: true}));
        setSteps(steps);
    }, [list, workCenter]);

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        if (!ev.target.value) {
            onChange(null);
        }
        const id = Number(ev.target.value);
        const [step] = steps.filter(step => step.id === id);
        onChange(step || null);
    }

    if (!stepId && !!value) {
        const [step] = steps.filter(s => s.stepCode === value);
        stepId = step.id;
    }

    return (
        <select className="form-select form-select-sm" value={stepId || ''} onChange={changeHandler} required={required}
                disabled={disabled}>
            <option value="">Select Step</option>
            {steps.map(step => (<option key={step.id} value={step.id}>{step.stepCode} - {step.description}</option>))}
        </select>
    )
}

export default SelectSLCSteps;
