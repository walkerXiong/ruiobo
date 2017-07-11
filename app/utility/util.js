/**
 * Created by DELL on 2016/12/23.
 */
'use strict';
import React, {Component} from 'react';
import Dimensions from 'Dimensions';
import {
    PixelRatio,
    DeviceEventEmitter,
    Platform,
    BackHandler,
    StatusBar
} from 'react-native';
import Toast from 'react-native-root-toast';

import config from '../config';
const debugMsg = config.debugMsg;//是否开启打印

const screenWidth = Dimensions.get('window').width;//屏幕宽度
const screenHeight = Dimensions.get('window').height;//屏幕高度
const minPixel = PixelRatio.get();
const fontScale = PixelRatio.getFontScale();
const statusBarHeight_android = StatusBar.currentHeight;

const Util = {
    activeOpacity: 0.6,
    ActivityIndicatorColor: '#b3bbc0',

    platformAndroid: () => {
        return Platform.OS === 'android';
    },

    size: {
        screen: {
            pixel: 1 / minPixel,//最小线宽
            pixelRatio: minPixel,
            width: screenWidth,//屏幕宽度
            height: screenHeight,//屏幕高度
            fontScale: fontScale
        },
        statusBar: {
            height: Platform.OS === 'android' ? statusBarHeight_android : 20//状态栏高度，iOS=20，安卓通过StatusBar获取
        },
    },
    /**
     * 添加事件监听
     * event: 需要监听的事件
     * callback: 监听回调
     */
    addListener(event, callback){
        return DeviceEventEmitter.addListener(event, callback);
    },
    /**
     * 触发监听事件
     * event: 触发监听的事件
     * params: 事件携带参数
     */
    trigger(event, params){
        DeviceEventEmitter.emit(event, params);
    },
    /**
     * 移除监听事件
     * handle: addListener方法返回的句柄
     */
    removeListener(handle){
        handle && handle.remove();
    },
    /**
     * 物理按键
     */
    physicalButton: {
        _lastBackPressed: -1,
        _allowLeaveTime: 2000,
        _navigation: null,
        _topRouter: null,
        addBackEventListener(eventName, navigation, topRouter){
            Util.physicalButton._navigation = navigation;
            Util.physicalButton._topRouter = topRouter;
            return BackHandler.addEventListener(eventName, Util.physicalButton.onBackAndroid);
        },
        removeBackEventListener(hardWareBackHandle){
            hardWareBackHandle && hardWareBackHandle.remove();
        },
        onBackAndroid(){
            let navigation = Util.physicalButton._navigation;
            if (navigation) {
                let _routers = navigation.state;
                if (_routers.routeName !== Util.physicalButton._topRouter) {
                    navigation.goBack(null);
                    return true;
                }
                //如果路由层级已经为顶层，则两次单击退出
                if (Util.physicalButton._lastBackPressed !== -1 && (Util.physicalButton._lastBackPressed + Util.physicalButton._allowLeaveTime) >= Date.now()) {
                    return false;//2s之内连续按返回键，则退出应用
                }
                Util.physicalButton._lastBackPressed = Date.now();
                Util.toast.show("再按一次退出应用");
                return true;
            }
        }
    },
    /**
     * toast 提示框
     */
    toast: {
        durations: {
            LONG: 3500,
            SHORT: 2000
        },
        positions: {
            TOP: 80,
            BOTTOM: -80,
            CENTER: 0
        },
        /**
         * 显示Toast提示，该方法最多提供两个参数
         */
        show(){
            let _params = Array.prototype.slice.call(arguments), _toastHandle = null;
            switch (_params.length) {
                case 1:
                    _toastHandle = Toast.show(_params[0], {
                        duration: Util.toast.durations.SHORT,
                        position: Util.toast.positions.BOTTOM,
                        shadow: false,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                        backgroundColor: '#696969',
                        textColor: '#FFF'
                    });
                    break;
                case 2:
                    _toastHandle = Toast.show(_params[0], {
                        duration: _params[1].duration === 0 ? 0 : (_params[1].duration || Util.toast.durations.SHORT),
                        position: _params[1].position || Util.toast.positions.BOTTOM,
                        shadow: _params[1].shadow || false,
                        animation: _params[1].animation || true,
                        hideOnPress: _params[1].hideOnPress || true,
                        delay: _params[1].delay || 0,
                        backgroundColor: _params[1].backgroundColor || '#696969',
                        textColor: _params[1].textColor || '#FFF',
                        onShow: () => {
                            // calls on toast\`s appear animation start
                            _params[1].onShow instanceof Function ? _params[1].onShow() : null;
                        },
                        onShown: () => {
                            // calls on toast\`s appear animation end.
                            _params[1].onShown instanceof Function ? _params[1].onShown() : null;
                        },
                        onHide: () => {
                            // calls on toast\`s hide animation start.
                            _params[1].onHide instanceof Function ? _params[1].onHide() : null;
                        },
                        onHidden: () => {
                            // calls on toast\`s hide animation end.
                            _params[1].onHidden instanceof Function ? _params[1].onHidden() : null;
                        }
                    });
                    break;
                default :
                    break;
            }
            return _toastHandle;//用于隐藏Toast，该返回值传递给Toast.hide(_toastHandle);
        },
        /**
         * 隐藏toast提示
         * handle: show方法返回的句柄
         */
        hide(handle){
            handle && Toast.hide(handle);
        }
    },
    log(msg){
        debugMsg ? window.console.log("【UI】" + msg) : null;
    }
};

export default Util;