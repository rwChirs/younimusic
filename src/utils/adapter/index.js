import Taro from '@tarojs/taro';

const plugin =
  process.env.TARO_ENV === 'weapp' ? Taro.requirePlugin('loginPlugin') : Taro;

const globalData =
  process.env.TARO_ENV === 'weapp' && Taro.getApp()
    ? Taro.getApp().$app.globalData
    : {};
const h5Url =
  process.env.NODE_ENV === 'development'
    ? 'https://7freshbe.m.jd.com'
    : 'https://7fresh.m.jd.com';
const bizReqUrl = `${
  process.env.NODE_ENV === 'development'
    ? 'https://mwpgwb.m.jd.com' // 预发
    : 'https://mwpgw.m.jd.com' // 线上
}/mwp/mobileDispatch`;
const colorUrl =
  process.env.NODE_ENV === 'development'
    ? 'https://beta-api.m.jd.com' // 预发
    : 'https://color.7fresh.com'; // 线上
// const h5Url = "https://7fresh.m.jd.com";
// const bizReqUrl = `https://mwpgw.m.jd.com/mwp/mobileDispatch`;
const commonParams = {
  appName: process.env.TARO_ENV === 'weapp' ? 'freshminip' : '7fresh',
  client: 'm',
  partner: 'wx',
};
const jsonp = process.env.TARO_ENV === 'weapp' ? false : 'callback';
const checkLoginedUrl = 'https://zmd.m.jd.com';
let cookie;

if (process.env.TARO_ENV === 'h5') {
  cookie = require('../common/cookie');
}

function randomWord() {
  let str = '',
    range = 26,
    arr = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];

  for (let i = 0; i < range; i++) {
    const pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}

function getUuid() {
  const uuidKey = 'M_7FRESH_COMMON_UUID';
  let val = '',
    group;
  if ((group = window.location.search.substr(1).match(/&?uuid=([^&]+)/))) {
    val = group[1];
  } else if (window.localStorage) {
    try {
      val = localStorage.getItem(uuidKey);
      if (!val) {
        val = cookie.getCookie(uuidKey);
      }
    } catch (e) {
      val = cookie.getCookie(uuidKey);
    }
  }

  if (!val) {
    val = randomWord();
  }
  return val;
}

function getPtPin() {
  if (process.env.TARO_ENV === 'weapp') {
    return encodeURIComponent(plugin.getStorageSync('jdlogin_pt_pin'));
  } else {
    return cookie.getCookie('pt_pin');
  }
}

function getPtKey() {
  if (process.env.TARO_ENV === 'weapp') {
    return encodeURIComponent(plugin.getStorageSync('jdlogin_pt_key'));
  } else {
    return cookie.getCookie('pt_key');
  }
}

function getPwdId() {
  if (process.env.TARO_ENV === 'weapp') {
    return encodeURIComponent(Taro.getStorageSync('jdlogin_pt_pin'));
  } else {
    return cookie.getCookie('pwdt_id');
  }
}

/**
 * 获取OpenId
 */
function getOpenId() {
  if (process.env.TARO_ENV === 'weapp') {
    const openId = wx.getStorageSync('openId') || globalData.openId;
    return new Promise((resolve, reject) => {
      if (process.env.TARO_ENV === 'weapp') {
        if (!openId) {
          Taro.login({
            success: ({ code }) => {
              Taro.request({
                url: bizReqUrl,
                data: {
                  api: '7fresh.pay.getWeiXinOpenId',
                  data: JSON.stringify({
                    code: code,
                    pay_channel: 19,
                    tenantId: 1, //租户id
                    platformId: 1, //平台id
                  }),
                  ...commonParams,
                },
                header: {
                  cookie: `pt_key=${getPtKey()}; pt_pin=${getPtPin()}`,
                },
              })
                .then(
                  ({
                    data: {
                      data: {
                        payOrderInfo: { open_id },
                      },
                    },
                  }) => {
                    globalData.openId = open_id;
                    resolve(globalData.openId);
                  }
                )
                .catch(e => {
                  globalData.openId = undefined;
                  console.warn('无法获取openId', e);
                  reject('无法获取openId');
                });
            },
          });
        } else {
          resolve(openId);
        }
      } else {
        resolve(getUuid());
      }
    });
  } else {
    return new Promise(resolve => {
      resolve(getUuid());
    });
  }
}

export {
  jsonp,
  bizReqUrl,
  h5Url,
  checkLoginedUrl,
  commonParams,
  getOpenId,
  getPtPin,
  getPtKey,
  getPwdId,
  colorUrl,
};
