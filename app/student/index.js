/**
 * Created by walkerxiong on 2017/6/17.
 */
'use strict';
import React from 'react';
import {DrawerNavigator} from 'react-navigation';
import Nearby from './nearby';

const StudentDrawer = DrawerNavigator({
    Nearby: {screen: Nearby},
}, {
    initialRouteName: 'Nearby',
    drawerWidth: 200,
    drawerPosition: 'left',
    contentOptions: {
        activeTintColor: '#e91e63',
    },
});

export default () => <StudentDrawer/>;