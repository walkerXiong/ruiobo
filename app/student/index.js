/**
 * Created by walkerxiong on 2017/6/17.
 */
'use strict';
import React, {Component} from 'react';
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

export default class StudentClient extends Component {
    _defaultGetStateForAction = null;

    componentDidMount() {
        this._defaultGetStateForAction = DrawerMenu.router.getStateForAction;
        DrawerMenu.router.getStateForAction = this._getStateForAction.bind(this);
    }

    _getStateForAction(action, state) {
        if (state && state.index === 1) {
            let {navigation} = this.props;
            let {getRootNavigator} = navigation.state.params;
            if (getRootNavigator instanceof Function) {
                let _rootNavigator = getRootNavigator();
                if (_rootNavigator.state && _rootNavigator.state.nav.index >= 1) {
                    return null;
                }
            }
        }
        return this._defaultGetStateForAction(action, state);
    }

    render() {
        return <DrawerMenu screenProps={{rootNavigation: this.props.navigation}}/>
    }
}