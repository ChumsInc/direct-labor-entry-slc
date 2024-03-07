import React, {ChangeEvent} from 'react';
import {format} from "date-fns";
import {useDispatch, useSelector} from "react-redux";
import {selectMaxDate, selectMinDate} from "./selectors";
import {inputDate} from "../../utils/date";
import {setMaxDate, setMinDate} from "./actions";

const ReportMinDate:React.FC = () => {
    const dispatch = useDispatch();
    const minDate = useSelector(selectMinDate);
    const maxDate = useSelector(selectMaxDate);

    const onChangeMinDate = (ev: ChangeEvent<HTMLInputElement>) => {
        let d = ev.target.valueAsDate;
        if (!d) {
            return;
        }
        d = inputDate(d)
        if (d > new Date(maxDate)) {
            dispatch(setMaxDate(minDate));
        }
        dispatch(setMinDate(d.toISOString()));
    }

    return (
        <input type="date" value={format(new Date(minDate), 'y-MM-dd')}
               className="form-control form-control-sm" onChange={onChangeMinDate}/>
    )
}

export default ReportMinDate;
