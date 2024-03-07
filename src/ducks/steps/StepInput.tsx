import React, {ChangeEvent, InputHTMLAttributes, useEffect, useId, useState} from "react";
import {selectWorkCenter} from "../reports/selectors";
import {InputGroup} from "chums-components";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectStepsList, selectStepsLoaded} from "./selectors";
import {Step} from "../common-types";
import {loadSteps} from "./actions";
import {stepSorter} from "./utils";

export interface StepInputProps extends InputHTMLAttributes<HTMLInputElement>{
    value: string,
    onChange: (ev: ChangeEvent<HTMLInputElement>) => void,
}

const StepInput = ({value, onChange, ...rest}:StepInputProps) => {
    const dispatch = useAppDispatch();
    const workCenter = useAppSelector(selectWorkCenter);
    const list = useAppSelector(selectStepsList);
    const [steps, setSteps] = useState<Step[]>([])
    const loaded = useAppSelector(selectStepsLoaded);
    const id = useId();

    useEffect(() => {
        const steps = list.filter(step => !workCenter || step.workCenter === workCenter)
            .sort(stepSorter({field: 'stepCode', ascending: true}));
        setSteps(steps);
    }, [workCenter, list]);

    useEffect(() => {
        if (!loaded) {
            dispatch(loadSteps());
        }
    }, [])

    return (
        <>
            <InputGroup bsSize="sm">
                <label className="input-group-text  bi-diagram-3-fill"/>
                <input type="search" className="form-control form-control-sm" value={value} onChange={onChange}
                       {...rest}
                       list={id} placeholder="D/L Step"/>
            </InputGroup>
            <datalist id={id}>
                {steps.map(step => <option key={step.id} value={step.stepCode}>{step.description}</option>)}
            </datalist>
        </>
    )
}
export default StepInput;
