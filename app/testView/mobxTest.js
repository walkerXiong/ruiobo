'use strict';
import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';

import {observable, action, autorun, computed} from 'mobx';
import {observer, Provider, inject} from 'mobx-react/native';
import AppStore from '../stores/testView/test';
import Util from '../utility/util';
import WebAPI from '../utility/webAPI';
import * as ACTIONS from '../utility/events';

import AlertSys from '../components/AlertSys';
import Loading from '../components/Loading';
import NavActivity from '../components/NavActivity';
import SecuredPayKeyboard from '../components/keyboard/SecuredPayKeyboard';

@inject('store', 'navigation') @observer
class CountAge extends Component {
    componentDidMount() {
        setInterval(() => {
            this.props.store.state.age++
        }, 2000);
    }

    render() {
        return (
            <View style={{marginTop: 20}}>
                <Text>{`my age: ${this.props.store.state.age}`}</Text>
                <Text>{`my birth: ${this.props.store.fixAge}`}</Text>
                <TouchableOpacity
                    style={Styles.btn}
                    onPress={() => this.props.navigation.navigate('NextPage')}>
                    <Text>{'press to jump!!!'}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

@inject('store', 'navigation') @observer
class ReduxTestPage extends Component {
    constructor(props) {
        super(props);
    }

    _nextPage() {
        // window.console.log(this.props.navigation);
        // this.props.navigation.navigate('NextPage');
        // Util.trigger(ACTIONS.ACTION_LOADING_DONE, {done: false, overTime: 20000});
        Util.trigger('MOBX_TEST_ALERT', {
            alertShow: true,//是否显示alert
            alertTitle: '这是标题',//标题
            alertDetail: '没什么详情',//详情
            alertAttach: '骑士队输球了',//附加说明
            alertBtnNum: 1,//alert弹窗的button个数
            alertBtnFont: ['我知道了'],//各个button的文案
            alertBtnCallback: [() => {
                let _random = Math.ceil(Math.random() * 10);
                if (_random <= 3) {
                    Util.trigger('MOBX_TEST_ALERT', {resetAlert: true});
                }
                else {
                    Util.trigger('MOBX_TEST_ALERT', {alertTitle: 'change title' + _random});
                }
            }]
        });
    }

    _onKeyPress(value) {
        if (this._myInput.isFocused()) {
            this._myInput.setNativeProps({
                text: value
            });
        }
        else {
            this._myInput.focus();
            this._myInput.setNativeProps({
                text: value
            });
        }
    }

    render() {
        let {userName} = this.props.store.state;
        let {Success, keyboardType} = this.props.store.data;
        let {updateData} = this.props.store;
        return (
            <View style={Styles.wrap}>
                <NavActivity title={{title: '主页'}}/>
                <Text>{`my Name is: ${userName}`}</Text>
                <Text>{`server data isSuccess ${Success}`}</Text>
                <TouchableOpacity
                    style={Styles.btn}
                    onPress={() => updateData({Success: true, keyboardType: Math.ceil(Math.random() * 3)})}>
                    <Text>{'toggle server data true or false'}</Text>
                </TouchableOpacity>
                <CountAge/>
                <TextInput style={Styles.commonInput} ref={(ref) => this._myInput = ref}/>
                <SecuredPayKeyboard
                    visible={Success}
                    onRequestToClose={()=>updateData({Success: false})}/>
            </View>
        )
    }
}

export default class ReduxTest extends Component {

    componentWillMount() {
        //注册监听网络是否连接
        WebAPI.NetInfo.isConnected.addEventListener('NetInfo_isConnected', this._registerIsConnectHandle);
    }

    componentWillUnmount() {
        //组件销毁时候，移除网络是否连接的监听
        WebAPI.NetInfo.isConnected.removeEventListener('NetInfo_isConnected', this._registerIsConnectHandle);
    }

    _registerIsConnectHandle = (isConnected) => {
        //此处监听一个空执行函数，是因为iOS端需要先监听，然后isConnected.fetch()才能获取正确结果，而安卓可以直接fetch
        !isConnected && Util.toast.show('网络断开，请检查网络');
    };

    render() {
        return (
            <Provider store={AppStore} navigation={this.props.navigation}>
                <ReduxTestPage/>
            </Provider>
        );
    }
};

const Styles = StyleSheet.create({
    wrap: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    btn: {
        width: 200,
        height: 50,
        backgroundColor: '#ffe341',
        marginTop: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    commonInput: {
        width: 200,
        height: 50,
        margin: 0,
        padding: 0,
        textAlign: 'center'
    }
});