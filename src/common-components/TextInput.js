import React, {Component, forwardRef} from 'react';
import PropTypes from 'prop-types';
import {noop} from "../utils";
import classNames from 'classnames';

class TextInput extends Component {
    static propTypes = {
        type: PropTypes.oneOf(['text', 'email', 'number', 'password', 'search', 'tel', 'url']),
        className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        field: PropTypes.string,
        transform: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
    };
    static defaultProps = {
        type: 'text',
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
        this.props.onChange({field: this.props.field, value: this.props.transform(ev.target.value)});
    }

    render() {
        const {type, className, field, value, transform, onChange, forwardedRef, ...rest} = this.props;
        return (
            <input type={type} value={value || ''}
                   className={classNames('form-control form-control-sm', className)}
                   onChange={this.onChange}
                   ref={forwardedRef}
                   {...rest} />
        );
    }
}

export default forwardRef((props, ref) => <TextInput forwardedRef={ref} {...props}/>);

