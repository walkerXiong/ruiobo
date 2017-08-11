/**
 * Created by hebao on 2017/5/12.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import Modal from '../components/ModalActivity';
import Util from '../utility/util';
import * as ACTIONS from '../utility/events';
import RBStyle from '../styles/standard';

const debugKeyWord = '[AlertSys]';

export default class AlertSys extends Component {
    _alertShowHandle = null;

    constructor(props) {
        super(props);
        this.state = {
            alertShow: false,//是否显示alert
            alertTitle: '',//标题
            alertDetail: '',//详情
            alertAttach: '',//附加说明
            alertBtnNum: 1,//alert弹窗的button个数
            alertBtnFont: [],//各个button的文案
            alertBtnCallback: [],//各个button的回调函数数组
        }
    }

    componentDidMount() {
        this._alertShowHandle = Util.addListener(ACTIONS.ACTION_SYSALERT_SHOW, this._alertShow.bind(this));
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    componentWillUnmount() {
        Util.removeListener(this._alertShowHandle);
    }

    _alertShow(payload) {
        if (payload.alertShow === true) {
            this.setState({...payload}, () => {
                payload.onAlertShow instanceof Function && payload.onAlertShow();
            });
        }
        else if (payload.alertShow === false) {
            this.resetAlert(payload.hiddenCallback);
        }
    }

    resetAlert(hiddenCallback) {
        this.setState({
            alertShow: false,//是否显示alert
            alertTitle: '',//标题
            alertDetail: '',//详情
            alertAttach: '',//附加说明
            alertBtnNum: 1,//alert弹窗的button个数
            alertBtnFont: [],//各个button的文案
            alertBtnCallback: [],//各个button的回调函数数组
        }, () => {
            hiddenCallback instanceof Function && hiddenCallback();
        });
    }

    btnPressCallback(id) {
        let {alertBtnCallback} = this.state;
        alertBtnCallback[id] instanceof Function && alertBtnCallback[id]();
    }

    checkAlertBtn() {
        let {alertBtnNum, alertBtnFont} = this.state;
        if (alertBtnNum == 1) {
            return (
                <View style={Styles.oneBtn}>
                    <TouchableHighlight
                        underlayColor={RBStyle.color.gray_press}
                        onPress={() => this.btnPressCallback(0)}
                        style={[Styles.oneBtn, Styles.oneBtnRadius]}>
                        <Text style={Styles.btnFont}>{alertBtnFont[0]}</Text>
                    </TouchableHighlight>
                </View>
            );
        }
        else if (alertBtnNum == 2) {
            return (
                <View style={Styles.section}>
                    <TouchableHighlight
                        underlayColor={RBStyle.color.gray_press}
                        onPress={() => this.btnPressCallback(0)}
                        style={[Styles.twoBtn, {borderBottomLeftRadius: 20}]}>
                        <Text style={Styles.btnFont}>{alertBtnFont[0]}</Text>
                    </TouchableHighlight>
                    <View style={Styles.divideLinear}/>
                    <TouchableHighlight
                        underlayColor={RBStyle.color.gray_press}
                        onPress={() => this.btnPressCallback(1)}
                        style={[Styles.twoBtn, {borderBottomRightRadius: 20}]}>
                        <Text style={Styles.btnFont}>{alertBtnFont[1]}</Text>
                    </TouchableHighlight>
                </View>
            );
        }
    }

    render() {
        let {alertShow, alertTitle, alertDetail, alertAttach} = this.state;
        Util.log(debugKeyWord + 'render===show:' + alertShow);
        return (
            <Modal
                springOption={{velocity: 3, friction: 10}}
                onRequestToClose={() => null}
                visible={alertShow}
                containerStyle={Styles.wrap}>
                <View style={Styles.container}>
                    {alertTitle ? <Text style={Styles.title}>{alertTitle}</Text> : null}
                    <View style={[Styles.container, {marginTop: alertTitle ? 0 : 34, marginBottom: 34}]}>
                        <Text style={Styles.detail}>{alertDetail}</Text>
                        {alertAttach ? <Text style={Styles.attach}>{alertAttach}</Text> : null}
                    </View>
                    {this.checkAlertBtn()}
                </View>
            </Modal>
        )
    }
}

const Styles = StyleSheet.create({
    wrap: {
        width: 292,
        borderRadius: 20,
        backgroundColor: RBStyle.color.white_bg,
        paddingHorizontal: 22,
        paddingVertical: 0,
        margin: 0,
        alignSelf: 'center'
    },
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    section: {
        width: 292,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: Util.size.screen.pixel,
        borderTopColor: RBStyle.color.gray_line
    },
    title: {
        fontSize: 18,
        color: RBStyle.color.wblack,
        marginVertical: 22
    },
    detail: {
        fontSize: 16,
        color: RBStyle.color.wblack,
        textAlign: 'center'
    },
    attach: {
        fontSize: 14,
        color: RBStyle.color.wgray_main,
        marginTop: 16,
        textAlign: 'center'
    },
    oneBtn: {
        width: 292,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: Util.size.screen.pixel,
        borderTopColor: RBStyle.color.gray_line,
    },
    oneBtnRadius: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
    twoBtn: {
        flex: 1,
        height: 50,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    divideLinear: {
        height: 50,
        width: Util.size.screen.pixel,
        borderRightWidth: Util.size.screen.pixel,
        borderRightColor: RBStyle.color.gray_line
    },
    btnFont: {
        fontSize: 18,
        color: RBStyle.color.worange
    }
});