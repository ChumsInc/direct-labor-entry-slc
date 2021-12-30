/**
 * Created by steve on 9/15/2016.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";

const SortIcon = ({asc = true}) => {
    return (
        asc
            ? <span className="oi oi-sort-ascending" />
            : <span className="oi oi-sort-descending" />
    )
};

export default class ThSortable extends Component {
    static propTypes = {
        field: PropTypes.string.isRequired,
        currentSort: PropTypes.shape({
            field: PropTypes.string,
            asc: PropTypes.bool,
        }).isRequired,
        className: PropTypes.string,
        noSort: PropTypes.bool,
        onClick: PropTypes.func.isRequired,
    };

    static defaultProps = {
        field: '',
        currentSort: {
            field: '',
            asc: true,
        },
        className: '',
        noSort: false,
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.onClick(this.props.field);
    }
    render() {
        const {currentSort, field, noSort, className, children} = this.props;
        const sortClassName = {
            sorted: field === currentSort.field,
            sortable: !noSort,
            'sorted-asc': field === currentSort.field && !!currentSort.asc,
            'sorted-desc': field === currentSort.field && !!currentSort.desc,
        }
        return noSort
            ? (<th className={classNames(className, 'no-sort')}>{children}</th>)
            : (
                <th className={classNames(className, sortClassName)}
                    onClick={this.onClick}>
                    {children}
                </th>
            )
    }
}


/*
Additional SCSS styling:
.table {
    &.table-sortable {
        th {
            cursor: pointer;
            &.no-sort {
                cursor: not-allowed;
            }
        }
    }
}
 */
