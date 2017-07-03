/**
 * Created by walkerxiong on 2017/6/17.
 */
'use strict';
import React from 'react';
import {DrawerNavigator} from 'react-navigation';
import PersonalInfo from './personalInfo';
import OrderList from './orderList';
import SysSet from './sysSet';
import Help from './help';

const TeacherDrawer = DrawerNavigator({
    personalInfo: {screen: PersonalInfo},
    orderRequire: {screen: OrderList},
    sysSet: {screen: SysSet},
    help: {screen: Help}
}, {
    initialRouteName: 'orderRequire',
    drawerWidth: 200,
    drawerPosition: 'left',
    contentOptions: {
        activeTintColor: '#e91e63',
    },
});

export default () => <TeacherDrawer/>;