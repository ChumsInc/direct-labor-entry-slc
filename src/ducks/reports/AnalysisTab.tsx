import React, {ChangeEvent, FormEvent, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    selectFilterEmployee,
    selectFilterItem,
    selectHTML,
    selectMaxDate,
    selectMinDate,
    selectWorkCenter
} from "./selectors";
import {HTMLReportType} from "./types";
import {
    fetchHTMLReportAction,
    fetchReportDataAction,
    maxDateChangedAction,
    minDateChangedAction, filterEmployeeAction, filterItemAction,
    workCenterChangedAction
} from "./actions";
import {format} from "date-fns";
import {WORK_CENTERS} from "../../constants/reports";
import EmployeeSelect from "../employees/EmployeeSelect";
import {selectCurrentEmployee} from "../employees/selectors";
import {InputGroup} from "chums-ducks";
import AnalysisFilters from "./AnalysisFilters";
import AnalysisReport from "./AnalysisReport";


const AnalysisTab:React.FC = () => {

    return (
        <div>
            <AnalysisFilters />
            <div className="mt-4">
                <AnalysisReport />
            </div>
        </div>
    )
}

export default AnalysisTab;
