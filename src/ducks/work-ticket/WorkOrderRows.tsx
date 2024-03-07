import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentEntry} from "../entries/selectors";
import {selectWorkTicket} from "./selectors";
import numeral from "numeral";
import {updateEntry} from "../entries/actions";
import classNames from "classnames";
import {useAppDispatch} from "../../app/configureStore";
import {WorkTicketDetail} from "chums-types";

export interface WorkOrderRowsProps {
    onSelect: () => void,
}

const WorkOrderRows: React.FC<WorkOrderRowsProps> = ({onSelect}) => {
    const dispatch = useAppDispatch();
    const entry = useSelector(selectCurrentEntry);
    const workTicket = useSelector(selectWorkTicket);

    if (!workTicket || !workTicket.operationDetail) {
        return null;
    }

    const onSelectRow = (row: WorkTicketDetail) => {
        if (!row.idSteps) {
            return;
        }
        dispatch(updateEntry({
            ItemCode: workTicket.ParentItemCode ?? '',
            WarehouseCode: workTicket.ParentWarehouseCode ?? '',
            DocumentNo: workTicket.WorkTicketNo,
            DocumentType: 'WT',
            WorkCenter: row.WorkCenter ?? '',
            idSteps: row.idSteps,
            StandardAllowedMinutes: row.StandardAllowedMinutes ?? 0,

        }));
        onSelect();
    }

    return (
        <>
            {workTicket.operationDetail.map((row, index: number) => (
                <tr key={index} onClick={() => onSelectRow(row)}
                    className={classNames({'text-danger': !row.idSteps, 'text-primary': !!row.idSteps})}
                    title={!!row.idSteps ? 'Select Entry' : 'Entry has no assigned step.'}>
                    <td>{row.WorkCenter}</td>
                    <td>{row.ActivityCode}</td>
                    <td>{row.ActivityDesc}</td>
                    <td className="text-end">{numeral(row.StandardAllowedMinutes).format('0.0000')}</td>
                    <td className="text-end">{numeral(row.UnitCost ?? 0).format('0.0000')}</td>
                </tr>
            ))}
        </>
    )
}

export default WorkOrderRows;
