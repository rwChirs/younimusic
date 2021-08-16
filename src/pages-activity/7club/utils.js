import Taro from '@tarojs/taro';
import {
  px2vw,
  getRealValue,
  getCssValue,
  filterImg,
  isLogined,
  h5Url,
  getNameByCoords,
  getRealUrl,
  isFollowWx,
  getUrlParams,
  addHttps,
} from '../../utils/common/utils';
import { exportPoint } from '../../utils/common/exportPoint';
import utils from '../../pages/login/util';
import getUserStoreInfo from '../../utils/common/getUserStoreInfo';
import { logClick, structureLogClick } from '../../utils/common/logReport';
import goPage from '../../pages/index/goPage';

const app = Taro.getApp().$app;

const getLbsData = () => {
  return Taro.getStorageSync('addressInfo') || {};
};

//跳转购物车
const goCart = storeId => {
  const uuid = app.globalData.openId;
  const lbsData = getLbsData();
  utils.navigateToH5({
    page:
      app.h5RequestHost +
      `/cart.html?from=miniapp&source=7club&storeId=${storeId ||
        lbsData.storeId ||
        ''}&uuid=${uuid}&lat=${lbsData.lat || ''}&lng=${lbsData.lon ||
        ''}&tenantId=${lbsData.tenantId || ''}`,
  });
};

//跳转其他页面
const goToPage = (action, storeId) => {
  console.log('goToPage', action, storeId);
  const lbsData = getLbsData();
  goPage({
    action,
    storeId: storeId || lbsData.storeId || '',
    coords: [lbsData.lat || '', lbsData.lon || ''],
    tenantId: lbsData.tenantId || '',
    platformId: lbsData.platformId || '',
  });
};

//商祥页跳转
const goProDetail = (skuId, storeId) => {
  const lbsData = getLbsData();
  Taro.navigateTo({
    url: `/pages/detail/index?storeId=${storeId ||
      lbsData.storeId ||
      ''}&skuId=${skuId}&lng=${lbsData.lon || ''}&lat=${lbsData.lat ||
      ''}&tenantId=${lbsData.tenantId || ''}&platformId=${lbsData.platformId ||
      ''}`,
  });
};

//菜谱详情
const goBillDetail = (data, storeId) => {
  if (!data.contentId) return;
  const lbsData = getLbsData();
  Taro.navigateTo({
    url: `/pages/bill/bill-detail/index?storeId=${storeId ||
      lbsData.storeId ||
      ''}&contentId=${data.contentId}&planDate=${
      data.planDate
    }&tenantId=${lbsData.tenantId || ''}&platformId=${lbsData.platformId ||
      ''}`,
  });
};

const get7clubPath = option => {
  const lbsData = getLbsData();
  let url = '';
  if (option.contentType === 3) {
    //视频详情
    url = `/pages-activity/7club/video-detail/index?storeId=${lbsData.storeId ||
      ''}&contentId=${option.contentId}&contentType=${option.contentType}`;
  } else if (option.contentType === 2) {
    //菜谱详情
    url = `/pages/bill/bill-detail/index?storeId=${lbsData.storeId ||
      ''}&contentId=${option.contentId}&planDate=${option.planDate || ''}`;
  } else if (option.contentType === 6) {
    //内容榜单
    url = `/pages-activity/7club/club-rank-detail/index?storeId=${lbsData.storeId ||
      ''}&contentId=${option.contentId}&contentTitle=${option.title}`;
  } else {
    if (option.contentSubType === 1) {
      //笔记详情
      url = `/pages-activity/7club/notes-detail/index?storeId=${lbsData.storeId ||
        ''}&contentId=${option.contentId}&contentType=${option.contentType}`;
    } else {
      //图文详情
      url = `/pages-activity/7club/club-detail/index?storeId=${lbsData.storeId ||
        ''}&contentId=${option.contentId}&contentType=${option.contentType}`;
    }
  }
  return url;
};

const getShareImage = option => {
  return option.shareCoverImg
    ? filterImg(option.shareCoverImg)
    : option.coverImg
    ? filterImg(option.coverImg)
    : option.images && option.images.length > 0
    ? filterImg(option.images[0])
    : images.shareDefaultImg;
};

//转换收藏数&&点赞数
const switchNum = num => {
  let tmp = num;
  if (num >= 10000) {
    let one = Math.floor(num / 10000);
    let two = Math.floor((num - 10000 * one) / 1000);
    tmp = one + '.' + two + 'w';
  }
  return tmp ? tmp : 0;
};

//默认图片
const images = {
  shareDefaultImg:
    'https://m.360buyimg.com/img/jfs/t1/69208/12/10463/20438/5d8071feE8dcd8369/91d24f744bc3f13f.png',
  default7clubImg:
    'https://m.360buyimg.com/img/jfs/t1/70032/29/10545/3427/5d80720cE2de6d257/6500d012aba8852d.png',
  userDefaultPicture:
    'https://m.360buyimg.com/img/jfs/t1/51545/30/11225/899/5d832e45Ea9b27d7b/1692cbb2b169e523.png',
  praiseDefaultImg:
    'https://m.360buyimg.com/img/jfs/t1/118152/12/5320/1432/5eb27038E825191da/871d05cd498a9f22.png',
  praiseSelectedGif:
    'https://m.360buyimg.com/img/jfs/t1/138465/2/932/53506/5ee9ddd7E9dc5fe60/b1efa1e9f3fe88b9.gif',
  praiseSelectedImg:
    'https://m.360buyimg.com/img/jfs/t1/125734/32/1151/1864/5eba0376E341f4e4a/e74905151153094a.png',

  collectDefaultImg:
    'https://m.360buyimg.com/img/jfs/t1/114852/25/5231/1690/5eb26fa5E5eff204a/dff47dc3cb6ad1a2.png',
  collectSelectedGif:
    'https://m.360buyimg.com/img/jfs/t1/120802/3/5175/45243/5eeb394bE26407c55/43d2b6b45104044c.gif',
  collectSelectedImg:
    'https://m.360buyimg.com/img/jfs/t1/126319/3/1114/1979/5eba02b6Ee7901f1d/e79d5d72c084b78d.png',
};

export {
  goToPage,
  px2vw,
  getRealValue,
  getCssValue,
  filterImg,
  exportPoint,
  utils,
  getUserStoreInfo,
  logClick,
  structureLogClick,
  goCart,
  h5Url,
  getNameByCoords,
  getRealUrl,
  isFollowWx,
  getUrlParams,
  addHttps,
  goProDetail,
  goBillDetail,
  images,
  get7clubPath,
  getShareImage,
  isLogined,
  switchNum,
};
