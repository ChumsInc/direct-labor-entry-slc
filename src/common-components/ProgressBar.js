/**
 * Created by steve on 9/8/2016.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class ProgressBar extends Component {

    static propTypes = {
        visible: PropTypes.bool,
        striped: PropTypes.bool,
        active: PropTypes.bool,
        label: PropTypes.string,
        style: PropTypes.string,
        value: PropTypes.number,
        min: PropTypes.number,
        max: PropTypes.number
    };

    render() {
        const {visible, striped, active, label, value, min, max, style} = this.props;
        if (!visible) {
            return null;
        }
        const progressClass = classNames('progress-bar', {
            'progress-bar-striped': this.props.striped,
            'active': active
        });

        const labelClass = classNames({
            'sr-only': label === undefined
        });

        const styles = {
            ...style
        };

        // const value = this.props.value === undefined ? 100 : this.props.value;
        return (
            <div className="progress" style={styles}>
                <div className={progressClass} role="progressbar"
                     aria-valuenow={value} aria-valuemin={min || 0} aria-valuemax={max || 100}
                     style={{width: `${value === undefined ? 100 : value}%`}}>
                    <span className={labelClass}>{label || ''}</span>
                </div>
            </div>
        );
    }
}
