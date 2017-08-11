/**
 * Created by hebao on 2017/7/11.
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {observer, Provider, inject} from 'mobx-react/native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import UserInfo from '../stores/userInfo';
import Util from '../utility/util';

const drawerItems_student = [{
    icon: 'paper-plane',
    profile: '附近的老师',
    navRoute: 'DrawerClose'
}, {
    icon: 'question',
    profile: '使用指南',
    navRoute: 'Help'
}, {
    icon: 'settings',
    profile: '系统设置',
    navRoute: 'SysSet'
}];

const drawerItems_teacher = [{
    icon: 'list',
    profile: '订单列表',
    navRoute: 'DrawerClose'
}, {
    icon: 'question',
    profile: '使用指南',
    navRoute: 'Help'
}, {
    icon: 'settings',
    profile: '系统设置',
    navRoute: 'SysSet'
}];

@inject('user') @observer
class FooterInfo extends Component {
    resetTo() {
        let {rootNavigation} = this.props.screenProps;
        rootNavigation.dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({routeName: 'TeacherClient'})
            ]
        }));
    }

    render() {
        let {rootNavigation} = this.props.screenProps;
        let {isStudent} = this.props.user.base;
        return (
            <View style={Styles.footer}>
                {
                    isStudent ?
                        <TouchableOpacity
                            onPress={() => this.resetTo()}
                            style={Styles.teacherContainer}>
                            <Text style={Styles.teacherFont}>{'我是老师'}</Text>
                            <IconMaterial name={'navigate-next'} size={22}/>
                        </TouchableOpacity> : null
                }
                <View style={Styles.footerWrap}>
                    <TouchableOpacity
                        style={[Styles.footerItem]}
                        activeOpacity={0.8}
                        onPress={() => rootNavigation.navigate('About')}>
                        <Text style={Styles.footerFont}>{'关于'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[Styles.footerItem, {borderRightWidth: 0}]}
                        activeOpacity={0.8}
                        onPress={() => rootNavigation.navigate('CustomerService')}>
                        <Text style={Styles.footerFont}>{'客服'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

@inject('user') @observer
class DrawerItems extends Component {
    navItem(navRoute) {
        let {rootNavigation} = this.props.screenProps;
        navRoute === 'DrawerClose' ? this.props.navigation.navigate(navRoute) : rootNavigation.navigate(navRoute);
    }

    checkDrawerItems() {
        let {isStudent} = this.props.user.base;
        let drawerItems = isStudent ? drawerItems_student : drawerItems_teacher;
        return (
            drawerItems.map((s, i) => {
                return (
                    <TouchableOpacity
                        key={i}
                        onPress={() => this.navItem(s.navRoute)}
                        style={Styles.drawerItemWrap}>
                        <Icon name={s.icon} size={22} color={this.props.activeTintColor}/>
                        <Text style={[Styles.drawerItem, {color: this.props.activeTintColor}]}>{s.profile}</Text>
                    </TouchableOpacity>
                );
            })
        );
    }

    render() {
        return (
            <View style={Styles.drawer}>
                {this.checkDrawerItems()}
            </View>
        );
    }
}

@inject('user') @observer
class HeaderInfo extends Component {
    render() {
        let {nickName, userIcon} = this.props.user.base;
        let {rootNavigation} = this.props.screenProps;
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => rootNavigation.navigate('UserInfo')}
                style={Styles.header}>
                <View style={Styles.userIconWrap}>
                    <Image
                        source={{uri: userIcon}}
                        style={Styles.userIcon}
                        fadeDuration={0}
                        resizeMode={'center'}/>
                </View>
                <Text style={Styles.nickName}>{`${nickName}`}</Text>
            </TouchableOpacity>
        )
    }
}

export default class DrawerContent extends Component {
    render() {
        return (
            <Provider user={UserInfo}>
                <View style={Styles.container}>
                    <HeaderInfo {...this.props}/>
                    <DrawerItems {...this.props}/>
                    <FooterInfo {...this.props}/>
                </View>
            </Provider>
        );
    }
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    header: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 50
    },
    userIconWrap: {
        width: 84,
        height: 84,
        borderRadius: 42,
        borderWidth: Util.size.screen.pixel,
        borderColor: '#D3D3D3',
        marginBottom: 15,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    userIcon: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    nickName: {
        fontSize: 18,
        color: '#C4C4C4',
        textAlign: 'center'
    },
    drawer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    drawerItemWrap: {
        width: 200,
        paddingHorizontal: 30,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    drawerItem: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    teacherContainer: {
        width: 150,
        height: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFEC8B',
        borderRadius: 10,
        marginBottom: 20
    },
    teacherFont: {
        fontSize: 18,
        color: '#8B6508',
        fontWeight: 'bold',
        marginRight: 5
    },
    footer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    footerWrap: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50
    },
    footerItem: {
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRightColor: '#C4C4C4',
        borderRightWidth: Util.size.screen.pixel
    },
    footerFont: {
        fontSize: 14,
        color: '#C4C4C4',
        textAlign: 'center'
    }
});