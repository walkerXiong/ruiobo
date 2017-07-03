/**
 * Created by walkerxiong on 2017/6/17.
 */
import {Easing} from 'react-native';
import * as Animatable from 'react-native-animatable';

Animatable.initializeRegistryWithDefinitions({
    //path_animation_special
    app_index_sc_in: {
        easing: Easing.ease,
        0: {
            scale: 0.8,
            translateY: -50,
            opacity: 0.5
        },
        1: {
            scale: 1,
            translateY: 0,
            opacity: 1
        }
    },
    app_index_tc_in: {
        easing: Easing.ease,
        0: {
            scale: 0.8,
            translateY: 50,
            opacity: 0.5
        },
        1: {
            scale: 1,
            translateY: 0,
            opacity: 1
        }
    },
});