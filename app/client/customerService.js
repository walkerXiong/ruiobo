/**
 * Created by hebao on 2017/7/3.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';

import NavActivity from '../components/NavActivity';
import Util from '../utility/util';

const debugKeyWord = '[CustomerService]';

export default class CustomerService extends Component {
    render() {
        Util.log(debugKeyWord + 'render!!!');
        return (
            <View style={Styles.wrap}>
                <NavActivity
                    navigator={this.props.navigation}
                    leftButton={{disabled: false}}
                    title={{title: '客服与反馈'}}/>
            </View>
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