import React, {ChangeEvent} from 'react';
import {format} from "date-fns";
import {useDispatch, useSelector} from "react-redux";
import {selectMaxDate, selectMinDate} from "./selectors";
import {inputDate} from "../../utils/date";
import {maxDateChangedAction, minDateChangedAction} from "./actions";

const ReportMaxDate:React.FC = () => {
    const dispatch = useDispatch();
    const minDate = useSelector(selectMinDate);
    const maxDate = useSelector(selectMaxDate);

    const onChangeMaxDate = (ev: ChangeEvent<HTMLInputElement>) => {
        let d = ev.target.valueAsDate;
        if (!d) {
            return;
        }
        d = inputDate(d)
        if (d < new Date(minDate)) {
            dispatch(minDateChangedAction(maxDate));
        }
        dispatch(maxDateChangedAction(d.toISOString()));
    }

    return (
        <input type="date" value={format(new Date(maxDate), 'y-MM-dd')}
               className="form-control form-control-sm" onChange={onChangeMaxDate}/>
    )
}

export default ReportMaxDate;
