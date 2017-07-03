/**
 * Created by walkerxiong on 2017/6/19.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {observable, action, autorun, computed} from 'mobx';
import {observer, Provider, inject} from 'mobx-react/native';
import AppStore from '../stores/testView/test';

import NavActivity from '../components/NavActivity';
import Util from '../utility/util';

const debugKeyWord = '[OrderList]';

@inject('store', 'navigation') @observer
class OrderDetail extends Component {
    render() {
        return (
            <View style={Styles.wrap}>
                <NavActivity
                    navigator={this.props.navigation}
                    leftButton={{disabled: false, enableBackZone: false}}
                    menuButton={{disabled: false}}
                    title={{title: '订单列表'}}/>
            </View>
        )
    }
}

export default class OrderList extends Component {
    static navigationOptions = {
        drawerLabel: '订单列表',
        drawerIcon: ({tintColor}) => (
            <Icon
                name={'cards-outline'}
                size={24}
                style={{color: tintColor}}/>
        )
    };

    render() {
        Util.log(debugKeyWord + 'render!!!');
        return (
            <Provider store={AppStore} navigation={this.props.navigation}>
                <OrderDetail/>
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