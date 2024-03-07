import React, {ChangeEvent} from 'react';
import {format} from "date-fns";
import {useDispatch, useSelector} from "react-redux";
import {selectMaxDate, selectMinDate} from "./selectors";
import {inputDate} from "../../utils/date";
import {setMaxDate, setMinDate} from "./actions";

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
            dispatch(setMinDate(maxDate));
        }
        dispatch(setMaxDate(d.toISOString()));
    }

    return (
        <input type="date" value={format(new Date(maxDate), 'y-MM-dd')}
               className="form-control form-control-sm" onChange={onChangeMaxDate}/>
    )
}

export default ReportMaxDate;
