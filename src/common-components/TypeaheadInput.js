import React, {Component} from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import classNames from 'classnames';

const DEFAULT_MIN_LENGTH = 2;
const DEFAULT_MAX_LIST_LENGTH = 10;

class TypeaheadDropdownItem extends Component {
    static propTypes = {
        item: PropTypes.any,
        active: PropTypes.bool,
        itemRender: PropTypes.func,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        active: false,
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(ev) {
        ev.preventDefault();
        this.props.onClick(this.props.item);
    }

    render() {
        const {item, active, itemRender} = this.props;
        return (
            <a href="#" className={classNames("dropdown-item", {active})}
               onClick={this.onClick}>
                {itemRender(item)}
            </a>
        );
    }
}

class MoreIndicator extends Component {
    static propTypes = {
        up: PropTypes.bool,
        onClick: PropTypes.func,
    };
    static defaultProps = {
        down: false
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(ev) {
        ev.preventDefault();
        this.props.onClick();
    }

    render() {
        const {up} = this.props;
        return (
            <a href="#" className="dropdown-item" onClick={this.onClick}>
                <span className={classNames('oi', {'oi-chevron-top': up, 'oi-chevron-bottom': !up})} />
            </a>
        );
    }
}

class TypeaheadDropdown extends Component {
    static propTypes = {
        list: PropTypes.array.isRequired,
        selected: PropTypes.number,
        start: PropTypes.number,
        maxItems: PropTypes.number,

        itemRender: PropTypes.func.isRequired,
        onSelect: PropTypes.func.isRequired,
        onClickPrev: PropTypes.func,
        onClickNext: PropTypes.func,
    };

    static defaultProps = {
        list: [],
        selected: 0,
        start: 0,
        maxItems: DEFAULT_MAX_LIST_LENGTH,
        onClickPrev: () => {},
        onClickNext: () => {},
    };

    render() {
        const {itemRender, list, maxItems, selected, start} = this.props;
        const items = list
            .filter((item, index) => {
                return index >= start && index - start <= maxItems;
            })
            .map((item, index) => {
                return (
                    <TypeaheadDropdownItem item={item} active={selected - start === index}
                                           itemRender={itemRender}
                                           onClick={this.props.onSelect}
                                           key={index}/>
                )
            });

        return (
            <div className="dropdown-menu show">
                <div>
                    {start > 0 && <MoreIndicator onClick={this.props.onClickPrev} up={true}/>}
                    <div>{items}</div>
                    {list.length - start > maxItems && <MoreIndicator onClick={this.props.onClickNext}/>}
                </div>
            </div>
        )
    }
}

class TypeaheadInput extends Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        minLength: PropTypes.number,
        maxItems: PropTypes.number,
        data: PropTypes.array.isRequired,
        className: PropTypes.string,
        itemRender: PropTypes.func.isRequired,
        onSelect: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        placeholder: PropTypes.string,
        required: PropTypes.bool,
    };

    static defaultProps = {
        value: '',
        minLength: DEFAULT_MIN_LENGTH,
        maxItems: DEFAULT_MAX_LIST_LENGTH,
        data: [],
        className: '',
        placeHolder: '',
        required: false,
    };

    state = {
        show: false,
        selected: 0,
        start: 0,
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onClickPrev = this.onClickPrev.bind(this);
        this.onClickNext = this.onClickNext.bind(this);
    }

    handleClickOutside = evt => {
        this.setState({show: false});
    };

    onSelect(item) {
        this.setState({show: false});
        this.props.onSelect(item);
    }

    onChange(ev) {
        const {value} = ev.target;
        const {minLength = 2} = this.props;
        this.setState({show: value.length >= minLength, start: 0, selected: -1});
        this.props.onChange(value);
    }

    onKeyDown(ev) {
        const {which} = ev;
        const {selected, start, show} = this.state;
        const {data, maxItems = DEFAULT_MAX_LIST_LENGTH} = this.props;
        if (!show) {
            return;
        }
        switch (which) {
        case 13:
            ev.preventDefault();
            this.onSelect(data[selected]);
            break;
        case 27:
            ev.preventDefault();
            this.setState({show: false});
            break;
        case 38:
            ev.preventDefault();
            if (selected > 0) {
                this.setState({selected: selected - 1, start: (selected <= start ? start - 1 : start)})
            }
            break;
        case 40:
            ev.preventDefault();
            if (selected < data.length - 1) {
                this.setState({selected: selected + 1, start: (selected >= start + maxItems ? start + 1 : start)})
            }
            break;
        default:
            // console.log(which);
            break;
        }
    }

    onClick() {
        const {value, minLength = DEFAULT_MIN_LENGTH} = this.props;
        this.setState({show: value.length >= minLength, selected: -1});
    }

    onClickPrev() {
        const {start} = this.state;
        const {maxItems} = this.props;
        this.setState({start: Math.max(start - maxItems, 0)});
    }

    onClickNext() {
        const {start} = this.state;
        const {maxItems, data} = this.props;
        this.setState({start: Math.min(start + maxItems, data.length)});
    }

    render() {
        const {value, className, placeholder, required, data, maxItems, itemRender} = this.props;
        const {selected, start, show} = this.state;
        return (
            <div className="input-autocomplete">
                <input type="text" className={classNames("form-control form-control-sm", className)}
                       value={value} required={required}
                       onChange={this.onChange} placeholder={placeholder}
                       onKeyDown={this.onKeyDown}
                       onClick={this.onClick}/>
                {show && <TypeaheadDropdown list={data} itemRender={itemRender} maxItems={maxItems}
                                            onSelect={this.onSelect}
                                            selected={selected} start={start}
                                            onClickNext={this.onClickNext}
                                            onClickPrev={this.onClickPrev}/>}
            </div>
        )
    }
}

export default onClickOutside(TypeaheadInput);
