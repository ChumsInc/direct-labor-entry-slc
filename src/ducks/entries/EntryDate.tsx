import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectEntryDate} from "./selectors";
import {setEntryDate} from "./actions";
import React, {ChangeEvent} from "react";
import {Col, FormControl, FormGroup, FormLabel, Row} from "react-bootstrap";
import dayjs from "dayjs";

const EntryDate = () => {
    const dispatch = useAppDispatch();
    const entryDate = useSelector(selectEntryDate);

    const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.valueAsDate && dayjs(ev.target.valueAsDate).isValid()) {
            dispatch(
                setEntryDate(
                    dayjs(ev.target.value)
                        .add(ev.target.valueAsDate.getTimezoneOffset(), 'minutes')
                        .format('YYYY-MM-DD'))
            );
            return;
        }
        dispatch(setEntryDate(ev.target.value));
    }

    return (
        <div>
            <FormGroup as={Row}>
                <FormLabel column sm={4}>
                    <h4>Entry Date</h4>
                </FormLabel>
                <Col>
                    <FormControl type="date" form="entry-form--slc" required={true}
                                 value={dayjs(entryDate).format('YYYY-MM-DD')} onChange={onChange}/>
                </Col>
            </FormGroup>
        </div>
    )
}

export default EntryDate;
