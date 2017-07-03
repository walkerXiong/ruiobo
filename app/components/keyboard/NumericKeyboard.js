/**
 * Created by hebao on 2017/6/13.
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    BackHandler,
    StyleSheet,
    Animated,
    Easing,
    TouchableHighlight
} from 'react-native';
import Util from '../../utility/util';
import * as KBEvent from './KBEvent';

const debugKeyWord = '[NumericKeyboard]';
export default class NumericKeyboard extends Component {
    _keyboardHandle = -1;

    static propTypes = {
        keyboardType: PropTypes.number,
        keyboardShow: PropTypes.bool,
        onKeyPress: PropTypes.func,
        onRequestToClose: PropTypes.func.isRequired,
    };

    static defaultProps = {
        keyboardShow: false,
        keyboardType: 1,//1 身份证键盘  2 数字带小数点键盘  3 纯数字键盘
    };

    constructor(props) {
        super(props);
        this.state = {
            translatePosY: new Animated.Value(300),
            value: '',
        }
    }

    componentDidMount() {
        this._keyboardHandle = BackHandler.addEventListener(KBEvent.ACTION_NUMERIC_KEYBOARD_SHOW, this._hardwareBackPress.bind(this))
    }

    shouldComponentUpdate(nextProps, nextState) {
        //return shallowCompare(this, nextProps, nextState);//因为存在回调函数必须绑定 父组件 执行环境，因此此处如果使用 shallowCompare 总是会返回true
        return nextProps.keyboardShow !== this.props.keyboardShow || nextProps.keyboardType !== this.props.keyboardType;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.keyboardShow !== this.props.keyboardShow) {
            if (this.props.keyboardShow === true) {
                Animated.timing(this.state.translatePosY, {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.ease
                }).start();
            }
            else if (this.props.keyboardShow === false) {
                Animated.timing(this.state.translatePosY, {
                    toValue: 300,
                    duration: 200,
                    easing: Easing.ease
                }).start();
            }
        }
    }

    _hardwareBackPress() {
        let {keyboardShow, onRequestToClose}=this.props;
        if (keyboardShow) {
            onRequestToClose instanceof Function && onRequestToClose();
            return true;
        }
        return false;
    }

    _keyboardPress(id) {
        if (id !== 'delete') {
            this.state.value += id;
        }
        else {
            this.state.value = this.state.value.substring(0, this.state.value.length - 1);
        }
        this.props.onKeyPress instanceof Function && this.props.onKeyPress(this.state.value);
    }

    render() {
        Util.log(debugKeyWord + 'render!!!');
        let {keyboardType} = this.props;
        return (
            <Animated.View style={[Styles.wrap, {transform: [{translateY: this.state.translatePosY}]}]}>
                <View style={[Styles.container]}>
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
                <View style={[Styles.container]}>
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
                <View style={[Styles.container]}>
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
                <View style={[Styles.container,{borderBottomWidth: 0}]}>
                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor={keyboardType !== 3 ? '#eaeaea' : '#ffffff'}
                        onPress={()=>this._keyboardPress(keyboardType == 1 ? 'X' : keyboardType == 2 ? '.' : '')}
                        style={[Styles.section]}>
                        <Text>{keyboardType == 1 ? 'X' : keyboardType == 2 ? '.' : 'secure'}</Text>
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
            </Animated.View>
        );
    }
}

const Styles = StyleSheet.create({
    wrap: {
        width: Util.size.screen.width,
        height: 280,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        bottom: 0,
        backgroundColor: '#ffffff'
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: Util.size.screen.pixel,
        borderBottomColor: '#eaeaea'
    },
    section: {
        flex: 1,
        height: 70,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: Util.size.screen.pixel,
        borderRightColor: '#eaeaea'
    }
});