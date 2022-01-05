import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentEntry} from "../entries/selectors";
import {selectITOrders} from "./index";
import {ITOrder} from "../common-types";
import numeral from "numeral";
import {updateEntryAction} from "../entries/actions";
import classNames from "classnames";

export interface ITOrderRowsProps {
    onSelect: () => void,
}

const ITOrderRows: React.FC<ITOrderRowsProps> = ({onSelect}) => {
    const dispatch = useDispatch();
    const entry = useSelector(selectCurrentEntry);
    const itOrders = useSelector(selectITOrders);

    const onSelectRow = (row: ITOrder) => {
        dispatch(updateEntryAction({
            ...entry,
            ItemCode: row.ItemCode,
            WarehouseCode: row.WarehouseCode,
            DocumentNo: row.PurchaseOrderNo,
            DocumentType: 'IT',
            WorkCenter: row.WorkCenter || '',
            idSteps: row.idSteps,
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
                    <td className="text-end">n/a</td>
                </tr>
            ))}
        </>
    )
}

export default ITOrderRows;
