/**
 * Created by hebao on 2017/5/27.
 *  this component's main job is to change text directly ,
 *  because we can't find the Text Component's setNativeProps to change content
 *  so ,this component birth to solve this problem.
 *  the scene to use it is you need to set Text content frequently , like number scroll up
 */
import React, {Component, PropTypes} from 'react';
import {
    Text
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';

import Util from '../utility/util';
const debugKeyWord = '[DirectText]';
export default class DirectText extends Component {
    static propTypes = {
        text: PropTypes.string,
        fontSize: PropTypes.number,
        color: PropTypes.string,
        textAlign: PropTypes.string
    };

    static defaultProps = {
        text: '',
        fontSize: 15,
        color: '#000000',
        textAlign: 'center'
    };

    constructor(props) {
        super(props);
        this.state = {
            ...props
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    setText(text) {
        this.setState({text: text});
    }

    render() {
        Util.log(debugKeyWord + 'render!!!');
        let {text, fontSize, color, textAlign} = this.state;
        return <Text style={{fontSize: fontSize, color: color, textAlign: textAlign}}>{text}</Text>
    }
}