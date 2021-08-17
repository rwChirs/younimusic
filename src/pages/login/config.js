// eslint-disable-next-line import/prefer-default-export
export default {
  wxversion: 'wxae9140d69ccf0c22',
  appid: 750,
  // returnPage: '/pages/arrivedStore/arrivedStore',
  returnPage: '/pages/index/index',
  pageType: 'switchTab',
  isLogout: 1,
  noWXinfo: 1,
  h5path: undefined,
  logoPath: undefined,
  isTest: undefined,
  isKepler: undefined,
  navigationBarColor: { backgroundColor: '#67D04E', frontColor: '#ffffff' },
  navigationBarTitle: { title: '七鲜' },
  tabNum: 2,
  requestHost: 'https://wxapplogin.m.jd.com',
  logPluginName: '', // 埋点插件的名字 例如：'log-plugin'
  selfTipsDialog: false, // 是否弹窗展示协议授权，默认为false，如果为true，author必须为false
  selfTips: [
    {
      tip: '《京东用户注册协议》',
      url: 'https://wxapplogin.m.jd.com/static/registration.html',
    },
    {
      tip: '《京东隐私政策》',
      url: 'https://ihelp.jd.com/n/help/tip/getTipsFacade.json?tipId=74',
    },
    {
      tip: '《七鲜用户注册协议》',
      url: 'https://7fresh.m.jd.com/reg-protocal.html',
    },
    {
      tip: '《七鲜隐私政策》',
      url: 'https://7fresh.m.jd.com/policy.html',
    },
  ],
  author: true, //增加协议勾选框 默认为不展示
};
