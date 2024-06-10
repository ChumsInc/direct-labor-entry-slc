import React, {useEffect, useState} from 'react';
import {useAppDispatch} from "./configureStore";
import {loadEmployees} from "../ducks/employees/actions";
import {Tab, TabList} from 'chums-components';
import AlertList from '../ducks/alerts/AlertList';
import SLCEntryTab from "../ducks/entries/SLCEntryTab";
import EmployeeTab from "../ducks/employees/EmployeesTab";
import ReportTab from "../ducks/reports/ReportTab";
import AnalysisTab from "../ducks/analysis/AnalysisTab";
import {appStorage, STORAGE_KEYS} from "../utils/appStorage";
import {ErrorBoundary} from "react-error-boundary";
import ErrorBoundaryFallbackAlert from "../ducks/alerts/ErrorBoundaryFallbackAlert";
import VersionNo from "../ducks/version/VersionNo";
import ChangeLog from "../ducks/version/ChangeLog";


const TAB_SLC_ENTRY = 'slcEntry';
const TAB_REPORTS = 'reports';
const TAB_EMPLOYEES = 'employees';
const TAB_ANALYSIS = 'analysis';
const TAB_ABOUT = 'about';

const currentTab = appStorage.getItem(STORAGE_KEYS.TAB);

const appTabs:Tab[] = [
    {id: TAB_SLC_ENTRY, title: 'SLC Entry'},
    {id: TAB_REPORTS, title: 'Reports'},
    {id: TAB_ANALYSIS, title: 'Analysis'},
    {id: TAB_EMPLOYEES, title: 'Employees'},
    {id: TAB_ABOUT, title: <VersionNo />},
]
const App = () => {
    const dispatch = useAppDispatch();
    const [tab, setTab] = useState<string>(currentTab ?? TAB_SLC_ENTRY);

    useEffect(() => {
        dispatch(loadEmployees());
    }, []);

    const tabChangeHandler = (tab:Tab) => {
        appStorage.setItem(STORAGE_KEYS.TAB, tab.id);
        setTab(tab.id);
    }

    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
            <div>
                <TabList tabs={appTabs} currentTabId={tab} onSelectTab={tabChangeHandler} className="mb-3"/>
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
                    <AnalysisTab/>
                )}
                {tab === TAB_ABOUT && (
                    <ChangeLog/>
                )}
            </div>
        </ErrorBoundary>
    )
}

export default App;
