/**
 * Created by hebao on 2017/6/15.
 * refer to : http://www.reactnativediary.com/2016/12/20/navigation-experimental-custom-transition-1.html
 */
import {I18nManager, Easing, Animated} from 'react-native';

// Define scene transition params
const transitionSpec = {
    duration: 350,
    easing: Easing.out(Easing.poly(5)), // decelerate
    timing: Animated.timing,
};

const IOSTransitionSpec = ({
    duration: 500,
    easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
    timing: Animated.timing,
});

export const Android_Default = () => {
    return {
        transitionSpec,
        // Define scene interpolation, eq. custom transition
        screenInterpolator: (sceneProps) => {
            //part-1: prepare for some params
            const {position, scene} = sceneProps;
            const {index} = scene;
            const inputRange = [index - 1, index, index + 0.99, index + 1];

            //part-2: define transition animation
            const opacity = position.interpolate({
                inputRange,
                outputRange: [0, 1, 1, 0],
            });
            const translateY = position.interpolate({
                inputRange,
                outputRange: [50, 0, 0, 0],
            });

            //part-3 return
            return {
                opacity,
                transform: [
                    {translateY}
                ]
            };
        }
    }
};

export const IOS_Default = () => {
    return {
        IOSTransitionSpec,
        // Define scene interpolation, eq. custom transition
        screenInterpolator: (sceneProps) => {
            //part-1: prepare for some params
            const {position, scene, layout} = sceneProps;
            const {index} = scene;
            const width = layout.initWidth;
            const inputRange = [index - 1, index, index + 1];
            const outputRange = I18nManager.isRTL ? [-width, 0, 10] : [width, 0, -10];

            //part-2: define transition animation
            const opacity = position.interpolate({
                inputRange: ([
                    index - 1,
                    index - 0.99,
                    index,
                    index + 0.99,
                    index + 1,
                ]),
                outputRange: ([0, 1, 1, 0.3, 0]),
            });
            const translateY = 0;
            const translateX = position.interpolate({
                inputRange,
                outputRange,
            });

            //part-3 return
            return {
                opacity,
                transform: [
                    {translateX},
                    {translateY}
                ]
            };
        }
    }
};

export const Horizontal_RToL_Scale_Opacity_TranslateX = () => {
    return {
        transitionSpec,
        // Define scene interpolation, eq. custom transition
        screenInterpolator: (sceneProps) => {
            //part-1: prepare for some params
            const {position, scene, layout} = sceneProps;
            const {index} = scene;
            const width = layout.initWidth;
            const inputRange = [index - 1, index, index + 0.999, index + 1];
            const outputRange = I18nManager.isRTL ? [-width, 0, 10, 10] : [width, 0, -10, -10];

            //part-2: define transition animation
            const opacity = position.interpolate({
                inputRange,
                outputRange: [1, 1, 0.3, 0],
            });
            const scale = position.interpolate({
                inputRange,
                outputRange: ([1, 1, 0.95, 0.95]),
            });
            const translateX = position.interpolate({
                inputRange,
                outputRange,
            });

            //part-3 return
            return {
                opacity,
                transform: [
                    {scale},
                    {translateX}
                ]
            };
        }
    }
};

export const Horizontal_RToL_Opacity_TranslateX = () => {
    return {
        transitionSpec,
        // Define scene interpolation, eq. custom transition
        screenInterpolator: (sceneProps) => {
            //part-1: prepare for some params
            const {position, scene, layout} = sceneProps;
            const {index} = scene;
            const width = layout.initWidth;
            const inputRange = [index - 1, index, index + 0.999, index + 1];
            const outputRange = I18nManager.isRTL ? [-width, 0, 10, 10] : [width, 0, -10, -10];

            //part-2: define transition animation
            const opacity = position.interpolate({
                inputRange,
                outputRange: [1, 1, 0.3, 0],
            });
            const translateX = position.interpolate({
                inputRange,
                outputRange,
            });

            //part-3 return
            return {
                opacity,
                transform: [
                    {translateX},
                ]
            };
        }
    }
};

export const Horizontal_RToL_Opacity = () => {
    return {
        transitionSpec,
        // Define scene interpolation, eq. custom transition
        screenInterpolator: (sceneProps) => {
            //part-1: prepare for some params
            const {position, scene, layout} = sceneProps;
            const {index} = scene;
            const width = layout.initWidth;
            const inputRange = [index - 1, index, index + 0.999, index + 1];
            const outputRange = I18nManager.isRTL ? [-width, 0, 0, 0] : [width, 0, 0, 0];

            //part-2: define transition animation
            const opacity = position.interpolate({
                inputRange,
                outputRange: [1, 1, 0.3, 0],
            });
            const translateX = position.interpolate({
                inputRange,
                outputRange,
            });

            //part-3 return
            return {
                opacity,
                transform: [
                    {translateX},
                ]
            };
        }
    }
};

export const Horizontal_RToL_Scale_Opacity = () => {
    return {
        transitionSpec,
        // Define scene interpolation, eq. custom transition
        screenInterpolator: (sceneProps) => {
            //part-1: prepare for some params
            const {position, scene, layout} = sceneProps;
            const {index} = scene;
            const width = layout.initWidth;
            const inputRange = [index - 1, index, index + 0.999, index + 1];
            const outputRange = I18nManager.isRTL ? [-width, 0, 0, 0] : [width, 0, 0, 0];

            //part-2: define transition animation
            const opacity = position.interpolate({
                inputRange,
                outputRange: [1, 1, 0.3, 0],
            });
            const scale = position.interpolate({
                inputRange,
                outputRange: ([1, 1, 0.95, 0.95]),
            });
            const translateX = position.interpolate({
                inputRange,
                outputRange,
            });

            //part-3 return
            return {
                opacity,
                transform: [
                    {scale},
                    {translateX}
                ]
            };
        }
    }
};

export const FadeIn = () => {
    return {
        transitionSpec,
        // Define scene interpolation, eq. custom transition
        screenInterpolator: (sceneProps) => {
            //part-1: prepare for some params
            const {position, scene} = sceneProps;
            const {index} = scene;
            const inputRange = [index - 1, index, index + 1];

            //part-2: define transition animation
            const opacity = position.interpolate({
                inputRange,
                outputRange: [0, 1, 0],
            });

            //part-3 return
            return {
                opacity
            };
        }
    }
};