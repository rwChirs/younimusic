import Taro from '@tarojs/taro';
const app = Taro.getApp().$app;

export default function toUrlH5(action, storeId, coords) {
  if (!action.urlType) return;
  //埋点

  if (action.clsTag) {
    let points;
    if (process.env.TARO_ENV === 'h5') {
      points = require('@7fresh/points/build/h5');
      points.logClick({ eid: action.clsTag });
    } else {
      points = require('../../utils/common/logReport');
      points.logClick({ eid: action.clsTag });
    }
  }

  action.toUrl = action.toUrl || '';

  let toUrl = '';
  let goH5 = true;
  switch (action.urlType) {
    //邀请有礼
    case '204':
      // toUrl = "inviteHasGifts.html";
      toUrl = `/pages-a/invitation/index?${action.toUrl}&storeId=${storeId ||
        ''}`;
      goH5 = false;
      break;
    //新人专享
    case '205':
      toUrl = 'newGift.html';
      break;
    //试吃
    case '209':
      toUrl = action.toUrl;
      break;
    //热销排行
    case '202':
      toUrl = `hot.html`;
      break;
    //新品上市
    case '203':
      toUrl = `new.html`;
      break;
    //砍价列表
    case '211':
      toUrl = `bargainList.html`;
      break;
    //商祥
    case '1':
      toUrl = `/detail.html?${action.toUrl}&storeId=${storeId || ''}`;
      goH5 = false;
      break;
    //秒杀列表
    case '201':
      toUrl = 'miaosha.html';
      break;
    //店铺
    // case "2":
    //   toUrl = `/pages/index/index?storeId=${storeId}`;
    //   goH5 = false;
    //   break;
    //分类
    case '5':
      toUrl =
        action.toUrl.toLowerCase() === 'all'
          ? 'category1.html?iconSource=1'
          : 'category2.html?iconSource=1&cid=' + action.toUrl;
      break;
    //m站
    case '3':
    case '210':
      toUrl = action.toUrl.replace('http://', 'https://');
      break;
    case 'search':
      toUrl = action.toUrl;
      break;
  }
  if (goH5) {
    if (!toUrl) return;

    toUrl =
      toUrl.indexOf('7fresh') === -1
        ? app.h5RequestHost + '/' + toUrl
        : toUrl;

    Taro.navigateTo({ url: toUrl });
  } else {
    if (toUrl.indexOf('?') > -1) {
      toUrl = toUrl + '&';
    } else {
      toUrl = toUrl + '?';
    }
    toUrl =
      toUrl +
      `lng=${coords && coords.lng ? coords.lng : ''}&lat=${
        coords && coords.lat ? coords.lat : ''
      }`;
    if (toUrl.indexOf('storeId=') === -1) {
      toUrl = toUrl + `&storeId=${storeId}`;
    }
    Taro.navigateTo({
      url: toUrl,
    });
  }
}
