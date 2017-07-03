/**
 * Created by DELL on 2016/11/16.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Modal,
    Animated
} from 'react-native';

import Util from '../utility/util';
import FrameAnimation from './FrameAnimation';
import * as ACTIONS from '../utility/events';

const debugKeyWord = '[Loading]';
export default class Loading extends Component {
    _DeviceEventEmitter = null;
    _loadingRequestArr = [];//记录loading请求次数的数组
    _allowCancel = true;//是否允许返回键取消loading动画

    _sprite = [
        require('../res/test/animation_loading00.png'),
        require('../res/test/animation_loading01.png'),
        require('../res/test/animation_loading02.png'),
        require('../res/test/animation_loading03.png'),
        require('../res/test/animation_loading04.png'),
        require('../res/test/animation_loading05.png'),
        require('../res/test/animation_loading06.png'),
        require('../res/test/animation_loading07.png'),
        require('../res/test/animation_loading08.png'),
        require('../res/test/animation_loading09.png'),
        require('../res/test/animation_loading10.png'),
        require('../res/test/animation_loading11.png'),
        require('../res/test/animation_loading12.png'),
        require('../res/test/animation_loading13.png'),
        require('../res/test/animation_loading14.png'),
        require('../res/test/animation_loading15.png'),
    ];

    static defaultProps = {
        fadeInTime: 200,
        fadeOutTime: 100
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoadingDone: true,
            opacity: new Animated.Value(0)
        }
    }

    componentDidMount() {
        this._DeviceEventEmitter = Util.addListener(ACTIONS.ACTION_LOADING_DONE, this.loadingRequest.bind(this));
    }

    componentWillUnmount() {
        Util.removeListener(this._DeviceEventEmitter);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isLoadingDone !== this.state.isLoadingDone;
    }

    loadingRequest(options) {
        if (!options.done) {
            Util.log(debugKeyWord + "loadingRequest===done: false!");
            let _allowCancel = options.allowCancel === false || options.allowCancel === true;
            this._loadingRequestArr.push(true);
            _allowCancel ? this._allowCancel = options.allowCancel : null;
            this.setState({isLoadingDone: false});
        }
        else {
            Util.log(debugKeyWord + "loadingRequest===done: true!");
            this._loadingRequestArr.pop();
            if (this._loadingRequestArr.length <= 0) {
                this._allowCancel = true;
                this.onRequestClose(options.onClose);
            }
        }
    }

    onRequestClose(onClose) {
        Util.log(debugKeyWord + 'onRequestClose===_allowCancel:' + this._allowCancel);
        if (this._allowCancel) {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: this.props.fadeOutTime
            }).start(() => this.setState({
                isLoadingDone: true
            }, () => onClose instanceof Function && onClose()));
        }
    }

    render() {
        Util.log(debugKeyWord + 'render!!!');
        return (
            <Modal
                animationType={'none'}
                transparent={true}
                visible={!this.state.isLoadingDone}
                onRequestClose={() => this.onRequestClose()}
                onShow={() => Animated.timing(this.state.opacity, {toValue: 1, duration: this.props.fadeInTime}).start()}>
                <Animated.View style={[Styles.wrap, {opacity: this.state.opacity}]}>
                    <View style={Styles.loading}>
                        <FrameAnimation
                            fps={20}
                            sprite={this._sprite}
                            width={112}
                            height={56}/>
                        <Text style={Styles.font} numberOfLines={1}>{this.props.font || '加载中...'}</Text>
                    </View>
                </Animated.View>
            </Modal>
        )
    }
}

const Styles = StyleSheet.create({
    wrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading: {
        width: 171,
        height: 171,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 30
    },
    font: {
        marginTop: 10,
        fontSize: 15,
        textAlign: 'center',
        color: '#B8B8B8'
    }
});