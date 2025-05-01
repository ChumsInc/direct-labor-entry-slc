import React, {ChangeEvent} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectMaxDate, selectMinDate} from "./selectors";
import {inputDate} from "../../utils/date";
import {setMaxDate, setMinDate} from "./actions";
import dayjs from "dayjs";
import {FormControl, FormControlProps} from "react-bootstrap";

export type ReportMinDateProps = Omit<FormControlProps, 'value'|'onChange'|'type'>;
const ReportMinDate = (props:ReportMinDateProps) => {
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
        <FormControl size="sm" type="date"
                     value={dayjs(minDate).format('YYYY-MM-DD')} onChange={onChangeMinDate}
                     {...props}/>
    )
}

export default ReportMinDate;
