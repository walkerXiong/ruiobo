/**
 * Created by hebao on 2017/7/17.
 */
import {observable, action, computed} from 'mobx';

let UserInfo = observable({
    @observable base: {//本地状态
        isStudent: true,
        nickName: 'ruiobo',
        realName: '',
        phoneNumber: '',
        userIcon: 'http://img.jsqq.net/uploads/allimg/150111/1_150111080328_19.jpg'
    },

    @observable state: {//本地状态
        drawerItems: [{
            icon: 'paper-plane',
            profile: '订单列表',
            navRoute: 'DrawerClose'
        }, {
            icon: 'question',
            profile: '使用指南',
            navRoute: 'Help'
        }, {
            icon: 'settings',
            profile: '系统设置',
            navRoute: 'SysSet'
        }]
    },

    @action updateBaseInfo(data) {
        UserInfo.base = {
            ...UserInfo.base,
            ...data
        };
    },

    @action updateState(state) {
        UserInfo.state = {
            ...UserInfo.state,
            ...state
        };
    },

    @computed get fixAge() {
        return (1993 - (UserInfo.state.age - 23)).toFixed(1);
    }
});

export default UserInfo;