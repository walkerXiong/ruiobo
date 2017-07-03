/**
 * Created by hebao on 2017/5/22.
 * this component's main job is to realize fps animation
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';

import Util from '../utility/util';
const debugKeyWord = '[FrameAnimation]';
export default class FrameAnimation extends Component {
    _aniHandle = -1;

    static propTypes = {
        sprite: PropTypes.array.isRequired,
        fps: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    };

    static defaultProps = {
        sprite: [],
        fps: 20,
        width: 112,
        height: 56
    };

    constructor(props) {
        super(props);
        this.state = {
            aniIndex: 0
        }
    }

    componentDidMount() {
        this._aniHandle = setInterval(() => {
            let _aniIndex;
            if (this.state.aniIndex >= this.props.sprite.length - 1) {
                _aniIndex = 0;
            }
            else {
                _aniIndex = this.state.aniIndex;
                ++_aniIndex;
            }
            this.setState({aniIndex: _aniIndex});
        }, Math.ceil(1000 / this.props.fps));
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.aniIndex !== this.state.aniIndex;
    }

    componentWillUnmount() {
        clearInterval(this._aniHandle);
    }

    render() {
        Util.log(debugKeyWord + 'render!!!');
        let {width, height, sprite} = this.props;
        return (
            <View style={{width: width, height: height}}>
                {sprite.map((s, i) => {
                    if (s !== undefined) {
                        return (
                            <Image
                                key={i}
                                fadeDuration={0}
                                style={{
                                    width: width,
                                    height: height,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    opacity: i == this.state.aniIndex ? 1 : 0
                                }}
                                source={s}/>
                        );
                    }
                })}
            </View>
        );
    }
}