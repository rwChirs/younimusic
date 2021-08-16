import Taro from '@tarojs/taro';
import { getWxLoginStatus } from "@7fresh/api";
import serverApi from '../config/server.js';
import Mmd5 from './Mmd5.js';

let app = getApp();
let { appid = 269, wxversion } = app;

function wxAjax({ url, method = 'GET', data, header, callback }) {
  const CONTENT_TYPE = 'application/x-www-form-urlencoded',
    DEFAULT_HEADER = {
      'content-type': CONTENT_TYPE,
      cookie: setCookie(),
    };
  wx.request({
    url,
    data,
    method,
    header: header || DEFAULT_HEADER,
    complete: res => {
      // wx.showModal({title: 'test', content: JSON.stringify(res)})
      let { statusCode, data } = res,
        isSuccess =
          (statusCode >= 200 && statusCode < 300) || statusCode === 304;
      data = data || {}; //兼容null
      data.isSuccess = isSuccess;
      data.wxStatus = isSuccess ? 'success' : 'fail';
      callback(data);
    },
  });
}

function setCookie() {
  const GUID = wx.getStorageSync('jdlogin_guid') || '',
    LSID = wx.getStorageSync('jdlogin_lsid') || '',
    PIN = encodeURIComponent(wx.getStorageSync('jdlogin_pt_pin') || ''),
    KEY = wx.getStorageSync('jdlogin_pt_key') || '',
    TOKEN = wx.getStorageSync('jdlogin_pt_token') || '';
  return `guid=${GUID}; lsid=${LSID}; pt_pin=${PIN}; pt_key=${KEY}; pt_token=${TOKEN}`;
}

function smslogin({ code, wxUserInfo, jdlogin, callback }) {
  let { iv, encryptedData } = wxUserInfo;
  if (jdlogin) {
    code = '';
    iv = '';
    encryptedData = '';
    [
      'jdlogin_guid',
      'jdlogin_lsid',
      'jdlogin_pt_pin',
      'jdlogin_pt_key',
      'jdlogin_pt_tokenS',
    ].forEach(item => {
      wx.removeStorageSync(item);
    });
  }
  let data = {
    appid,
    wxversion,
    code,
    user_data: encryptedData,
    user_iv: iv,
  };
  wxAjax({
    url: serverApi.smslogin,
    data,
    method: 'POST',
    callback,
  });
}

function smslogin_sendmsg({ sdk_ver, mobile, callback }) {
  const MD5_SALT = 'Abcdg!ax0bd39gYr3zf&dSrvm@t%a3b9';
  let commonStr = `appid=${appid}&mobile=${mobile}`;
  let sign =
    sdk_ver == 2
      ? `${commonStr}&wxappid=${wxversion}${MD5_SALT}`
      : `${commonStr}${MD5_SALT}`;
  let md5Sign = Mmd5().hex_md5(sign);
  let url = `${serverApi.smslogin_sendmsg}?${commonStr}&sign=${md5Sign}`;
  wxAjax({
    url,
    callback,
  });
}

function dosmslogin({ mobile, smscode, callback }) {
  let data = {
    mobile,
    smscode,
  };
  wxAjax({
    url: serverApi.dosmslogin,
    data,
    method: 'POST',
    callback,
  });
}

function goBackPage(returnPage, pageType) {
  returnPage = decodeURIComponent(returnPage);
  switch (pageType) {
    case 'switchTab':
      wx.switchTab({
        url: returnPage,
      });
      break;
    case 'h5':
      h5JumpOnly(returnPage);
      break;
    default:
      wx.redirectTo({
        url: returnPage,
      });
  }
}

function goBack({ returnPage, pageType }) {
  //TODO: 需要验证
  getWxLoginStatus({
      fromsource: 'weix',
      source:
        returnPage.indexOf('groupon') > -1
          ? '30'
          : returnPage.indexOf('cabinet') > -1
          ? '34'
          : returnPage.indexOf('luck-red-envelopes') > -1
          ? '9'
          : '100', //新人入驻同步用户数据需要传参
      subSource: '',
  })
    .then(data => {
      if (
        data &&
        data.isNewUser == 1 &&
        data.applyStatus != 1 &&
        data.coupons.length > 0
      ) {
        wx.reLaunch({
          url: `/pages/new-gift/index?grabRedPackets=${JSON.stringify(
            data.coupons
          )}&returnPage=${returnPage}&pageType=${pageType}`,
        });
        return;
      }
      goBackPage(returnPage, pageType);
    })
    .catch(err => {
      console.log(err);
    });
}

//只做跳转，其他逻辑在web-view中执行
function h5JumpOnly(page, canBack) {
  if (canBack) {
    wx.navigateTo({
      url: '../web-view/web-view?h5_url=' + encodeURIComponent(page),
    });
  } else {
    wx.redirectTo({
      url: '../web-view/web-view?h5_url=' + encodeURIComponent(page),
    });
  }
}

function tokenLogin({ token, callback }) {
  let data = {
    token,
    appid,
  };
  wxAjax({
    url: serverApi.tokenlogin,
    data,
    method: 'POST',
    callback,
  });
}

function smslogin_checkreceiver({ mobile, receiver, callback }) {
  let data = {
    mobile,
    receiver,
  };
  wxAjax({
    url: serverApi.smslogin_checkreceiver,
    data,
    method: 'POST',
    callback,
  });
}

function wxconfirmlogin({ wx_token, callback }) {
  let data = {
    wx_token,
  };
  wxAjax({
    url: serverApi.wxconfirmlogin,
    data,
    method: 'POST',
    callback,
  });
}

function logout() {
  wxAjax({
    url: `${serverApi.logout}?appid=${appid}`,
    callback: (res = {}) => {
      let { isSuccess } = res;
      if (isSuccess) {
        console.log('logout request success');
      } else {
        console.log('logout request failed');
      }
      ['jdlogin_pt_key', 'jdlogin_pt_pin', 'jdlogin_pt_token'].forEach(item => {
        wx.removeStorageSync(item);
      });
    },
  });
}

//检测是否能登录
function checkLogin(obj) {
  var flag = true;
  for (var key in obj) {
    if (!obj[key]) {
      flag = false;
      return flag;
    }
  }
  return flag;
}

//验证是否为手机号码
function checkPhone(phone) {
  var pattern = /^1[3-9][0-9]{9}$/;
  return pattern.test(phone);
}

function setCommonStorage(params = {}) {
  let { pt_key, pt_token, expire_time, refresh_time, pt_pin } = params;
  let temp = [
    {
      key: 'jdlogin_pt_pin',
      val: pt_pin,
    },
    {
      key: 'jdlogin_pt_key',
      val: pt_key,
    },
    {
      key: 'jdlogin_pt_token',
      val: pt_token,
    },
    {
      key: 'jdlogin_pt_key_expire_time',
      val: expire_time,
    },
    {
      key: 'jdlogin_pt_key_refresh_time',
      val: refresh_time,
    },
  ];
  setListStorage(temp);
}

function setListStorage(list = []) {
  list.forEach((item = {}) => {
    let { key, val } = item;
    val && wx.setStorageSync(key, val);
  });
}

function doSure({ wx_token, _data, from }) {
  wxconfirmlogin({
    wx_token,
    callback: res => {
      wx.hideLoading();
      let { isSuccess, err_msg, err_code } = res;
      let { returnPage } = _data;
      if (isSuccess && !err_code) {
        setConfirmLoginStorage(res);
        returnPage && goBack(_data);
      } else if (from === 'bind') {
        //联合登录页面异常处理特殊逻辑
        wx.showModal({
          content: err_msg,
          showCancel: false,
          success: () => {
            toMobilePage(_data);
          },
        });
      }
    },
  });
}

function toMobilePage({ returnPage, pageType }) {
  wx.redirectTo({
    url: `../login-mobile/login-mobile?&returnPage=${returnPage}&pageType=${pageType}`,
  });
}

function setConfirmLoginStorage(params) {
  let { pt_pin, pt_key, pt_token } = params;
  try {
    let temp = [
      {
        key: 'jdlogin_pt_pin',
        val: pt_pin,
      },
      {
        key: 'jdlogin_pt_key',
        val: pt_key,
      },
      {
        key: 'jdlogin_pt_token',
        val: pt_token,
      },
      {
        key: 'login_flag',
        val: true,
      },
    ];
    setListStorage(temp);
  } catch (e) {
    console.log('fail to set confirmlogin storage');
  }
}

function getQuery({ str = '', key }) {
  let index = str.indexOf('?');
  str = index === -1 ? str : str.slice(index + 1);
  let args = str.split('&');
  for (let i = 0, len = args.length; i < len; i++) {
    let arr = args[i].split('=');
    if (arr[0] == key) {
      return arr[1];
    }
  }
}

function wxapp_reg(guid, lsid, returnpage, appid, callback) {
  var header = {
    Cookie: 'guid=' + guid + '; lsid=' + lsid,
  };
  wxAjax({
    // url: '/cgi-bin/wx/wxapp_reg?appid=' + appid + '&returnpage=' + returnpage,
    url: `${app.loginRequestUrl}/cgi-bin/wx/wxapp_reg?appid=${appid}&returnpage=${returnpage}`,
    method: 'GET',
    data: '',
    header,
    callback: function(data) {
      callback(data);
    },
  });
}

export default {
  smslogin,
  smslogin_sendmsg,
  dosmslogin,
  goBack,
  goBackPage,
  smslogin_checkreceiver,
  wxconfirmlogin,
  logout,
  checkPhone,
  checkLogin,
  h5JumpOnly,
  wxAjax,
  setCommonStorage,
  setListStorage,
  doSure,
  toMobilePage,
  getQuery,
  tokenLogin,
  wxapp_reg,
};
