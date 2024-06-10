import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectEntryDate} from "./selectors";
import {setEntryDate} from "./actions";
import {DateInput, FormColumn, LocalStore} from "chums-components";
import React from "react";
import {storeEntryDate} from "../../contants";

const EntryDate = () => {
    const dispatch = useAppDispatch();
    const entryDate = useSelector(selectEntryDate);

    const onChangeEntryDate = (date: Date | null) => {
        if (date) {
            LocalStore.setItem(storeEntryDate, date.toISOString());
        } else {
            LocalStore.removeItem(storeEntryDate);
        }
        dispatch(setEntryDate(date?.toISOString() || null));
    }

    return (
        <div>
            <FormColumn width={8} label={<h4>Entry Date</h4>}>
                <DateInput date={entryDate} onChangeDate={onChangeEntryDate}
                           form="entry-form--slc"
                           required={true}/>
            </FormColumn>
        </div>
    )
}

export default EntryDate;
