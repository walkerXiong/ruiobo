/**
 * Created by hebao on 2017/2/7.
 */
'use strict';
const config = {
    version: '0.1',
    debugMsg: false,//是否开启打印
    develop: true,//开发环境 or 正式环境
    preview: false,//是否预发版，true 预发版 false 不是预发版==> 只有当 develop 为 false 时候，才会继续判断此字段的值，最终决定 domain 地址
    formalDomain: 'https://www.baidu.com/',//正式环境主域名
    preDomain: 'https://www.baidu.com/',//预发版域名
    devDomain: 'http://www.baidu.com/',//测试环境主域名，其中端口以版本号命名
    activityFormalDomain: 'https://www.baidu.com/',//活动的正式域名
    activityDevDomain: 'http://www.baidu.com/',//活动的测试域名
};
export default config;