import React, {ChangeEvent, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchSteps, selectLoading, selectSLCSteps, stepSorter} from "./index";
import {selectWorkCenter} from "../reports/selectors";
import {InputGroup} from "chums-ducks";

export interface StepInput {
    value: string,
    onChange: (ev:ChangeEvent<HTMLInputElement>) => void,
}
const StepInput:React.FC<StepInput> = ({value, onChange}) => {
    const dispatch = useDispatch();
    const workCenter = useSelector(selectWorkCenter);
    const steps = useSelector(selectSLCSteps(workCenter));
    const loading = useSelector(selectLoading);
    useEffect(() => {
        if (!loading && !steps.length) {
            dispatch(fetchSteps());
        }
    }, [])

    return (
        <>
            <InputGroup bsSize="sm">
                <label className="input-group-text  bi-diagram-3-fill"/>
                <input type="search" className="form-control form-control-sm" value={value} onChange={onChange} list="step-search-list" placeholder="D/L Step"/>
            </InputGroup>
            <datalist id="step-search-list">
                {steps.sort(stepSorter).map(step => <option key={step.id} value={step.stepCode}>{step.description}</option>)}
            </datalist>
        </>
    )
}
export default StepInput;
