import {type ChangeEvent} from "react";
import {WORK_CENTERS} from "../constants.ts";
import {useDispatch, useSelector} from "react-redux";
import {selectWorkCenter} from "../selectors.ts";
import {setWorkCenter} from "../actions.ts";

const WorkCenterSelect = () => {
    const dispatch = useDispatch();
    const workCenter = useSelector(selectWorkCenter);
    const onChangeWorkCenter = (ev: ChangeEvent<HTMLSelectElement>) => dispatch(setWorkCenter(ev.target.value));

    return (
        <select value={workCenter} onChange={onChangeWorkCenter} className="form-select form-select-sm">
            <option value="%">All</option>
            {WORK_CENTERS.map(wc => (<option key={wc.code} value={wc.code}>{wc.description}</option>))}
        </select>
    )
}

export default WorkCenterSelect;
