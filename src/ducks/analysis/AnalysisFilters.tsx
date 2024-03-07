import React, {ChangeEvent, FormEvent} from "react";
import {useSelector} from "react-redux";
import {
    selectFilterEmployee,
    selectFilterItem,
    selectFilterOperation,
    selectReportLoading,
    selectWorkCenter
} from "./selectors";
import {
    loadReportData,
    loadReportExcel,
    setFilterEmployee,
    setFilterItem,
    setFilterOperation,
    setWorkCenter
} from "./actions";
import EmployeeSelect from "../employees/EmployeeSelect";
import {InputGroup, SpinnerButton} from "chums-components";
import GroupBySelect from "./GroupBySelect";
import ReportMinDate from "./ReportMinDate";
import ReportMaxDate from "./ReportMaxDate";
import {WORK_CENTERS} from "./constants";
import StepInput from "../steps/StepInput";
import {useAppDispatch} from "../../app/configureStore";

const AnalysisFilters: React.FC = () => {
    const dispatch = useAppDispatch();
    const workCenter = useSelector(selectWorkCenter);
    const employee = useSelector(selectFilterEmployee);
    const operation = useSelector(selectFilterOperation);
    const item = useSelector(selectFilterItem);
    const loading = useSelector(selectReportLoading);

    const onChangeWorkCenter = (ev: ChangeEvent<HTMLSelectElement>) => dispatch(setWorkCenter(ev.target.value));

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(loadReportData())
    }

    const onDownload = () => {
        dispatch(loadReportExcel());
    }

    const onChangeGrouping = () => {
        dispatch(loadReportData());
    }

    const onChangeOperationFilter = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setFilterOperation(ev.target.value || ''));
    }

    return (

        <form onSubmit={onSubmit}>
            <div className="row g-3">

                <div className="col-auto">
                    <InputGroup bsSize="sm">
                        <label className="input-group-text">From</label>
                        <ReportMinDate/>
                    </InputGroup>
                </div>


                <div className="col-auto">
                    <InputGroup bsSize="sm">
                        <label className="input-group-text">To</label>
                        <ReportMaxDate/>
                    </InputGroup>
                </div>


                <div className="col-auto">
                    <InputGroup bsSize="sm">
                        <label className="input-group-text bi-house-door-fill"/>
                        <select value={workCenter} onChange={onChangeWorkCenter} className="form-select form-select-sm">
                            <option value="%">All</option>
                            {WORK_CENTERS.map(wc => (<option key={wc.code} value={wc.code}>{wc.description}</option>))}
                        </select>
                    </InputGroup>
                </div>

                <div className="col-auto">
                    <InputGroup bsSize="sm">
                        <label className="input-group-text bi-person-fill"/>
                        <EmployeeSelect value={employee ?? ''}
                                        onSelect={(emp) => dispatch(setFilterEmployee(emp?.EmployeeNumber || ''))}/>
                    </InputGroup>

                </div>

                <div className="col-auto">
                    <StepInput value={operation ?? ''} onChange={onChangeOperationFilter}/>
                </div>

                <div className="col-auto">
                    <InputGroup bsSize="sm">
                        <label className="input-group-text bi-upc"/>
                        <input type="text" value={item ?? ''} placeholder="item code"
                               className="form-control form-control-sm"
                               onChange={(ev) => dispatch(setFilterItem(ev.target.value))}/>
                    </InputGroup>
                </div>

                <div className="col-auto">
                    <SpinnerButton type="submit" className="btn btn-sm btn-primary"
                                   spinning={loading}>Submit</SpinnerButton>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={onDownload}>Download
                    </button>
                </div>

            </div>
            <div className="row g-3 mt-1">
                <div className="col-auto">Group By</div>
                <div className="col-auto">
                    <GroupBySelect groupId={0} onChange={onChangeGrouping}/>
                </div>
                <div className="col-auto">
                    <GroupBySelect groupId={1} onChange={onChangeGrouping}/>
                </div>
                <div className="col-auto">
                    <GroupBySelect groupId={2} onChange={onChangeGrouping}/>
                </div>
                <div className="col-auto">
                    <GroupBySelect groupId={3} onChange={onChangeGrouping}/>
                </div>
                <div className="col-auto">
                    <GroupBySelect groupId={4} onChange={onChangeGrouping}/>
                </div>
                <div className="col-auto">
                    <GroupBySelect groupId={5} onChange={onChangeGrouping}/>
                </div>
                <div className="col-auto">
                    <GroupBySelect groupId={6} onChange={onChangeGrouping}/>
                </div>
            </div>
        </form>
    )
}

export default AnalysisFilters;
