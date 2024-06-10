import React from "react";
import {useSelector} from "react-redux";
import {selectWorkTicket} from "./selectors";
import numeral from "numeral";
import {updateEntry} from "../entries/actions";
import classNames from "classnames";
import {useAppDispatch} from "../../app/configureStore";
import {WorkTicketDetail} from "chums-types";
import Decimal from "decimal.js";

export interface WorkTicketStepsProps {
    onSelect: () => void,
}

const WorkTicketSteps = ({onSelect}: WorkTicketStepsProps) => {
    const dispatch = useAppDispatch();
    const workTicket = useSelector(selectWorkTicket);

    if (!workTicket || !workTicket.operationDetail) {
        return null;
    }

    const onSelectRow = (row: WorkTicketDetail) => {
        // if (!row.idSteps) {
        //     return;
        // }
        dispatch(updateEntry({
            ItemCode: workTicket.ParentItemCode ?? '',
            WarehouseCode: workTicket.ParentWarehouseCode ?? '',
            DocumentNo: workTicket.WorkTicketNo,
            DocumentType: 'WT',
            WorkCenter: row.WorkCenter ?? '',
            StepCode: row.StepCode ?? row.ActivityCode ?? '',
            TemplateNo: workTicket.TemplateNo ?? '',
            StepNo: row.StepNo ?? '',
            ActivityCode: row.ActivityCode ?? '',
            Description: row.stepDescription ?? row.ActivityDesc ?? '',
            idSteps: row.idSteps ?? 0,
            StandardAllowedMinutes: row.StandardAllowedMinutes ?? row.expectedSAM ?? 0,

        }));
        onSelect();
    }

    const rowClassName = (row: WorkTicketDetail): string => classNames({
        'text-danger': !row.idSteps && new Decimal(row.expectedSAM ?? 0).lessThanOrEqualTo(0),
        'text-warning': !row.idSteps && new Decimal(row.expectedSAM ?? 0).gt(0),
        'text-primary': !!row.idSteps
    })
    return (
        <>
            {workTicket.operationDetail.map((row, index: number) => (
                <tr key={index} onClick={() => onSelectRow(row)}
                    className={rowClassName(row)}
                    title={row.idSteps > 0 ? 'Select Entry' : 'Activity has no D/L Step; SAM is estimated.'}>
                    <td>{row.WorkCenter}</td>
                    <td>
                        {row.ActivityCode}
                    </td>
                    <td>{row.ActivityDesc}</td>
                    <td className="text-end">{numeral(row.StandardAllowedMinutes ?? row.expectedSAM).format('0.0000')}</td>
                    <td className="text-end">{numeral(row.UnitCost ?? 0).format('0.0000')}</td>
                </tr>
            ))}
        </>
    )
}

export default WorkTicketSteps;
