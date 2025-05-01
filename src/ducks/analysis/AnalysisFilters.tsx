import React, {ChangeEvent, FormEvent, useId} from "react";
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
import GroupBySelect from "./GroupBySelect";
import ReportMinDate from "./ReportMinDate";
import ReportMaxDate from "./ReportMaxDate";
import {WORK_CENTERS} from "./constants";
import StepInput from "../steps/StepInput";
import {useAppDispatch} from "../../app/configureStore";
import InputGroup from "react-bootstrap/InputGroup";
import {FormControl, FormSelect} from "react-bootstrap";
import {SpinnerButton} from "@chumsinc/react-bootstrap-addons";

const AnalysisFilters = () => {
    const dispatch = useAppDispatch();
    const workCenter = useSelector(selectWorkCenter);
    const employee = useSelector(selectFilterEmployee);
    const operation = useSelector(selectFilterOperation);
    const item = useSelector(selectFilterItem);
    const loading = useSelector(selectReportLoading);
    const idMinDate = useId();
    const idMaxDate = useId();
    const idWorkCenter = useId();
    const idEmployee = useId();
    const idItemCode = useId();

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
                    <InputGroup size="sm">
                        <InputGroup.Text as="label" htmlFor={idMinDate}>From</InputGroup.Text>
                        <ReportMinDate id={idMinDate}/>
                    </InputGroup>
                </div>


                <div className="col-auto">
                    <InputGroup size="sm">
                        <InputGroup.Text as="label" htmlFor={idMaxDate}>To</InputGroup.Text>
                        <ReportMaxDate id={idMaxDate}/>
                    </InputGroup>
                </div>


                <div className="col-auto">
                    <InputGroup size="sm">
                        <InputGroup.Text as="label" htmlFor={idWorkCenter} aria-label="Work Center">
                            <span className="bi-house-door-fill" aria-hidden/>
                        </InputGroup.Text>
                        <FormSelect value={workCenter} onChange={onChangeWorkCenter} size="sm" id={idWorkCenter}>
                            <option value="%">All</option>
                            {WORK_CENTERS.map(wc => (<option key={wc.code} value={wc.code}>{wc.description}</option>))}
                        </FormSelect>
                    </InputGroup>
                </div>

                <div className="col-auto">
                    <InputGroup size="sm">
                        <InputGroup.Text as="label" htmlFor={idEmployee} aria-label="Employee">
                            <span className="bi-person-fill" aria-hidden/>
                        </InputGroup.Text>
                        <EmployeeSelect value={employee ?? ''} id={idEmployee}
                                        onChange={(emp) => dispatch(setFilterEmployee(emp?.EmployeeNumber || ''))}/>
                    </InputGroup>

                </div>

                <div className="col-auto">
                    <StepInput value={operation ?? ''} workCenter={workCenter} onChange={onChangeOperationFilter}/>
                </div>

                <div className="col-auto">
                    <InputGroup size="sm">
                        <InputGroup.Text as="label" htmlFor={idItemCode} aria-label="Item Code">
                            <span className="bi-upc" aria-hidden/>
                        </InputGroup.Text>
                        <FormControl type="text" placeholder="item code" size="sm" id={idItemCode}
                                     value={item ?? ''}
                                     onChange={(ev) => dispatch(setFilterItem(ev.target.value))}/>
                    </InputGroup>
                </div>

                <div className="col-auto">
                    <SpinnerButton type="submit" size="sm" variant="primary" spinnerProps={{size: "sm"}}
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
