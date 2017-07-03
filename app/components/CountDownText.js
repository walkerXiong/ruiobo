/**
 * Created by hebao on 2017/5/27.
 */
import React, {Component, PropTypes} from 'react';
import {
    Text
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';

import Util from '../utility/util';
const debugKeyWord = '[CountDownText]';
export default class CountDownText extends Component {
    static propTypes = {
        countTime: PropTypes.number,
        countInterval: PropTypes.number,
        countDoneCallBack: PropTypes.func,
        autoStartCount: PropTypes.bool,
        fontSize: PropTypes.number,
        color: PropTypes.string,
        textAlign: PropTypes.string
    };

    static defaultProps = {
        countTime: 60,
        countInterval: 1000,
        countDoneCallBack: null,
        autoStartCount: false,
        fontSize: 15,
        color: '#000000',
        textAlign: 'center'
    };

    _countHandle = -1;

    constructor(props) {
        super(props);
        this.state = {
            ...props
        }
    }

    componentDidMount() {
        if (this.state.autoStartCount) {
            this.startCountDown();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    componentWillUnmount() {
        clearInterval(this._countHandle);
    }

    startCountDown(countTime) {
        countTime && (this.state.countTime = countTime);
        clearInterval(this._countHandle);
        this._countHandle = setInterval(() => {
            if (this.state.countTime > 0) {
                let _countTime = this.state.countTime;
                this.setState({countTime: --_countTime});
            }
            else {
                clearInterval(this._countHandle);
                this.state.countDoneCallBack instanceof Function && this.state.countDoneCallBack();
            }
        }, this.state.countInterval);
    }

    stopCountDown() {
        clearInterval(this._countHandle);
    }

    render() {
        Util.log(debugKeyWord + 'render!!!');
        let {countTime, fontSize, color, textAlign} = this.state;
        return <Text style={{fontSize: fontSize, color: color, textAlign: textAlign}}>{countTime}</Text>
    }
}