import Taro from '@tarojs/taro';
import { getClubQueryUserInfo } from '@7fresh/api';
import AES from 'crypto-js/aes';
import loginConfig from './config';

let plugin = Taro.requirePlugin('loginPlugin');
const app = Taro.getApp();

(function () {
  if (console.jdLoginLog) return;
  let normalLog = console.log;
  console.jdLoginLog = (...args) => {
    args.unshift('-------登录插件-------');
    normalLog && normalLog(...args);
  };
})();

const utils = {
  transformH5Url(h5Url) {
    let tempUrl = decodeURIComponent(h5Url).split('?');
    const addressInfo = Taro.getStorageSync('addressInfo');
    const storeInfo = addressInfo
      ? typeof addressInfo === 'string'
        ? JSON.parse(addressInfo)
        : addressInfo
      : '';
    if (tempUrl.length === 2) {
      if (tempUrl[1].indexOf('from=') === -1) {
        tempUrl[1] = `${tempUrl[1]}&from=miniapp`;
      }
      if (tempUrl[1].indexOf('storeId=') === -1) {
        tempUrl[1] = `${tempUrl[1]}&storeId=${storeInfo.storeId}`;
      }
      if (tempUrl[1].indexOf('lat=') === -1) {
        tempUrl[1] = `${tempUrl[1]}&lat=${
          storeInfo.lat || (storeInfo && storeInfo.coord[0])
        }`;
      }
      if (tempUrl[1].indexOf('lng=') === -1) {
        tempUrl[1] = `${tempUrl[1]}&lng=${
          storeInfo.lng || (storeInfo && storeInfo.coord[1])
        }`;
      }
      if (tempUrl[1].indexOf('tenantId=') === -1) {
        tempUrl[1] = `${tempUrl[1]}&tenantId=${storeInfo.tenantId}`;
      }
      //集单的不加SR_SDK_INFO，避免400
      // if (
      //   tempUrl[1].indexOf('nowBuy=15') === -1 &&
      //   tempUrl[1].indexOf('nowBuy=16') === -1 &&
      //   tempUrl[1].indexOf('prepayCardType=true') === -1 &&
      //   tempUrl[0].indexOf('giftCards/cardDetail') === -1
      // ) {
      //   if (tempUrl[1].indexOf('SR_SDK_INFO=') > -1) {
      //     tempUrl[1] = tempUrl[1].split('&SR_SDK_INFO')[0];
      //   } else if (
      //     tempUrl[1].indexOf('SR_SDK_INFO=') === -1 &&
      //     encodeURIComponent(`${app.sr.getInfo()}`).length < 1500
      //   ) {
      //     tempUrl[1] = `${tempUrl[1]}&${app.sr.getInfo()}`;
      //   }
      // }

      if (tempUrl[1].indexOf('platformId=') === -1) {
        tempUrl[1] = `${tempUrl[1]}&platformId=${storeInfo.platformId || 1}`;
      }
      // tempUrl[0].indexOf('/order.html') === -1 // 结算页
      if (
        tempUrl[1].indexOf('returnData=') === -1 &&
        tempUrl[0].indexOf('/coupon') === -1 &&
        tempUrl[1].indexOf('nowBuy=16') === -1 &&
        tempUrl[1].indexOf('prepayCardType=true') === -1 &&
        tempUrl[0].indexOf('/giftCards') === -1 && //coupon不加returnData
        tempUrl[0].indexOf('/immersive/inviteHasGifts') === -1 &&
        tempUrl[0].indexOf('/new-customer') === -1 &&
        tempUrl[0].indexOf('/calculation-rank-list') === -1 && //榜单详情页面url参数过长
        tempUrl[0].indexOf('/red-envelope-rain') === -1 && // 红包雨
        tempUrl[0].indexOf('/draw') === -1 && // 下单抽大奖
        tempUrl[0].indexOf('/address') === -1 && // 地址页
        tempUrl[0].indexOf('/muji-code') === -1 // MUJI会员码
      ) {
        tempUrl[1] = `${tempUrl[1]}&returnData=${utils.cryptoReturnData()}`;
      }
    } else if (tempUrl.length === 0) {
      tempUrl[1] = `from=miniapp&storeId=${storeInfo.storeId}&lat=${
        storeInfo.lat || (storeInfo && storeInfo.coord[0])
      }&lng=${storeInfo.lng || (storeInfo && storeInfo.coord[1])}&tenantId=${
        storeInfo.tenantId || 1
      }&${app.sr.getInfo()}&platformId=${
        storeInfo.platformId || 1
      }&returnData=${utils.cryptoReturnData()}`;
    }
    let url;
    if (tempUrl[1]) {
      url = encodeURIComponent(`${tempUrl[0]}?${tempUrl[1]}`);
    } else {
      url = encodeURIComponent(`${tempUrl[0]}`);
    }
    console.log({ url });
    return url;
  },
  cryptoReturnData() {
    let addressInfo = Taro.getStorageSync('addressInfo');
    if (addressInfo && addressInfo.tenantShopInfo) {
      delete addressInfo.tenantShopInfo;
    }
    const storeInfo = addressInfo
      ? typeof addressInfo === 'string'
        ? JSON.parse(addressInfo)
        : addressInfo
      : '';
    /*小程序跳转H5暂不传递租户列表*/

    const ciphertext = AES.encrypt(
      JSON.stringify(storeInfo),
      '7fresh-h5'
    ).toString();
    return ciphertext;
  },
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
      return String(string).replace(/[&<>"'/]/g, function (s) {
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
    console.log(group);
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
  hideHomeButton() {
    wx.hideHomeButton();
  },
  redirectToH5({ page, wvroute }) {
    const globalData = app.globalData;
    let url = plugin.formH5Url({
      page: decodeURIComponent(
        page +
          (page.indexOf('?') > -1
            ? `&storeId=${globalData.storeId}&lng=${
                globalData.coords ? globalData.coords.lng : ''
              }&lat=${
                globalData.coords ? globalData.coords.lat : ''
              }&from=miniapp`
            : `?storeId=${globalData.storeId}&lng=${
                globalData.coords ? globalData.coords.lng : ''
              }&lat=${
                globalData.coords ? globalData.coords.lat : ''
              }&from=miniapp`)
      ),
      wvroute,
    });
    utils.redirectPage(url);
  },
  gotoLogin(url, pageType = 'redirectTo', isLogout = 1) {
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
    console.log('跳转url', url);
    wx.navigateTo({
      url,
    });
  },
  redirectPage(url) {
    console.log('跳转url', url);
    wx.redirectTo({
      url,
    });
  },
  /**
   * 跳转H5
   * @param {*} param0
   */
  navigateToH5({ page, wvroute }, isRedirect) {
    const addressInfo = Taro.getStorageSync('addressInfo');
    console.log('navigateToH5-addressInfo', addressInfo);
    const storeInfo = addressInfo
      ? typeof addressInfo === 'string'
        ? JSON.parse(addressInfo)
        : addressInfo
      : '';
    if (page.indexOf('?') === -1) {
      page = page + '?';
    } else {
      page = page + '&';
    }
    page = page + 'from=miniapp';
    if (page.indexOf('storeId=') === -1 && Number(storeInfo.storeId) > 0) {
      page = page + `&storeId=${storeInfo.storeId}`;
    }
    if (Number(utils.getUrlParam('storeId', page)[0]) === storeInfo.storeId) {
      if (page.indexOf('lat=') === -1) {
        if (Number(storeInfo.lat) > 0) {
          page = page + `&lat=${storeInfo.lat}`;
        } else if (
          storeInfo.coord &&
          storeInfo.coord.length > 1 &&
          Number(storeInfo.coord[0]) > 0
        ) {
          page = page + `&lat=${storeInfo.coord[0]}`;
        }
      }
      if (page.indexOf('lng=') === -1) {
        if (Number(storeInfo.lon) > 0) {
          page = page + `&lng=${storeInfo.lon}`;
        } else if (
          storeInfo.coord &&
          storeInfo.coord.length > 1 &&
          Number(storeInfo.coord[1]) > 0
        ) {
          page = page + `&lng=${storeInfo.coord[1]}`;
        }
      }
      if (page.indexOf('tenantId=') === -1) {
        if (Number(storeInfo.tenantId) > 0) {
          page = page + `&tenantId=${storeInfo.tenantId}`;
        }
      }
    }

    let url = plugin.formH5Url({
      page: decodeURIComponent(page),
      wvroute,
    });
    if (isRedirect) {
      utils.redirectPage(url);
    } else {
      utils.navigatePage(url);
    }
  },
  setLoginParamsStorage(obj = {}) {
    plugin.setLoginStorageSync(utils.getLoginConfig(obj));
  },
  /*
   * 首页存缓存逻辑（兼容不适用loginConfig直接存缓存）：
   * 同名参数优先级：url 中参数 > loginConfig > 缓存中
   */
  getLoginConfig(obj = {}) {
    //兼容缓存中有returnPage， 传递的参数中无，塞缓存时会用缓存中的值，导致不匹配
    const handleUndefinedType = (o = {}) => {
      let { pageType = 'redirectTo' } = o;
      o.pageType = pageType;
      return o;
    };

    let storageConfig = plugin.getLoginParams();
    let config = handleUndefinedType(utils.getDefaultConfig());
    let loginParams = { ...storageConfig, ...config };
    if (plugin.isObject(obj)) {
      loginParams = { ...loginParams, ...obj };
    } else {
      console.jdLoginLog('登录参数必须为对象');
    }

    if (loginParams.isLogout === '1') loginParams.isLogout = 1;
    return loginParams;
  },
  getDefaultConfig() {
    return loginConfig || {};
  },
  handleJump(p = {}) {
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

    utils.getClubQueryUserInfo(pageType, returnPage);
    // switch (pageType) {
    //   case 'switchTab':
    //     wx.switchTab({
    //       url: returnPage,
    //     });
    //     break;
    //   case 'h5':
    //     utils.redirectToH5({ page: returnPage });
    //     break;
    //   case 'reLaunch':
    //     wx.reLaunch({ url: returnPage });
    //     break;
    //   default:
    //     utils.redirectPage(returnPage);
    // }
    // plugin.gobackLog();
  },
  getClubQueryUserInfo(pageType, returnPage) {
    getClubQueryUserInfo()
      .then((res) => {
        console.log('【7fresh.user.queryUserInfo】goBack res:', res);
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
      })
      .catch((err) => {
        console.log('【7fresh.user.queryUserInfo】goBack err:', err);
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
      });
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
  requestWithLoginStatus(obj = {}) {
    obj.header = obj.header || {};
    let [GUID = '', KEY = '', TOKEN = '', PIN = ''] = plugin.getJdListStorage([
        'guid',
        'pt_key',
        'pt_token',
        'pt_pin',
      ]),
      _cookie = `guid=${GUID}; pt_pin=${encodeURIComponent(
        PIN
      )}; pt_key=${KEY}; pt_token=${TOKEN}`,
      { cookie } = obj.header;
    obj.header.cookie = cookie ? `${cookie};${_cookie}` : _cookie;
    wx.request(obj);
  },
  silentauthlogin(options, goToLogin, callback) {
    wx.login({
      success(res = {}) {
        let { code } = res;
        if (code) {
          utils.setLoginParamsStorage(options);
          plugin
            .silentauthlogin({ ...options, code }, goToLogin)
            .then(() => {
              callback && callback();
            })
            .catch(() => {
              callback && callback();
              console.jdLoginLog('请重试一次');
            });
        } else {
          callback && callback();
          console.jdLoginLog('wx.login 获取code失败');
        }
      },
      fail() {
        callback && callback();
      },
    });
  },
};

export default utils;
