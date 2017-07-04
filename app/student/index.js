/**
 * Created by walkerxiong on 2017/6/17.
 */
'use strict';
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {DrawerNavigator, DrawerItems, NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Util from '../utility/util';
import Nearby from './nearby';
import SysSet from '../client/sysSet';
import Help from '../client/help';

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
        width: 50,
        height: 50,
        padding: 2,
        backgroundColor: '#FFA500',
        borderRadius: 25,
        borderWidth: Util.size.screen.pixel,
        borderColor: '#D3D3D3',
        marginBottom: 5
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
                        <Icon name={'user-circle'} size={45}/>
                    </View>
                    <Text style={Styles.nickName}>{'微风\n131****8387'}</Text>
                </View>
                <DrawerItems {...this.props}/>
                <View style={Styles.footer}>
                    <View style={Styles.footerWrap}>
                        <TouchableOpacity
                            style={[Styles.footerItem]}
                            activeOpacity={0.8}
                            onPress={() => {
                                // this.props.navigation.navigate('DrawerClose');
                                rootNavigation.navigate('About');
                            }}>
                            <Text style={Styles.footerFont}>{'关于'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[Styles.footerItem, {borderRightWidth: 0}]}
                            activeOpacity={0.8}
                            onPress={() => {
                                // this.props.navigation.navigate('DrawerClose');
                                rootNavigation.navigate('CustomerService');
                            }}>
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
    SysSet: {screen: SysSet},
    Help: {screen: Help},
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