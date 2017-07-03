/**
 * Created by hebao on 2017/5/26.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import {observable, action, autorun, computed} from 'mobx';
import {observer, Provider, inject} from 'mobx-react/native';
import AppStore from '../stores/testView/testPage';
import NavActivity from '../components/NavActivity';

@inject('store', 'navigation') @observer
class RouterTestPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            change: false
        }
    }

    render() {
        let {wifiName} = this.props.store.state;
        return (
            <View style={Styles.wrap}>
                <NavActivity
                    navigator={this.props.navigation}
                    title={{title: '个人'}}
                    leftButton={{disabled: false, title: '返回'}}/>
                <Text>{`wifi is: ${wifiName}`}</Text>
                <TouchableOpacity
                    style={Styles.btn}
                    onPress={() => {
                        this.state.change = !this.state.change;
                        this.props.store.state.wifiName = this.state.change ? 'myWifi' : 'walkerXiong';
                    }}>
                    <Text>{'toggle wifi name'}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default class RouterPage extends Component {

    render() {
        return (
            <Provider store={AppStore} navigation={this.props.navigation}>
                <RouterTestPage/>
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
        backgroundColor: '#ffffff'
    },
    btn: {
        width: 200,
        height: 50,
        backgroundColor: '#ffe341',
        marginTop: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});