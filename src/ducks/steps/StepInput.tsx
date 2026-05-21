import {type ChangeEvent, startTransition, useEffect, useId, useState} from "react";
import InputGroup from "react-bootstrap/InputGroup";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectStepsList, selectStepsLoaded} from "./selectors";
import {loadSteps} from "./actions";
import {stepSorter} from "./utils";
import type {DLStep} from "chums-types";
import {FormControl, type FormControlProps} from "react-bootstrap";

export interface StepInputProps extends Omit<FormControlProps, 'value' | 'onChange' | 'id' | 'list'> {
    value: string,
    workCenter: string,
    onChange: (ev: ChangeEvent<HTMLInputElement>) => void,
}

const StepInput = ({value, onChange, workCenter, ...rest}: StepInputProps) => {
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectStepsList);
    const [steps, setSteps] = useState<DLStep[]>([])
    const loaded = useAppSelector(selectStepsLoaded);
    const id = useId();
    const inputId = useId();

    useEffect(() => {
        startTransition(() => {
            const steps = list.filter(step => !workCenter || step.workCenter === workCenter)
                .sort(stepSorter({field: 'stepCode', ascending: true}));
            setSteps(steps);
        })
    }, [workCenter, list]);

    useEffect(() => {
        if (!loaded) {
            dispatch(loadSteps());
        }
    }, [loaded, dispatch]);

    return (
        <>
            <InputGroup size="sm">
                <InputGroup.Text as="label" htmlFor={inputId} aria-label="D/L Step">
                    <span className="bi-diagram-3-fill" aria-hidden/>
                </InputGroup.Text>
                <FormControl type="search" size="sm" value={value} onChange={onChange}
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
