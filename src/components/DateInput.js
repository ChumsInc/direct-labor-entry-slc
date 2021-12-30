import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {noop} from "../utils";
import classNames from 'classnames';
import {format, parseISO} from 'date-fns';

export function toDateString(val) {
    if (!val) {
        return '';
    }
    if (typeof val === "number") {
        val = new Date(val);
    } else if (typeof val === "string") {
        val = parseISO(val);
    }
    if (!val instanceof Date) {
        return '';
    }
    return format(val, 'yyyy-MM-dd');
}

class DateInput extends Component {
    static propTypes = {
        type: PropTypes.oneOf(['date', 'time', 'text']), // input type="time" is not widely supported, so text is preferred for time.
        className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
        field: PropTypes.string,
        transform: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        type: 'date',
        className: '',
        value: '',
        field: '',
        transform: (val) => val,
        onChange: noop,
    };


    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(ev) {
        const {field, transform} = this.props;
        this.props.onChange({field, value: transform(parseISO(ev.target.value))});
    }

    render() {
        const {type, className, field, value, transform, onChange, ...rest} = this.props;

        return (
            <input type={type} value={toDateString(value)}
                   className={classNames('form-control form-control-sm', className)}
                   onChange={this.onChange}
                   {...rest} />
        );
    }
}


export default DateInput;
