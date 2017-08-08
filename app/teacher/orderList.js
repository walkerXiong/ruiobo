/**
 * Created by walkerxiong on 2017/6/19.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';
import realm from '../DB/client';
import SplashScreen from 'react-native-smart-splash-screen';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {observable, action, autorun, computed} from 'mobx';
import {observer, Provider, inject} from 'mobx-react/native';
import UserInfo from '../stores/userInfo';

import NavActivity from '../components/NavActivity';
import Util from '../utility/util';
import WebAPI from '../utility/webAPI';

const debugKeyWord = '[OrderList]';

@inject('user', 'navigation') @observer
class OrderDetail extends Component {
    componentDidMount() {
        SplashScreen.close({
            animationType: SplashScreen.animationType.fade,
            duration: 500,
            delay: 100,
        });
        if (!realm.objects('Client')[0]) {
            Util.log(debugKeyWord + 'componentDidMount===create client teacher!!!');
            realm.write(() => {
                realm.create('Client', {currClient: 'teacher'});
            });
        }
        else if (realm.objects('Client')[0].currClient !== 'teacher') {
            Util.log(debugKeyWord + 'componentDidMount===write client teacher!!!');
            realm.write(() => {
                realm.objects('Client')[0].currClient = 'teacher';
            });
        }
    }

    render() {
        return (
            <View style={Styles.wrap}>
                <NavActivity
                    navigator={this.props.navigation}
                    leftButton={{disabled: false, enableBackZone: false}}
                    menuButton={{disabled: false}}
                    title={{title: '订单列表'}}/>
                <TouchableOpacity
                    style={{width: 200, height: 50, backgroundColor: '#ffeeaa'}}
                    onPress={() => {
                        // Util.log(debugKeyWord + 'xq debug === pressed!');
                        // if (!realm.objects('Client')[0] || realm.objects('Client')[0].currClient === 'teacher') {
                        //     Util.log(debugKeyWord + 'componentDidMount===write client student!!!');
                        //     realm.write(() => {
                        //         realm.objects('Client')[0].currClient = 'student';
                        //     });
                        // }
                        WebAPI.UserInfos.getUserInfo(1, (res) => {
                            Util.log(debugKeyWord + 'first try get data:' + (res ? JSON.stringify(res) : 'none'));
                            let {user} = this.props;
                            user.updateBaseInfo({
                                userName: res.Data.nickName
                            })
                        });
                        WebAPI.UserInfos.setUserInfo({nickName: 'fuck off'}, (res) => {
                            Util.log(debugKeyWord + 'setUserInfo:' + (res ? JSON.stringify(res) : 'none'));
                        });
                        // fetch('http://127.0.0.1:3000/').then((res) => {
                        //     Util.log(debugKeyWord + 'res:' + res);
                        // });
                    }}>
                    <Text>{'click me'}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default class OrderList extends Component {
    render() {
        Util.log(debugKeyWord + 'render!!!');
        return (
            <Provider user={UserInfo} navigation={this.props.navigation}>
                <OrderDetail {...this.props}/>
            </Provider>
        );
    }
}

const Styles = StyleSheet.create({
    wrap: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    }
});