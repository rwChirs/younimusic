import { getjsApiService } from '@7fresh/api';
import WxShare from '../../utils/common/wx-share';
import utils from '../login/util';
import { sendRequest } from '../../utils/common/sendRequest';

/**
 * 登录
 * @param {Object} params 参数
 */
export const gotoLogin = params => {
  if (process.env.TARO_ENV === 'h5') {
    window.location.href =
      'https://plogin.m.jd.com/user/login.action?appid=361&returnurl=' +
      encodeURIComponent(window.location.href);
  }
  if (process.env.TARO_ENV === 'weapp') {
    utils.redirectToLogin(
      `/pages/luck-red-envelopes/index?storeId=${params.storeId}&orderId=${params.orderId}&businessId=${params.businessId}&fixedPageId=${params.fixedPageId}`
    );
  }
};

export const initShare = params => {
  if (process.env.TARO_ENV === 'h5') {
    const data = {
      url: encodeURIComponent(window.location.href.split('#')[0]),
    };
    getjsApiService(data)
      .then(res => {
        new WxShare()
          .config({
            debug: false,
            appId: res.appId,
            timestamp: res.timestamp,
            nonceStr: res.nonceStr,
            signature: res.signature,
          })
          .setReadyCallBack(() => {
            console.log('ready');
          })
          .setDefaultShare({
            title: '拼手气红包',
            link:
              'https://7fresh.m.jd.com/luck-red-envelopes/#/pages/luck-red-envelopes/index',
            desc: '分享给好友，看谁手气最佳！',
            imgUrl: '',
          })
          .setShareSuccessCallBack(() => {
            console.log('success');
          })
          .share(params);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

export const getURLParameter = (name, encode) => {
  encode = typeof encode == 'undefined' ? true : false;
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function(s) {
      return entityMap[s];
    });
  }
  return name
    ? (function() {
        var reg = new RegExp('.*(\\?|&)' + name + '=([^&]*).*');
        return reg.test(window.location.search)
          ? encode
            ? escapeHtml(
                decodeURIComponent(window.location.search.replace(reg, '$2'))
              )
            : decodeURIComponent(window.location.search.replace(reg, '$2'))
          : '';
      })()
    : '';
};

/**
 * 菊花码解码
 */
export const getRealUrl = url => {
  return sendRequest({
    api: '7fresh.qrcode.getRealUrl',
    url: url,
  }).then(res => {
    return res;
  });
};

export const pointResult = () => {
  let result = {},
  points = '',
  exposure = '';
  if (process.env.TARO_ENV === 'h5') {
    points = require('@7fresh/points/build/h5');
    result = {
      logClick: points.logClick,
      logPv: points.logPv,
      structureLogClick: points.structureLogClick,
      commonLogExposure: points.commonLogExposure,
    };
  } else {
    points = require('../../utils/common/logReport');
    exposure = require('../../utils/common/exportPoint');
    result = {
      logClick: points.logClick,
      logPv: points.logPv,
      structureLogClick: points.structureLogClick,
      getExposure: exposure.getExposure,
      getPageExposure: exposure.getPageExposure,
    };
  }
  return result
}
// module.exports = result;

// export default result;
