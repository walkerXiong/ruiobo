/**
 * Created by hebao on 2017/5/26.
 */
import {observable, action, computed} from 'mobx';

let TestStore = observable({
    @observable data: {//服务端数据
        Success: false,
        keyboardType: 1
    },

    @observable state: {//本地状态
        userName: 'walkerXiong',
        age: 23
    },

    @action updateData(data) {
        TestStore.data = {
            ...TestStore.data,
            ...data
        };
    },

    @computed get fixAge() {
        return (1993 - (TestStore.state.age - 23)).toFixed(1);
    }
});

export default TestStore;