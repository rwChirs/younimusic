import Taro from '@tarojs/taro';
import { getTenantShopService,getLocationPosition } from '@7fresh/api';

/*
 * 地址信息存入 Taro.setStorageSync("addressInfo")
 * 小程序platformId写死为1，tenantId存入门店信息内
 */
export const saveAddrInfo = (addrInfo, tenantData, bottoming = false) => {
  const lbs_data = Taro.getStorageSync('addressInfo')
    ? Taro.getStorageSync('addressInfo')
    : ''; //缓存数据

  let addressSummary = '';
  if (addrInfo && addrInfo.addressSummary) {
    if (addrInfo.addressSummary !== '') {
      addressSummary = addrInfo.addressSummary;
      if (addrInfo.addressSummary === '-1') {
        addressSummary = '';
      }
    } else if (lbs_data && lbs_data.addressSummary) {
      addressSummary = lbs_data.addressSummary;
    }
  }

  let addressExt = '';
  if (addrInfo && addrInfo.addressExt) {
    if (addrInfo.addressExt !== '') {
      addressExt = addrInfo.addressExt;
    }
    if (addrInfo.addressExt === '-1') {
      addressExt = '';
    }
  } else if (lbs_data && lbs_data.addressExt) {
    addressExt = lbs_data.addressExt;
  }

  let where = '';
  if (addrInfo && addrInfo.where) {
    if (addrInfo.where !== '') {
      where = addrInfo.where;
    }
    if (addrInfo.where === '-1') {
      where = '';
    }
  } else if (lbs_data && lbs_data.where) {
    where = lbs_data.where;
  }

  let old_tentInfo = (lbs_data && lbs_data.tenantShopInfo) || [];
  let new_tentInfo =
    tenantData && tenantData.length ? tenantData : old_tentInfo;
  new_tentInfo = sortTenantShopList(addrInfo, tenantData);

  const lbsData = {
    //门店信息
    addressId: (addrInfo && addrInfo.addressId) || '',
    storeId:
      (addrInfo && addrInfo.storeId) ||
      (new_tentInfo &&
        new_tentInfo.length > 0 &&
        new_tentInfo[0] &&
        new_tentInfo[0].storeId) ||
      (lbs_data && lbs_data.storeId),
    tenantId:
      (addrInfo && addrInfo.tenantId) ||
      (new_tentInfo &&
        new_tentInfo.length > 0 &&
        new_tentInfo[0].tenantInfo &&
        new_tentInfo[0].tenantInfo.tenantId) ||
      1,
    tenantInfo:
      (addrInfo && addrInfo.tenantInfo) ||
      (new_tentInfo && new_tentInfo.length > 0 && new_tentInfo[0].tenantInfo) ||
      (lbs_data && lbs_data.tenantInfo),
    lat: (addrInfo && addrInfo.lat) || (lbs_data && lbs_data.lat),
    lon: (addrInfo && addrInfo.lon) || (lbs_data && lbs_data.lon),
    coord:
      addrInfo && addrInfo.coord && addrInfo.coord.length > 1
        ? addrInfo.coord
        : addrInfo && addrInfo.lat && addrInfo.lon
        ? [addrInfo.lat, addrInfo.lon]
        : lbs_data && lbs_data.coord && lbs_data.coord.length > 1
        ? lbs_data.coord
        : [],
    isDefault:
      addrInfo && addrInfo.isDefault
        ? addrInfo.isDefault
        : (lbs_data && lbs_data.isDefault) || false, //是否为默认地址，0:不是 1：是
    where: where,
    addressSummary: addressSummary,
    addressExt: addressExt,
    fullAddress:
      (addrInfo && addrInfo.fullAddress) || addressSummary + addressExt + where,
    detailAddress: addressSummary + addressExt + where,
    sendTo:
      (addrInfo && addrInfo.sendTo) || addressSummary + addressExt + where,
    storeName:
      (addrInfo && addrInfo.storeName) ||
      (new_tentInfo &&
        new_tentInfo.length > 0 &&
        new_tentInfo[0] &&
        new_tentInfo[0].storeName) ||
      (lbs_data && lbs_data.storeName),
    //租户信息
    //租户列表信息
    tenantShopInfo: new_tentInfo,
    bottoming: bottoming || false, //是否走拖底页，
  };
  Taro.setStorageSync('addressInfo', lbsData);
  return lbsData;
};

function sortTenantShopList(addrInfo, tenantData) {
  let isSelectedIndex = 0;
  let new_tentInfo = {};
  if (
    addrInfo &&
    !addrInfo.tenantId &&
    addrInfo.tenantInfo &&
    addrInfo.tenantInfo.tenantId
  ) {
    addrInfo.tenantId = addrInfo.tenantInfo.tenantId;
  }
  if (addrInfo && tenantData && tenantData.length > 0) {
    for (let i = 0; i < tenantData.length; i++) {
      const tenantInfo = tenantData[i].tenantInfo;
      if (
        Number(tenantData[i].storeId) === Number(addrInfo.storeId) &&
        Number(tenantInfo.tenantId) === Number(addrInfo.tenantId)
      ) {
        isSelectedIndex = i;
      }
      tenantData[i].isSelected = false;
    }
    tenantData[isSelectedIndex].isSelected = true;
    new_tentInfo = tenantData;
    if (new_tentInfo.length > 1) {
      let arr = new_tentInfo.splice(isSelectedIndex, 1);
      new_tentInfo.unshift(arr[0]);
    }
  } else {
    new_tentInfo = tenantData;
  }
  return new_tentInfo;
}

//获取租户信息
export const onTenantInfo = (storeId, tenantId) => {
  const params = {
    storeId,
    tenantId,
  };
  return getTenantShopService({
    ...params,
  })
    .then(res => {
      console.log('【7fresh.shop.getTenantShop】:', res);
      if (res && res.success) {
        const tenantShopInfo = res && res.tenantShopInfo;
        const addrInfo = {
          addressSummary: '-1',
          addressExt: tenantShopInfo.storeAddress,
          where: '-1',
          fullAddress: tenantShopInfo.storeAddress,
          lon: tenantShopInfo.lon,
          lat: tenantShopInfo.lat,
        };
        return saveAddrInfo(addrInfo, tenantShopInfo);
      } else {
        console.log(res.msg);
        return;
      }
    })
    .catch(err => {
      console.log(err);
    });
};

/**
 * 三公里浏览体验 定位经纬度，链接门店Id
 * 三公里作为第一个请求接口，是取出租户信息的开始，所以不需要tenantId和platformId作为入参
 */
export const LinkPositonCompared = (
  lon = '',
  lat = '',
  storeId = '',
  source = '',
  activityId = ''
) => {
  return getLocationPosition({
     lon, lat, storeId, source, activityId
  }).then(res => {
    if (res && res.success) {
      //默认存列表第一个信息，之后根据弹框选择租户门店后，更新缓存信息
      let addrInfo = {},
        tenantInfo = {};
      // tenantId = 1;

      if (res.addressLocationInfo) {
        //单门店信息
        console.log('获取到单门店信息', res.addressLocationInfo);
        addrInfo = res.addressLocationInfo;
        tenantInfo = res.tenantShopInfoList ? res.tenantShopInfoList : null;
      } else if (res.tenantShopInfoList) {
        //租户信息
        console.log('获取到租户信息', res.tenantShopInfoList);
        addrInfo = res.addressLocationInfo;
        tenantInfo = res.tenantShopInfoList;
      } else {
        console.log('三公里接口返回数据为空');
        addrInfo = {
          storeId: storeId,
          coords: [lat, lon],
          lat: lat,
          lon: lon,
        };
      }

      //兼容首页弹框，默认选中第一个租户
      if (tenantInfo && tenantInfo.length > 0) {
        tenantInfo[0].isSelected = true;
      }

      return saveAddrInfo(addrInfo, tenantInfo, res.bottoming);
    } else {
      console.log('三公里定位接口请求失败');
    }
  });
};

/**
 * 过滤skuId格式
 */
export function getSkuList(skuIds) {
  let skuIdList = [],
    skuList = [];
  if (skuIds) {
    skuIdList = skuIds.split(',');
    for (let i in skuIdList) {
      if (skuIdList[i] !== '') {
        skuList.push(Number(skuIdList[i]));
      }
    }
  }

  return skuList;
}

export default (
  storeId = '',
  lon = '',
  lat = '',
  acId = '',
  type = 1,
  tenantId = '1'
) => {
  console.log(
    `【三公里定位】入参，门店：${storeId}，租户：${tenantId}，经度：${lon}，纬度：${lat}，活动Id：${acId}，类型：${type}`
  );
  const addressInfo = Taro.getStorageSync('addressInfo') || null;
  console.log('【缓存信息】：', addressInfo);
  if (
    addressInfo &&
    !!addressInfo.storeId &&
    parseInt(addressInfo.storeId) === parseInt(storeId) &&
    !!addressInfo.tenantId &&
    addressInfo.tenantInfo &&
    // addressInfo.tenantShopInfo &&
    !!addressInfo.lat &&
    !!addressInfo.lon
  ) {
    //走缓存
    console.log('走缓存');
    return new Promise(resove => {
      resove(addressInfo);
    });
  }

  if (parseFloat(lon) > 0 && parseFloat(lat) > 0) {
    console.log(
      '【三公里定位】storeId与缓存不一致或者无缓存地址，但链接里存在经纬度'
    );
    return LinkPositonCompared(lon, lat, storeId, type, acId);
  } else {
    console.log(
      '【三公里定位】storeId与缓存不一致或者无缓存地址，且不存在经纬度'
    );

    //提取内联函数
    return Taro.getLocation({ type: 'gcj02' })
      .then(res => {
        lon = res && res.longitude ? res.longitude : null;
        lat = res && res.latitude ? res.latitude : null;
        console.log(`【三公里定位】当前定位经纬度，经度：${lon}, 纬度：${lat}`);
        Taro.getApp().$app.globalData.coords = [lon, lat]; //[经度，纬度]
        return LinkPositonCompared(lon, lat, storeId, type, acId);
      })
      .catch(err => {
        console.warn('【三公里定位】获取定位经纬度接口失败！', err);
        return LinkPositonCompared(lon, lat, storeId, type, acId);
      });
  }
};

// 静默切换门店
export const silenceChagneStore = params => {
  //获取租户信息
  return new Promise((resolve, reject) => {
    getTenantShopService({
      storeId: params.storeId,
      tenantId: params.tenantId,
    })
      .then(res => {
        if (res && res.success) {
          const tenantShopInfo = res.tenantShopInfo;
          let addrInfo = {};
          addrInfo.addressSummary = tenantShopInfo.storeAddress;
          addrInfo.addressExt = tenantShopInfo.storeAddress;
          addrInfo.fullAddress = tenantShopInfo.storeAddress;
          addrInfo.detailAddress = tenantShopInfo.storeAddress;
          addrInfo.sendTo = tenantShopInfo.storeName;
          addrInfo.storeName = tenantShopInfo.storeName;
          addrInfo.storeId = tenantShopInfo.storeId;
          addrInfo.tenantId =
            tenantShopInfo.tenantInfo && tenantShopInfo.tenantInfo.tenantId;
          addrInfo.tenantInfo =
            tenantShopInfo.tenantInfo && tenantShopInfo.tenantInfo;
          addrInfo.where = tenantShopInfo.storeAddress;
          addrInfo.addressId = -1;
          saveAddrInfo(addrInfo, tenantShopInfo);
          resolve(true);
        }
      })
      .catch(err => {
        console.log(err);
        reject();
      });
  });
};
