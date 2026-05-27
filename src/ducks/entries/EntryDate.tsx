import {useAppDispatch} from "@/app/configureStore";
import {useSelector} from "react-redux";
import {selectEntryDate} from "./selectors";
import {setEntryDate} from "./actions";
import type {ChangeEvent} from "react";
import {Col, FormControl, FormGroup, FormLabel, Row} from "react-bootstrap";
import {currentSLCWorkDay} from "@/utils/workDays.ts";
import {LocalStore} from "@chumsinc/ui-utils";
import {STORAGE_KEYS} from "@/utils/appStorage.ts";

const EntryDate = () => {
    const dispatch = useAppDispatch();
    const entryDate = useSelector(selectEntryDate);

    const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
        LocalStore.setItem(STORAGE_KEYS.SLC_ENTRY_DATE, ev.target.value)
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
                                 value={entryDate ?? currentSLCWorkDay()} onChange={onChange}/>
                </Col>
            </FormGroup>
        </div>
    )
}

export default EntryDate;
