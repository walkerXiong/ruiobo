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
import realm from './DB/client';
import {NavigationActions, StackNavigator} from 'react-navigation';
import {IOS_Default} from './utility/transitionConfig';
import Teacher from './teacher/index';
import Student from './student/index';
import UserInfo from './client/userInfo';
import Help from './client/help';
import SysSet from './client/sysSet';
import About from './client/about';
import CustomerService from './client/customerService';
import Util from './utility/util';

class CheckClient extends Component {
    componentDidMount() {
        let _currClient = (realm.objects('Client')[0] && realm.objects('Client')[0].currClient === 'teacher') ? 'TeacherClient' : 'StudentClient';
        this.props.navigation.dispatch(
            NavigationActions.reset({
                index: 0,
                key: null,
                actions: [
                    NavigationActions.navigate({routeName: _currClient})
                ]
            })
        );
    }

    render() {
        return null;
    }
}

const App = StackNavigator({
    CheckClient: {screen: CheckClient},
    StudentClient: {screen: Student},
    TeacherClient: {screen: Teacher},
    UserInfo: {screen: UserInfo},
    Help: {screen: Help},
    SysSet: {screen: SysSet},
    CustomerService: {screen: CustomerService},
    About: {screen: About},
}, {
    initialRouteName: 'CheckClient',
    headerMode: 'none',
    navigationOptions: {gesturesEnabled: Platform.OS === 'ios'},
    transitionConfig: IOS_Default
});

export default class AppClient extends Component {
    _navigator = null;
    _lastBackPressed = -1;
    _allowLeaveTime = 2000;

    handleBackPress = () => {
        if (this._navigator) {
            let {state, dispatch} = this._navigator;
            if (state.nav.index > 0) {
                dispatch(NavigationActions.back());
                return true;
            }
            else {
                if (this._lastBackPressed !== -1 && (this._lastBackPressed + this._allowLeaveTime) >= Date.now()) {
                    return false;//2s之内连续按返回键，则退出应用
                }
                this._lastBackPressed = Date.now();
                Util.toast.show("再按一次退出应用");
            }
            return true;
        }
        return false;
    };

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    getRootNavigator() {
        return this._navigator;
    }

    render() {
        return <App ref={(ref) => this._navigator = ref}
                    screenProps={{getRootNavigator: this.getRootNavigator.bind(this)}}/>;
    }
}