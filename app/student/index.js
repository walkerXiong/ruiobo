/**
 * Created by walkerxiong on 2017/6/17.
 */
'use strict';
import React from 'react';
import {DrawerNavigator} from 'react-navigation';
import Nearby from './nearby';
import DrawerContent from '../client/drawerContent';

const DrawerComponent = (props) => <DrawerContent {...props}/>;
const DrawerMenu = DrawerNavigator({
    Nearby: {screen: Nearby},
}, {
    initialRouteName: 'Nearby',
    drawerWidth: 200,
    drawerPosition: 'left',
    contentComponent: DrawerComponent,
    contentOptions: {
        activeTintColor: '#e91e63',
        activeBackgroundColor: '#ffffff',
        inactiveBackgroundColor: '#ffffff'
    },
});

export default (props) => <DrawerMenu screenProps={{rootNavigation: props.navigation}}/>