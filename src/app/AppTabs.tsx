import React from 'react';
import {Nav, NavProps} from "react-bootstrap";
import {Tab} from "./App";

export interface AppTabsProps extends NavProps {
    currentTab: string;
    onChangeTab: (tab: string | null) => void;
    tabs: Tab[]
}


export default function AppTabs({
                                    currentTab,
                                    onChangeTab,
                                    tabs,
                                    ...rest
                                }: AppTabsProps) {
    return (
        <Nav variant="tabs" defaultActiveKey={tabs[0].id} activeKey={currentTab} onSelect={onChangeTab} {...rest}>
            {tabs.map(tab => (
                <Nav.Item key={tab.id}>
                    <Nav.Link eventKey={tab.id}>{tab.title}</Nav.Link>
                </Nav.Item>
            ))}
        </Nav>
    )
}
