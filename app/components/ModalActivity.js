/**
 * Created by hebao on 2017/5/12.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Animated,
    ViewPropTypes,
    Modal
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';

import Util from '../utility/util';
const debugKeyWord = '[ModalActivity]';
export default class ModalActivity extends Component {

    static defaultProps = {
        visible: false,//modal是否显示
        springOption: {
            velocity: 3,
        },//弹框摩擦选项
        shadeStartOpacity: 0,//背景蒙层一开始出现的透明度
        shadeEndOpacity: 0.75,//背景蒙层的透明度
        initScale: 0.85,//初始放大的倍数
        animationDuration: 100,//显示完整Modal的时间
        tapBackToHide: false,//点击其他区域是否关闭弹框
        onRequestToClose: () => null,//关闭Modal的唯一途径只有通过props.visible来关闭，此回调函数就是用于父组件更新props.visible，并且此属性isRequired
        wrapStyle: null,//最外层Modal的样式
        containerStyle: null,//Modal内部组件样式，建议使用alignSelf来决定内部组件的位置，避免使用flex:1，导致按其他区域不能消失弹框
        modalDidClose: null,//Modal关闭时候的回调函数
    };

    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
            shadeOpacity: new Animated.Value(props.shadeStartOpacity),
            currScale: new Animated.Value(props.initScale),
            containerOpacity: new Animated.Value(1),
        };
    }

    componentWillReceiveProps(nextProps, nextState) {
        if ((nextProps.visible === true || nextProps.visible === false) && nextProps.visible !== this.props.visible) {
            nextProps.visible === true ? this.modalShow() : this.modalHide();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.visible === false) {
            return nextState.visible !== this.state.visible;
        }
        return shallowCompare(this, nextProps, nextState);
    }

    componentWillUnmount() {
        this._hardwareBackPressHandle.remove();
    }

    modalShow() {
        if (this.state.visible === false) {
            this.setState({
                visible: true
            });
        }
    }

    onShow() {
        let {shadeEndOpacity, animationDuration, springOption} = this.props;
        this.state.containerOpacity.setValue(1);
        Animated.parallel([
            Animated.spring(this.state.currScale, {
                toValue: 1,
                duration: animationDuration,
                ...springOption
            }),
            Animated.timing(this.state.shadeOpacity, {
                toValue: shadeEndOpacity,
                duration: animationDuration
            })
        ]).start();
    }

    modalHide() {
        if (this.state.visible === true) {
            let {animationDuration, shadeStartOpacity, initScale, modalDidClose} = this.props;
            //Animated.parallel() callback exec will delay little time , usually is 600ms , so abort it.
            Animated.spring(this.state.currScale, {
                toValue: initScale,
                duration: animationDuration,
            }).start();
            Animated.timing(this.state.containerOpacity, {
                toValue: shadeStartOpacity,
                duration: animationDuration
            }).start();
            Animated.timing(this.state.shadeOpacity, {
                toValue: shadeStartOpacity,
                duration: animationDuration
            }).start(() => {
                this.setState({visible: false}, () => {
                    modalDidClose instanceof Function && modalDidClose();
                });
            });
        }
    }

    tapBackToHide() {
        let {tapBackToHide, onRequestToClose} = this.props;
        if (tapBackToHide) onRequestToClose();
    }

    render() {
        Util.log(debugKeyWord + 'render!!!');
        let {children, wrapStyle, containerStyle, onRequestToClose} = this.props;
        return (
            <Modal
                visible={this.state.visible}
                onRequestClose={() => onRequestToClose()}
                transparent={true}
                hardwareAccelerated={true}
                onShow={() => this.onShow()}
                animationType={'none'}>
                <View style={[Styles.wrap, wrapStyle]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => this.tapBackToHide()}
                        style={Styles.wrap}>
                        <Animated.View
                            style={[Styles.wrap, {backgroundColor: '#000000', opacity: this.state.shadeOpacity,}]}/>
                    </TouchableOpacity>
                    <Animated.View
                        style={[containerStyle, {
                            transform: [{scale: this.state.currScale}],
                            opacity: this.state.containerOpacity
                        }]}>
                        {children}
                    </Animated.View>
                </View>
            </Modal>
        );
    }
}

ModalActivity.propTypes = {
    visible: PropTypes.bool,
    springOption: PropTypes.object,
    shadeStartOpacity: PropTypes.number,
    shadeEndOpacity: PropTypes.number,
    initScale: PropTypes.number,
    animationDuration: PropTypes.number,
    tapBackToHide: PropTypes.bool,
    onRequestToClose: PropTypes.func.isRequired,
    wrapStyle: ViewPropTypes.style,
    containerStyle: ViewPropTypes.style,
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
        justifyContent: 'center',
        alignItems: 'center'
    },
});
