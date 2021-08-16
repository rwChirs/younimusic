import Taro from '@tarojs/taro';

import { sendRequest } from '../../../utils/common/sendRequest';
import QQMapWX from '../../../utils/qqmap-wx-jssdk.min';

const app = Taro.getApp();
const qqmapsdk = new QQMapWX({ key: app.wx_map_dev_key });
let location = '';

function searchKeyword(params = {}) {
  if (location) {
    return searchKeywordFuc({
      ...params,
      location,
    });
  } else {
    return Taro.getLocation({ type: 'gcj02' }).then((res) => {
      location = `${res.latitude},${res.longitude}`;
      return searchKeyword({
        ...params,
        location,
      });
    });
  }
}

function searchKeywordFuc(params = {}) {
  if (params.keyword) {
    return new Promise((resolve, reject) => {
      qqmapsdk.getSuggestion({
        keyword: params.keyword,
        page_size: 20,
        policy: 0,
        location: params.location,
        page_index: params.pageIndex ? params.pageIndex : 1,
        success: function (res) {
          const data = res.data.map((item) => ({
            brief: item.title,
            detail: item.address,
            addressSummary:
              item.province === item.city
                ? item.city + item.district
                : item.province + item.city + item.district,
            addressExt: item.title,
            pos: item.location,
            lon: item.location.lng,
            lat: item.location.lat,
          }));
          match(data).then((result) => {
            resolve(result);
          });
        },
        fail: function (info) {
          reject(info);
        },
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      qqmapsdk.reverseGeocoder({
        get_poi: 1,
        poi_options: 'page_size=20;radius=3000;policy=2',
        success: function (res) {
          const data = res.result
            ? res.result.pois.map((item) => ({
                brief: item.title,
                detail: item.address,
                addressSummary:
                  item.ad_info.province === item.ad_info.city
                    ? item.ad_info.city + item.ad_info.district
                    : item.ad_info.province +
                      item.ad_info.city +
                      item.ad_info.district,
                addressExt: item.title,
                pos: item.location,
                lon: item.location.lng,
                lat: item.location.lat,
              }))
            : [];
          match(data).then((result) => {
            resolve(result);
          });
        },
        fail: function (info) {
          reject(info);
        },
      });
    });
  }
}

function match(arr = []) {
  return new Promise((resolve) => {
    matchStoreByCoords(arr.map((res) => res.pos)).then((res) => {
      const data = res.map((addr) => ({
        ...arr[addr.addressId],
        supportDelivery: addr.supportDelivery,
        storeId: addr.storeId ? addr.storeId : 0,
      }));
      resolve(data.sort((a, b) => b.supportDelivery - a.supportDelivery));
    });
  });
}

function matchStoreByCoords(coords = []) {
  const params = {
    addressInfos: coords.map((coord, index) => ({
      addressId: index,
      lat: coord.lat,
      lon: coord.lng,
    })),
  };
  return sendRequest({
    api: '7fresh.areastore.locationDelivery',
    data: JSON.stringify(params),
  }).then((res) => {
    return new Promise((resolve) => {
      resolve(res ? res.addressInfos : []);
    });
  });
}

export default {
  searchKeyword,
};
