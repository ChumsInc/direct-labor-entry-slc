import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import EmployeeTotals from "./EmployeeTotals";
import {selectEntryDate} from "./selectors";
import {loadEntries, setWorkCenters} from "./actions";
import SLCEntryForm from "./SLCEntryForm";
import SLCEmployeeEntries from "./SLCEmployeeEntries";
import {useAppDispatch} from "../../app/configureStore";
import EntryDate from "./EntryDate";


const SLCEntryTab = () => {
    const dispatch = useAppDispatch();
    const entryDate = useSelector(selectEntryDate);

    useEffect(() => {
        dispatch(setWorkCenters(['INH', 'IMP', 'CON']));
    }, [])

    useEffect(() => {
        if (entryDate) {
            dispatch(loadEntries({entryDate}));
        }
    }, [entryDate])

    return (
        <div className="row g-3">
            <div className="col-12 col-xl-3">
                <EmployeeTotals/>
            </div>
            <div className="col-6 col-md-4 col-xl-3">
                <EntryDate/>
                <hr/>
                <SLCEntryForm/>
            </div>
            <div className="col-6 col-md-8 col-xl-6">
                <SLCEmployeeEntries/>
            </div>
        </div>
    );
}

export default SLCEntryTab;
