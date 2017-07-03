/**
 * Created by hebao on 2017/5/12.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Platform,
    BackHandler,
    DeviceEventEmitter,
    Animated,
    ViewPropTypes
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import * as Animatable from 'react-native-animatable';
Animatable.initializeRegistryWithDefinitions({
    SPK_translateY_in: {
        0: {translateY: 300, translateX: 0},
        1: {translateY: 0, translateX: 0}
    },
    SPK_translateY_out: {
        0: {translateY: 0},
        1: {translateY: 300}
    },
    SPK_translateXY_out: {
        0: {translateY: 0, translateX: -Util.size.screen.width},
        1: {translateY: 300, translateX: -Util.size.screen.width}
    },
    SPK_translateX_in: {
        0: {translateX: 0},
        1: {translateX: -Util.size.screen.width}
    },
    SPK_translateX_out: {
        0: {translateX: -Util.size.screen.width},
        1: {translateX: 0}
    },
    SPK_attachWrap_in: {
        0: {opacity: 0, scale: 0.85},
        0.3: {opacity: 0.8,},
        1: {opacity: 1, scale: 1}
    },
    SPK_attachWrap_out: {
        0: {opacity: 1, scale: 1},
        1: {opacity: 0, scale: 0.85}
    },
    SPK_container_in: {
        0: {opacity: 0.9},
        1: {opacity: 1}
    },
    SPK_container_out: {
        0: {opacity: 1},
        1: {opacity: 0.75}
    },
    SPK_shadeWrap_in: {
        0: {opacity: 0},
        1: {opacity: 0.75}
    },
    SPK_shadeWrap_out: {
        0: {opacity: 0.75},
        1: {opacity: 0}
    },
});

import Util from '../../utility/util';
const debugKeyWord = '[SecuredPayKeyboard]';

class KeyBoard extends Component {
    _dot_1 = null;
    _dot_2 = null;
    _dot_3 = null;
    _dot_4 = null;
    _dot_5 = null;
    _dot_6 = null;

    static defaultProps = {
        visible: false,//modal是否显示
        animationDuration: 200,//显示完整Modal的时间
        tapBackToHide: () => null,//点击其他区域是否关闭弹框
        modalDidClose: null,//Modal关闭时候的回调函数
    };

    constructor(props) {
        super(props);
        this.state = {
            value: '',//键盘输入的值
            pwMaxLength: 6,//安全键盘输入密码的最长长度
            pwScale_1: new Animated.Value(1),
            pwScale_2: new Animated.Value(1),
            pwScale_3: new Animated.Value(1),
            pwScale_4: new Animated.Value(1),
            pwScale_5: new Animated.Value(1),
            pwScale_6: new Animated.Value(1),
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if ((nextProps.visible === true || nextProps.visible === false) && nextProps.visible !== this.props.visible) {
            nextProps.visible === true ? this.modalShow() : this.modalHide();
        }
        return false;
    }

    modalShow() {
        let {visible, animationDuration} = this.props;
        if (visible === false) {
            this._attachWrap.SPK_attachWrap_in(animationDuration);
            this._keyboardWrap.SPK_translateY_in(animationDuration);
            this._shadeWrap.SPK_shadeWrap_in(animationDuration);
        }
    }

    modalHide() {
        let {visible, animationDuration, modalDidClose} = this.props;
        if (visible === true) {
            this._attachWrap.SPK_attachWrap_out(animationDuration);
            this.state.value.length === 6 ? this._keyboardWrap.SPK_translateXY_out(animationDuration) : this._keyboardWrap.SPK_translateY_out(animationDuration);
            this._shadeWrap.SPK_shadeWrap_out(animationDuration).then((endState) => {
                if (endState.finished) {
                    this._pwScale(0);
                    this.state.value = '';
                    modalDidClose instanceof Function && modalDidClose();
                }
            });
        }
    }

    _verifyPassword() {
        let {animationDuration} = this.props;
        this._keyboardWrap.SPK_translateX_in(animationDuration);
    }

    _pwScale(id) {
        let _i = 0;
        if (id == 0) {
            for (_i = 1; _i <= this.state.pwMaxLength; _i++) {
                this['_dot_' + _i].setNativeProps({style: {backgroundColor: '#eaeaea'}});
            }
        }
        else {
            for (_i = 1; _i <= this.state.pwMaxLength; _i++) {
                _i <= id ? this['_dot_' + _i].setNativeProps({style: {backgroundColor: '#ffe341'}}) : this['_dot_' + _i].setNativeProps({style: {backgroundColor: '#eaeaea'}});
            }
            Animated.timing(this.state['pwScale_' + id], {
                toValue: 1.2,
                duration: 100,
            }).start(() => {
                Animated.timing(this.state['pwScale_' + id], {
                    toValue: 1,
                    duration: 100,
                }).start(() => {
                    id == this.state.pwMaxLength ? this._verifyPassword() : null;
                });
            });
        }
    }

    _keyboardPress(id) {
        if (this.state.value.length >= this.state.pwMaxLength && id !== 'delete') return;
        if (id !== 'delete') {
            this.state.value += id;
        }
        else {
            this.state.value = this.state.value.substring(0, this.state.value.length - 1);
        }
        Util.log('inner keyboard _keyboardPress==value:' + this.state.value);
        this._pwScale(this.state.value.length);
    }

    render() {
        Util.log('inner keyboard render!!!');
        return (
            <View style={[Styles.wrap]}>
                <Animatable.View
                    useNativeDriver={true}
                    ref={(ref) => this._shadeWrap = ref}
                    style={[Styles.wrap, {backgroundColor: 'rgba(0,0,0,0.9)'}]}>
                    <TouchableOpacity activeOpacity={1} onPress={() => this.props.tapBackToHide()} style={Styles.wrap}/>
                </Animatable.View>
                <View
                    ref={(ref) => this._container = ref}
                    style={[Styles.container]}>
                    <Animatable.View
                        useNativeDriver={true}
                        ref={(ref) => this._attachWrap = ref}
                        style={[Styles.attachWrap]}>
                        <Text style={{fontSize: 18, marginVertical: 10}}>10000</Text>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Animated.View
                                ref={(ref) => this._dot_1 = ref}
                                style={[Styles.dot, {transform: [{scale: this.state.pwScale_1}]}]}/>
                            <Animated.View
                                ref={(ref) => this._dot_2 = ref}
                                style={[Styles.dot, {transform: [{scale: this.state.pwScale_2}]}]}/>
                            <Animated.View
                                ref={(ref) => this._dot_3 = ref}
                                style={[Styles.dot, {transform: [{scale: this.state.pwScale_3}]}]}/>
                            <Animated.View
                                ref={(ref) => this._dot_4 = ref}
                                style={[Styles.dot, {transform: [{scale: this.state.pwScale_4}]}]}/>
                            <Animated.View
                                ref={(ref) => this._dot_5 = ref}
                                style={[Styles.dot, {transform: [{scale: this.state.pwScale_5}]}]}/>
                            <Animated.View
                                ref={(ref) => this._dot_6 = ref}
                                style={[Styles.dot, {transform: [{scale: this.state.pwScale_6}], marginRight: 0}]}/>
                        </View>
                    </Animatable.View>
                    <Animatable.View
                        useNativeDriver={true}
                        ref={(ref) => this._keyboardWrap = ref}
                        style={[Styles.keyboardWrap]}>
                        <View style={Styles.keyboardZone}>
                            <View style={[Styles.keyboardContainer]}>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(1)}
                                    style={[Styles.section]}>
                                    <Text>1</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(2)}
                                    style={[Styles.section]}>
                                    <Text>2</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(3)}
                                    style={[Styles.section, {borderRightWidth: 0}]}>
                                    <Text>3</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={[Styles.keyboardContainer]}>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(4)}
                                    style={[Styles.section]}>
                                    <Text>4</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(5)}
                                    style={[Styles.section]}>
                                    <Text>5</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(6)}
                                    style={[Styles.section, {borderRightWidth: 0}]}>
                                    <Text>6</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={[Styles.keyboardContainer]}>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(7)}
                                    style={[Styles.section]}>
                                    <Text>7</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(8)}
                                    style={[Styles.section]}>
                                    <Text>8</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(9)}
                                    style={[Styles.section, {borderRightWidth: 0}]}>
                                    <Text>9</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={[Styles.keyboardContainer,{borderBottomWidth: 0}]}>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#ffffff'}
                                    style={[Styles.section]}>
                                    <Text>{'secure'}</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(0)}
                                    style={[Styles.section]}>
                                    <Text>0</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress('delete')}
                                    style={[Styles.section, {borderRightWidth: 0}]}>
                                    <Text>delete</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={Styles.keyboardZone}>
                            <Text>verifying...</Text>
                        </View>
                    </Animatable.View>
                </View>
            </View>
        );
    }
}

export default class SecuredPayKeyboard extends Component {
    _hardwareBackPressHandle = null;//物理返回键监听句柄
    _hardwareBackPress = null;//安卓物理返回键案件回调函数

    static defaultProps = {
        visible: false,//modal是否显示
        allowHardwareBackHideModal: true,//是否允许安卓返回键隐藏Modal
        hardwareBackPress: null,//自定义响应安卓硬件返回键
        tapBackToHide: true,//点击其他区域是否关闭弹框
        onRequestToClose: () => null,//关闭Modal的唯一途径只有通过props.visible来关闭，此回调函数就是用于父组件更新props.visible，并且此属性isRequired
        modalDidClose: null,//Modal关闭时候的回调函数
    };

    constructor(props) {
        super(props);
        this.state = {
            show: props.visible
        }
    }

    componentDidMount() {
        let {hardwareBackPress} = this.props;
        this._hardwareBackPress = hardwareBackPress instanceof Function ? hardwareBackPress : this.hardwareBackPress.bind(this);
        this._hardwareBackPressHandle = BackHandler.addEventListener('hardwareBackPress', this._hardwareBackPress);
    }

    componentWillReceiveProps(nextProps, nextState) {
        nextProps.visible === true && this.setState({show: true});
    }

    componentWillUnmount() {
        this._hardwareBackPressHandle.remove();
    }

    hardwareBackPress() {
        if (this.props.visible) {
            if (this.props.allowHardwareBackHideModal) {
                this.props.onRequestToClose();
            }
            return true;
        }
        return false;
    }

    tapBackToHide() {
        let {tapBackToHide, onRequestToClose} = this.props;
        if (tapBackToHide) onRequestToClose();
    }

    modalDidClose() {
        this.setState({show: false}, () => {
            this.props.modalDidClose && this.props.modalDidClose();
        });
    }

    render() {
        Util.log(debugKeyWord + 'render!!!');
        return (
            <View style={[Styles.wrap, {transform: [{translateY: this.state.show ? 0 : 10000}]}]}>
                <KeyBoard
                    visible={this.props.visible}
                    tapBackToHide={this.tapBackToHide.bind(this)}
                    modalDidClose={this.modalDidClose.bind(this)}/>
            </View>
        );
    }
}

SecuredPayKeyboard.propTypes = {
    visible: PropTypes.bool,
    allowHardwareBackHideModal: PropTypes.bool,
    hardwareBackPress: PropTypes.func,
    animationDuration: PropTypes.number,
    tapBackToHide: PropTypes.bool,
    onRequestToClose: PropTypes.func.isRequired,
    modalDidClose: PropTypes.func,
};

const Styles = StyleSheet.create({
    wrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
    },
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#ffffff'
    },
    attachWrap: {
        width: Util.size.screen.width,
        height: 100,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    keyboardWrap: {
        width: Util.size.screen.width * 2,
        height: 280,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    keyboardZone: {
        width: Util.size.screen.width,
        height: 280,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: Util.size.screen.pixel,
        borderColor: '#eaeaea'
    },
    keyboardContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: Util.size.screen.pixel,
        borderColor: '#eaeaea'
    },
    section: {
        flex: 1,
        height: 70,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: Util.size.screen.pixel,
        borderRightColor: '#eaeaea'
    },
    dot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#eaeaea',
        marginRight: 20
    }
});