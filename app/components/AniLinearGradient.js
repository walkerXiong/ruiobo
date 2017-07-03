/**
 * Created by hebao on 2017/5/27.
 *  this component's main job is to change LinearGradient in animated ,
 *  relay on two lib:
 *  1 react-native-linear-gradient // realize linear gradient Git: https://github.com/react-native-community/react-native-linear-gradient
 *  Git: https://github.com/react-native-community/react-native-linear-gradient
 *  PS: need to link naive android or iOS
 *  2 chroma-js // lib to manage color, use it to realize animation
 *  Git: https://github.com/gka/chroma.js/
 *  Doc: https://gka.github.io/chroma.js/
 *  install: npm install chroma-js --save
 */
import React, {Component, PropTypes} from 'react';
import {
    StyleSheet
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Chroma from 'chroma-js';
import shallowCompare from 'react-addons-shallow-compare';

import Util from '../utility/util';
const debugKeyWord = '[AniLinearGradient]';
export default class AniLinearGradient extends Component {
    _changeColorHandle = -1;
    _gradientTime = 20;//every 20ms to change one gradient color

    static propTypes = {
        initColors: PropTypes.array,
        targetColors: PropTypes.array,
        aniDuration: PropTypes.number,
        gradientStyle: PropTypes.any
    };

    static defaultProps = {
        initColors: ['#ffce4d', '#ffa931'],
        targetColors: ['#5adf70', '#39cb51'],
        aniDuration: 500,
        gradientStyle: {}
    };

    constructor(props) {
        super(props);
        let _gradientNum = Math.ceil(props.aniDuration / this._gradientTime);
        this.state = {
            startColors: Chroma.scale([props.initColors[0], props.targetColors[0]]).colors(_gradientNum),
            endColors: Chroma.scale([props.initColors[1], props.targetColors[1]]).colors(_gradientNum),
            gradientNum: _gradientNum,
            colorIndex: 0
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    componentWillUnmount() {
        clearTimeout(this._changeColorHandle);
    }

    /**
     * this component's API
     * to start gradient linear animation,
     * have one or two argument
     * if provide one argument, it will set to be the targetColors
     * if provide two arguments, it will set to be the initColors and targetColors
     */
    startChange() {
        let _argArrLength = arguments.length;
        let {initColors} = this.props;
        let {gradientNum} = this.state;
        if (_argArrLength == 1) {
            this.state.startColors = Chroma.scale([initColors[0], arguments[0][0]]).colors(gradientNum);
            this.state.endColors = Chroma.scale([initColors[1], arguments[0][1]]).colors(gradientNum);
        }
        else if (_argArrLength == 2) {
            this.state.startColors = Chroma.scale([arguments[0][0], arguments[1][0]]).colors(gradientNum);
            this.state.endColors = Chroma.scale([arguments[0][1], arguments[1][1]]).colors(gradientNum);
        }
        this.startAni();
    }

    startAni() {
        let {colorIndex} = this.state;
        colorIndex++;
        this.setState({
            colorIndex: colorIndex
        }, () => {
            clearTimeout(this._changeColorHandle);
            if (colorIndex < this.state.gradientNum - 1) {
                this._changeColorHandle = setTimeout(() => {
                    this.startAni();
                }, this._gradientTime);
            }
            else {
                this.state.colorIndex = 0;
            }
        });
    }

    render() {
        Util.log(debugKeyWord + 'render!!!');
        let {startColors, endColors, colorIndex} = this.state;
        return (
            <LinearGradient
                start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 1.0}}
                colors={[startColors[colorIndex], endColors[colorIndex]]}
                style={[Styles.linearGradient, this.props.gradientStyle]}/>
        );
    }
}

const Styles = StyleSheet.create({
    linearGradient: {
        width: 79,
        height: 79,
        borderRadius: 40,
        position: 'absolute',
        top: 0,
        left: 0,
    }
});