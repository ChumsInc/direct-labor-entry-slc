import type {ReactNode} from "react";
import {LocalStore} from "@chumsinc/ui-utils";
import {STORAGE_KEYS} from "@/utils/appStorage.ts";
import VersionNo from "@/ducks/version/VersionNo.tsx";

export interface Tab {
    id: string,
    title: string | ReactNode,

    /** Bootstrap icon className */
    icon?: string,

    canClose?: boolean,
    disabled?: boolean,
}

export const TAB_SLC_ENTRY = 'slcEntry';
export const TAB_REPORTS = 'reports';
export const TAB_EMPLOYEES = 'employees';
export const TAB_ANALYSIS = 'analysis';
export const TAB_ABOUT = 'about';

export const currentTab = LocalStore.getItem(STORAGE_KEYS.TAB, TAB_SLC_ENTRY);

export const appTabs: Tab[] = [
    {id: TAB_SLC_ENTRY, title: 'SLC Entry'},
    {id: TAB_REPORTS, title: 'Reports'},
    {id: TAB_ANALYSIS, title: 'Analysis'},
    {id: TAB_EMPLOYEES, title: 'Employees'},
    {id: TAB_ABOUT, title: <VersionNo/>},
]
