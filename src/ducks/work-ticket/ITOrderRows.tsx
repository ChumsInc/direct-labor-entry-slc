import React from "react";
import {useSelector} from "react-redux";
import {selectCurrentEntry} from "../entries/selectors";
import {selectITOrders} from "./selectors";
import {ITOrder} from "../common-types";
import numeral from "numeral";
import {updateEntry} from "../entries/actions";
import classNames from "classnames";
import {useAppDispatch} from "../../app/configureStore";

export interface ITOrderRowsProps {
    onSelect: () => void,
}

const ITOrderRows = ({onSelect}: ITOrderRowsProps) => {
    const dispatch = useAppDispatch();
    const entry = useSelector(selectCurrentEntry);
    const itOrders = useSelector(selectITOrders);

    const onSelectRow = (row: ITOrder) => {
        if (!entry) {
            return;
        }
        dispatch(updateEntry({
            ItemCode: row.ItemCode,
            WarehouseCode: row.WarehouseCode,
            DocumentNo: row.PurchaseOrderNo,
            DocumentType: 'IT',
            WorkCenter: row.WorkCenter || '',
            idSteps: row.idSteps,
            StandardAllowedMinutes: row.StandardAllowedMinutes,
            Description: row.OperationDescription,
        }));
        onSelect();
    }

    return (
        <>
            {itOrders.map((row, index: number) => (
                <tr key={index} onClick={() => onSelectRow(row)}
                    className={classNames({'text-danger': !row.idSteps, 'text-primary': !!row.idSteps})}>
                    <td>{row.WorkCenter}</td>
                    <td>{row.OperationCode}</td>
                    <td>{row.OperationDescription}</td>
                    <td className="text-end">{numeral(row.StandardAllowedMinutes).format('0.0000')}</td>
                    <td className="text-end">{numeral(row.StepCost).format('0.0000')}</td>
                </tr>
            ))}
        </>
    )
}

export default ITOrderRows;
