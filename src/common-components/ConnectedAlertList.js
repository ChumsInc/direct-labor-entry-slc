import React, { Component } from 'react';
import {connect} from 'react-redux';
import {dismissAlert} from "../actions/app";
import AlertList from 'chums-components/src/AlertList';

const mapStateToProps = (state, ownProps) => {
    const {alerts} = state.app;
    return {alerts};
};

const mapDispatchToProps = {
    onDismiss: dismissAlert,
};

export default connect(mapStateToProps, mapDispatchToProps)(AlertList);
