/**
 * Created by hebao on 2017/7/17.
 */
import {observable, action, computed} from 'mobx';

let UserInfo = observable({
    @observable base: {//本地状态
        login: false,
        token: '',
        isStudent: true,
        nickName: 'ruiobo',
        realName: '',
        phoneNumber: '131****8387',
        userIcon: 'http://img.jsqq.net/uploads/allimg/150111/1_150111080328_19.jpg'
    },

    @action updateBaseInfo(data) {
        UserInfo.base = {
            ...UserInfo.base,
            ...data
        };
    },

    @computed get fixAge() {
        return (1993 - (UserInfo.state.age - 23)).toFixed(1);
    }
});

export default UserInfo;