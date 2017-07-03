/**
 * Created by hebao on 2017/3/13.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Animated,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';

import Util from '../utility/util';

const debugKeyWord = '[ImageScaleActivity]';
const screenWidth = Util.size.screen.width;
const screenHeight = Util.platformAndroid() ? Util.size.screen.height - Util.size.statusBar.height : Util.size.screen.height;

class ImageScaleActivity extends Component {

    _onDoubleClick = false;
    _doubleClickHandle = -1;//双击操作句柄
    _doubleClickTime = 200;//双击时长阈值

    _touchStartTime = -1;//触摸开始的时间
    _touchReleaseTime = -1;//触摸释放的时间

    _maxScaleSize = 5;//最大放大倍数
    _scaleStep_1 = 1;
    _scaleStep_2 = 1.5;
    _scaleStep_4 = 2;

    _scaleDuration = 250;

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

            initScale: 1,//图片全屏查看时的原始放大倍数
            currScale: 1,//图片当前放大倍数
            zoomScale: new Animated.Value(1),

            animatedScale: new Animated.Value(0.5),

            containerOpacity: new Animated.Value(0)
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
            this.state.initScale = 1;
            this.state.imageFitWidth = this.props.imageInitWidth;
            this.state.imageFitHeight = this.props.imageInitHeight;
        }
    }

    componentDidMount() {
        Animated.parallel([
            Animated.timing(this.state.containerOpacity, {
                toValue: 1,
                duration: this._scaleDuration
            }),
            Animated.timing(this.state.animatedScale, {
                toValue: 1,
                duration: this._scaleDuration
            })
        ]).start();
    }

    componentWillUnmount() {
        clearTimeout(this._doubleClickHandle);
    }

    _doubleClick() {
        Util.log(debugKeyWord + '_onPanResponderGrant===double click');
        this._onDoubleClick = true;
        if (this.state.currScale >= this._scaleStep_4) {
            this.state.currScale = this._scaleStep_1;
            Animated.timing(this.state.zoomScale, {
                toValue: this._scaleStep_1,
                duration: this._scaleDuration
            }).start();
        }
        else if (this.state.currScale >= this._scaleStep_2) {
            this.state.currScale = this._scaleStep_4;
            Animated.timing(this.state.zoomScale, {
                toValue: this._scaleStep_4,
                duration: this._scaleDuration
            }).start();
        }
        else if (this.state.currScale >= this._scaleStep_1) {
            this.state.currScale = this._scaleStep_2;
            Animated.timing(this.state.zoomScale, {
                toValue: this._scaleStep_2,
                duration: this._scaleDuration
            }).start();
        }
        else {
            this.state.currScale = this._scaleStep_1;
            Animated.timing(this.state.zoomScale, {
                toValue: this._scaleStep_1,
                duration: this._scaleDuration
            }).start();
        }
    }

    _onPressIn() {
        Util.log(debugKeyWord + 'onPressIn!');
        this._onDoubleClick = false;
        //判断双击操作
        if ((new Date()).getTime() - this._touchStartTime < this._doubleClickTime) {
            clearTimeout(this._doubleClickHandle);//判断为双击操作时候，停止单击退出操作
            this._touchStartTime = -1;//双击操作时，将触摸开始时间置为0
            //this._doubleClick();
        } else {
            this._touchStartTime = (new Date()).getTime();
        }
    }

    _onPress() {
        Util.log(debugKeyWord + 'onPress!');
        this._touchReleaseTime = (new Date()).getTime();
        if (!this._onDoubleClick && this._touchReleaseTime - this._touchStartTime < this._doubleClickTime) {
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
    }

    _onLongPress() {
        Util.log(debugKeyWord + '_onLongPress!');
        this.props.onLongPress && this.props.onLongPress(this.props.ImageUrl);
    }

    render() {
        Util.log(debugKeyWord + 'render!!!');
        return (
            <Animated.ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                bouncesZoom={true}
                centerContent={true}
                maximumZoomScale={this._maxScaleSize}
                minimumZoomScale={1 / this.state.initScale}
                zoomScale={this.state.zoomScale}
                style={[Styles.wrap, {
                    opacity: this.state.containerOpacity,
                    transform: [{
                        scale: this.state.animatedScale
                    }]
                }]}>
                {/*Image标签外需再包裹一层View，以便于利用该View控制多图片的切换*/}
                <TouchableWithoutFeedback
                    onPressIn={() => this._onPressIn()}
                    onPress={() => this._onPress()}
                    onLongPress={() => this._onLongPress()}>
                    <Image
                        style={{
                            width: this.state.imageFitWidth,
                            height: this.state.imageFitHeight
                        }}
                        resizeMode={'cover'}
                        source={{uri: this.props.ImageUrl ? this.props.ImageUrl : ''}}/>
                </TouchableWithoutFeedback>
            </Animated.ScrollView>
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
        backgroundColor: '#000000'
    }
});

export default ImageScaleActivity;