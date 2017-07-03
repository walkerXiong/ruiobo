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
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import {NavigationActions} from 'react-navigation'
import * as Animatable from 'react-native-animatable';
import './utility/animation';
import Util from './utility/util';
import WebAPI from './utility/webAPI';

const debugKeyWord = '[rootPage]';
export default class judgeClient extends Component {
    _clientStudent = null;
    _clientTeacher = null;

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        //注册监听网络是否连接
        WebAPI.NetInfo.isConnected.addEventListener('NetInfo_isConnected', this._registerIsConnectHandle);
    }

    componentDidMount() {
        this._clientStudent.app_index_sc_in(500);
        this._clientTeacher.app_index_tc_in(500);
    }

    componentWillUnmount() {
        //组件销毁时候，移除网络是否连接的监听
        WebAPI.NetInfo.isConnected.removeEventListener('NetInfo_isConnected', this._registerIsConnectHandle);
        Util.log(debugKeyWord + 'componentWillUnmount!!!');
    }

    _registerIsConnectHandle = (isConnected) => {
        //此处监听一个空执行函数，是因为iOS端需要先监听，然后isConnected.fetch()才能获取正确结果，而安卓可以直接fetch
        !isConnected && Util.toast.show('网络断开，请检查网络');
    };

    checkPage(client) {
        switch (client) {
            case 'teacher':
                this.props.navigation.dispatch(NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName: 'TeacherClient'})
                    ]
                }));
                break;
            case 'student':
                this.props.navigation.dispatch(NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName: 'StudentClient'})
                    ]
                }));
                break;
        }
    }

    render() {
        return (
            <View style={Styles.wrap}>
                <Animatable.View
                    ref={(ref) => this._clientStudent = ref}
                    useNativeDrive={true}>
                    <TouchableOpacity
                        style={Styles.client}
                        activeOpacity={1}
                        onPress={() => this.checkPage('student')}>
                        <Text>{'学生'}</Text>
                    </TouchableOpacity>
                </Animatable.View>
                <Animatable.View
                    ref={(ref) => this._clientTeacher = ref}
                    useNativeDrive={true}>
                    <TouchableOpacity
                        style={Styles.client}
                        activeOpacity={1}
                        onPress={() => this.checkPage('teacher')}>
                        <Text>{'老师'}</Text>
                    </TouchableOpacity>
                </Animatable.View>
            </View>
        );
    }
};

const Styles = StyleSheet.create({
    wrap: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    client: {
        width: 100,
        height: 100,
        backgroundColor: '#FFB5C5',
        borderRadius: 50,
        marginBottom: 30,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    font: {
        fontSize: 18,
        color: '#ffffff'
    }
});