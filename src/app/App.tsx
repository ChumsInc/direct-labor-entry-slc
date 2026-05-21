import {useEffect, useState} from 'react';
import {useAppDispatch} from "./configureStore";
import {loadEmployees} from "../ducks/employees/actions";
import AlertList from '../components/AlertList';
import SLCEntryTab from "../ducks/entries/SLCEntryTab";
import EmployeeTab from "../ducks/employees/EmployeesTab";
import ReportTab from "../ducks/reports/ReportTab";
import AnalysisTab from "@/ducks/analysis/components/AnalysisTab.tsx";
import {STORAGE_KEYS} from "../utils/appStorage";
import {ErrorBoundary} from "react-error-boundary";
import ErrorBoundaryFallbackAlert from "../components/ErrorBoundaryFallbackAlert";
import ChangeLog from "../ducks/version/ChangeLog";
import AppTabs from "./AppTabs";
import {LocalStore} from "@chumsinc/ui-utils";
import {
    appTabs,
    currentTab,
    TAB_ABOUT,
    TAB_ANALYSIS,
    TAB_EMPLOYEES,
    TAB_REPORTS,
    TAB_SLC_ENTRY
} from "@/app/app-tabs.tsx";
import styled from "@emotion/styled";

const AppContainer = styled.div`
    .table {
        &.table-selectable tbody tr {
            td {
                cursor: pointer;
            }
            &.text-danger  td {
                cursor: not-allowed;
            }
        }
        tfoot tr td {
            font-weight: bold;
        }
    }

    @media print {
        .hidden-print {
            display: none;
        }
        .container {
            max-width: 100%;
        }
        table tbody.employee {
            display: block;
            page-break-after: always;
            width: 100%;
        }
    }
    footer {
        display: none;
    }
`

const App = () => {
    const dispatch = useAppDispatch();
    const [tab, setTab] = useState<string>(currentTab ?? TAB_SLC_ENTRY);

    useEffect(() => {
        dispatch(loadEmployees());
    }, [dispatch]);

    const tabChangeHandler = (tab: string | null) => {
        LocalStore.setItem(STORAGE_KEYS.TAB, tab ?? appTabs[0].id);
        setTab(tab ?? appTabs[0].id);
    }

    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
            <AppContainer>

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
            </AppContainer>
        </ErrorBoundary>
    )
}

export default App;
