/**
 * Created by walkerxiong on 2017/6/17.
 */
'use strict';
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {DrawerNavigator, DrawerItems, NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import Util from '../utility/util';
import Nearby from './nearby';

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
    userIcon: {
        width: 70,
        height: 70,
        padding: 2,
        backgroundColor: '#FFA500',
        borderRadius: 35,
        borderWidth: Util.size.screen.pixel,
        borderColor: '#D3D3D3',
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nickName: {
        fontSize: 18,
        color: '#C4C4C4',
        textAlign: 'center'
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

class DrawerContent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {rootNavigation} = this.props.screenProps;
        return (
            <View style={Styles.container}>
                <View style={Styles.header}>
                    <View style={Styles.userIcon}>
                        <Icon name={'user'} size={45}/>
                    </View>
                    <Text style={Styles.nickName}>{'微风\n131****8387'}</Text>
                </View>
                <TouchableOpacity style={{
                    width: 200,
                    paddingHorizontal: 30,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Icon name={'paper-plane'} size={22} color={this.props.activeTintColor}/>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 10
                    }}>
                        <Text style={{fontSize: 16, color: this.props.activeTintColor, fontWeight: 'bold'}}>
                            {'附近的老师'}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => rootNavigation.navigate('Help')}
                    style={{
                        width: 200,
                        paddingHorizontal: 30,
                        paddingVertical: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                    <Icon name={'question'} size={22} color={this.props.activeTintColor}/>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 10
                    }}>
                        <Text style={{fontSize: 16, color: this.props.activeTintColor, fontWeight: 'bold'}}>
                            {'使用指南'}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => rootNavigation.navigate('SysSet')}
                    style={{
                        width: 200,
                        paddingHorizontal: 30,
                        paddingVertical: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                    <Icon name={'settings'} size={22} color={this.props.activeTintColor}/>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 10
                    }}>
                        <Text style={{fontSize: 16, color: this.props.activeTintColor, fontWeight: 'bold'}}>
                            {'设置'}
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={Styles.footer}>
                    <TouchableOpacity
                        onPress={() => rootNavigation.navigate('TeacherClient')}
                        style={{
                            width: 150,
                            height: 30,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#FFEC8B',
                            borderRadius: 10,
                            marginBottom: 20
                        }}>
                        <Text style={{fontSize: 18, color: '#8B6508', fontWeight: 'bold', marginRight: 5}}>
                            {'我是老师'}
                        </Text>
                        <IconMaterial name={'navigate-next'} size={22}/>
                    </TouchableOpacity>
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
            </View>
        );
    }
}

const DrawerMenu = DrawerNavigator({
    Nearby: {screen: Nearby},
}, {
    initialRouteName: 'Nearby',
    drawerWidth: 200,
    drawerPosition: 'left',
    contentComponent: DrawerContent,
    contentOptions: {
        activeTintColor: '#e91e63',
        activeBackgroundColor: '#ffffff',
        inactiveBackgroundColor: '#ffffff'
    },
});

export default class StudentClient extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <DrawerMenu screenProps={{rootNavigation: this.props.navigation}}/>;
    }
};