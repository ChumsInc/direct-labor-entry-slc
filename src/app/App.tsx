import React, {ReactNode, useEffect, useState} from 'react';
import {useAppDispatch} from "./configureStore";
import {loadEmployees} from "../ducks/employees/actions";
import AlertList from '../components/AlertList';
import SLCEntryTab from "../ducks/entries/SLCEntryTab";
import EmployeeTab from "../ducks/employees/EmployeesTab";
import ReportTab from "../ducks/reports/ReportTab";
import AnalysisTab from "../ducks/analysis/AnalysisTab";
import {appStorage, STORAGE_KEYS} from "../utils/appStorage";
import {ErrorBoundary} from "react-error-boundary";
import ErrorBoundaryFallbackAlert from "../components/ErrorBoundaryFallbackAlert";
import VersionNo from "../ducks/version/VersionNo";
import ChangeLog from "../ducks/version/ChangeLog";
import AppTabs from "./AppTabs";

export interface Tab {
    id: string,
    title: string|ReactNode,

    /** Bootstrap icon className */
    icon?: string,

    canClose?: boolean,
    disabled?: boolean,
}

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

    const tabChangeHandler = (tab:string|null) => {
        appStorage.setItem(STORAGE_KEYS.TAB, tab ?? appTabs[0].id);
        setTab(tab ?? appTabs[0].id);
    }

    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
            <div>

                <AppTabs tabs={appTabs} currentTab={tab} onChangeTab={tabChangeHandler} className="mb-3"/>
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
