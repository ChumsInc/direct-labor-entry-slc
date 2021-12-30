import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentEntry} from "../entries/selectors";
import {selectWorkOrder} from "./index";
import {WOOperationDetail} from "../common-types";
import numeral from "numeral";
import {selectEntryAction, updateEntryAction} from "../entries/actions";
import classNames from "classnames";

export interface WorkOrderRowsProps {
    onSelect: () => void,
}

const WorkOrderRows:React.FC<WorkOrderRowsProps> = ({onSelect}) => {
    const dispatch = useDispatch();
    const entry = useSelector(selectCurrentEntry);
    const workOrder = useSelector(selectWorkOrder);

    if (!workOrder || !workOrder.operationDetail) {
        return null;
    }

    const onSelectRow = (row:WOOperationDetail) => {
        if (!row.idSteps) {
            return;
        }
        dispatch(updateEntryAction({
            ...entry,
            ItemCode: workOrder.ItemBillNumber,
            WarehouseCode: workOrder.ParentWhse,
            DocumentNo: workOrder.WorkOrder,
            DocumentType: 'WO',
            WorkCenter: row.WorkCenter,
            idSteps: row.idSteps,
        }));
        onSelect();
    }

    return (
        <>
            {workOrder.operationDetail.map((row: WOOperationDetail, index: number) => (
                <tr key={index} onClick={() => onSelectRow(row)}
                    className={classNames({'text-danger': !row.idSteps, 'text-primary': !!row.idSteps})} title={!!row.idSteps ? 'Select Entry' : 'Entry has no assigned step.'}>
                    <td>{row.WorkCenter}</td>
                    <td>{row.OperationCode}</td>
                    <td>{row.OperationDescription}</td>
                    <td className="text-end">{numeral(row.StandardAllowedMinutes).format('0.0000')}</td>
                    <td className="text-end">{numeral(row.StdRatePiece).format('0.0000')}</td>
                </tr>
            ))}
        </>
    )
}

export default WorkOrderRows;
