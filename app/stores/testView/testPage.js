/**
 * Created by hebao on 2017/5/26.
 */
import {observable, action, computed} from 'mobx';

let TestPageStore = observable({
    @observable data: {//服务端数据
        wifiPwd: '123456'
    },

    @observable state: {//本地状态
        wifiName: 'walkerXiong',
    },

    @action updateData(data) {
        TestPageStore.data = {
            ...TestPageStore.data,
            ...data
        };
    },
});

export default TestPageStore;