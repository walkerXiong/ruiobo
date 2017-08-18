/**
 * Created by hebao on 2017/8/17.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Text,
    TextInput,
    Image,
    Animated,
    Easing,
    Keyboard
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {observable, action, autorun, computed} from 'mobx';
import {observer, Provider, inject} from 'mobx-react/native';
import UserInfo from '../stores/userInfo';

import RBStyle from '../styles/standard';
import Util from '../utility/util';

const debugKeyWord = '[login]';
const MyAniIcons = Animated.createAnimatedComponent(SimpleLineIcons);
Animatable.initializeRegistryWithDefinitions({
    login_password: {
        easing: 'ease-in-out',
        0: {
            translateX: -Util.size.screen.width,
        },
        0.4: {
            translateX: -Util.size.screen.width - 15
        },
        1: {
            translateX: 0,
        },
    },
    login_verifyCode: {
        easing: 'ease-in-out',
        0: {
            translateX: 0,
        },
        0.4: {
            translateX: 15
        },
        1: {
            translateX: -Util.size.screen.width,
        },
    }
});

@inject('user', 'state') @observer
class Footer extends Component {
    checkRegister() {
        let {onRegister, loginType, loginPanel, nextButton} = this.props.state;
        if (onRegister) {
            this.props.state.onRegister = !onRegister;
            loginType === 1 ? loginPanel.switchLoginType() : null;
        }
        else {
            loginType === 0 ? loginPanel.switchLoginType() : null;
            this.props.state.onRegister = !onRegister;
        }
        nextButton.checkRegister();
    }

    render() {
        let {onRegister} = this.props.state;
        return (
            <TouchableOpacity
                style={Styles.footer}
                activeOpacity={0.8}
                onPress={() => this.checkRegister()}>
                {onRegister ?
                    <FontAwesome
                        name={'angle-double-left'}
                        size={13}
                        color={RBStyle.color.worange}
                        style={{marginRight: 5}}/> : null}
                <Text style={Styles.font_4}>{onRegister ? '返回登录' : '没有账号，立即注册'}</Text>
                {onRegister ? null :
                    <FontAwesome
                        name={'angle-double-right'}
                        size={13}
                        color={RBStyle.color.worange}
                        style={{marginLeft: 5}}/>}
            </TouchableOpacity>
        )
    }
}

@inject('user', 'state') @observer
class NextButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            touchAble: false,
            fontTranslateY: new Animated.Value(0)
        };
        this.props.state.nextButton = this;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.touchAble !== this.state.touchAble;
    }

    ableTouch(enable) {
        this.setState({touchAble: enable});
    }

    checkNextStep() {
        Util.log(debugKeyWord + 'checkNextStep');
        Keyboard.dismiss();
        this.setState({touchAble: false}, () => {

        });
    }

    checkRegister() {
        let {onRegister} = this.props.state;
        if (onRegister) {
            Animated.timing(this.state.fontTranslateY, {
                toValue: -50,
                duration: 300,
                easing: Easing.ease
            }).start();
        }
        else {
            Animated.timing(this.state.fontTranslateY, {
                toValue: 0,
                duration: 300,
                easing: Easing.ease
            }).start();
        }
    }

    render() {
        Util.log(debugKeyWord + 'NextButton render!!!');
        return (
            <TouchableHighlight
                underlayColor={RBStyle.color.btny_p}
                onPress={() => this.state.touchAble && this.checkNextStep()}
                disabled={!this.state.touchAble}
                style={[RBStyle.button.btn_l, {
                    marginTop: 32,
                    justifyContent: 'flex-start',
                    backgroundColor: this.state.touchAble ? RBStyle.color.btny : RBStyle.color.btny_d
                }]}>
                <Animated.View style={[Styles.nextBtnFontWrap, {transform: [{translateY: this.state.fontTranslateY}]}]}>
                    <View style={Styles.nextBtnFont}><Text style={Styles.font_3}>{'登    录'}</Text></View>
                    <View style={Styles.nextBtnFont}><Text style={Styles.font_3}>{'注    册'}</Text></View>
                </Animated.View>
            </TouchableHighlight>
        );
    }
}

@inject('user', 'state') @observer
class LoginPanel extends Component {
    _inputPassword = null;

    constructor(props) {
        super(props);
        this.state = {
            switchRotateZ: new Animated.Value(180),
            switchDone: true
        };
        this.props.state.loginPanel = this;
    }

    switchLoginType() {
        let {switchDone} = this.state;
        let {loginType, onRegister} = this.props.state;
        if (!switchDone || onRegister) return;
        this.props.state.loginType = loginType === 0 ? 1 : 0;
        this.state.switchDone = !switchDone;
        if (this.props.state.loginType === 1) {
            Animated.timing(this.state.switchRotateZ, {
                duration: 300,
                toValue: 0,
                easing: Easing.ease
            }).start(() => this.state.switchDone = true);
            this._inputPassword.login_verifyCode(300);
        }
        else {
            Animated.timing(this.state.switchRotateZ, {
                duration: 300,
                toValue: 180,
                easing: Easing.ease
            }).start(() => this.state.switchDone = true);
            this._inputPassword.login_password(300);
        }
    }

    getVerifyCode() {

    }

    render() {
        let {phoneNumber} = this.props.user.base;
        let {switchRotateZ} = this.state;
        let {onRegister} = this.props.state;
        return (
            <View style={Styles.loginPanel}>
                <View style={Styles.account}>
                    <Text style={Styles.font_1}>{'账    号'}</Text>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        placeholder={onRegister ? '请输入手机号': phoneNumber ? phoneNumber : '请输入手机号'}
                        placeholderTextColor={'#cbcbcb'}
                        style={[Styles.commonInput, {
                            borderBottomWidth: Util.size.screen.pixel,
                            borderBottomColor: RBStyle.color.gray_line
                        }]}/>
                </View>
                <Animatable.View
                    ref={(ref) => this._inputPassword = ref}
                    useNativeDriver={true}
                    style={[Styles.passwordWrap, {transform: [{translateX: 0}]}]}>
                    <View style={Styles.password}>
                        <Text style={Styles.font_1}>{'密    码'}</Text>
                        <TextInput
                            secureTextEntry={true}
                            underlineColorAndroid={'transparent'}
                            placeholder={'请输入登陆密码'}
                            placeholderTextColor={'#cbcbcb'}
                            style={[Styles.commonInput]}/>
                    </View>
                    <View style={Styles.password}>
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            placeholder={'请输入验证码'}
                            placeholderTextColor={'#cbcbcb'}
                            maxLength={4}
                            style={[Styles.commonInput]}/>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => this.getVerifyCode()}
                            style={[RBStyle.button.btn_input, {backgroundColor: RBStyle.color.btnr, marginRight: 50}]}>
                            <Text style={Styles.font_2}>{'点击获取'}</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => this.switchLoginType()}
                    style={Styles.switchButton}>
                    <MyAniIcons
                        name={'arrow-right-circle'}
                        size={22}
                        color={'#676767'}
                        style={{
                            marginLeft: 15,
                            transform: [{
                                rotateZ: switchRotateZ.interpolate({
                                    inputRange: [0, 180],
                                    outputRange: ['0deg', '180deg']
                                })
                            }]
                        }}/>
                </TouchableOpacity>
            </View>
        );
    }
}

@inject('user') @observer
class Header extends Component {
    render() {
        let {userIcon} = this.props.user.base;
        return (
            <View style={Styles.headerWrap}>
                <View style={Styles.userIconWrap}>
                    <Image
                        source={{uri: userIcon}}
                        style={Styles.userIcon}
                        fadeDuration={0}
                        resizeMode={'center'}/>
                </View>
            </View>
        );
    }
}

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = observable({
            @observable loginType: 0,//0: 表示使用密码 1: 表示使用验证码
            @observable onRegister: false,//表示是否正在进行注册操作
            @observable loginPanel: null,//注册面板实例
            @observable nextButton: null,//下一步按钮实例
        });
    }

    render() {
        Util.log(debugKeyWord + 'render!!!');
        return (
            <Provider
                user={UserInfo}
                state={this.state}
                navigation={this.props.navigation}>
                <View style={Styles.wrap}>
                    <Header />
                    <LoginPanel />
                    <NextButton />
                    <Footer />
                </View>
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
        backgroundColor: RBStyle.color.gray_bg
    },
    headerWrap: {
        width: Util.size.screen.width,
        height: Util.size.screen.height / 3,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    userIconWrap: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40
    },
    userIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    loginPanel: {
        width: Util.size.screen.width,
        height: RBStyle.size.h_list * 2,
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderTopWidth: Util.size.screen.pixel,
        borderBottomWidth: Util.size.screen.pixel,
        borderColor: RBStyle.color.gray_line
    },
    account: {
        width: Util.size.screen.width,
        height: RBStyle.size.h_list,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    passwordWrap: {
        width: Util.size.screen.width * 2,
        height: RBStyle.size.h_list,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    password: {
        width: Util.size.screen.width,
        height: RBStyle.size.h_list,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    font_1: {
        fontSize: 16,
        color: '#676767',
        marginRight: 10
    },
    font_2: {
        fontSize: 13,
        color: RBStyle.color.wwhite,
    },
    font_3: {
        fontSize: 18,
        color: RBStyle.color.wwhite
    },
    font_4: {
        fontSize: 13,
        color: RBStyle.color.worange,
    },
    commonInput: {
        flex: 1,
        height: RBStyle.size.h_list,
        margin: 0,
        padding: 0,
        borderWidth: 0,
        fontSize: 16,
        color: RBStyle.color.wblack,
        textAlign: 'left'
    },
    switchButton: {
        position: 'absolute',
        top: -RBStyle.size.h_list,
        right: -RBStyle.size.h_list * 3,
        width: RBStyle.size.h_list * 4,
        height: RBStyle.size.h_list * 4,
        borderRadius: RBStyle.size.h_list * 2,
        backgroundColor: '#e8e8e8',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    footer: {
        width: Util.size.screen.width,
        marginTop: 32,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    nextBtnFontWrap: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    nextBtnFont: {
        height: 50,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
});