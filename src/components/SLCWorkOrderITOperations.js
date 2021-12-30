import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {loadInventoryTransfer, loadWorkOrder, updateSelectedEntry} from '../actions/slc-entries';
import FormGroup from "./FormGroup";
import ProgressBar from "./ProgressBar";
import numeral from "numeral";
import TextInput from './TextInput';

const WorkOrderOperationRow = ({ItemBillNumber, step, onSelect}) => {
    const {WorkCenter, OperationCode, OperationDescription, StandardAllowedMinutes, StdRatePiece, idSteps} = step;
    const handleClick = () => {
        onSelect(step);
    };

    return (
        <tr>
            <td>{ItemBillNumber}</td>
            <td>{WorkCenter}</td>
            <td>{OperationCode}</td>
            <td>{OperationDescription}</td>
            <td>{numeral(StandardAllowedMinutes).format("0.0000")}</td>
            <td>
                <button type="button" className="btn btn-sm btn-outline-dark"
                        disabled={StdRatePiece === 0 || idSteps === null}
                        onClick={handleClick}>
                    Select
                </button>
            </td>
        </tr>
    )
};


const ITOperationRow = ({line, onSelect}) => {
    const {ItemCode, OperationCode, OperationDescription, StandardAllowedMinutes, idSteps} = line;
    const handleClick = () => {
        onSelect(line);
    };

    return (
        <tr>
            <td>{ItemCode}</td>
            <td>INH</td>
            <td>{OperationCode}</td>
            <td>{OperationDescription}</td>
            <td>{numeral(StandardAllowedMinutes).format("0.0000")}</td>
            <td>
                <button type="button" className="btn btn-sm btn-outline-dark"
                        disabled={idSteps === null} onClick={handleClick}>
                    Select
                </button>
            </td>
        </tr>
    );
};

class SLCWorkOrderITOperations extends Component {
    static propTypes = {
        DocumentNo: PropTypes.string,
        workOrder: PropTypes.object,
        inventoryTransfer: PropTypes.array,
        isLoadingWorkOrder: PropTypes.bool,

        loadWorkOrder: PropTypes.func.isRequired,
        loadInventoryTransfer: PropTypes.func.isRequired,
        updateSelectedEntry: PropTypes.func.isRequired,
    };

    static defaultProps = {
        DocumentNo: '',
        workOrder: {},
        inventoryTransfer: [],
        isLoadingWorkOrder: false,
    };

    constructor(props) {
        super(props);
        this.onChangeEntry = this.onChangeEntry.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSelectWOOperation = this.onSelectWOOperation.bind(this);
        this.onSelectITOperation = this.onSelectITOperation.bind(this);
    }

    onChangeEntry({field, value}) {
        this.props.updateSelectedEntry({[field]: value});
    }

    onSubmit(ev) {
        ev.preventDefault();
        this.props.loadWorkOrder();
    }

    onSelectWOOperation(step) {
        if (!step) {
            return;
        }
        const {ItemBillNumber, ParentWhse} = this.props.workOrder;
        const {WorkCenter, OperationCode, OperationDescription, StandardAllowedMinutes, idSteps} = step;
        if (StandardAllowedMinutes === null) {
            return;
        }
        this.props.updateSelectedEntry({
            OperationCode,
            StandardAllowedMinutes,
            OperationDescription,
            idSteps,
            WorkCenter,
            ItemCode: ItemBillNumber,
            WarehouseCode: ParentWhse
        });
    };

    onSelectITOperation(line) {
        if (!line) {
            return;
        }
        const {WarehouseCode, ItemCode, idSteps, OperationCode, OperationDescription, StandardAllowedMinutes} = line;
        if (StandardAllowedMinutes === null) {
            return;
        }
        this.props.updateSelectedEntry({
            OperationCode,
            StandardAllowedMinutes,
            OperationDescription,
            idSteps,
            WorkCenter: 'INH',
            ItemCode,
            WarehouseCode
        });
    }


    render() {
        const {
            DocumentNo, workOrder, inventoryTransfer, isLoadingWorkOrder, loadInventoryTransfer,
            onSelectOperation,
        } = this.props;
        const {operationDetail = [], ItemBillNumber} = workOrder;
        return (
            <form className="form" onSubmit={this.onSubmit}>
                <FormGroup type="" label="Work Order / IT  No" colWidth={8} small>
                    <div className="input-group">
                        <TextInput type="text"
                                   placeholder="Document No"
                                   value={DocumentNo} field="DocumentNo"
                                   onChange={this.onChangeEntry}/>
                        <span className="input-group-append">
                            <button className="btn btn-outline-secondary btn-sm" type="submit">Load WO</button>
                        </span>
                        <span className="input-group-append">
                            <button className="btn btn-outline-secondary btn-sm"
                                    type="button" onClick={loadInventoryTransfer}>Load IT</button>
                        </span>
                    </div>
                </FormGroup>

                <table className="table table-condensed">
                    <thead>
                    <tr>
                        <th>Item</th>
                        <th>W/C</th>
                        <th colSpan={2}>Operation</th>
                        <th>SAM</th>
                        <th>Qty</th>
                    </tr>
                    </thead>
                    <tbody>
                    {!!isLoadingWorkOrder && (
                        <tr>
                            <td colSpan={6}><ProgressBar striped={true}/></td>
                        </tr>
                    )}
                    {operationDetail.map((step, index) => (
                        <WorkOrderOperationRow key={index} ItemBillNumber={ItemBillNumber}
                                               step={step} onSelect={this.onSelectWOOperation}/>
                    ))}
                    {inventoryTransfer.map((line, index) => (
                        <ITOperationRow key={index} line={line} onSelect={this.onSelectITOperation}/>
                    ))}
                    </tbody>
                </table>
            </form>
        );
    }
}

const mapStateToProps = ({SLCEntries}) => {
    const {selected, workOrder, inventoryTransfer, isLoadingWorkOrder} = SLCEntries;
    const {DocumentNo} = selected;
    return {
        DocumentNo,
        workOrder,
        inventoryTransfer,
        isLoadingWorkOrder,
    };
};

const mapDispatchToProps = {
    loadWorkOrder,
    loadInventoryTransfer,
    updateSelectedEntry,
};

export default connect(mapStateToProps, mapDispatchToProps)(SLCWorkOrderITOperations) 
