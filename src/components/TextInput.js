import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TextInput = React.forwardRef((props, ref) => {
    const {onChange = () => {}, field, className = '', forwardedRef, ...rest} = props;
    const _className = {
        'form-control': true,
        'form-control-sm': !className.split(' ').includes('form-control-lg'),
        className
    };
    const changeValue = (ev) => {
        switch (props.type) {
        case 'number':
            return Number(ev.target.value);
        default:
            return ev.target.value;
        }
    };

    return (
        <input className={classNames(_className)}
               onChange={ev => onChange({field, value: changeValue(ev)})}
               ref={ref || forwardedRef}
               {...rest} />
    );
});

export default TextInput;
