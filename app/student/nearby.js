/**
 * Created by hebao on 2017/6/27.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Button
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {observable, action, autorun, computed} from 'mobx';
import {observer, Provider, inject} from 'mobx-react/native';
import AppStore from '../stores/testView/test';

import {MapView, MapTypes, Geolocation} from 'react-native-baidu-map';
import NavActivity from '../components/NavActivity';
import Util from '../utility/util';

const debugKeyWord = '[Nearby]';

@inject('store', 'navigation') @observer
class NearbyDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mapType: MapTypes.NORMAL,
            zoom: 15,
            center: null,
            markers: []
        };
    }

    render() {
        return (
            <View style={Styles.wrap}>
                <NavActivity title={{title: '测试页面'}}/>
                <MapView
                    style={Styles.map}
                    zoomControlsVisible={false}
                    zoom={this.state.zoom}
                    mapType={this.state.mapType}
                    center={this.state.center}
                    marker={this.state.marker}
                    markers={this.state.markers}
                    onMapLoaded={}
                    onMarkerClick={(e) => {
                    }}
                    onMapClick={(e) => {
                    }}/>
            </View>
        )
    }
}

export default class Nearby extends Component {
    static navigationOptions = {
        drawerLabel: '附近的老师',
        drawerIcon: ({tintColor}) => (
            <Icon
                name={'md-list-box'}
                size={24}
                style={{color: tintColor}}/>
        )
    };

    render() {
        Util.log(debugKeyWord + 'render!!!');
        return (
            <Provider store={AppStore} navigation={this.props.navigation}>
                <NearbyDetail/>
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
        backgroundColor: '#ffffff'
    },
    map: {
        width: Util.size.screen.width,
        height: Util.size.screen.height - NavActivity.getHeaderHeight(true),
    }
});