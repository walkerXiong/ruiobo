/**
 * Created by hebao on 2017/5/27.
 */
import {Platform} from 'react-native';
import {StackNavigator, DrawerNavigator} from 'react-navigation';
import {Android_Default, Horizontal_RToL_withoutScale, Horizontal_RToL_withScale, FadeIn} from './transitionConfig';

import Root from '../index';
import Teacher from '../teacher/index';
import Student from '../student/index';

export const RootPage = StackNavigator({
    Home: {screen: Root},
    TeacherClient: {screen: Teacher},
    StudentClient: {screen: Student}
}, {
    headerMode: 'none',
    navigationOptions: {gesturesEnabled: Platform.OS === 'ios'},
    transitionConfig: Horizontal_RToL_withoutScale
});