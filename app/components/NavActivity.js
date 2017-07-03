/**
 * Created by DELL on 2016/11/16.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ActivityIndicator,
    StatusBar,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Platform
} from 'react-native';
import Dimensions from 'Dimensions';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import Util from '../utility/util';
const debugKeyWord = '[NavActivity]';

let _template = {//默认模版
    width: 320,//iphone5的逻辑宽度，可由matchTemplate函数更改
    height: 568,//iphone5的逻辑高度，可由matchTemplate函数更改
    headerHeight: 44,//默认为头栏的高度，可由matchSize函数更改，并用作对外输出的常量，初始值与navHeight相等
    navHeight: 44,//默认导航栏高度，static 常量，不可更改
    paddingSize: 10,//默认左右补白，static 常量，不可更改
    titleFontSize: 20,//导航栏标题字号，static 常量，不可更改
    btnFontSize: 16,//除了标题之外的文字按钮的字号，static 常量，不可更改
};
/**
 * 根据属性配置当前导航栏
 * @param phone 设计稿模版
 * @param height 可选，如果传入此属性，则该属性的值应该为 phone 设计稿上的导航栏的高度，不传此参数，则默认为44
 */
function matchTemplate(phone, height) {
    switch (phone) {
        case 'i5':
        case 'i5s'://iphone 5 5s
        {
            _template.width = 320;
            _template.height = 568;
            break;
        }
        case 'i6d'://iphone 5 5s
        {
            _template.width = 320;
            _template.height = 568;
            break;
        }
        case 'i6'://iphone 5 5s
        {
            _template.width = 375;
            _template.height = 667;
            break;
        }
        case 'i6pd'://iphone 5 5s
        {
            _template.width = 375;
            _template.height = 667;
            break;
        }
        case 'i6p'://iphone 5 5s
        {
            _template.width = 414;
            _template.height = 736;
            break;
        }
        default://默认iphone 5
        {
            _template.width = 320;
            _template.height = 568;
            break;
        }
    }
    height !== _template.navHeight ? _template.navHeight = height : null;
}
/**
 * 如果disableScale为false，则文字大小按照此规则缩放
 * @param size
 * @returns {number}
 */
function matchFontSize(size) {
    let {height} = Dimensions.get('window');
    return (size / _template.height * height);
}
/**
 * 如果disableScale为false，则组件大小按照此规则缩放
 * @param direction
 * @param size
 * @returns {number}
 */
function matchSize(direction, size) {
    let {width, height} = Dimensions.get('window');
    return direction === 'w' ? (size / _template.width * width) : (size / _template.height * height);
}

class LeftButton extends Component {
    render() {
        const {leftButton, navigator, closeButton, menuButton, navHeight, paddingSize} = this.props.store;
        if (leftButton.disabled) {
            return <View style={Styles.leftButton}/>
        }
        return (
            <View style={Styles.leftButton}>
                {leftButton.enableBackZone ?
                    <TouchableOpacity
                        style={[Styles.backZone, {height: navHeight, paddingLeft: paddingSize}]}
                        activeOpacity={1}
                        onPress={() => onBackPress(navigator, leftButton.handler)}>
                        <Image
                            style={{width: leftButton.iconSize[0], height: leftButton.iconSize[1]}}
                            resizeMode={'cover'}
                            source={leftButton.icon}/>
                        <Text style={{
                            color: leftButton.tintColor,
                            fontSize: leftButton.fontSize
                        }}>{leftButton.title}</Text>
                    </TouchableOpacity> : null}
                {!closeButton.disabled && closeButton.closeZone == 'left' ?
                    <TouchableOpacity
                        style={[Styles.closeZone, {height: navHeight}]}
                        activeOpacity={1}
                        onPress={() => onClosePress(closeButton.handler)}>
                        <Text style={{color: closeButton.tintColor, fontSize: closeButton.fontSize}}>
                            {closeButton.title}
                        </Text>
                    </TouchableOpacity> : null}
                {!menuButton.disabled ?
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => onMenuPress(navigator, menuButton.handler)}
                        style={Styles.menuZone}>
                        <Icon
                            name={'menu'}
                            size={menuButton.size}
                            color={menuButton.color}/>
                    </TouchableOpacity> : null}
            </View>
        );
    }
}

class TitleElement extends Component {
    _pressStartTime = -1;

    _onPressOut() {
        const {title} = this.props.store;
        let _pressEndTime = Date.now();
        if (_pressEndTime - this._pressStartTime >= title.longPressTime) {
            title.onLongPressFunc instanceof Function && title.onLongPressFunc();
        }
        this._pressStartTime = _pressEndTime;
    }

    render() {
        const {title, navHeight} = this.props.store;
        return (
            <TouchableWithoutFeedback
                onPressIn={() => this._pressStartTime = Date.now()}
                onPressOut={() => this._onPressOut()}
                style={Styles.title}>
                <View style={[Styles.loadingWrap, {height: navHeight}]}>
                    {title.animating ?
                        <ActivityIndicator
                            style={[Styles.loading, {height: navHeight}]}
                            animating={title.animating}
                            color={'#b3bbc0'}
                            size={"small"}/> : null}
                    <Text numberOfLines={1} style={{color: title.tintColor, fontSize: title.fontSize}}>
                        {title.title}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

class RightButton extends Component {
    render() {
        const {closeButton, customButton, navHeight, paddingSize} = this.props.store;
        if (closeButton.disabled && customButton.disabled) {
            return <View style={Styles.rightButton}/>;
        }
        return (
            <View style={Styles.rightButton}>
                {!closeButton.disabled && closeButton.closeZone == 'right' ?
                    <TouchableOpacity
                        style={[Styles.closeZone, {height: navHeight, paddingRight: paddingSize}]}
                        activeOpacity={1}
                        onPress={() => onClosePress(closeButton.handler)}>
                        <Text style={{color: closeButton.tintColor, fontSize: closeButton.fontSize}}>
                            {closeButton.title}
                        </Text>
                    </TouchableOpacity> : null}
                {!customButton.disabled ?
                    <TouchableOpacity
                        style={[Styles.closeZone, {height: navHeight, paddingRight: paddingSize}]}
                        activeOpacity={1}
                        onPress={() => customButton.customCallback && customButton.customCallback()}>
                        <Image
                            style={{width: customButton.iconSize[0], height: customButton.iconSize[1]}}
                            resizeMode={'contain'}
                            source={customButton.icon}/>
                    </TouchableOpacity> : null}
            </View>
        );
    }
}

export default class NavActivity extends Component {
    static propTypes = {
        navigator: PropTypes.any,
        template: PropTypes.object,
        statusBar: PropTypes.object,
        title: PropTypes.object,
        leftButton: PropTypes.object,
        closeButton: PropTypes.object,
        menuButton: PropTypes.object,
        customButton: PropTypes.object,
        bottomStyle: PropTypes.object
    };

    static getHeaderHeight = (countStatusBar) => {
        return countStatusBar ? (_template.headerHeight + (Platform.OS === 'android' ? StatusBar.currentHeight : 20)) : _template.headerHeight;
    };

    constructor(props) {
        super(props);
        this.state = {
            navigator: props.navigator ? props.navigator : null,//路由
            template: {
                phone: 'i5',//设计模版，默认为iphone 5
                height: _template.navHeight,
                disableScale: true,//是否禁止自定义缩放，true代表使用RN默认的按照PixelRatio的缩放规则，false代表使用自定义的按照模版缩放的规则
                ...props.template
            },
            statusBar: {//下拉状态栏的样式
                disabledAndroid: false,//在安卓上禁止使用statusBar的API
                animated: false,
                hidden: false,
                backgroundColor: '#000000',
                translucent: false,
                barStyle: 'default',
                networkActivityIndicatorVisible: false,
                showHideTransition: 'fade',
                ...props.statusBar
            },
            title: {
                title: '',//中间标题
                tintColor: '#2b2b2b',//中间标题颜色
                fontSize: _template.titleFontSize,
                animating: false,//是否在title旁边显示加载动画
                longPressTime: 10000,//长按标题响应时间
                onLongPressFunc: null,//长按响应函数
                ...props.title
            },
            leftButton: {//左边返回按钮
                title: '',
                tintColor: '#2b2b2b',
                fontSize: _template.btnFontSize,
                iconSize: [23, 23],//返回icon的宽高
                icon: require('../res/default/navig_img_back_black.png'),//icon的图片路径
                handler: null,//leftButton按键按下时调用的回调函数
                disabled: true,//是否禁用左边返回按钮
                enableBackZone: true,//开启返回键按钮
                ...props.leftButton
            },
            closeButton: {//关闭按钮
                title: '关闭',
                tintColor: '#2b2b2b',
                fontSize: _template.btnFontSize,
                handler: null,//closeButton按键按下时调用的回调函数
                closeZone: 'right',//关闭按钮在leftButton区域还是rightButton区域
                disabled: true,
                ...props.closeButton
            },
            menuButton: {//关闭按钮
                size: 22,
                color: '#C1C1C1',
                handler: null,//closeButton按键按下时调用的回调函数
                disabled: true,
                ...props.menuButton
            },
            customButton: {//自定义右侧按钮
                disabled: true,
                customCallback: null,//按钮回调
                iconSize: [23, 23],//返回icon的宽高
                icon: require('../res/default/navig_img_share.png'),//icon的图片路径
                ...props.customButton
            },
            bottomStyle: {//底部样式
                apartLinesColor: '#eaeaea',//导航栏下边分割线的颜色
                ...props.bottomStyle
            },
            navHeight: _template.navHeight,//导航栏的高度
            paddingSize: _template.paddingSize,//导航栏的左右补白
        };
        if (!this.state.template.disableScale) {
            matchTemplate(this.state.template.phone, this.state.template.height);
            this.state.title.fontSize = matchFontSize(_template.titleFontSize);
            this.state.leftButton.fontSize = this.state.closeButton.fontSize = matchFontSize(_template.btnFontSize);

            this.state.navHeight = matchSize('h', _template.navHeight);
            _template.headerHeight = matchSize('h', _template.navHeight);
            this.state.paddingSize = matchSize('w', _template.paddingSize);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        nextProps.title.animating !== this.props.title.animating ? this.state.title.animating = nextProps.title.animating : null;//setState 做的更改
        return nextProps.title.animating !== this.props.title.animating || nextState.title.animating !== this.state.title.animating;//animatedDone 做的更改
    }

    animatedDone() {
        this.setState({
            title: {
                ...this.state.title,
                animating: false
            }
        });
    }

    render() {
        Util.log(debugKeyWord + 'render!!!');
        const {statusBar, bottomStyle, navHeight} = this.state;
        return (
            <View style={[Styles.wrap, {
                borderBottomColor: bottomStyle.apartLinesColor,
                height: navHeight + (Platform.OS === 'android' ? 0 : 20)
            }]}>
                {statusBar.disabledAndroid ? null : <StatusBar {...statusBar}/>}
                <View style={Styles.containerStyle}>
                    <LeftButton store={this.state}/>
                    <TitleElement store={this.state}/>
                    <RightButton store={this.state}/>
                </View>
            </View>
        )
    }
}

let _routerHandle = null;//用于延迟切换场景，延时是为了让TouchableHighlight动画效果展示完毕
function onBackPress(navigator, handler) {
    if (handler instanceof Function) {
        if (handler()) {//如果自定义back函数返回为true，则执行路由pop操作，如果返回为false，则表示当前路由目前状态不允许pop回上一个路由
            if (navigator !== null) {
                clearTimeout(_routerHandle);
                _routerHandle = setTimeout(() => {
                    _routerHandle = null;//用于GC回收
                    navigator.goBack();//销毁当前路由场景，返回之前的场景，此会调用 componentWillUnmount
                }, 100);//设置定时是为了TouchableHighlight按下效果能展示完毕
            }
        }
    }
    else {
        if (navigator !== null) {
            clearTimeout(_routerHandle);
            _routerHandle = setTimeout(() => {
                _routerHandle = null;//用于GC回收
                navigator.goBack();//销毁当前路由场景，返回之前的场景，此会调用 componentWillUnmount
            }, 100);//设置定时是为了TouchableHighlight按下效果能展示完毕
        }
    }
}
function onClosePress(handler) {
    handler instanceof Function ? handler() : null;//若配置回调函数，则执行该回调函数
}
function onMenuPress(navigator, handler) {
    navigator.navigate('DrawerOpen');
    handler instanceof Function ? handler() : null;//若配置回调函数，则执行该回调函数
}

const Styles = StyleSheet.create({
    wrap: {
        width: Dimensions.get('window').width,
        paddingTop: (Platform.OS === 'android' ? 0 : 20),
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        backgroundColor: '#ffffff',
    },
    containerStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    //左边button区域
    leftButton: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    backZone: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    closeZone: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 3,
    },
    menuZone: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16,
    },
    //中间标题区域
    title: {
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingWrap: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading: {
        width: Dimensions.get('window').width * 0.08,
        position: 'absolute',
        top: 0,
        left: -(Dimensions.get('window').width * 0.08),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    //右边button区域
    rightButton: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
});