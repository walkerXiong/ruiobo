/**
 * Created by hebao on 2017/3/3.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    PanResponder,
    Image,
    Animated,
    InteractionManager
} from 'react-native';

import Util from '../utility/util';

const debugKeyWord = '[ImageScaleActivity]';
const screenWidth = Util.size.screen.width;
const screenHeight = Util.platformAndroid() ? Util.size.screen.height - Util.size.statusBar.height : Util.size.screen.height;

class ImageScaleActivity extends Component {
    _panGesture = null;

    _scaleZoneDistance = 250;//缩放响应速率，调节此值能调节图片缩放的速度快慢
    _leaveDistance = 5;//手指滑动距离小于此距离，则视为单击退出

    _doubleClickHandle = -1;//双击操作句柄
    _doubleClickTime = 200;//双击时长阈值

    _touchStartTime = -1;//触摸开始的时间
    _touchReleaseTime = -1;//触摸释放的时间

    _longPressHandle = -1;//长按操作句柄
    _longPressTime = 1500;//长按时长阈值

    _maxScaleSize = 5;//最大放大倍数
    _scaleStep_1 = 1;
    _scaleStep_2 = 1.5;
    _scaleStep_4 = 2;
    _scaleDuration = 250;//缩放动画持续时间

    _handleOfDiffY = null;
    _handleOfDiffX = null;
    _diffSlideLastY = 0;
    _diffSlideLastX = 0;

    static defaultProps = {
        imageInitWidth: 0,//图片全屏展开时的宽度
        imageInitHeight: 0,//图片全屏展开时的高度
        ImageUrl: '',//图片路径

        onClose: null,//单击时关闭图片
        onLongPress: null,//长按操作
    };

    constructor(props) {
        super(props);
        this.state = {
            imageFitWidth: 0,//首次加载图片时，图片的宽度，如果图片宽度小于屏幕，则放大至屏幕宽度
            imageFitHeight: 0,//首次加载图片时，图片的高度

            positionX: 0,//图片查看以及缩放时候的X轴偏移量
            positionY: 0,//图片查看以及缩放时候的Y轴偏移量
            lastPositionX: null,//最近一次的X轴偏移量，用于计算连续位移
            lastPositionY: null,//最近一次的Y轴偏移量，用于计算连续位移

            initScale: 1,//图片全屏查看时的原始放大倍数
            currScale: 1,//图片当前放大倍数
            lastScale: 1,//双击操作时候，记录的当前放大倍数
            isDoubleClick: false,

            currScaleDistance: 0,//双指缩放时当前缩放距离，用于计算缩放增量，然后计算缩放倍数
            lastScaleDistance: null,//双指最新一次双指缩放时缩放距离，用于计算缩放增量，然后计算缩放倍数

            animatedPositionX: new Animated.Value(0),
            animatedPositionY: new Animated.Value(0),
            animatedScale: new Animated.Value(0.5),

            currTouches: 0,//当前屏幕上几个触控点

            scaleAnimatedDone: true,//缩放操作之后，缩放操作的动画是否执行完毕

            verticalDiffTop: -1,//纵向放大时上部超出屏幕部分
            verticalDiffBottom: -1,//纵向放大时下部超出屏幕部分

            containerOpacity: new Animated.Value(0),

            _diffX: new Animated.Value(0),
            _diffY: new Animated.Value(0),
        };
    }

    componentWillMount() {
        //计算图片大小
        if (this.props.imageInitWidth < screenWidth) {
            this.state.initScale = screenWidth / this.props.imageInitWidth;//记录原始放大倍数
            this.state.initScale > this._maxScaleSize ? this.state.initScale = this._maxScaleSize : null;
            this.state.imageFitWidth = this.props.imageInitWidth * this.state.initScale;
            this.state.imageFitHeight = this.props.imageInitHeight * this.state.initScale;
        }
        else {
            this.state.initScale = this.state.currScale = 1;
            this.state.imageFitWidth = this.props.imageInitWidth;
            this.state.imageFitHeight = this.props.imageInitHeight;
        }
        //响应手势操作
        this._panGesture = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderGrant: this._onPanResponderGrant.bind(this),
            onPanResponderRelease: this._handlePanResponderRelease.bind(this),
            onPanResponderMove: this._handlePanResponderMove.bind(this)
        });
        this._handleOfDiffY = this.state._diffY.addListener(({value}) => this._checkDiffY(value));
        this._handleOfDiffX = this.state._diffX.addListener(({value}) => this._checkDiffX(value));
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            Animated.parallel([
                Animated.timing(this.state.containerOpacity, {
                    duration: this._scaleDuration,
                    toValue: 1
                }),
                Animated.timing(this.state.animatedScale, {
                    toValue: this.state.currScale,
                    duration: this._scaleDuration
                })
            ]).start();
        });
    }

    componentWillUnmount() {
        clearTimeout(this._longPressHandle);//组件销毁时候，停止长按执行函数
        this.state._diffY.removeListener(this._handleOfDiffY);
        this.state._diffX.removeListener(this._handleOfDiffX);
    }

    _checkDiffY(value) {
        if (this.state.imageFitHeight * this.state.currScale > screenHeight) {
            let _diffSlideLastY = this._diffSlideLastY;
            this._diffSlideLastY = value;
            this.state.positionY += value - _diffSlideLastY;
            if (!this._fixPositionY()) {
                Util.log(debugKeyWord + 'value:' + value + ';positionY:' + this.state.positionY);
                this.state.animatedPositionY.setValue(this.state.positionY);
            }
            else {
                this.state._diffY.stopAnimation(() => {
                    this.state.animatedPositionY.setValue(this.state.positionY);
                    Util.log(debugKeyWord + 'addListener animatedPositionY stop!!!');
                });
            }
        }
    }

    _checkDiffX(value) {
        if (this.state.imageFitWidth * this.state.currScale > screenWidth) {
            let _diffSlideLastX = this._diffSlideLastX;
            this._diffSlideLastX = value;
            this.state.positionX += value - _diffSlideLastX;
            if (!this._fixPositionX()) {
                Util.log(debugKeyWord + 'value:' + value + ';positionX:' + this.state.positionX);
                this.state.animatedPositionX.setValue(this.state.positionX);
            }
            else {
                this.state._diffX.stopAnimation(() => {
                    this.state.animatedPositionX.setValue(this.state.positionX);
                    Util.log(debugKeyWord + 'addListener animatedPositionX stop!!!');
                });
            }
        }
    }

    _doubleClick(e, gestureState) {
        Util.log(debugKeyWord + '_onPanResponderGrant===double click!!!');
        this.state.scaleAnimatedDone = false;
        this.state.isDoubleClick = true;
        this.state.lastScale = this.state.currScale;

        if (this.state.currScale >= this._scaleStep_4) {
            this.state.currScale = this._scaleStep_1;
        }
        else if (this.state.currScale >= this._scaleStep_2) {
            this.state.currScale = this._scaleStep_4;
        }
        else if (this.state.currScale >= this._scaleStep_1) {
            this.state.currScale = this._scaleStep_2;
        }
        else {
            this.state.currScale = this._scaleStep_1;
        }
    }

    _fixPositionX() {
        let _maxHorizontalDiff = (this.state.imageFitWidth * this.state.currScale - screenWidth) / 2 / this.state.currScale;
        if (this.state.positionX < 0 && Math.abs(this.state.positionX) > _maxHorizontalDiff) {
            this.state.positionX = -_maxHorizontalDiff;
        }
        if (this.state.positionX > 0 && this.state.positionX > _maxHorizontalDiff) {
            this.state.positionX = _maxHorizontalDiff;
        }
        return this.state.positionX == -_maxHorizontalDiff || this.state.positionX == _maxHorizontalDiff;
    }

    _fixPositionY() {
        let _fixDiffY = null;

        this.state.imageFitHeight > screenHeight ? _fixDiffY = (this.state.imageFitHeight - screenHeight) / 2 : null;
        let _maxVerticalDiff = (this.state.imageFitHeight * this.state.currScale - screenHeight) / 2;
        let _verticalDiffTop = (_maxVerticalDiff - _fixDiffY) / this.state.currScale;
        let _verticalDiffBottom = (_maxVerticalDiff + _fixDiffY) / this.state.currScale;

        //如果 _verticalDiffTop 此值 < 0 ，说明 _maxVerticalDiff < _fixDiffY ，说明当前图片positionY为0时，图片上方跟屏幕顶部就存在距离了
        if ((this.state.positionY > 0 && this.state.positionY > _verticalDiffTop) || (this.state.positionY < 0 && this.state.positionY > _verticalDiffTop)) {
            this.state.positionY = _verticalDiffTop;
        }
        if (this.state.positionY < 0 && Math.abs(this.state.positionY) > _verticalDiffBottom) {
            this.state.positionY = -_verticalDiffBottom;
        }
        return this.state.positionY == _verticalDiffTop || this.state.positionY == -_verticalDiffBottom;
    }

    _onPanResponderGrant(e, gestureState) {
        this.state._diffX.stopAnimation();
        this.state._diffY.stopAnimation();

        this.state.currScaleDistance = 0;//触摸开始，重置双指之间缩放的距离
        this.state.lastScaleDistance = null;//触摸开始，重置最近一次双指之间缩放的距离

        this.state.lastPositionX = null;//触摸开始，重置上次横向偏移量
        this.state.lastPositionY = null;//触摸开始，重置上次纵向偏移量

        this.state.currTouches = 0;//触摸开始，重置当前触控点数量
        this.state.isDoubleClick = false;

        let _changedTouches = e.nativeEvent.changedTouches;
        Util.log(debugKeyWord + '_onPanResponderGrant===_changedTouches:' + _changedTouches.length);

        if (_changedTouches.length === 1) {
            //判断长按操作
            clearTimeout(this._longPressHandle);
            this._longPressHandle = setTimeout(() => {
                this.props.onLongPress && this.props.onLongPress(this.props.ImageUrl);
            }, this._longPressTime);

            //判断双击操作
            if ((new Date()).getTime() - this._touchStartTime < this._doubleClickTime) {
                clearTimeout(this._doubleClickHandle);//判断为双击操作时候，停止单击退出操作
                this._touchStartTime = -1;//双击操作时，将触摸开始时间置为0
                //this._doubleClick(e, gestureState);
            } else {
                this._touchStartTime = (new Date()).getTime();
            }
        }
    }

    _handlePanResponderRelease(e, gestureState) {
        clearTimeout(this._longPressHandle);//停止长按执行函数

        let _changedTouches = e.nativeEvent.changedTouches;
        let _fixDiffY = null;

        if (!this.state.scaleAnimatedDone || this.state.currTouches === 2) {
            this.state.scaleAnimatedDone = true;

            //放大双击中心点的图片
            if (this.state.isDoubleClick) {
                let _touchCenterDistanceX = _changedTouches[0].pageX - this.state.imageFitWidth / 2;
                let _touchCenterDistanceY = _changedTouches[0].pageY - this.state.imageFitHeight / 2;
                let _diffScale = this.state.currScale - this.state.lastScale;
                let _scaleDistanceX = _touchCenterDistanceX * _diffScale / this.state.currScale;
                let _scaleDistanceY = _touchCenterDistanceY * _diffScale / this.state.currScale;
                this.state.positionX += -_scaleDistanceX;
                this.state.positionY += -_scaleDistanceY;
            }

            //处于放大状态
            if (this.state.currScale > 1) {
                if (this.state.imageFitWidth * this.state.currScale > screenWidth) {
                    this._fixPositionX();
                }
                else {
                    this.state.positionX = 0;
                }
                if (this.state.imageFitHeight * this.state.currScale > screenHeight) {
                    this._fixPositionY();
                }
                else {
                    this.state.imageFitHeight > screenHeight ? _fixDiffY = (this.state.imageFitHeight - screenHeight) / 2 : null;
                    _fixDiffY ? this.state.positionY = -_fixDiffY : this.state.positionY = 0;
                }
            }
            //处于缩小状态
            else if (this.state.currScale <= 1) {
                //横向偏移量置为0
                this.state.positionX = 0;
                //缩小态的图片高度仍然大于屏幕高度
                if (this.state.imageFitHeight * this.state.currScale > screenHeight) {
                    this._fixPositionY();
                }
                else {
                    this.state.imageFitHeight > screenHeight ? _fixDiffY = (this.state.imageFitHeight - screenHeight) / 2 : null;
                    _fixDiffY ? this.state.positionY = -_fixDiffY : this.state.positionY = 0;
                }
            }

            Animated.parallel([
                Animated.timing(this.state.animatedScale, {
                    toValue: this.state.currScale,
                    duration: this._scaleDuration
                }),
                Animated.timing(this.state.animatedPositionX, {
                    toValue: this.state.positionX,
                    duration: this._scaleDuration
                }),
                Animated.timing(this.state.animatedPositionY, {
                    toValue: this.state.positionY,
                    duration: this._scaleDuration
                })
            ]).start();
        }

        let _moveDistance = Math.sqrt(gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy);
        this._touchReleaseTime = (new Date()).getTime();
        //单击退出
        if (this.state.currTouches <= 1 && _moveDistance < this._leaveDistance && this._touchReleaseTime > this._touchStartTime && this._touchReleaseTime - this._touchStartTime < this._doubleClickTime) {
            this._doubleClickHandle = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(this.state.containerOpacity, {
                        duration: this._scaleDuration,
                        toValue: 0
                    }),
                    Animated.timing(this.state.animatedScale, {
                        toValue: 1 / this.state.initScale / 2,
                        duration: this._scaleDuration
                    })
                ]).start(() => {
                    setTimeout(() => {
                        this.props.onClose && this.props.onClose(true);
                    }, 10);
                });
            }, this._doubleClickTime);
        }
        else if (this.state.currTouches <= 1 && (Math.abs(gestureState.vy) >= 0.1 || Math.abs(gestureState.vx) >= 0.1)) {
            this._diffSlideLastY = this._diffSlideLastX = 0;
            this.state._diffY.setValue(0);
            this.state._diffX.setValue(0);
            if (Math.abs(gestureState.vy) >= 0.1) {
                let _gestureStateVy = Math.abs(gestureState.vy);
                if (_gestureStateVy >= 0.1 && _gestureStateVy < 1.8) {
                    _gestureStateVy = gestureState.vy * 4
                }
                else if (_gestureStateVy >= 1.8) {
                    _gestureStateVy = gestureState.vy * 10
                }
                Animated.decay(this.state._diffY, {
                    velocity: _gestureStateVy
                }).start();
            }
            if (Math.abs(gestureState.vx) >= 0.1) {
                let _gestureStateVx = Math.abs(gestureState.vx);
                if (_gestureStateVx >= 0.1 && _gestureStateVx < 1.8) {
                    _gestureStateVx = gestureState.vx * 4
                }
                else if (_gestureStateVx >= 1.8) {
                    _gestureStateVx = gestureState.vx * 10
                }
                Animated.decay(this.state._diffX, {
                    velocity: _gestureStateVx
                }).start();
            }
        }
    }

    _handlePanResponderMove(e, gestureState) {
        let _changedTouches = e.nativeEvent.changedTouches;

        if (_changedTouches.length === 1) {//单个手指，可能为滑动
            this.state.currTouches = 1;

            let diffX = this.state.lastPositionX === null ? 0 : gestureState.dx - this.state.lastPositionX;//左右滑动偏移量，右为正，左为负
            let diffY = this.state.lastPositionY === null ? 0 : gestureState.dy - this.state.lastPositionY;//上下滑动偏移量，下为正，上为负

            this.state.lastPositionX = gestureState.dx;//记录当前横向偏移量，正为右，负为左
            this.state.lastPositionY = gestureState.dy;//记录当前纵向偏移量，正为下，负为上

            (diffX > this._leaveDistance || diffY > this._leaveDistance) ? clearTimeout(this._longPressHandle) : null;//如果滑动距离大于退出距离，则不执行长按操作

            //横向偏移量
            if (this.state.imageFitWidth * this.state.currScale > screenWidth) {
                this.state.positionX += diffX / this.state.currScale;
                this._fixPositionX();
                this.state.animatedPositionX.setValue(this.state.positionX);
            }

            //纵向偏移量
            if (this.state.imageFitHeight * this.state.currScale > screenHeight) {
                this.state.positionY += diffY / this.state.currScale;
                this._fixPositionY();
                this.state.animatedPositionY.setValue(this.state.positionY);
            }
        }
        else if (_changedTouches.length === 2) {
            clearTimeout(this._longPressHandle);//双指缩放时，停止执行长按响应函数

            this.state.currTouches = 2;
            this.state.scaleAnimatedDone = false;

            let _initTouch = _changedTouches[0], _lastTouch = _changedTouches[1];
            //计算两个触摸点之间的横向距离
            let _minX = _initTouch.pageX;
            let _maxX = _lastTouch.pageX;
            //计算两个触摸点之间的纵向距离
            let _minY = _initTouch.pageY;
            let _maxY = _lastTouch.pageY;
            //计算两个触摸点之间的直线距离
            let _distanceX = _maxX - _minX;
            let _distanceY = _maxY - _minY;
            this.state.currScaleDistance = Math.sqrt(_distanceX * _distanceX + _distanceY * _distanceY);

            if (this.state.lastScaleDistance !== null) {
                //暂存当前缩放倍数
                let _scaleBefore = this.state.currScale;

                //根据缩放距离增量，计算此次缩放增量对应的缩放倍数
                let _scale = Number(((this.state.currScaleDistance - this.state.lastScaleDistance) / this._scaleZoneDistance).toFixed(2));
                let _scaleNow = this.state.currScale + _scale;

                //最大放大倍数为maxScaleSize，最小缩小倍数为缩小到原图
                _scaleNow < 1 / this.state.initScale ? _scaleNow = 1 / this.state.initScale : _scaleNow >= this._maxScaleSize ? _scaleNow = this._maxScaleSize : null;
                this.state.currScale = _scaleNow;

                //图片缩放
                this.state.animatedScale.setValue(this.state.currScale);

                //计算手指缩放中心与图片中心的横向纵向距离，缩放时，需要根据缩放增量反向抵消这两点之间的距离，达到以手指缩放中心缩放图片的效果
                let _touchCenterDistanceX = (_initTouch.pageX + _lastTouch.pageX) / 2 - this.state.imageFitWidth / 2;
                let _touchCenterDistanceY = (_initTouch.pageY + _lastTouch.pageY) / 2 - this.state.imageFitHeight / 2;

                //计算缩放增量，取反，抵消增量
                let _diffScale = _scaleNow - _scaleBefore;
                let _scaleDistanceX = _touchCenterDistanceX * _diffScale / this.state.currScale;
                let _scaleDistanceY = _touchCenterDistanceY * _diffScale / this.state.currScale;

                Util.log(debugKeyWord + 'currScale:' + this.state.currScale);

                this.state.positionX += -_scaleDistanceX;
                this.state.positionY += -_scaleDistanceY;

                this.state.animatedPositionX.setValue(this.state.positionX);
                this.state.animatedPositionY.setValue(this.state.positionY);
            }

            this.state.lastScaleDistance = this.state.currScaleDistance;
        }
    }

    render() {
        Util.log(debugKeyWord + 'render!!!');
        return (
            <Animated.View
                style={[Styles.wrap, {
                    paddingTop: this.state.imageFitHeight > screenHeight ? 0 : (screenHeight - this.state.imageFitHeight) / 2,
                    opacity: this.state.containerOpacity
                }]}
                {...this._panGesture.panHandlers}>
                <Animated.View
                    style={{
                        width: this.state.imageFitWidth,
                        height: this.state.imageFitHeight,
                        transform: [{
                            scale: this.state.animatedScale
                        }, {
                            translateX: this.state.animatedPositionX
                        }, {
                            translateY: this.state.animatedPositionY
                        }]
                    }}>
                    {/*Image标签外需再包裹一层View，以便于利用该View控制多图片的切换*/}
                    <Image
                        style={{
                            width: this.state.imageFitWidth,
                            height: this.state.imageFitHeight
                        }}
                        resizeMode={'cover'}
                        source={{uri: this.props.ImageUrl ? this.props.ImageUrl : ''}}/>
                </Animated.View>
            </Animated.View>
        )
    }
}

const Styles = StyleSheet.create({
    wrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: screenWidth,
        height: screenHeight,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#000000'
    }
});

export default ImageScaleActivity;