/**
 * Created by hebao on 2017/8/11.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import {observable, action, autorun, computed} from 'mobx';
import {observer, Provider, inject} from 'mobx-react/native';
import UserInfo from '../stores/userInfo';

import NavActivity from '../components/NavActivity';
import RBStyle from '../styles/standard';
import Util from '../utility/util';

const debugKeyWord = '[userInfo]';

@inject('user') @observer
class Detail extends Component {
    render() {
        let {nickName, phoneNumber} = this.props.user.base;
        return (
            <View style={Styles.infoWrap}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => null}
                    style={Styles.infoItem}>
                    <Text>{'昵称'}</Text>
                    <View style={Styles.rightZone}>
                        <Text style={{color: RBStyle.color.wgray_sub}}>{nickName}</Text>
                        <IconMaterial name={'navigate-next'} size={22}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => null}
                    style={[Styles.infoItem, {borderBottomWidth: 0}]}>
                    <Text>{'手机号'}</Text>
                    <View style={Styles.rightZone}>
                        <Text style={{color: RBStyle.color.wgray_sub}}>{phoneNumber}</Text>
                        <IconMaterial name={'navigate-next'} size={22}/>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

@inject('user') @observer
class Header extends Component {
    render() {
        let {userIcon} = this.props.user.base;
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => null}
                style={Styles.headerWrap}>
                <Text>{'头像'}</Text>
                <View style={Styles.rightZone}>
                    <Image
                        source={{uri: userIcon}}
                        style={Styles.userIcon}
                        fadeDuration={0}
                        resizeMode={'center'}/>
                    <IconMaterial name={'navigate-next'} size={22}/>
                </View>
            </TouchableOpacity>
        );
    }
}

@inject('user', 'navigation') @observer
class Info extends Component {
    render() {
        return (
            <View style={Styles.wrap}>
                <NavActivity
                    navigator={this.props.navigation}
                    leftButton={{disabled: false}}
                    title={{title: '个人中心'}}/>
                <Header />
                <Detail />
            </View>
        )
    }
}

export default class User extends Component {
    render() {
        Util.log(debugKeyWord + 'render!!!');
        return (
            <Provider user={UserInfo} navigation={this.props.navigation}>
                <Info />
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
        backgroundColor: RBStyle.color.gray_bg
    },
    headerWrap: {
        width: Util.size.screen.width,
        height: 80,
        marginVertical: 15,
        paddingLeft: 20,
        paddingRight: 10,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: Util.size.screen.pixel,
        borderBottomWidth: Util.size.screen.pixel,
        borderColor: RBStyle.color.gray_line
    },
    rightZone: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userIcon: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 5
    },
    infoWrap: {
        width: Util.size.screen.width,
        paddingLeft: 20,
        paddingRight: 10,
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderTopWidth: Util.size.screen.pixel,
        borderBottomWidth: Util.size.screen.pixel,
        borderColor: RBStyle.color.gray_line
    },
    infoItem: {
        width: Util.size.screen.width - 30,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: Util.size.screen.pixel,
        borderColor: RBStyle.color.gray_line
    }
});