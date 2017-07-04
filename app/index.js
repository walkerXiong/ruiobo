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
import {Platform} from 'react-native';
import {NavigationActions, StackNavigator, DrawerNavigator} from 'react-navigation';
import {Horizontal_RToL_withoutScale} from './utility/transitionConfig';
import Teacher from './teacher/index';
import Student from './student/index';
import Help from './client/help';
import SysSet from './client/sysSet';
import About from './client/about';
import CustomerService from './client/customerService';
import Util from './utility/util';
import WebAPI from './utility/webAPI';

const debugKeyWord = '[rootPage]';
class HomePage extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        //注册监听网络是否连接
        WebAPI.NetInfo.isConnected.addEventListener('NetInfo_isConnected', this._registerIsConnectHandle);
    }

    componentDidMount() {
        this.props.navigation.dispatch(NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'StudentClient'})
            ]
        }));
    }

    componentWillUnmount() {
        Util.log(debugKeyWord + 'componentWillUnmount!!!');
        //组件销毁时候，移除网络是否连接的监听
        WebAPI.NetInfo.isConnected.removeEventListener('NetInfo_isConnected', this._registerIsConnectHandle);
    }

    _registerIsConnectHandle = (isConnected) => {
        //此处监听一个空执行函数，是因为iOS端需要先监听，然后isConnected.fetch()才能获取正确结果，而安卓可以直接fetch
        !isConnected && Util.toast.show('网络断开，请检查网络');
    };

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
    transitionConfig: Horizontal_RToL_withoutScale
});

export default () => <App/>;