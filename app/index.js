'use strict';
/**
 * Global Error Track
 */
import ErrorUtils from 'ErrorUtils';
const _ErrorDefaultHandle = (ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler()) || ErrorUtils._globalHandler;

import stacktraceParser from 'stacktrace-parser';
const parseErrorStack = (error) => {//error track
    if (!error || !error.stack) return [];
    return Array.isArray(error.stack) ? error.stack : stacktraceParser.parse(error.stack);
};

async function wrapGlobalHandler(error, isFatal) {
    const stack = parseErrorStack(error);
    window.console.log(`__Global__Error:${error};stack:${JSON.stringify(stack)};isFatal:${isFatal}`);
    _ErrorDefaultHandle(error, isFatal);
}
ErrorUtils.setGlobalHandler(wrapGlobalHandler);

import React, {Component} from 'react';
import {Platform, BackHandler} from 'react-native';
import {NavigationActions, StackNavigator, addNavigationHelpers} from 'react-navigation';
import {Horizontal_RToL_Opacity} from './utility/transitionConfig';
import Teacher from './teacher/index';
import Student from './student/index';
import Help from './client/help';
import SysSet from './client/sysSet';
import About from './client/about';
import CustomerService from './client/customerService';
import Util from './utility/util';

class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.navigation.dispatch(NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'StudentClient'})
            ]
        }));
    }

    render() {
        return null;
    }
}

const App = StackNavigator({
    Home: {screen: HomePage},
    StudentClient: {screen: Student},
    TeacherClient: {screen: Teacher},
    Help: {screen: Help},
    SysSet: {screen: SysSet},
    CustomerService: {screen: CustomerService},
    About: {screen: About},
}, {
    initialRouteName: 'Home',
    headerMode: 'none',
    navigationOptions: {gesturesEnabled: Platform.OS === 'ios'},
    transitionConfig: Horizontal_RToL_Opacity
});

export default class AppClient extends Component {
    _lastBackPressed = -1;
    _allowLeaveTime = 2000;

    handleBackPress = () => {
        if (this._lastBackPressed !== -1 && (this._lastBackPressed + this._allowLeaveTime) >= Date.now()) {
            return false;//2s之内连续按返回键，则退出应用
        }
        this._lastBackPressed = Date.now();
        Util.toast.show("再按一次退出应用");
        return true;
    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    render() {
        return <App ref={(ref) => this._navigator = ref}/>;
    }
}