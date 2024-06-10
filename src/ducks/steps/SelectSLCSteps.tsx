import React, {ChangeEvent, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {loadSteps} from "./actions";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectStepsLoaded, selectWorkCenterSteps} from "./selectors";
import {stepSorter} from "./utils";
import {MinimalStep} from "../common-types";


export interface SelectSLCStepsProps {
    workCenter: string,
    stepId?: number | null,
    step?: MinimalStep | null;
    value?: string | null,
    onChange: (step: MinimalStep | null) => void,
    required?: boolean,
    disabled?: boolean,
}

const SelectSLCSteps = ({workCenter, value, stepId, step, onChange, required, disabled}: SelectSLCStepsProps) => {
    const dispatch = useAppDispatch();
    const list = useAppSelector(state => selectWorkCenterSteps(state, workCenter));
    const loaded = useSelector(selectStepsLoaded);
    const [steps, setSteps] = useState<MinimalStep[]>([]);

    useEffect(() => {
        if (!loaded) {
            dispatch(loadSteps());
        }
    }, []);

    useEffect(() => {
        let _list: MinimalStep[] = [...list];
        if (step && !step.id) {
            _list = [...list, step];
        }
        const steps = _list.sort(stepSorter({field: "stepCode", ascending: true}));
        setSteps(steps);
    }, [list, workCenter, step]);

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
        <select className="form-select form-select-sm" value={stepId ?? step?.id ?? ''} onChange={changeHandler}
                required={required}
                disabled={disabled}>
            <option value="">Select Step</option>
            {steps.map(step => (<option key={step.id} value={step.id}>{step.stepCode} - {step.description}</option>))}
        </select>
    )
}

export default SelectSLCSteps;
