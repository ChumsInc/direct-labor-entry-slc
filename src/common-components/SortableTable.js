import React, {Component, Fragment} from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";
import Pagination from "./Pagination";
import RowsPerPage from "./RowsPerPage";
import FormGroup from "../components/FormGroup";
import ThSortable from "./ThSortable";


class SortableTableFooter extends Component {
    static propTypes = {
        fields: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string.isRequired,
            render: PropTypes.func,
            className: PropTypes.string,
        })),
        footerData: PropTypes.object,
        page: PropTypes.number,
        pages: PropTypes.number,
    };

    static defaultProps = {
        fields: [],
        footerData: {},
    };

    render() {
        const {page, pages, fields, footerData} = this.props;
        return (
            <tfoot>
            {page < pages && <tr>
                <td colSpan={fields.length} className="align-content-center">...</td>
            </tr>}
            <tr>
                {fields.map(({field, render, className = ''}) => (
                    <td key={field} className={className}>{footerData[field] !== undefined ? (!!render ? render(footerData) : footerData[field]) : ' '}</td>
                ))}
            </tr>
            </tfoot>
        );
    }
}

class SortableTableHeader extends Component {
    static propTypes = {
        fields: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string.isRequired,
            title: PropTypes.string,
            noSort: PropTypes.bool,
            className: PropTypes.string,
        })),
        sort: PropTypes.shape({
            field: PropTypes.string,
            asc: PropTypes.bool,
        }),

        onClickSort: PropTypes.func,
    };

    static defaultProps = {
        fields: [],
        sort: {
            field: '',
            asc: true
        },
    };

    render() {
        const {fields, sort} = this.props;
        return (
            <thead>
            <tr>
                {fields.map(({field, title = null, noSort = false, className = ''}) => (
                    <ThSortable key={field} currentSort={sort} onClick={this.props.onClickSort}
                                className={className}
                                field={field} noSort={noSort}>
                        {title || field}
                    </ThSortable>)
                )}
            </tr>
            </thead>
        );
    }
}
export default class SortableTable extends Component {
    static propTypes = {
        fields: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string.isRequired,
            title: PropTypes.string,
            noSort: PropTypes.bool,
            render: PropTypes.func,
            className: PropTypes.string,
        })),
        data: PropTypes.array.isRequired,
        hasFooter: PropTypes.bool,
        footerData: PropTypes.object,
        keyField: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        selected: PropTypes.any,
        hasPageIndicators: PropTypes.bool,
        onSelect: PropTypes.func,
        sorter: PropTypes.func,
        defaultSort: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({field: PropTypes.string, asc: PropTypes.bool})]),
        sort: PropTypes.shape({
            field: PropTypes.string,
            asc: PropTypes.bool,
        }),
        page: PropTypes.number,
        rowsPerPage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        filtered: PropTypes.bool,
        rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

        onChangeSort: PropTypes.func,
        onChangePage: PropTypes.func,
        onChangeRowsPerPage: PropTypes.func,
    };

    static defaultProps = {
        fields: [],
        data: [],
        hasFooter: false,
        footerData: {},
        keyField: 'id',
        hasPageIndicators: true,
        defaultSort: '',
        sort: {
            field: '',
            asc: true
        },
        page: 1,
        rowsPerPage: 25,
        filtered: false,
        rowClassName: '',
    };

    state = {
        sort: {
            field: '',
            asc: true,
        },
        page: 1,
        perPage: 25,
    };

    constructor(props) {
        super(props);
        this.onClickSort = this.onClickSort.bind(this);
        this.onSelectRow = this.onSelectRow.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.sorter = this.sorter.bind(this);
    }

    componentDidMount() {
        const {defaultSort} = this.props;
        if (typeof defaultSort === 'object') {
            this.setState({sort: defaultSort});
        } else {
            this.setState({sort: {field: defaultSort, asc: true}});
        }
    }


    onClickSort(nextField) {
        const {sort} = this.state;
        if (sort.field === nextField) {
            sort.asc = !sort.asc;
            this.setState({sort});
        } else {
            this.setState({sort: {field: nextField, asc: true}});
        }
    }

    onSelectRow(row) {
        if (this.props.onSelect){
            this.props.onSelect(row);
        }
    }

    handlePageChange(page) {
        this.props.onChangePage(page);
    }

    sorter(list) {
        const {field, asc} = this.state.sort;
        const {fields, sorter} = this.props;
        if (typeof sorter === 'function') {
            return sorter({list, field, asc});
        }
        const [{sortFn} = {}] = fields.filter(f => f.field === field);
        return list.sort((a, b) => {
            const aa = sortFn ? sortFn(a) : (typeof (a[field]) === 'number' ? a[field] : String(a[field]).toLowerCase());
            const bb = sortFn ? sortFn(b) : (typeof (b[field]) === 'number' ? b[field] : String(b[field]).toLowerCase());
            return (aa === bb ? 0 : (aa > bb ? 1 : -1)) * (asc ? 1 : -1);
        })
    }


    render() {
        const {fields, data, className, page, rowsPerPage, keyField, filtered, selected, hasFooter, footerData, onSelect} = this.props;
        const {sort} = this.state;
        const rows = this.sorter(data);
        const pages = Math.ceil(rows.length / rowsPerPage);
        const hasPages = typeof this.props.onChangePage === 'function';

        return (
            <Fragment>
                <table className={classNames("table table-sm table-hover table-sortable",  {'table-selectable': typeof onSelect === 'function'}, className)}>
                    <SortableTableHeader fields={fields} sort={sort} onClickSort={this.onClickSort}/>
                    {!!hasFooter && <SortableTableFooter fields={fields} footerData={footerData} page={page} pages={pages}/>}
                    <tbody>
                    {rows
                        .filter((row, index) => !hasPages || Math.ceil((index + 1) / rowsPerPage) === page)
                        .map(row => {
                            const key = typeof keyField === "function" ? keyField(row) : row[keyField];
                            const rowClassName = typeof this.props.rowClassName === 'function'
                                ? this.props.rowClassName(row)
                                : this.props.rowClassName;
                            const className = {
                                'table-active': key === selected,
                            };
                            return (
                                <tr key={key} onClick={() => this.onSelectRow(row)} className={classNames(rowClassName, className)}>
                                    {fields.map((field, index) => {
                                        if (typeof field.render === 'function') {
                                            return (<td key={index} className={field.className}>{field.render(row)}</td>);
                                        }
                                        return (<td key={index} className={field.className}>{row[field.field]}</td>);
                                    })}
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
                {!!hasPages && (
                    <div className="page-display row g-3 align-items-end">
                        <div className="col-auto">
                            <RowsPerPage value={rowsPerPage} onChange={this.props.onChangeRowsPerPage}/>
                        </div>
                        <div className="col-auto">
                            {rows.length > 0 && <Pagination activePage={page} pages={Math.ceil(rows.length / rowsPerPage)}
                                                            onSelect={this.handlePageChange} filtered={filtered}/>}
                            {rows.length === 0 && <strong>No records.</strong>}
                        </div>
                    </div>
                )}
            </Fragment>
        );
    }
}
