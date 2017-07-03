/**
 * Created by hebao on 2017/6/21.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {observable, action, autorun, computed} from 'mobx';
import {observer, Provider, inject} from 'mobx-react/native';
import AppStore from '../stores/testView/test';

import NavActivity from '../components/NavActivity';
import Util from '../utility/util';

const debugKeyWord = '[sysSet]';

@inject('store', 'navigation') @observer
class Teacher extends Component {
    render() {
        return (
            <View style={Styles.wrap}>
                <NavActivity title={{title: '系统设置'}}/>
            </View>
        )
    }
}

export default class OrderRequire extends Component {
    static navigationOptions = {
        drawerLabel: ' 设置',
        drawerIcon: ({tintColor}) => (
            <Icon
                name={'settings'}
                size={24}
                style={{color: tintColor}}/>
        )
    };

    render() {
        Util.log(debugKeyWord + 'render!!!');
        return (
            <Provider store={AppStore} navigation={this.props.navigation}>
                <Teacher/>
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