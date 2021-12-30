import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import EmployeeTotals from "./EmployeeTotals";
import {selectEntryDate} from "./selectors";
import {fetchEntriesAction, selectWorkCenterAction, setEntryDateAction} from "./actions";
import SLCEntryForm from "./SLCEntryForm";
import {previousSLCWorkDay} from "../../utils/workDays";
import SLCEmployeeEntries from "./SLCEmployeeEntries";


const SLCEntryTab: React.FC = () => {
    const dispatch = useDispatch();
    const entryDate = useSelector(selectEntryDate);

    useEffect(() => {
        dispatch(setEntryDateAction(previousSLCWorkDay()));
        dispatch(selectWorkCenterAction(['INH', 'IMP', 'CON']));
    }, [])

    useEffect(() => {
        dispatch(fetchEntriesAction());
    }, [entryDate])

    return (
        <div className="row g-3">
            <div className="col-12 col-xl-3">
                <EmployeeTotals/>
            </div>
            <div className="col-6 col-md-4 col-xl-3">
                <SLCEntryForm/>
            </div>
            <div className="col-6 col-md-8 col-xl-6">
                <SLCEmployeeEntries/>
            </div>
        </div>
    );
}

export default SLCEntryTab;
