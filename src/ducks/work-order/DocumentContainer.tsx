import React from "react";
import {useSelector} from "react-redux";
import {selectITOrders, selectWorkOrder} from "./index";
import WorkOrderRows from "./WorkOrderRows";
import ITOrderRows from "./ITOrderRows";
import {ErrorBoundary} from "chums-ducks";

export interface DocumentContainerProps {
    onSelect: () => void,
}

const  DocumentContainer: React.FC<DocumentContainerProps> = ({onSelect}) => {
    const workOrder = useSelector(selectWorkOrder);
    const itOrders = useSelector(selectITOrders);

    return (
        <div>
            {!!workOrder && (
                <div><strong>{workOrder.ParentWhse}/{workOrder.ItemBillNumber}</strong></div>
            )}
            {itOrders.map(it => (
                <div><strong>{it.WarehouseCode}/{it.ItemCode}</strong></div>
            ))}
            <ErrorBoundary>
                <table className="table table-xs table-selectable ">
                    <thead>
                    <tr>
                        <th>W/C</th>
                        <th>Op Code</th>
                        <th>Description</th>
                        <th className="text-end">SAM</th>
                        <th className="text-end">Cost</th>
                    </tr>
                    </thead>
                    <tbody>
                    <WorkOrderRows onSelect={onSelect}/>
                    <ITOrderRows onSelect={onSelect}/>
                    </tbody>
                </table>
            </ErrorBoundary>
        </div>
    )
}
export default DocumentContainer;
