import Taro from '@tarojs/taro';
import { getUserIsConcern } from '@7fresh/api';
import { getRealUrlService,getWxLoginStatus } from '@7fresh/api';
import { bizReqUrl, h5Url, checkLoginedUrl } from '../adapter/index';
import {
  userDefaultPicture,
  productDefaultPicture,
  defaultHeaderImage,
  defaultLogo,
} from './images';
import { getPageInfo } from './logReport';

const plugin =
  process.env.TARO_ENV === 'weapp' ? Taro.requirePlugin('loginPlugin') : Taro;

const cachedData =
  process.env.TARO_ENV === 'weapp' && Taro.getApp()
    ? Taro.getApp().$app.cachedData
    : {};

// let loginStatus;

/**
 * 节流函数
 * @author Bin
 *
 * @param fn [Function] 需要被节流的函数
 * @param wait [Number] 时间，毫秒
 * @return [Function]
 */
const throttle = (fn, wait) => {
  let last = 0;

  return function() {
    const now = Date.now();

    if (now - last < wait) return;

    last = now;
    return fn.apply(this, arguments);
  };
};

/**
 * 是否登录
 */
const isLoginFn = () => {
  return new Promise(function(resolve, reject) {
    const pt_key = plugin.getStorageSync('jdlogin_pt_key');
    const pt_pin = encodeURIComponent(plugin.getStorageSync('jdlogin_pt_pin'));
    if (pt_key) {
      Taro.request({
        url: `${checkLoginedUrl}/serialCode/isLogin`,
        header: { cookie: `pt_key=${pt_key}; pt_pin=${pt_pin}` },
      })
        .then(({ data: { resultCode } }) => {
          resolve(resultCode !== -4);
        })
        .catch(err => reject(err));
    } else {
      resolve(false);
    }
  });
};

const getNameByCoords = (lon, lat) => {
  return new Promise(function(resolve, reject) {
    Taro.request({
      url: `https://restapi.amap.com/v3/geocode/regeo?key=ca5151e5858555fcc4243126c1768d3d&location=${lon},${lat}`,
    })
      .then(res => {
        if (res.data.status === '1') {
          resolve(res.data.regeocode.formatted_address);
        } else {
          reject(res.data.info);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

const cache = (key, fn, flag = true) => {
  return () => {
    if (cachedData[key] && flag) {
      return new Promise(resolve => {
        resolve(cachedData[key]);
      });
    }
    return fn().then(res => {
      cachedData[key] = res;
      return new Promise(resolve => resolve(res));
    });
  };
};

/* 裁剪封面，
   src为本地图片路径或临时文件路径，
   imgW为原图宽度，
   imgH为原图高度，
   cb为裁剪成功后的回调函数
*/
const clipImage = (src, imgW, imgH, cb) => {
  // ‘canvas’为前面创建的canvas标签的canvas-id属性值
  let ctx = Taro.createCanvasContext('canvas');
  let canvasW = 640,
    canvasH = imgH;

  if (imgW / imgH > 5 / 4) {
    // 长宽比大于5:4
    canvasW = (imgH * 5) / 4;
  }

  // 将图片绘制到画布
  ctx.drawImage(
    src,
    (imgW - canvasW) / 2,
    0,
    canvasW,
    canvasH,
    0,
    0,
    canvasW,
    canvasH
  );
  // draw()必须要用到，并且需要在绘制成功后导出图片
  ctx.draw(false, () => {
    setTimeout(() => {
      //  导出图片
      Taro.canvasToTempFilePath({
        width: canvasW,
        height: canvasH,
        destWidth: canvasW,
        destHeight: canvasH,
        canvasId: 'canvas',
        fileType: 'jpg',
        success: res => {
          // res.tempFilePath为导出的图片路径
          typeof cb == 'function' && cb(res.tempFilePath);
        },
      });
    }, 1000);
  });
};

const productUnits = {
  1: '个',
  2: '盒',
  3: '份',
  4: '袋',
  5: '瓶',
  6: '箱',
  7: '套',
  8: '杯',
  9: '只',
  10: '件',
  11: '束',
  12: '条',
  13: '桶',
  14: '罐',
  15: '包',
  16: '支',
  17: '双',
  18: '提',
  19: '排',
  20: '组',
  21: '听',
  51: 'kg',
  52: 'g',
};

const addHttps = url => {
  return !url ? '' : url.indexOf('http') > -1 ? url : `https:${url}`;
};

/**
 * 数字转中文
 * @number {Integer} 形如123的数字
 * @return {String} 返回转换成的形如 一百二十三 的字符串
 */
const numberToChinese = number => {
  const chars = '零一二三四五六七八九';
  const units = '个十百千万@#%亿^&~';
  const a = (number + '').split('');
  const s = [];
  if (a.length > 12) {
    throw new Error('too big');
  } else {
    for (var i = 0, j = a.length - 1; i <= j; i++) {
      if (j == 1 || j == 5 || j == 9) {
        //两位数 处理特殊的 1*
        if (i == 0) {
          if (a[i] != '1') s.push(chars.charAt(a[i]));
        } else {
          s.push(chars.charAt(a[i]));
        }
      } else {
        s.push(chars.charAt(a[i]));
      }
      if (i != j) {
        s.push(units.charAt(j - i));
      }
    }
  }
  return s
    .join('')
    .replace(/零([十百千万亿@#%^&~])/g, function(m, d, b) {
      b = units.indexOf(d);
      if (b != -1) {
        if (d == '亿') return d;
        if (d == '万') return d;
        if (a[j - b] == '0') return '零';
      }
      return '';
    })
    .replace(/零+/g, '零')
    .replace(/零([万亿])/g, function(m, b) {
      return b;
    })
    .replace(/亿[万千百]/g, '亿')
    .replace(/[零]$/, '')
    .replace(/[@#%^&~]/g, function(m) {
      return {
        '@': '十',
        '#': '百',
        '%': '千',
        '^': '十',
        '&': '百',
        '~': '千',
      }[m];
    })
    .replace(/([亿万])([一-九])/g, function(m, d, b, c) {
      c = units.indexOf(d);
      if (c != -1) {
        if (a[j - c] == '0') return d + '零' + b;
      }
      return m;
    });
};

/**
 * 菊花码解码
 */
const getRealUrl = url => {
  // TODO: 需要验证
  return getRealUrlService({
    url: url,
  }).then(res => {
    return res;
  });
};

//是否关注公众号
const isFollowWx = unionId => {
  return getUserIsConcern({ unionId: unionId }).then(res => {
    return new Promise(resolve => {
      resolve(res);
    });
  });
};

const getUrlParams = url => {
  const query =
    decodeURIComponent(url).split('?').length > 1
      ? decodeURIComponent(url).split('?')[1]
      : decodeURIComponent(url);
  const params = {};
  if (query) {
    query.split('&').forEach(p => {
      const item = p.split('=');
      params[item[0]] = item[1];
    });
  }
  return params;
};

//压缩图片
const zipPicture = url => {
  if (url) {
    if (url.indexOf('jpg') > -1) {
      return url + '!q70.dpg';
    }
    if (url.indexOf('png') > -1) {
      // var u = navigator.userAgent;
      // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
      // if (isAndroid) {
      //   //这个是安卓操作系统
      //   return url + '!q70.webp';
      // } else {
      return url;
      // }
    }
  } else {
    return productDefaultPicture;
  }
};

function urlAddSepartor(url) {
  if (url.indexOf('?') === -1) {
    url = url + '?';
  } else {
    url = url + '&';
  }
  return url;
}

//拼接h5地址，添加 storeId, coords, tenantId,platformId 参数
const getH5PageUrl = (url, storeId, tenantId, platformId, coords) => {
  if (url.indexOf('storeId=') < 0 && storeId > 0) {
    url = urlAddSepartor(url) + `storeId=${storeId}`;
  }
  if (url.indexOf('tenantId=') < 0 && tenantId > 0) {
    url = urlAddSepartor(url) + `tenantId=${tenantId}`;
  }
  if (url.indexOf('platformId=') < 0 && platformId > 0) {
    url = urlAddSepartor(url) + `platformId=${platformId}`;
  }
  if (url.indexOf('lat=') < 0 && url.indexOf('lng=') < 0) {
    if (coords && typeof coords === 'object' && coords.lng && coords.lat) {
      url = urlAddSepartor(url) + `lng=${coords.lng}&lat=${coords.lat}`;
    }
  }
  if (url.indexOf('uuid=') < 0) {
    const exportPoint = Taro.getStorageSync('exportPoint');
    if (
      exportPoint &&
      typeof exportPoint === 'string' &&
      exportPoint !== '{}'
    ) {
      const uuid = JSON.parse(exportPoint).openid || '';
      url = urlAddSepartor(url) + `uuid=${uuid}`;
    }
  }
  try {
    const pageInfo = getPageInfo();
    if (pageInfo.pageId && pageInfo.pageName) {
      url =
        urlAddSepartor(url) +
        `lastPageID=${pageInfo.pageId}&lastPageName=${pageInfo.pageName}`;
    }
  } catch (error) {}

  return url;
};

//进行地址可选、不可选的拆分
const getReadlyAddressList = addressList => {
  if (!addressList) return;
  if (!Array.isArray(addressList)) addressList = [];
  const aList = [],
    bList = [];
  for (let i in addressList) {
    if (addressList[i].supportDelivery) {
      aList.push(addressList[i]);
    } else {
      bList.push(addressList[i]);
    }
  }

  return {
    aList,
    bList,
  };
};

/**
 * 截取字符串
 *
 * @export
 * @param {*} word 文案
 * @param {*} number 截取长度
 */
function filterDescription(word, number) {
  if (word) {
    if (word.length > number) {
      let value = word.substring(0, number);
      return value + '...';
    } else {
      return word;
    }
  } else {
    return '';
  }
}
const filterImg = (img, str, flag) => {
  let value = '';
  if (str === 'solitaire') {
    value = img ? img : defaultHeaderImage;
  } else if (str === 'shoplogo') {
    value = img ? img : defaultLogo;
  } else if (str === 'user') {
    value = img ? img : userDefaultPicture;
  } else {
    value = img ? img : productDefaultPicture;
  }

  if (value) {
    //图片压缩
    if (
      value.indexOf('storage.360buyimg.com') <= -1 &&
      value.indexOf('storage.jd.com') <= -1 &&
      str !== 'solitaire' &&
      flag !== 'no'
    ) {
      if (value.indexOf('!q70') <= -1) {
        value += '!q70';
      }
      if (value.indexOf('.dpg') <= -1) {
        value += '.dpg';
      }
    }

    if (value.indexOf('//') <= -1) {
      value = 'https://' + value;
    } else if (value.indexOf('http') <= -1) {
      value = 'https:' + value;
    } else if (value.indexOf('http') > -1 && value.indexOf('https') <= -1) {
      str = value.split('http:')[1];
      value = 'https:' + str;
    }
    if (value.indexOf('webp') > -1) {
      value = value.replace('.webp', '');
    }
    if (value.indexOf('!cc_4x3.jpg') > -1) {
      value = value.replace('!cc_4x3.jpg', '!cc_4x3');
    }
  }
  return value;
};

const px2vw = number => {
  const val = (100 / 750) * number;
  return `${val}vw`;
};

const webpSupport = () => {
  try {
    return (
      document
        .createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') == 0
    );
  } catch (err) {
    return false;
  }
};

const getURLParameter = url => {
  let theRequest = new Object();
  let strs = url ? url.split('&') : '';
  for (var i = 0; i < strs.length; i++) {
    theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
  }
  return theRequest;
};

const iosTrouchFn = el => {
  //el需要滑动的元素
  el.addEventListener('touchmove', function(e) {
    e.isSCROLL = true;
  });
  document.body.addEventListener(
    'touchmove',
    function(e) {
      if (!e.isSCROLL) {
        e.preventDefault(); //阻止默认事件(上下滑动)
      } else {
        //需要滑动的区域
        var top = el.scrollTop; //对象最顶端和窗口最顶端之间的距离
        var scrollH = el.scrollHeight; //含滚动内容的元素大小
        var offsetH = el.offsetHeight; //网页可见区域高
        var cScroll = top + offsetH; //当前滚动的距离

        //被滑动到最上方和最下方的时候
        if (top === 0) {
          top = 1; //0～1之间的小数会被当成0
        } else if (cScroll === scrollH) {
          el.scrollTop = top - 0.1;
        }
      }
    },
    { passive: false }
  ); //passive防止阻止默认事件不生效
};

const isPassive = () => {
  var supportsPassiveOption = false;
  try {
    window.addEventListener(
      'test',
      null,
      Object.defineProperty({}, 'passive', {
        get: function() {
          supportsPassiveOption = true;
          return true;
        },
      })
    );
  } catch (e) {}
  return supportsPassiveOption;
};

/**
 * 不同屏幕css数值运算得出真实数值
 *
 * @export
 */
const getRealValue = (cssValue, windowWidth) => {
  windowWidth = windowWidth || Taro.getSystemInfoSync().windowWidth;
  return Math.round((cssValue * windowWidth) / 750);
};

/**
 * 不同屏幕真实数值运算得出css数值
 *
 * @export
 */
const getCssValue = (jsValue, windowWidth) => {
  windowWidth = windowWidth || Taro.getSystemInfoSync().windowWidth;
  return Math.round((jsValue * 750) / windowWidth);
};

const isLogined = () => {
  return (
    !!plugin.getStorageSync('jdlogin_pt_key') &&
    !!plugin.getStorageSync('jdlogin_pt_pin')
  );
};

const isLogin = () => cache('isLogin', isLoginFn);

const userLogin = () => {
  return getWxLoginStatus({
     fromsource: 'weix'
  }).then(res => {
    return new Promise(resolve => {
      resolve(res);
    });
  });
};

const getMessage = ({ detail }) => {
  if (detail && detail.data) {
    detail.data.forEach(message => {
      switch (message.type) {
        case 'address_changed':
          if (message.data && message.data.storeId) {
            Taro.getApp().$app.globalData.storeId = message.data.storeId;
          }
          if (message.data && message.data.sendTo) {
            if (Taro.getCurrentPages()[0]) {
              Taro.getCurrentPages()[0].setData({
                addr: message.data.sendTo,
                defaultAddr: {
                  storeId: message.data.storeId,
                  addressSummary: '',
                  addressExt: message.data.sendTo,
                  address: message.data.sendTo,
                  lat: message.data.coord[0],
                  lon: message.data.coord[1],
                  userName: message.data.userName,
                  mobile: message.data.mobile,
                  fullAddress: message.data.fullAddress,
                },
              });
            }

            Taro.setStorageSync('addressInfo', {
              addressId: message.data.addressId,
              storeId: message.data.storeId,
              tenantId: message.data.tenantId,
              platformId: 1,
              tenantInfo: message.data.tenantInfo,
              lat: message.data.lat,
              lon: message.data.lon,
              coord:
                message.data.coord && message.data.coord.length > 1
                  ? message.data.coord
                  : message.data.lat && message.data.lon
                  ? [message.data.lat, message.data.lon]
                  : [],
              isDefault: message.data.isDefault || false,
              where: message.data.where,
              addressSummary: message.data.addressSummary,
              addressExt: message.data.addressExt,
              fullAddress: message.data.fullAddress,
              sendTo: message.data.sendTo,
              address: message.data.sendTo,
              storeName: message.data.storeName,
              tenantShopInfo: message.data.tenantShopInfo,
              bottoming: message.data.bottoming,
            });
          }
          break;
        case 'share':
          if (message.data) {
            console.log('getMessage() case share', message.data);

            Taro.setStorageSync('share', {
              title: message.data.title,
              imageUrl: filterImg(message.data.imageUrl),
            });
          }
          break;
        case 'refresh_page':
          //是否刷新页面（目前用于新人专区二级页切完地址返回首页，刷新页面）
          if (message.data.refreshPage) {
            Taro.setStorageSync('refreshPage', message.data.refreshPage);
          }
          console.log('refresh_page==============', message.data);
          break;
      }
    });
  }
};

const formatDate = date => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}-${m > 9 ? m : `0${m}`}-${d > 9 ? d : `0${d}`}`;
};

/**
 * 比较版本号
 * @param {String} v1 必填，当前值
 * @param {String} v2 必填，目标比较值
 */
const compareVersion = (v1, v2) => {
  v1 = v1.split('.');
  v2 = v2.split('.');
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push('0');
  }
  while (v2.length < len) {
    v2.push('0');
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }
  return 0;
};

/**
 * 判断新版iPhone  X以上
 *
 */
const getIsNewIphone = () => {
  try {
    const res = wx.getSystemInfoSync();
    if (res && /iphone/i.test(res.model) && res.windowHeight >= 812) {
      return true;
    }
  } catch (e) {
    console.log('获取设备信息失败!');
  }
  return false;
};

//加车结果方法
const handlerAddCartResult = (data, info) => {
  const msg = data.msg;
  if (data.success) {
    //新人专享价商品的多次加购时处理 newPeopleAddCartTip-楼层配置提示或者不提示
    let newPeopleAddCartTip = Taro.getStorageSync('newPeopleAddCartTip') || 0;
    let isAgainAddGoods =
      (Taro.getStorageSync('isAgainAddGoods') &&
        JSON.parse(Taro.getStorageSync('isAgainAddGoods'))) ||
      {};
    if (
      Number(newPeopleAddCartTip) === 1 &&
      isAgainAddGoods &&
      isAgainAddGoods['skuId' + info.skuId] >= 1
    ) {
      Taro.showToast({
        title: '加购2件及以上将以原价结算呦~',
        icon: 'success',
      });
    } else {
      Taro.showToast({
        title: msg || '添加成功！',
        icon: 'success',
      });
    }

    newPeopleAddCartTip = Taro.setStorageSync('newPeopleAddCartTip', 0);
    // 记录新人专享价已加车成功商品
    Taro.setStorageSync(
      'isAgainAddGoods',
      JSON.stringify({
        ...isAgainAddGoods,
        ['skuId' + info.skuId]: 1,
      })
    );
  } else {
    Taro.showToast({
      title: msg || '添加失败！',
      icon: 'none',
    });
  }
};

const formatDateTime = time => {
  let dayOfMil = 24 * 60 * 60 * 1000,
    hourOfMil = 60 * 60 * 1000,
    minOfMil = 60 * 1000,
    secOfMil = 1000,
    hourOffset = time % dayOfMil,
    minuteOffset = hourOffset % hourOfMil,
    seccondOffset = minuteOffset % minOfMil,
    // h = Math.floor(time / hourOfMil),
    m = Math.floor(minuteOffset / minOfMil),
    s = Math.floor(seccondOffset / secOfMil),
    // str =
    // (h < 10 ? '0' + h : h) +
    // ':' +
    // (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
    str = [m < 10 ? '0' + m : m, s < 10 ? '0' + s : s];
  return str;
};

const handleTouchScroll = (flag)=> {
  if (flag) {
    scrollTop = document.documentElement.scrollTop

    // 使body脱离文档流
    document.body.classList.add('at-frozen')

    // 把脱离文档流的body拉上去！否则页面会回到顶部！
    document.body.style.top = `${-scrollTop}px`
  } else {
    document.body.style.top = ''
    document.body.classList.remove('at-frozen')

    document.documentElement.scrollTop = scrollTop
  }
}

export {
  throttle,
  isLogin,
  productUnits,
  bizReqUrl,
  h5Url,
  getNameByCoords,
  cache,
  clipImage,
  addHttps,
  numberToChinese,
  getRealUrl,
  isFollowWx,
  getUrlParams,
  zipPicture,
  getH5PageUrl,
  getReadlyAddressList,
  filterDescription,
  filterImg,
  px2vw,
  webpSupport,
  getURLParameter,
  iosTrouchFn,
  getRealValue,
  getCssValue,
  // setCenterTabBarConfig,
  isPassive,
  isLogined,
  userLogin,
  getMessage,
  formatDate,
  compareVersion,
  getIsNewIphone,
  handlerAddCartResult,
  formatDateTime,
  handleTouchScroll
};
