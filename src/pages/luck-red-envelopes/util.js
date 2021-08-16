import Taro from '@tarojs/taro';

let plugin = Taro.requirePlugin('loginPlugin');
let lgConfig;
try {
  lgConfig = require('./config.js');
} catch (err) {
  lgConfig = {};
}
let { config = {} } = lgConfig;

const utils = {
  // 截取字符串的值
  getUrlParam(name, replace, from) {
    if (typeof replace === 'string') {
      from = replace;
      replace = true;
    }

    replace = typeof replace === 'undefined' ? true : false;

    var entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
    };

    function replaceChar(string) {
      return String(string).replace(/[&<>"'/]/g, function(s) {
        return entityMap[s];
      });
    }

    var reg,
      group,
      arr = [];

    if (name) {
      reg = new RegExp('(\\?|&)' + name + '=([^&]*)', 'g');
      group = from.match(reg);
    }

    if (group) {
      for (var i = 0; i < group.length; i++) {
        var idx = group[i].indexOf('='),
          value = group[i].substr(idx + 1);
        if (value) {
          try {
            value = decodeURIComponent(value);
          } catch (e) {
            value = '';
          }
          arr.push(replace ? replaceChar(value) : value);
        }
      }
    }

    return arr;
  },
  redirectPage(url) {
    wx.redirectTo({
      url,
    });
  },
  redirectToH5({ page, wvroute }) {
    const app = Taro.getApp().$app.globalData;
    let url = plugin.formH5Url({
      page: decodeURIComponent(
        page +
          (page.indexOf('?') > -1
            ? `&storeId=${app.storeId}&lng=${
                app.coords ? app.coords.lng : ''
              }&lat=${app.coords ? app.coords.lat : ''}&from=miniapp`
            : `?storeId=${app.storeId}&lng=${
                app.coords ? app.coords.lng : ''
              }&lat=${app.coords ? app.coords.lat : ''}&from=miniapp`)
      ),
      wvroute,
    });
    utils.redirectPage(url);
  },
  gotoLogin(url, pageType = 'redirectTo', isLogout = 0) {
    const _url = `/pages/login/index?to=${encodeURIComponent(
      url
    )}&pageType=${pageType}`;
    wx.navigateTo({
      url: `/pages/login/index/index?returnPage=${encodeURIComponent(
        _url
      )}&pageType=redirectTo&isLogout=${isLogout}`,
    });
  },
  redirectToLogin(url, pageType = 'redirectTo', isLogout = 0) {
    const _url = `/pages/login/index?to=${encodeURIComponent(
      url
    )}&pageType=${pageType}`;
    wx.redirectTo({
      url: `/pages/login/index/index?returnPage=${encodeURIComponent(
        _url
      )}&pageType=redirectTo&isLogout=${isLogout}`,
    });
  },
  /**
   * 跳转url
   * @param {*} url
   */
  navigatePage(url) {
    console.log(url);
    wx.navigateTo({
      url,
    });
  },
  /**
   * 跳转H5
   * @param {*} param0
   */
  navigateToH5({ page, wvroute }) {
    const addressInfo = Taro.getStorageSync('addressInfo');
    const storeInfo = addressInfo
      ? typeof addressInfo === 'string'
        ? JSON.parse(addressInfo)
        : addressInfo
      : '';
    let url = plugin.formH5Url({
      page: decodeURIComponent(
        storeInfo
          ? page +
              (page.indexOf('?') > -1
                ? `&storeId=${storeInfo.storeId}&lng=${
                    storeInfo.lon
                      ? storeInfo.lon
                      : storeInfo.coord
                      ? storeInfo.coord[1]
                      : ''
                  }&lat=${
                    storeInfo.lat
                      ? storeInfo.lat
                      : storeInfo.coord
                      ? storeInfo.coord[0]
                      : ''
                  }&from=miniapp`
                : `?storeId=${storeInfo.storeId}&lng=${
                    storeInfo.lon
                      ? storeInfo.lon
                      : storeInfo.coord
                      ? storeInfo.coord[1]
                      : ''
                  }&lat=${
                    storeInfo.lat
                      ? storeInfo.lat
                      : storeInfo.coord
                      ? storeInfo.coord[0]
                      : ''
                  }&from=miniapp`)
          : page
      ),
      wvroute,
    });
    utils.navigatePage(url);
  },
  setLoginParamsStorage(obj = {}) {
    /*
     * 首页存缓存逻辑（兼容不适用loginConfig直接存缓存）：
     * 同名参数优先级：url 中参数 > loginConfig > 缓存中
     */
    let storageConfig = plugin.getLoginParams();
    let loginParams = { ...storageConfig, ...config };
    if (plugin.isObject(obj)) {
      loginParams = { ...loginParams, ...obj };
    } else {
      console.jdLoginLog('登录参数必须为对象');
    }
    plugin.setLoginStorageSync(loginParams);
  },
  getLoginConfig() {
    return config;
  },
  handleJump(p = {}) {
    console.log(p, '=========');
    let { goback, pluginUrl, riskUrl } = p;
    if (goback) {
      utils.goBack();
      return;
    }
    if (pluginUrl) {
      utils.redirectPage(pluginUrl);
      return;
    }
    riskUrl && utils.redirectToH5({ page: riskUrl });
  },
  goBack() {
    let params = plugin.getLoginParams(),
      { returnPage, pageType } = params;
    if (!returnPage) {
      wx.showToast({
        title: '没有returnPage，无法跳转',
        icon: 'none',
      });
      return;
    }
    if (pageType !== 'h5') {
      returnPage = decodeURIComponent(returnPage);
    }
    switch (pageType) {
      case 'switchTab':
        wx.switchTab({
          url: returnPage,
        });
        break;
      case 'h5':
        utils.redirectToH5({ page: returnPage });
        break;
      case 'reLaunch':
        wx.reLaunch({ url: returnPage });
        break;
      default:
        utils.redirectPage(returnPage);
    }
    plugin.gobackLog();
  },
  h5Init(options) {
    let p = plugin.getLoginParams();
    if (plugin.isEmptyObj(p)) utils.setLoginParamsStorage(options);
  },
  setCustomNavigation() {
    let { navigationBarColor, navigationBarTitle } = plugin.getLoginParams();
    plugin.isObject(navigationBarColor) &&
      wx.setNavigationBarColor(navigationBarColor);
    plugin.isObject(navigationBarTitle) &&
      wx.setNavigationBarTitle(navigationBarTitle);
  },
  requestWithLoginStatus({
    url,
    data,
    header = {},
    method,
    dataType,
    responseType,
    success,
    fail,
    complete,
  }) {
    let { cookie = '' } = header,
      [GUID = '', KEY = '', TOKEN = '', PIN = ''] = plugin.getJdListStorage([
        'guid',
        'pt_key',
        'pt_token',
        'pt_pin',
      ]),
      _cookie = `guid=${GUID}; pt_pin=${encodeURIComponent(
        PIN
      )}; pt_key=${KEY}; pt_token=${TOKEN}`;
    header.cookie = `${cookie};${_cookie}`;
    wx.request({
      url,
      data,
      header,
      method,
      dataType,
      responseType,
      success,
      fail,
      complete,
    });
  },
};

export default utils;
