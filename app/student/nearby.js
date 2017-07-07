/**
 * Created by hebao on 2017/6/27.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Animated,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {observable, action, autorun, computed} from 'mobx';
import {observer, Provider, inject} from 'mobx-react/native';
import AppStore from '../stores/testView/test';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import SplashScreen from 'react-native-smart-splash-screen';

import {MapView, MapTypes, Geolocation} from 'react-native-baidu-map';
import NavActivity from '../components/NavActivity';
import Util from '../utility/util';

const MyAniIcon = Animated.createAnimatedComponent(Icon);
const debugKeyWord = '[Nearby]';

@inject('store', 'navigation') @observer @reactMixin.decorate(TimerMixin)
class NearbyDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mapType: MapTypes.NORMAL,
            zoom: 15,
            center: null,
            markers: [],

            retryFocus: false,
            refreshAni: new Animated.Value(0),
            locFocusAni: new Animated.Value(1)
        };
    }

    onMapLoaded() {
        SplashScreen.close({
            animationType: SplashScreen.animationType.fade,
            duration: 500,
            delay: 100,
        });
        this.getCurrentPosition(null, () => {
            if (!this.state.retryFocus) {
                this.setTimeout(() => {
                    this.state.retryFocus = true;
                    this.onMapLoaded();
                }, 200);
            }
        });
    }

    getCurrentPosition(doneCallback, errorCallback) {
        Geolocation.getCurrentPosition().then((data) => {
            this.setState({
                center: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    rand: Math.random()
                },
                marker: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    title: '',
                    rand: Math.random()
                },
                zoom: 16
            }, () => {
                doneCallback instanceof Function && doneCallback();
            });
        }).catch((e) => {
            errorCallback instanceof Function && errorCallback();
        })
    }

    refreshMarkers() {
        Animated.timing(this.state.refreshAni, {
            toValue: 1,
            duration: 1000,
        }).start(() => {
            this.state.refreshAni.setValue(0);
        });
    }

    currLocFocus() {
        this.startLocFocusAni();
        this.getCurrentPosition();
    }

    startLocFocusAni() {
        Animated.timing(this.state.locFocusAni, {
            toValue: 0.8,
            duration: 500,
            useNativeDriver: true
        }).start(() => {
            Animated.timing(this.state.locFocusAni, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start();
        });
    }

    render() {
        return (
            <View style={Styles.wrap}>
                <NavActivity
                    navigator={this.props.navigation}
                    leftButton={{disabled: false, enableBackZone: false}}
                    menuButton={{disabled: false}}
                    title={{title: '附近'}}/>
                <MapView
                    style={Styles.map}
                    zoomControlsVisible={false}
                    zoom={this.state.zoom}
                    mapType={this.state.mapType}
                    center={this.state.center}
                    marker={this.state.marker}
                    markers={this.state.markers}
                    onMapLoaded={() => this.onMapLoaded()}
                    onMarkerClick={(e) => {
                    }}
                    onMapClick={(e) => {
                    }}/>
                <View style={Styles.mapTool}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => this.refreshMarkers()}
                        style={[Styles.mapToolItem, {marginBottom: 15}]}>
                        <MyAniIcon
                            name={'refresh'}
                            size={26}
                            style={{
                                transform: [{
                                    rotateZ: this.state.refreshAni.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0deg', '360deg']
                                    })
                                }]
                            }}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => this.currLocFocus()}
                        style={Styles.mapToolItem}>
                        <MyAniIcon
                            name={'my-location'}
                            size={26}
                            style={{
                                transform: [{
                                    scale: this.state.locFocusAni
                                }]
                            }}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default class Nearby extends Component {
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
    },
    mapTool: {
        position: 'absolute',
        bottom: 50,
        left: 35,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    mapToolItem: {
        width: 28,
        height: 28,
        backgroundColor: '#ffffff',
        borderRadius: 13,
        borderWidth: Util.size.screen.pixel,
        borderColor: '#FCFCFC',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
});