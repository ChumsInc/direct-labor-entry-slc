import {type ChangeEvent} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectMaxDate, selectMinDate} from "../selectors.ts";
import {inputDate} from "@/utils/date.ts";
import {setMaxDate, setMinDate} from "../actions.ts";
import dayjs from "dayjs";
import {FormControl, type FormControlProps} from "react-bootstrap";

export type ReportMaxDateProps = Omit<FormControlProps, 'value'|'onChange'|'type'>;
const ReportMaxDate = (props:ReportMaxDateProps) => {
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
        <FormControl type="date" size="sm"
                     value={dayjs(maxDate).format('YYYY-MM-DD')} onChange={onChangeMaxDate}
                     {...props}/>
    )
}

export default ReportMaxDate;
