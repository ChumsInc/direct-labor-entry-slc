import React, {forwardRef, PureComponent} from 'react';
import PropTypes from 'prop-types';
import FormGroup from "./FormGroup";
import TextInput from "./TextInput";


class FormGroupTextInput extends PureComponent {
    static propTypes = {
        label: PropTypes.string,
        formGroupClassName: PropTypes.string,
        labelClassName: PropTypes.string,
        colWidth: PropTypes.number,
        type: PropTypes.string,
        onChange: PropTypes.func,
        value: PropTypes.string.isRequired,
        field: PropTypes.string,
        className: PropTypes.string,
        id: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(value) {
        this.props.onChange(value);
    }

    render() {
        const {onChange, colWidth, value, className, id, labelClassName, formGroupClassName, label, field, placeholder,
            children, inline, forwrardedRef, ...rest} = this.props;
        return (
            <FormGroup colWidth={colWidth} inline={inline}
                       className={formGroupClassName} htmlFor={id}
                       labelClassName={labelClassName} label={label}>
                <TextInput id={id} className={className} ref={forwrardedRef}
                           value={value} field={field}
                           onChange={this.onChange}
                           placeholder={placeholder || label}
                           {...rest}/>
                {children}
            </FormGroup>
        );
    }
}

export default forwardRef((props, ref) => <FormGroupTextInput {...props} forwardedRef={ref}/>);
