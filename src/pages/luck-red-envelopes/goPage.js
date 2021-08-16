import Taro from '@tarojs/taro';
import utils from './util';
import { getH5PageUrl } from '../../utils/common/utils';

const app = Taro.getApp().$app;

export default function toUrlByType(action, storeId, coords) {
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
      toUrl = `/pages/detail/index?${action.toUrl}&storeId=${storeId || ''}`;
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
    if (process.env.TARO_ENV === 'weapp') {
      if (toUrl.indexOf('7fresh-groupon') > -1) {
        Taro.navigateTo({
          url: `/pages-a/fight-group/list/index?storeId=${storeId}&lng=${coords.lng}&lat=${coords.lat}`,
        });
        return;
      }
      if (toUrl.indexOf('7fresh.m.jd.com/groupon') > -1) {
        Taro.navigateTo({
          url: `/pages/solitaire/list/index?storeId=${storeId}&lng=${
            coords && coords.lng ? coords.lng : ''
          }&lat=${coords && coords.lat ? coords.lat : ''}`,
        });
        return;
      }
      if (toUrl.indexOf('top100') > -1) {
        Taro.navigateTo({
          url: `/pages/secondaryActivity/top100/index?${toUrl.slice(
            toUrl.indexOf('?') + 1
          )}&storeId=${storeId}&lng=${
            coords && coords.lng ? coords.lng : ''
          }&lat=${coords && coords.lat ? coords.lat : ''}`,
        });
        return;
      }
      if (toUrl.indexOf('seckill') > -1) {
        Taro.navigateTo({
          url: `/pages/secondaryActivity/seckill/index?${toUrl.slice(
            toUrl.indexOf('?') + 1
          )}&storeId=${storeId}&lng=${
            coords && coords.lng ? coords.lng : ''
          }&lat=${coords && coords.lat ? coords.lat : ''}`,
        });
        return;
      }
      if (toUrl.indexOf('red-envelope-rain') > -1) {
        Taro.navigateTo({
          url: `/pages-a/red-envelope-rain/index?${toUrl.slice(
            toUrl.indexOf('?') + 1
          )}&storeId=${storeId}&lng=${
            coords && coords.lng ? coords.lng : ''
          }&lat=${coords && coords.lat ? coords.lat : ''}`,
        });
        return;
      }
      if (toUrl.indexOf('nm') > -1) {
        Taro.navigateTo({
          url: `/pages/secondaryActivity/nm/index?${toUrl.slice(
            toUrl.indexOf('?') + 1
          )}&storeId=${storeId}&lng=${
            coords && coords.lng ? coords.lng : ''
          }&lat=${coords && coords.lat ? coords.lat : ''}`,
        });
        return;
      }
      if (toUrl.indexOf('three-group') > -1) {
        Taro.navigateTo({
          url: `/pages-a/fight-group/three-group/index?${toUrl.slice(
            toUrl.indexOf('?') + 1
          )}&storeId=${storeId}&lng=${
            coords && coords.lng ? coords.lng : ''
          }&lat=${coords && coords.lat ? coords.lat : ''}`,
        });
        return;
      }
      if (toUrl.indexOf('draw') > -1) {
        Taro.navigateTo({
          url: `/pages-a/draw/index?${toUrl.slice(
            toUrl.indexOf('?') + 1
          )}&lng=${coords.lng}&lat=${coords.lat}`,
        });
        return;
      }
    }

    toUrl =
      toUrl.indexOf('7fresh') === -1
        ? app.h5RequestHost + '/' + toUrl
        : toUrl;
    if (process.env.TARO_ENV === 'weapp') {
      utils.navigateToH5({ page: toUrl });
    } else {
      Taro.navigateTo({ url: toUrl });
    }
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
      toUrl = getH5PageUrl(toUrl, storeId);
    }
    Taro.navigateTo({
      url: toUrl,
    });
  }
}
