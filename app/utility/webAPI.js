/**
 * Created by hebao on 2017/2/7.
 */
'use strict';
import {
    NetInfo
} from 'react-native';
import config from '../config';
import Util from './util';
import * as Crypto from './cryptoJs';
import * as ACTIONS from '../utility/events';

const _domain = config.develop ? config.devDomain : (config.preview ? config.preDomain : config.formalDomain);
const _signKey = config.develop ? 'AF30FEB52DCEC4129CF778A316871BCA' : '453349E3338EE078CF23E9C8D46DF799';
const _activityDomain = config.develop ? config.activityDevDomain : config.activityFormalDomain;
const debugKeyWord = '[webAPI]';

let _loadingStartTime = 500;//500ms内网络请求无响应，则展现loading动画
let _overTimeCount = 30000;//API请求超时
/**
 *
 * @param options //options: {'allowCancel': true, 'overTime': 30000, 'overTimeCallback': null}
 * //allowCancel: 是否允许返回键取消loading动画
 * //overTime: API接口超时时间，默认 30s 超时
 * //overTimeCallback: 超时之后的回调函数
 * @returns {[*,*]}
 * @private
 */
function _startLoading(options) {
    Util.log(debugKeyWord + "loading start!!!!");
    options === undefined ? options = {} : null;
    let _loadingHandle = setTimeout(() => {
        Util.trigger(ACTIONS.ACTION_LOADING_DONE, {
            done: false,
            allowCancel: options.allowCancel
        });
    }, _loadingStartTime);

    let _overTimeHandle = setTimeout(() => {
        Util.trigger(ACTIONS.ACTION_LOADING_DONE, {
            done: true,
            onClose: () => {
                Util.toast.show('网络加载超时，请检查网络！');
                options.overTimeCallback instanceof Function && options.overTimeCallback();
            }
        });
    }, options.overTime ? options.overTime : _overTimeCount);

    return [_loadingHandle, _overTimeHandle];
}
function _endLoading(handles) {
    Util.log(debugKeyWord + "loading done!!!");
    clearTimeout(handles[0]);
    clearTimeout(handles[1]);
    Util.trigger(ACTIONS.ACTION_LOADING_DONE, {done: true});
}
function _sign(obj) {//加签规则
    let _signStr = '', _signValue, _bodyStr;
    let _keySort = Object.keys(obj).sort();
    for (let i = 0, j = _keySort.length; i < j; i++) {
        _signStr += _keySort[i] + '=' + encodeURIComponent(obj[_keySort[i]]);
        i !== j - 1 ? _signStr += '&' : null;
    }
    _signValue = Crypto.CryptoMD5(_signStr + '&key=' + _signKey);
    _bodyStr = _signStr + '&Sign=' + _signValue;
    return _bodyStr;
}
const WebAPI = {
    fetchDone: true,
    header: {},
    FAQ: {
        GetFAQTypeList: (callback, errorCallback) => {
            const _url = _domain + 'FAQ/GetFAQTypeList';
            Util.log(debugKeyWord + "fetch url:" + _url);
            fetch(_url, {
                method: "GET",
                headers: {
                    ...WebAPI.header
                },
            })
                .then((response) => response.json())
                .then((responseJsonData) => {
                    callback && callback(responseJsonData);
                })
                .catch((e) => {
                    Util.log(debugKeyWord + "GetFAQTypeList Error:" + e);
                    errorCallback && errorCallback(e);
                })
                .done();
        },
        FeedbackFAQ: (FAQID, isResolved, callback, errorCallback) => {
            const _url = _domain + 'FAQ/FeedbackFAQ';
            Util.log(debugKeyWord + "post url:" + _url + ";FAQID:" + FAQID + ";isResolved:" + isResolved);
            const _body = _sign({
                "FAQID": FAQID,
                "isResolved": isResolved,
            });
            fetch(_url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    ...WebAPI.header
                },
                body: _body
            })
                .then((response) => response.json())
                .then((responseJsonData) => {
                    callback && callback(responseJsonData);
                })
                .catch((e) => {
                    Util.log(debugKeyWord + "FeedbackFAQ Error:" + e);
                    errorCallback && errorCallback(e);
                })
                .done();
        }
    },
    NetInfo: {
        simulateRequestHandle: -1,
        isConnected: {
            fetch: (callback) => {
                NetInfo.isConnected.fetch().done(
                    (isConnected) => {
                        callback && callback(isConnected);
                    }
                );
            },
            addEventListener: (handle, callback) => {
                NetInfo.isConnected.addEventListener(
                    handle,
                    callback
                );
            },
            removeEventListener: (handle, callback) => {
                NetInfo.isConnected.removeEventListener(
                    handle,
                    callback
                );
            }
        },
        simulateRequest: (callback) => {
            let _responseTimeDelay = Math.ceil(Math.random() + 5) * 1000;
            let _loadingHandle = _startLoading({overTime: 20000, allowCancel: false});
            NetInfo.isConnected.fetch().done(
                (isConnected) => {
                    setTimeout(() => {
                        _endLoading(_loadingHandle);
                        callback && callback(isConnected);
                    }, _responseTimeDelay);
                }
            );
        },
        simulateRequestTest: (callback, overTimeCallback) => {
            let _responseTimeDelay = Math.ceil(Math.random() + 30) * 1000;
            let _loadingHandle = _startLoading({
                overTime: 20000,
                overTimeCallback: overTimeCallback
            });
            NetInfo.isConnected.fetch().done(
                (isConnected) => {
                    setTimeout(() => {
                        _endLoading(_loadingHandle);
                        callback && callback(isConnected);
                    }, _responseTimeDelay);
                }
            );
        }
    },
};
export default WebAPI;