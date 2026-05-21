import {useSelector} from "react-redux";
import WorkTicketSteps from "./WorkTicketSteps";
import ITOrderRows from "./ITOrderRows";
import {ErrorBoundary} from "react-error-boundary";
import ErrorBoundaryFallbackAlert from "../../components/ErrorBoundaryFallbackAlert";
import {selectITOrders, selectWorkTicket} from "./selectors";

export interface DocumentContainerProps {
    onSelect: () => void,
}

const  DocumentContainer = ({onSelect}:DocumentContainerProps) => {
    const workTicket = useSelector(selectWorkTicket);
    const itOrders = useSelector(selectITOrders);

    return (
        <div>
            {!!workTicket && (
                <div className="row g-3">
                    <div className="col">
                        <strong>{workTicket.ParentWarehouseCode}/{workTicket.ParentItemCode}</strong>
                    </div>
                    <div className="col-auto">
                        <span className="text-secondary">{workTicket.ParentItemCodeDesc}</span>
                        {workTicket.WorkTicketStatus === 'C' && (
                            <span className="ms-1 badge bg-danger">Closed</span>
                        )}
                    </div>
                </div>
            )}
            {itOrders.map(it => (
                <div key={it.PurchaseOrderNo}><strong>{it.WarehouseCode}/{it.ItemCode}</strong></div>
            ))}
            <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
                <table className="table table-xs table-selectable ">
                    <thead>
                    <tr>
                        <th>W/C</th>
                        <th>Activity</th>
                        <th>Description</th>
                        <th className="text-end">SAM</th>
                        <th className="text-end">Cost</th>
                    </tr>
                    </thead>
                    <tbody>
                    <WorkTicketSteps onSelect={onSelect}/>
                    <ITOrderRows onSelect={onSelect}/>
                    </tbody>
                </table>
            </ErrorBoundary>
        </div>
    )
}
export default DocumentContainer;
