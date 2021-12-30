import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import {setTab} from '../actions/app';
import {TABS} from "../constants/app";
import classNames from "classnames";

function mapStateToProps({app}) {
    const {tab} = app;
    return {
        tab,
    };
}


const mapDispatchToProps = {
    setTab,
};

class TabBar extends Component {
    static propTypes = {
        tab: PropTypes.string,
        setTab: PropTypes.func.isRequired,
    };

    static defaultProps = {
        tab: '',
    };

    constructor(props) {
        super(props);
        this.onSelectTab = this.onSelectTab.bind(this);
    }


    onSelectTab(selected) {
        const {key, employeeFilter} = TABS[selected];
        if (key === undefined) {
            return;
        }
        this.props.setTab(key, employeeFilter);
    }

    render() {
        const {tab} = this.props
        return (
            <ul className="nav nav-tabs nav-tab-icons mb-2">
                {Object.keys(TABS).map(key => (
                    <li className="nav-item" key={key}>
                        <a className={classNames('nav-link', {active: tab === key})}
                           onClick={() => this.onSelectTab(key)}>
                            {TABS[key].title}
                        </a>
                    </li>
                ))}
            </ul>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TabBar);
