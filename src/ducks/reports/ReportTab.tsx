import React, {ChangeEvent, FormEvent, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectHTML} from "./selectors";
import {fetchHTMLReportAction} from "./actions";
import {HTMLReportType} from "./types";
import ReportMinDate from "./ReportMinDate";
import ReportMaxDate from "./ReportMaxDate";
import WorkCenterSelect from "./WorkCenterSelect";


const ReportTab: React.FC = () => {
    const dispatch = useDispatch();
    const html = useSelector(selectHTML);
    const [reportType, setReportType] = useState<HTMLReportType>('employee-total')

    const onChangeReportType = (ev: ChangeEvent<HTMLSelectElement>) => setReportType(ev.target.value as HTMLReportType);

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(fetchHTMLReportAction(reportType))
    }

    return (
        <div>
            <form className="row g-3 align-items-baseline" onSubmit={onSubmit}>
                <label className="col-auto">From</label>
                <div className="col-auto">
                    <ReportMinDate/>
                </div>

                <label className="col-auto">To</label>
                <div className="col-auto">
                    <ReportMaxDate/>
                </div>

                <label className="col-auto">Work Center</label>
                <div className="col-auto">
                    <WorkCenterSelect/>
                </div>
                <label className="col-auto">Report Type</label>
                <div className="col-auto">
                    <select value={reportType} onChange={onChangeReportType} className="form-select form-select-sm">
                        <option value="employee-total">Employee Total</option>
                        <option value="step-total">Step Total</option>
                    </select>
                </div>
                <div className="col-auto">
                    <button type="submit" className="btn btn-sm btn-primary">Submit</button>
                </div>
            </form>
            <div className="mt-4 container" dangerouslySetInnerHTML={{__html: html}}/>
        </div>
    )
}

export default ReportTab;
