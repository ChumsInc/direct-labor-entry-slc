/**
 * Created by steve on 2/9/2017.
 */

import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import EmployeeTab from '../ducks/employees/EmployeesTab';
import SLCEntryTab from '../ducks/entries/SLCEntryTab';

import ReportTab from '../ducks/reports/ReportTab';

import {AlertList, selectCurrentTab, Tab, TabList, tabListCreatedAction} from "chums-ducks";
import {fetchEmployees} from "../ducks/employees/actions";
import {appStorage, STORAGE_KEYS} from "../utils/appStorage";
import AnalysisTab from "../ducks/reports/AnalysisTab";

const TAB_HURRICANE_ENTRY = 'hurricaneEntry';
const TAB_SLC_ENTRY = 'slcEntry';
const TAB_REPORTS = 'reports';
const TAB_EMPLOYEES = 'employees';
const TAB_ANALYSIS = 'analysis';


const tabId = 'direct-labor-entry';
const tabs: Tab[] = [
    {id: TAB_SLC_ENTRY, title: 'SLC Entry'},
    {id: TAB_REPORTS, title: 'Reports'},
    {id: TAB_ANALYSIS, title: 'Analysis'},
    {id: TAB_EMPLOYEES, title: 'Employees'}
];

const currentTab = appStorage.getItem(STORAGE_KEYS.TAB);

const App: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(tabListCreatedAction(tabs, tabId, currentTab || TAB_SLC_ENTRY));
        dispatch(fetchEmployees());
    }, [])

    const tab = useSelector(selectCurrentTab(tabId));

    const selectTabHandler = (id?:string) => {
        appStorage.setItem(STORAGE_KEYS.TAB, id);
    }
    return (
        <div>
            <TabList tabKey={tabId} onSelectTab={selectTabHandler} className="mb-3"/>
            <AlertList/>
            {tab === TAB_SLC_ENTRY && (
                <SLCEntryTab/>
            )}
            {tab === TAB_EMPLOYEES && (
                <EmployeeTab/>
            )}
            {tab === TAB_REPORTS && (
                <ReportTab/>
            )}
            {tab === TAB_ANALYSIS && (
                <AnalysisTab />
            )}
        </div>
    )
}

export default App

//@todo For SLC Entry, add a start/stop time calculator
//@todo Move WO # above minutes/qty
//@todo make real typeahead
//@todo on entering full operation code, the step id is not entered.
//@todo second entry for a person does not save EmployeeNumber
//@todo record WO# or IT #
